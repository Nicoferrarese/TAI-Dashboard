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
  private Sorgente = 'http://localhost:8000/api/record';
  private Response !: Observable<Record[]> ;
  public Usage = [0, 0];
  public ActualCars: number[] = [];
  public StartDate = new Date(2020, 10, 1);
  public EndDate = new Date();
  // Parametri FORM, Quelli sotto assegnati sono da intendersi valori di partenza
  public Category = '3';
  public MaxVehicles = 200;  // Massimo numero veicoli
  public RecordGroupTime = 10;  // minuti di raggruppamento
  //
  constructor(private http: HttpClient) { }
  getLineGraphData(): Observable<Record[]> {
    this.Response = this.http.get<Record[]>(this.Sorgente)
      .pipe(map(result => {
        result.forEach(li => {
          console.log('recieved: -> ' + li.measureTimestamp);
          li.data = new Date(li.measureTimestamp);
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
        this.ActualCars[2] = this.MaxVehicles;
        this.Usage[0] = Math.trunc(( this.ActualCars[0]  / this.MaxVehicles) * 100);
        this.Usage[1] = Math.trunc(( this.ActualCars[1]  / this.MaxVehicles) * 100);
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
    console.log(data);
    this.updated.emit('updated');
    switch (data.Record_Group_Time) {
      case ('10m'): this.RecordGroupTime = 10; break;
      case ('30m'): this.RecordGroupTime = 30; break;
      case ('60m'): this.RecordGroupTime = 60; break;
      case ('2h'):  this.RecordGroupTime = 60 * 2; break;
      case ('3h'):  this.RecordGroupTime = 60 * 3; break;
    }
    this.Category = data.Category;
    this.MaxVehicles = Number(data.MaxVehicles);
    this.StartDate = new Date(data.DateSelectedStart);
    this.EndDate = new Date(data.DateSelectedFinish);

    this.Sorgente =  'http://localhost:8080/api/record/'  + this.StartDate.getTime() + '&'
      + this.EndDate.getTime() + '&'
      + this.RecordGroupTime;
  }
  /*
  public NormalizeRecord(result: Record[]): Record[]{
    const ToServe: Record[] = [];
    Number(this.RecordGroupTime);
    // --------------------------------
    let InputLength = result.length - 1;
    let index = InputLength;
    let LastElementIndex = InputLength;
    let itemsInThisSection = 0;
    while (index > 0 ){
      let ToPush: Record = {
       measure: {
         taiLane1NumberOfVehicles: 0,
         taiLane2NumberOfVehicles: 0,
         LightLevel: 0
       },
      };
      itemsInThisSection = 0;
      while (result[LastElementIndex].measure.data.getTime() < (result[index].measure.data.getTime() + this.RecordGroupTime * 60000)){
        ToPush.measure.taiLane1NumberOfVehicles += result[index].measure.taiLane1NumberOfVehicles;
        ToPush.measure.taiLane2NumberOfVehicles += result[index].measure.taiLane2NumberOfVehicles;
        ToPush.measure.LightLevel += result[index].measure.LightLevel;
        index -= 1;
        itemsInThisSection += 1;
        if ( index < 0 ) { index = 0; break; }
      }
      ToPush.measure.taiLane1NumberOfVehicles = Math.trunc(ToPush.measure.taiLane1NumberOfVehicles / itemsInThisSection);
      ToPush.measure.taiLane2NumberOfVehicles = Math.trunc(ToPush.measure.taiLane2NumberOfVehicles / itemsInThisSection);
      ToPush.measure.LightLevel = Math.trunc(ToPush.measure.LightLevel / itemsInThisSection);
      ToPush.measure.data = new Date( result[index].measure.data.getTime() + (( result[LastElementIndex].measure.data.getTime() -
                                                                                      result[index].measure.data.getTime()) / 2));
      LastElementIndex = index;
      ToServe.unshift(ToPush);
    }
    return ToServe;
  }
  public SliceRecord(result: Record[]): Record[]{
    const LOWERLimit = this.StartDate.getTime();
    const UPPERLimit = this.EndDate.getTime();
    let ToServe: Record[] = [];
    result.forEach(li => {
        if ( li.measure?.data <= UPPERLimit && li.measure?.data >= LOWERLimit){
            ToServe.push(li);
        }
      }
    );
    return ToServe;
  }
  public SortRecord(li: Record[]): void{
    li.sort((a, b) => {
      return (a.measure.data < b.measure.data ? -1 : 1);
    });
  }
  */
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
