import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ServiceLine } from '../../UI/dash/service/service.service';
import { FormGroup } from '@angular/forms';
import { Record } from '../../UI/dash/service/line-data';
import { interval } from 'rxjs';

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
  constructor(private api: ServiceLine ){}
  public arrayRecord: Record[] = [];
  ngOnInit(): void {
    this.api.updated.subscribe(() => {
      this.FillGraph();
    });
    this.FillGraph();
    interval(1000 * 30).subscribe( () => {
        this.FillGraph();
      }
    );
  }
  public FillGraph(): void{ // -----------
    this.api.getLineGraphData().subscribe({
        next: Item => {
          this.radarChartData[0].data = [];
          this.radarChartLabels = [];
          this.arrayRecord = Item;
          this.arrayRecord.forEach(li => {
              this.radarChartData[0].data?.push(li.LightLevel);
              this.radarChartLabels.push(li.data?.getHours() + ':' + li.data?.getMinutes());
            }
          );
        }
      }
    );
  }
}
