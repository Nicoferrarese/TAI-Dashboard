import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Record } from '../dash/service/line-data';
import {ServiceLine} from '../dash/service/service.service';

@Injectable({
  providedIn: 'root'
})

export class LogServiceService {
  private ordersUrl = 'api/orders/orders.json';

  constructor(private http: HttpClient, private api: ServiceLine) { }

  getRecord(offset?: number, pageSize?: number, sortField?: string, sortDirection?: string): Observable<Record[]> {
    return this.api.getLineGraphData().pipe(
      map((response) => {
        return this.getPagedData(
          this.getSortedData(
            response,
            sortField,
            sortDirection), offset, pageSize);
      }),
      catchError(this.handleError)
    );
  }

  getRecordCount(): Observable<number> {
    return this.api.getLineGraphData().pipe(
      map((response) => {
        return response.length;
      }),
      catchError(this.handleError)
    );
  }

  // tslint:disable-next-line:typedef
  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    return throwError(errorMessage);
  }

  private getPagedData(data: Record[], startIndex: number, pageSize?: number): Record[] {
    return data.splice(startIndex, pageSize);
  }

  private getSortedData(data: Record[], active?: string, direction?: string): Record[] {
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
         case 'taiLane1NumberOfVehicles': return compare(+a.measure.measureTimestamp, +b.measure.measureTimestamp, isAsc);
          case 'data': return compare(+a.measure.data , +b.measure.data, isAsc);
        // case 'name': return compare(+a.measure.taiLane1NumberOfVehicles, +b.measure.taiLane1NumberOfVehicles, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number | Date , b: string | number | Date, isAsc: boolean): any{
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
function comparedat(a: Date , b: Date, isAsc: boolean): any {
      // @ts-ignore
      if ( a > b) {
        if (isAsc){ return 1; }
        else { return -1; }
    }
    else { // @ts-ignore
      if (a < b) {
        if (isAsc){ return -1; }
        else { return 1; }
      }
      else {
        return 0;
      }
    }
}

