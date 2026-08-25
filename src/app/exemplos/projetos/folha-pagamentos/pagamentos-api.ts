import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concatMap, delay, map, Observable, of, throwError } from "rxjs";

export interface IFuncionario {
    id: number;
    nome: string;
    selecionado: boolean;
    status: 'pendente' | 'processando' | 'pago' | 'erro';
}

export interface IPagamentoResponse {
  mensagem: string;
  funcionario: Partial<IFuncionario>;
}

@Injectable({
    providedIn: 'root',
})
export class PagamentosApi {
    getFuncionarios(): Observable<IFuncionario[]> {
      // Número entre 1000ms e 5000ms
      const tempoAleatorio = Math.floor(Math.random() * 4000) + 1000;

      if (true) {
        return of([
          { id: 0, nome: 'Ana Clara' },
          { id: 1, nome: 'Luiz Carlos' },
          { id: 2, nome: 'Rodrigo Silva' },
          { id: 3, nome: 'Ricardo Alves' },
        ]).pipe(
          delay(100),
          map((funcionarios) => {
            return funcionarios.map(
              (funcionario) => ({ ...funcionario, selecionado: true, status: 'pendente' } as IFuncionario)
            )
          })
        );
      } else {
        const simulacaoHttpError = new HttpErrorResponse({
          error: {
            mensagem: 'Ocorreu um erro sistêmico ao recuperar funcionários.',
            codigoInterno: 'ERR_FUNC_500',
          },
          status: 500,
          statusText: 'Internal Server Error',
          url: 'https://api.suaempresa.com.br/v1/funcionarios',
        });

        return of(true).pipe(
          delay(2000),
          concatMap(() => throwError(() => simulacaoHttpError)),
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 500) {
              return throwError(() => errorResponse.error.mensagem);
            }

            return throwError(() => 'Ocorreu um erro ao carregar a lista de funcionários');
          }),
        );
      }
    }

    pagarFuncionario(funcionario: IFuncionario): Observable<IPagamentoResponse> {
      const responseSucesso: IPagamentoResponse = {
        mensagem: '✅ Funcionário pago com sucesso',
        funcionario: {
          id: funcionario.id,
          nome: funcionario.nome,
        },
      };

      const simulacaoErroHttp = new HttpErrorResponse({
        error: {
            mensagem: 'Conta bloqueada.',
            codigoInterno: 'ERR_FUNC_400',
          },
          status: 400,
          statusText: 'Bad request',
          url: 'https://api.suaempresa.com.br/v1/funcionarios/pagamento',
      });

      return of(responseSucesso).pipe(
        delay(2000),
        map((response) => {
          if (response.funcionario.id === 2) {
            throw simulacaoErroHttp;
          }

          return response;
        }),
        catchError((erro: HttpErrorResponse) => {
          const pagamentoResponseErro: IPagamentoResponse = {
            mensagem: erro.status === 400 ? erro.error.mensagem : 'Ocorreu um erro inesperado.',
            funcionario,
          };

          return throwError(() => pagamentoResponseErro);
        }),
      );
    }
}
