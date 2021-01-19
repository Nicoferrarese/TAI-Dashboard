import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import {ServiceLine} from '../../UI/dash/service/service.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Record} from '../../UI/dash/service/line-data';

@Component({
  selector: 'app-traffic-radar',
  templateUrl: './traffic-radar.component.html',
  styleUrls: ['./traffic-radar.component.css']
})

export class TrafficRadarComponent implements OnInit {
  @Input() title = '';
  public radarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    }
  };
  public radarChartLabels: Label[] = [];

  public radarChartData: ChartDataSets[] = [
    { data: [],
      label: 'Direction 1' },
    { data: [],
      label: 'Direction 2' }
  ];
  public radarChartType: ChartType = 'radar';
  public radarChartLegend = false;
  constructor(private api: ServiceLine, public _fb: FormBuilder ){}
  public arrayRecord: Record[] = [];
  ngOnInit(): void {
    // -----------
    this.api.getLineGraphData().subscribe({
      next: Item => {
        this.arrayRecord = Item;
        this.arrayRecord.forEach(li => {
            // @ts-ignore
            this.radarChartData[0].data.push(li.measure?.taiLane1NumberOfVehicles);
            // @ts-ignore
            this.radarChartData[1].data.push(li.measure?.taiLane2NumberOfVehicles);
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
            this.radarChartData[1].data = [];
            this.radarChartLabels = [];
            this.arrayRecord = Item;
            this.arrayRecord.forEach(li => {
                // @ts-ignore
                this.radarChartData[0].data.push(li.measure?.taiLane1NumberOfVehicles);
                // @ts-ignore
                this.radarChartData[1].data.push(li.measure?.taiLane2NumberOfVehicles);
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
