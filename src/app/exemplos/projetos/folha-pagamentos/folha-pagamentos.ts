import { Component, computed, inject, signal } from '@angular/core';
import { IFuncionario, PagamentosApi } from './pagamentos-api';
import { catchError, concatMap, filter, from, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-folha-pagamentos',
  imports: [],
  templateUrl: './folha-pagamentos.html',
  styleUrl: './folha-pagamentos.css',
})
export class FolhaPagamentos {
  private readonly _pagamentosApi = inject(PagamentosApi);

  funcionarios = signal<IFuncionario[]>([]);

  consoleLogs = signal<string[]>(['Sistema pronto para iniciar.']);
  processando = signal(false);

  funcionariosSelecionados = computed(() =>
    this.funcionarios().filter(f => f.selecionado)
  );

  ngOnInit() {
    // this._pagamentosApi.getFuncionarios().subscribe(
    //   (funcionariosResponse) => console.log('Funcionários: ', funcionariosResponse)
    // );

    // Teste de pagamento de um único funcionário
    // this._pagamentosApi.getFuncionarios().pipe(
    //   map((funcionariosResponse) => funcionariosResponse.find((f) => f.id === 2)),
    //   filter((funcionario) => funcionario !== undefined),
    //   switchMap((funcionario) => this._pagamentosApi.pagarFuncionario(funcionario)),
    // )
    // .subscribe({
    //   next: (response) => console.log('Pagamento: ', response),
    //   error: (erro) => console.log('Erro no pagamento: ', erro),
    // });

    // Teste do pagamento de todos os funcionários
    this._pagamentosApi.getFuncionarios().pipe(
      tap((funcionarios) => console.log('Lista de funcionários: ', funcionarios)),
      switchMap((funcionarios) => from(funcionarios)),
      tap((funcionario) => console.log('Funcionário atual: ', funcionario)),
      concatMap((funcionario) => this._pagamentosApi.pagarFuncionario(funcionario).pipe(
        catchError((erroPagamento) => of(erroPagamento))
      )),
    )
      .subscribe((pagamentoResponse) => console.log('Pagemento: ', pagamentoResponse));
  }

  toggleSelecao(id: number) {

  }

  iniciarPagamentos() {

  }

  private atualizarStatus(id: number, novoStatus: IFuncionario['status']) {

  }

  private addLog(msg: string) {

  }

  private resetarStatus() {

  }
}
