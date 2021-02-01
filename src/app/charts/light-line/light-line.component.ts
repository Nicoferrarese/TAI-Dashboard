import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Record } from '../../UI/dash/service/line-data';
import { ServiceLine} from '../../UI/dash/service/service.service';
import 'chartjs-plugin-streaming';
import {interval} from 'rxjs';


@Component({
  selector: 'app-light-line',
  templateUrl: './light-line.component.html',
  styleUrls: ['./light-line.component.scss']
})
export class LightLineComponent implements OnInit {
  @Input() chartData: any;
  constructor(private api: ServiceLine){}
  public lineChartData: ChartDataSets[] = [
    {
      label: '',
      data: []
    }];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
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
  @Input() title = '';

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
    let minutes: string;
    this.api.getLineGraphData().subscribe({
        next: Item => {
          this.lineChartData[0].data = [];
          this.lineChartLabels = [];
          this.arrayRecord = Item;
          this.arrayRecord.forEach(li => {
              this.lineChartData[0].data?.push(li.measure.LightLevel);
              if (li.measure?.data?.getMinutes() < 10){
                minutes = '0' + li.measure?.data?.getMinutes();
              }
              else{
                minutes = '' +  li.measure?.data?.getMinutes();
              }
              this.lineChartLabels.push(li.measure?.data?.getHours() + ':' + minutes);
            }
          );
        }
      }
    );
  }
}

