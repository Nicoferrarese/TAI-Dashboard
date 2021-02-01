import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe} from 'chart.js';
import {Record} from './line-data';
import {Label} from 'ng2-charts';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ServiceLine {
  @Output() updated = new EventEmitter<any>(true);
  @Output() updatedCarNumber = new EventEmitter<any>(true);
  private Sorgente = 'http://localhost:3000/measures';
  private Response !: Observable<Record[]> ;
  public Usage = [0, 0];
  public ActualCars: number[] = [];
  public StartDate = new Date(2020, 10, 1);
  public EndDate = new Date();
  // Parametri FORM, Quelli sotto assegnati sono da intendersi valori di partenza
  public Category = '3';
  public MaxVehicles = 200;  // Massimo numero veicoli
  public RecordGroupTime = 10;  // minuti di raaggruppamento
  //
  constructor(private http: HttpClient) { }
  getLineGraphData(): Observable<Record[]> {
    this.Response = this.http.get<Record[]>(this.Sorgente)
      .pipe(map(result => {
        result.forEach(li => {
          li.measure.data = new Date(li.measure.measureTimestamp);
          switch (this.Category){
            case ('1'): li.measure.LightLevel = li.measure.applicableCategory1LightLevel; break;
            case ('2'): li.measure.LightLevel = li.measure.applicableCategory2LightLevel; break;
            case ('3'): li.measure.LightLevel = li.measure.applicableCategory3LightLevel; break;
            case ('4'): li.measure.LightLevel = li.measure.applicableCategory4LightLevel; break;
            case ('5'): li.measure.LightLevel = li.measure.applicableCategory5LightLevel; break;
            case ('6'): li.measure.LightLevel = li.measure.applicableCategory6LightLevel; break;
            case ('7'): li.measure.LightLevel = li.measure.applicableCategory7LightLevel; break;
          }
          // converto da veicoli in 10min a veicoli/h
          li.measure.taiLane1NumberOfVehicles = li.measure.taiLane1NumberOfVehicles *
            (60 / li.measure.taiMeasurePeriod);
          li.measure.taiLane2NumberOfVehicles = li.measure.taiLane2NumberOfVehicles *
            (60 / 10);
        });
        return result; }))
      .pipe(map (result => {
        this.SortRecord(result);
        return result; }))
      .pipe(map (result => {
        result = this.SliceRecord(result);
        result = this.NormalizeRecord(result);
        this.ActualCars[0] = (result[result.length - 1].measure.taiLane1NumberOfVehicles);
        this.ActualCars[1] = (result[result.length - 1].measure.taiLane2NumberOfVehicles);
        this.ActualCars[2] = this.MaxVehicles;
        console.log('cars: ' + this.ActualCars + ' Mv: ' + this.MaxVehicles);
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
  SendToServiceMaxCar(cars: number): void{
    this.updatedCarNumber.emit('updated');
    console.log('recieved: ' + cars);
    this.MaxVehicles = cars;
  }
  public PushData(data: any): void{
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
  }
  public NormalizeRecord(result: Record[]): Record[]{
    const ToServe: Record[] = [];
    Number(this.RecordGroupTime);
    // --------------------------------
    let InputLenght = result.length - 1;
    let index = InputLenght;
    let LastElementIndex = InputLenght;
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
  // tslint:disable-next-line:typedef
  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    return throwError(errorMessage);
  }


}
