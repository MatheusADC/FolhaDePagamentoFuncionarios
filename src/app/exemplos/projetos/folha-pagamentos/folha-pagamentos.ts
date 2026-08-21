import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { IFuncionario, PagamentosApi } from './pagamentos-api';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-folha-pagamentos',
  imports: [],
  templateUrl: './folha-pagamentos.html',
  styleUrl: './folha-pagamentos.css',
})
export class FolhaPagamentos {
  private readonly _pagamentosApi = inject(PagamentosApi);

  consoleLogs = signal<string[]>(['Sistema pronto para iniciar.']);
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

  }

  private atualizarStatus(id: number, novoStatus: IFuncionario['status']) {

  }

  private addLog(msg: string) {

  }

  private resetarStatus() {

  }

  recarregarFuncionarios() {
    this.funcionariosResource.reload();
  }
}
