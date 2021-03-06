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
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    return throwError(errorMessage);
  }

  private getPagedData(data: Record[], startIndex?: number, pageSize?: number): Record[] {
    if (typeof startIndex === 'undefined') { startIndex = 0; }
    return data.splice(startIndex, pageSize);
  }

  private getSortedData(data: Record[], active?: string, direction?: string): Record[] {
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
         case 'taiLane1NumberOfVehicles': return compare(+a.measure_timestamp, +b.measure_timestamp, isAsc);
         case 'data': return compare(+a.data , +b.data, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number | Date , b: string | number | Date, isAsc: boolean): any{
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
