import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Record } from '../../UI/dash/service/line-data';
import { ServiceLine} from '../../UI/dash/service/service.service';
import 'chartjs-plugin-streaming';
import {interval} from 'rxjs';

@Component({
  selector: 'app-use-line',
  templateUrl: './use-line.component.html',
  styleUrls: ['./use-line.component.scss']
})
export class UseLineComponent implements OnInit {
  @Input() chartData: any;
  @Input() title = '';
  constructor(private api: ServiceLine){}

  public lineChartData: ChartDataSets[] = [
    {
      label: 'Direction 1 (veh/h)',
      data: []
    }, {
      label: 'Direction 2 (veh/h)',
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
    this.api.updated.subscribe(() => {
      this.FillGraph();
    });
    this.FillGraph();
    interval(1000 * 30).subscribe( () => {
          this.FillGraph();
        }
      );
  }
  public FillGraph(): void{
    this.api.getLineGraphData().subscribe({
        next: Item => {
          this.lineChartData[0].data = [];
          this.lineChartData[1].data = [];
          this.lineChartLabels = [];
          this.arrayRecord = Item;
          this.arrayRecord.forEach(li => {
              this.lineChartData[0].data?.push(li.taiLane1NumberOfVehicles);
              this.lineChartData[1].data?.push(li.taiLane2NumberOfVehicles);
              this.lineChartLabels.push(  li.data.getDate() + '/' +
                                          (li.data.getMonth() + 1) + '/' +
                                          li.data.getFullYear()  + ' ' +
                                          li.data?.getHours() + ':' + this.print_minutes(li.data?.getMinutes()));
            }
          );
        }
      }
    );
  }
  public print_minutes(input: number): string{
    if (input < 10) {return('0' + input); }
    return input.toString();
  }
}

