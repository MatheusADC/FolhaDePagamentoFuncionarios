import { Component } from '@angular/core';
import { CicloVidaObs } from './exemplos/ciclo-vida-obs/ciclo-vida-obs';
import { ModFluxoObservable } from './exemplos/mod-fluxo-observable/mod-fluxo-observable';
import { ObsMultiplosValores } from './exemplos/obs-multiplos-valores/obs-multiplos-valores';
import { PrimeiroObservable } from './exemplos/primeiro-observable/primeiro-observable';
import { FolhaPagamentos } from './exemplos/projetos/folha-pagamentos/folha-pagamentos';
import { DefaultIfEmpty } from './exemplos/tratamento-complete/default-if-empty/default-if-empty';
import { EndWith } from './exemplos/tratamento-complete/end-with/end-with';
import { Finalize } from './exemplos/tratamento-complete/finalize/finalize';
import { Tap } from './exemplos/tratamento-complete/tap/tap';
import { CatchErrorEmpty } from './exemplos/tratamento-erros-catch-error/catch-error-empty/catch-error-empty';
import { CatchErrorFallbackOf } from './exemplos/tratamento-erros-catch-error/catch-error-fallback-of/catch-error-fallback-of';
import { PlanoB } from './exemplos/tratamento-erros-catch-error/plano-b/plano-b';
import { RepasseComThrowError } from './exemplos/tratamento-erros-catch-error/repasse-com-throw-error/repasse-com-throw-error';

@Component({
  selector: 'app-root',
  imports: [
    PrimeiroObservable,
    ObsMultiplosValores,
    ModFluxoObservable,
    CicloVidaObs,
    CatchErrorFallbackOf,
    CatchErrorEmpty,
    PlanoB,
    RepasseComThrowError,
    Finalize,
    Tap,
    EndWith,
    DefaultIfEmpty,
    FolhaPagamentos
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
