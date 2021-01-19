import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import {ServiceLine} from '../../UI/dash/service/service.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Record} from '../../UI/dash/service/line-data';

@Component({
  selector: 'app-use-radar',
  templateUrl: './use-radar.component.html',
  styleUrls: ['./use-radar.component.scss']
})

export class UseRadarComponent implements OnInit {
  @Input() title = '';
  public radarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    }
  };
  frmOptions!: FormGroup;
  public radarChartLabels: Label[] = [];

  public radarChartData: ChartDataSets[] = [
    { data: [], label: 'Illuminazione' }
  ];
  public radarChartType: ChartType = 'radar';
  public radarChartLegend = false;
  constructor(private api: ServiceLine, public _fb: FormBuilder ){}
  public arrayRecord: Record[] = [];
  ngOnInit(): void {
    this.frmOptions = this._fb.group({
      Category: '3'
    });
    // -----------
    this.api.getLineGraphData().subscribe({
      next: Item => {
        this.arrayRecord = Item;
        this.arrayRecord.forEach(li => {
            // @ts-ignore
            this.radarChartData[0].data.push(li.measure?.LightLevel);
            // @ts-ignore
            // this.radarChartData[1].data.push(li.measure?.taiLane1NumberOfVehicles + li.measure?.taiLane2NumberOfVehicles);
            // @ts-ignore
            this.radarChartLabels.push(li.measure?.data?.getHours() + ':' + li.measure?.data?.getMinutes());
          }
        );
      }
    });
    // -----------
    setInterval( () =>
      this.api.getLineGraphData().subscribe({
          next: Item => {
            this.radarChartData[0].data = [];
            // this.radarChartData[1].data = [];
            this.radarChartLabels = [];
            this.arrayRecord = Item;
            this.arrayRecord.forEach(li => {
                // @ts-ignore
                this.radarChartData[0].data.push(li.measure?.LightLevel);
                // @ts-ignore
                // this.radarChartData[1].data.push(li.measure?.taiLane1NumberOfVehicles + li.measure?.taiLane2NumberOfVehicles);
              // @ts-ignore
              // this.radarChartData[0].data.push(li.measure?.applicableCategory3LightLevel);
              // @ts-ignore
                this.radarChartLabels.push(li.measure?.data?.getHours() + ':' + li.measure?.data?.getMinutes());
              }
            );
          }
        }
      ), (1000));
  }
  SendToServiceRadar(value: any): void{
    this.api.PushDataRadar(value);
  }

}
