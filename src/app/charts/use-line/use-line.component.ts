import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Record } from '../../UI/dash/service/line-data';
import { ServiceLine} from '../../UI/dash/service/service.service';
import 'chartjs-plugin-streaming';
import { FormBuilder , Validators } from '@angular/forms';
import {EventEmitterService} from '../../event-emitter.service';

@Component({
  selector: 'app-use-line',
  templateUrl: './use-line.component.html',
  styleUrls: ['./use-line.component.scss']
})
export class UseLineComponent implements OnInit {
  @Input() chartData: any;
  @Input() title = '';
  // private api: ServiceLine
  constructor(private api: ServiceLine,
              public FB: FormBuilder ){}

  public lineChartData: ChartDataSets[] = [
    {
      label: 'Direction 1',
      data: []
    }, {
      label: 'Direction 2',
      data: []
    }];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];
  public arrayRecord: Record[] = [];

  ngOnInit(): void {
    // -----------
      this.api.getLineGraphData().subscribe({
        next: Item => {
          this.arrayRecord = Item;
          this.arrayRecord.forEach(li => {
              // @ts-ignore
              this.lineChartData[0].data.push(li.measure?.taiLane1NumberOfVehicles);
              // @ts-ignore
              this.lineChartData[1].data.push(li.measure?.taiLane2NumberOfVehicles);
              let minutes = '';
              // @ts-ignore
              if (li.measure?.data?.getMinutes() < 10){
                minutes = '0' + li.measure?.data?.getMinutes();
              }
              else{
                minutes = '' +  li.measure?.data?.getMinutes();
              }
              // @ts-ignore
              this.lineChartLabels.push(li.measure?.data?.getHours() + ':' + minutes);
            }
          );
        }
      });
    // -----------
      setInterval( () =>
      this.api.getLineGraphData().subscribe({
        next: Item => {
          this.lineChartData[0].data = [];
          this.lineChartData[1].data = [];

          this.lineChartLabels = [];
          this.arrayRecord = Item;
          this.arrayRecord.forEach(li => {
              // @ts-ignore
              this.lineChartData[0].data.push(li.measure.taiLane1NumberOfVehicles);
              // @ts-ignore
              this.lineChartData[1].data.push(li.measure.taiLane2NumberOfVehicles);
              let minutes = '';
              // @ts-ignore
              if (li.measure?.data?.getMinutes() < 10){
                minutes = '0' + li.measure?.data?.getMinutes();
              }
              else{
                minutes = '' +  li.measure?.data?.getMinutes();
              }
              // @ts-ignore
              this.lineChartLabels.push(li.measure?.data?.getHours() + ':' + minutes);
                }
              );
            }
          }
      ), (1000));
  }
 /* externalfunc(){
    this.eventEmitterService.RequestNumberElement(numeroelementi);
  }
  */
}

