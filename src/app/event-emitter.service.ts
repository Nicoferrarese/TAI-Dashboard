
import { Injectable, EventEmitter } from '@angular/core';
import { Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  AskNumberElements = new EventEmitter();
  subsVar: Subscription | undefined;
  constructor() { }
  /*// tslint:disable-next-line:typedef
  RequestNumberElement(numeroelementi: string) {
    this.AskNumberElements.emit(numeroelementi);
  }
  */}
