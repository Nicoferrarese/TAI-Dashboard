import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Overview} from './overview';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  getOverview(): Observable<Overview[]> {
    return of([
      { title: 'Risparmio Totale', value: '9465', isIncrease: true, color: 'primary', percentValue: '0.5383', icon: 'euro_symbol', isCurrency: false },
      { title: 'Risparmio Energetico', value: '243 Kw', isIncrease: true, color: 'warn', percentValue: '0.1065', icon: 'flash_on', isCurrency: false },
      { title: 'Traffico Attuale', value: '120 ', isIncrease: true, color: 'primary', percentValue: '0.05',   icon: 'directions_car', isCurrency: false },
      { title: 'Luminosità attuale', value: '35 %', isIncrease: false, color: 'accent', percentValue: '0.1261', icon: 'wb_sunny', isCurrency: false }
    ]);
  }
  constructor() { }
}
