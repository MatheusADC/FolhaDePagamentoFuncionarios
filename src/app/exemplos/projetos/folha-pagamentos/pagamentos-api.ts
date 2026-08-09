import { Injectable } from "@angular/core";
import { delay, map, Observable, of } from "rxjs";

export interface IFuncionario {
    id: number;
    nome: string;
    selecionado: boolean;
    status: 'pendente' | 'processando' | 'pago' | 'erro';
}

@Injectable({
    providedIn: 'root',
})
export class PagamentosApi {
    getFuncionarios(): Observable<IFuncionario[]> {
      // Número entre 1000ms e 5000ms
      const tempoAleatorio = Math.floor(Math.random() * 4000) + 1000;

        return of([
          { id: 0, nome: 'Ana Clara' },
          { id: 1, nome: 'Luiz Carlos' },
          { id: 2, nome: 'Rodrigo Silva' },
          { id: 3, nome: 'Ricardo Alves' },
        ]).pipe(
          delay(tempoAleatorio),
          map((funcionarios) => {
            return funcionarios.map(
              (funcionario) => ({... funcionario, selecionado: true, status: 'pendente' } as IFuncionario)
            )
          })
        );
    }

    pagarFuncionario() {

    }
}
