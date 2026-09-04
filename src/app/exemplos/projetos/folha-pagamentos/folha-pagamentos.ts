import { catchError, concatMap, EMPTY, finalize, retry, tap, timer } from 'rxjs';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { IFuncionario, IPagamentoResponse, PagamentosApi } from './pagamentos-api';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';

export interface IMensagemConsole {
  msg: string;
  tipo: 'sucesso' | 'alerta' | 'erro';
}

@Component({
  selector: 'app-folha-pagamentos',
  imports: [],
  templateUrl: './folha-pagamentos.html',
  styleUrl: './folha-pagamentos.css',
})
export class FolhaPagamentos {
  private readonly _pagamentosApi = inject(PagamentosApi);

  consoleLogs = signal<IMensagemConsole[]>([{ msg: 'Sistema pronto para iniciar.', tipo: 'sucesso' }]);
  processando = signal(false);

  funcionariosResource = rxResource({
    params: () => true,
    stream: () => this._pagamentosApi.getFuncionarios(),
  });

  funcionarios = linkedSignal(() => {
    if (this.funcionariosResource.hasValue()) {
      return this.funcionariosResource.value();
    }

    return [];
  });

  funcionariosMensagemErro = computed(() => {
    const ERRO_FUNCIONARIOS = this.funcionariosResource.error();

    if (ERRO_FUNCIONARIOS && ERRO_FUNCIONARIOS.cause) {
      return ERRO_FUNCIONARIOS.cause;
    }

    return 'Ocorreu um erro inesperado';
  });

  funcionariosSelecionados = computed(() => {
    if (this.funcionarios().length > 0) {
      return this.funcionarios().filter(f => f.selecionado);
    }

    return [];
  });

  toggleSelecao(funcionarioId: number) {
    this.funcionarios.update((funcionarios) => {
      return funcionarios.map((f) => {
        if (f.id === funcionarioId) {
          return { ...f, selecionado: !f.selecionado };
        }

        return f;
      });
    });
  }

  iniciarPagamentos() {
    this.consoleLogs.set([{ msg: 'Iniciando comunicação com o banco...', tipo: 'alerta' }]);
    this.resetarStatus();
    this.processando.set(true);

    const LISTA_SELECIONADOS_VAZIA = this.funcionariosSelecionados().length === 0;

    if (LISTA_SELECIONADOS_VAZIA) {
      this.addLog({ msg: '⚠️ AVISO: Nenhum funcionário selecionado no lote.', tipo: 'alerta'});
      this.processando.set(false);
      return;
    }

    from(this.funcionariosSelecionados()).pipe(
      concatMap((f) => {
        this.atualizarStatus(f.id, 'processando');
        this.addLog({  msg: `Processando paragamento de: ${f.nome}...`, tipo: 'sucesso' });

        return this._pagamentosApi.pagarFuncionario(f).pipe(
          retry({
            count: 2,
            delay: (erro, numeroDeTentativas) => {
              this.addLog({ msg: `⚠️ Falha na tentativa ${numeroDeTentativas}. Retentando pagamento de ${f.nome}`, tipo: 'alerta' });
              return timer(1000);
            },
          }),
          tap(() => {
            this.atualizarStatus(f.id, 'pago');
            this.addLog({ msg: `✅ Pagamento confirmado: ${f.nome}`, tipo: 'sucesso' });
          }),
          catchError((erro: IPagamentoResponse) => {
            this.atualizarStatus(f.id, 'erro');
            this.addLog({ msg: `❌ Erro no pagamento para ${f.nome}: ${erro.mensagem}`, tipo: 'erro' });

            return EMPTY;
          }),
        );
      }),
      finalize(() => {
        this.addLog({ msg: '🏁 Procesamento de pagamentos encerrado.', tipo: 'sucesso' });
        this.processando.set(false);
      }),
    ).subscribe();
  }

  private atualizarStatus(id: number, novoStatus: IFuncionario['status']) {
    this.funcionarios.update((funcionarios) => {
      return funcionarios.map((f) => {
        if (f.id === id) {
          return {...f, status: novoStatus };
        }

        return f;
      });
    });
  }

  private addLog(mensagem: IMensagemConsole) {
    this.consoleLogs.update((logs) => {
      return [...logs, mensagem];
    });
  }

  private resetarStatus() {
    this.funcionarios.update((funcionarios) => {
      return funcionarios.map((f) => {
        return {...f, status: 'pendente'};
      });
    });
  }

  recarregarFuncionarios() {
    this.funcionariosResource.reload();
  }
}
