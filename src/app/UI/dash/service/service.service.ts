import {Injectable} from '@angular/core';
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
  private Sorgente = 'http://localhost:3000/measures';
  private Response !: Observable<Record[]> ;
  public Usage = 0;
  public Category = '3';
  public ActualCars: number[] = [];
  // Parametri FORM
  public MaxVehicle = 70;  // Massimo numero veicoli
  public GroupNumber = 2;  // quanti record Raggruppare tra loro
  public hours = 3;        // mostrare ultime X ore
  //
  constructor(private http: HttpClient) { }
  getLineGraphData(): Observable<Record[]> {
    // @ts-ignore
    this.Response = this.http.get<Record[]>(this.Sorgente)
      .pipe(map(result => {
        result.forEach(li => {
          // @ts-ignore
          // li.measure.time = decodeURIComponent( li.measure?.measureTimestamp );
          // const dateParts = li.measure?.time.split('/');
          // console.log(li);
          // @ts-ignore
          // @ts-ignore
          li.measure.data = new Date(li.measure.measureTimestamp);
          if (this.Category === '1'){li.measure.LightLevel = li.measure.applicableCategory1LightLevel; }
          if (this.Category === '2'){li.measure.LightLevel = li.measure.applicableCategory2LightLevel; }
          if (this.Category === '3'){li.measure.LightLevel = li.measure.applicableCategory3LightLevel; }
          if (this.Category === '4'){li.measure.LightLevel = li.measure.applicableCategory4LightLevel; }
          if (this.Category === '5'){li.measure.LightLevel = li.measure.applicableCategory5LightLevel; }
          if (this.Category === '6'){li.measure.LightLevel = li.measure.applicableCategory6LightLevel; }
          if (this.Category === '7'){li.measure.LightLevel = li.measure.applicableCategory7LightLevel; }
        });
        return result; }))
      .pipe(map (result => {
        this.SortRecord(result);
        return result; }))
      .pipe(map (result => {
        result = this.SliceRecord(result);
        result = this.NormalizeRecord(result);
        // @ts-ignore
        this.ActualCars[0] = (result[result.length - 1].measure.taiLane1NumberOfVehicles);
                          // @ts-ignore
        this.ActualCars[1] = (result[result.length - 1].measure.taiLane2NumberOfVehicles);
        // @ts-ignore
        this.Usage = Math.trunc(( (this.ActualCars[0] + this.ActualCars[1]) / this.MaxVehicle) * 100);
        // @ts-ignore
        return result; }))
      .pipe(catchError(this.handleError));
    return this.Response;
  }
  getUsage(): Observable<number>{
    return of(this.Usage);
  }
  getCars(): Observable<number[]>{
    this.ActualCars[2] = this.MaxVehicle;
    return of(this.ActualCars);
  }
  public PushData(data: any): void{
      this.GroupNumber = data.FilterNumber;
      this.MaxVehicle = data.MaxNumber;
      this.hours      = data.Hour;
      console.log('----> ' + data.DateSelectedStart);
  }
  public PushDataRadar(data: any): void{
    this.Category = data;
    console.log('------------------> cat: ' + data);
  }
  public NormalizeRecord(result: Record[]): Record[]{
    const ToServe: Record[] = [];
    Number(this.GroupNumber);
    const segments = Math.trunc(result.length / this.GroupNumber);
    let TimeBetween = 0;
    console.log('segmenti: ' + segments);
    for (let i = 0 ; i < segments; i++){
        const index = Number(i * this.GroupNumber);
        const GNumber = Number(this.GroupNumber);
        if(index > (result.length - 1)) break;
        // @ts-ignore
        TimeBetween = result[index].measure?.data?.getTime() - result[index + GNumber - 1].measure?.data?.getTime();
        //console.log('Time between: ' + TimeBetween + ' index: ' + index + ' ->i: ' + i );
        let ToPush: Record = {
          measure: {
            data: new Date(result[index].measure.data.getTime() + (TimeBetween / 2)),
            taiLane1NumberOfVehicles: 0,
            taiLane2NumberOfVehicles: 0,
            LightLevel: 0,
          }
        };
        for (let g = 0 ; g < GNumber; g++){
          // tslint:disable-next-line:max-line-length
          ToPush.measure.taiLane1NumberOfVehicles = ToPush.measure.taiLane1NumberOfVehicles + result[index + g].measure?.taiLane1NumberOfVehicles;
          // console.log('index: ' + index + ' ->i: ' + i + ' -> g: ' + g);
          // @ts-ignore
          // tslint:disable-next-line:max-line-length
          ToPush.measure?.taiLane2NumberOfVehicles = ToPush.measure?.taiLane2NumberOfVehicles + result[index + g].measure?.taiLane2NumberOfVehicles;
          // @ts-ignore
          // tslint:disable-next-line:max-line-length
          ToPush.measure?.LightLevel = ToPush.measure.LightLevel + result[index + g].measure.LightLevel;
        }
        //console.log('1..');
        ToPush.measure.taiLane1NumberOfVehicles = ToPush.measure.taiLane1NumberOfVehicles / GNumber;
        //console.log('2..');
        ToPush.measure.taiLane2NumberOfVehicles = ToPush.measure.taiLane2NumberOfVehicles / GNumber;
       //console.log('3..');
        ToPush.measure.LightLevel = ToPush.measure.LightLevel / GNumber;
        //console.log('4..');
        ToServe.push(ToPush);
    }
    console.log('serving..');
    return ToServe;
  }
  public SliceRecord(result: Record[]): Record[]{
    const mostRecent = result[result.length - 1].measure?.data;
    // @ts-ignore
    const limitTime = new Date(mostRecent.getTime());
    const ToServe: Record[] = [];
      // @ts-ignore
    limitTime.setHours(limitTime?.getHours() - this.hours);
    result.forEach(li => {
        // @ts-ignore
        if ( li.measure?.data >= limitTime){
          ToServe.push(li);
        }
      });
    return ToServe;
  }
  public SortRecord(li: Record[]): void{
    li.sort((a, b) => {
          // @ts-ignore
          if ( a.measure?.data > b.measure?.data) {
            return 1;
          }
          else { // @ts-ignore
            if (a.measure?.data < b.measure?.data) {
              return -1;
            }
            else {
              return 0;
            }
          }
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
