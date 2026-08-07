import { Component, computed, signal } from '@angular/core';
import { from, tap, concatMap, map, catchError, of, defaultIfEmpty, endWith, finalize, delay, mergeMap } from 'rxjs';
import { IFuncionario } from './pagamentos-api';

@Component({
  selector: 'app-folha-pagamentos',
  imports: [],
  templateUrl: './folha-pagamentos.html',
  styleUrl: './folha-pagamentos.css',
})
export class FolhaPagamentos {
  funcionarios = signal<IFuncionario[]>([]);

  consoleLogs = signal<string[]>(['Sistema pronto para iniciar.']);
  processando = signal(false);

  funcionariosSelecionados = computed(() =>
    this.funcionarios().filter(f => f.selecionado)
  );

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
