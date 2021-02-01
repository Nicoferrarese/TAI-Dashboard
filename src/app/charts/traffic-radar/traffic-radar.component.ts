import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import {ServiceLine} from '../../UI/dash/service/service.service';
import {Record} from '../../UI/dash/service/line-data';
import {interval} from 'rxjs';

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
  constructor(private api: ServiceLine){}
  public arrayRecord: Record[] = [];
  ngOnInit(): void {
    this.api.updated.subscribe(() => {
      this.FillGraph();
    });
    this.FillGraph();
    interval(1000 * 30).subscribe( x => {
        this.FillGraph();
      }
    );
  }
public FillGraph(): void{
  this.api.getLineGraphData().subscribe({
      next: Item => {
        this.radarChartData[0].data = [];
        this.radarChartData[1].data = [];
        this.radarChartLabels = [];
        this.arrayRecord = Item;
        this.arrayRecord.forEach(li => {
            this.radarChartData[0].data?.push(li.measure?.taiLane1NumberOfVehicles);
            this.radarChartData[1].data?.push(li.measure?.taiLane2NumberOfVehicles);
            this.radarChartLabels.push(li.measure?.data?.getHours() + ':' + li.measure?.data?.getMinutes());
          }
        );
      }
    }
  );
}
}
