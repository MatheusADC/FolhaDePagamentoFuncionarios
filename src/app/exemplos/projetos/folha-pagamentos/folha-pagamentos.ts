import { Component, computed, inject, signal } from '@angular/core';
import { IFuncionario, PagamentosApi } from './pagamentos-api';

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
    this._pagamentosApi.getFuncionarios().subscribe(
      (funcionariosResponse) => console.log('Funcionários: ', funcionariosResponse)
    );
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
