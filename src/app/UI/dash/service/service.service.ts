import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Record} from './line-data';

@Injectable({
  providedIn: 'root'
})
export class ServiceLine {
  @Output() updated = new EventEmitter<any>(true);
  @Output() updatedCarNumber = new EventEmitter<any>(true);
  private Sorgente = '';
  private Response !: Observable<Record[]> ;
  public Usage = [0, 0];
  public ActualCars: number[] = [];
  public StartDate = new Date();
  public EndDate = new Date();
  // Parametri FORM, Quelli sotto assegnati sono da intendersi valori di partenza
  public Category = '3';
  public MaxVehicles = '100';  // Massimo numero veicoli
  public RecordGroupTime = '30_minutes';  // minuti di raggruppamento
  constructor(private http: HttpClient) { }
  getLineGraphData(): Observable<Record[]> {
    this.Response = this.http.get<Record[]>(this.BuildRequestLink())
      .pipe(map(result => {
        result.forEach(li => {
          li.data = new Date(li.measure_timestamp);
          console.log(li.data);
          switch (this.Category){
              case ('1'): li.LightLevel = li.applicableCategory1LightLevel; break;
              case ('2'): li.LightLevel = li.applicableCategory2LightLevel; break;
              case ('3'): li.LightLevel = li.applicableCategory3LightLevel; break;
              case ('4'): li.LightLevel = li.applicableCategory4LightLevel; break;
              case ('5'): li.LightLevel = li.applicableCategory5LightLevel; break;
              case ('6'): li.LightLevel = li.applicableCategory6LightLevel; break;
              case ('7'): li.LightLevel = li.applicableCategory7LightLevel; break;
            }
        }); // End Foreach
        this.ActualCars[0] = (result[result.length - 1].taiLane1NumberOfVehicles);
        this.ActualCars[1] = (result[result.length - 1].taiLane2NumberOfVehicles);
        this.ActualCars[2] = Number(this.MaxVehicles);
        this.Usage[0] = Math.trunc(( this.ActualCars[0]  / Number(this.MaxVehicles)) * 100);
        this.Usage[1] = Math.trunc(( this.ActualCars[1]  / Number(this.MaxVehicles)) * 100);
        this.updatedCarNumber.emit('updated');
        return result; }))
      .pipe(catchError(this.handleError));
    return this.Response;
  }
  getUsage(): Observable<number[]>{
    return of(this.Usage);
  }
  getCars(): Observable<number[]>{
    return of(this.ActualCars);
  }
  public UpdateServiceValues(data: any): void{
    this.Category = data.Category;
    this.RecordGroupTime = data.Record_Group_Time;
    this.MaxVehicles = data.MaxVehicles;
    this.StartDate = new Date(data.DateSelectedStart);
    this.EndDate = new Date(data.DateSelectedFinish);
    this.updated.emit('updated');
  }
  public BuildRequestLink(): string{
    this.StartDate.setSeconds(0, 0);
    this.EndDate.setSeconds(0, 0);
    if (this.StartDate.getTime() === this.EndDate.getTime()){
      this.StartDate.setDate( this.StartDate.getDate() - 1 );
    }
    return this.Sorgente = 'http://localhost:8000/timescale/' +
                            this.StartDate.getTime() + '&'
                            + this.EndDate.getTime() + '&'
                            + this.RecordGroupTime;
  }
  // tslint:disable-next-line:typedef
  private handleError(err: HttpErrorResponse){
    let errorMessage: string;
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(errorMessage);
  }


}
