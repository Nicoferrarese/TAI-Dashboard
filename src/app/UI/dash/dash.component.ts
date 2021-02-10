import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit{
  rHeight = 100;
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 2,
          rHeight: 100,
          MiniCard: { cols: 1, rows: 1 },
          UsageRadar: { cols: 2, rows: 1 },
          UsageChart: { cols: 2, rows: 1 },
          table: { cols: 2, rows: 1 },
        };
      }
      else {
        return{
        columns: 5,
        rHeight: 150,
        MiniCard: { cols: 1, rows: 1  },
        UsageRadar: { cols: 2, rows: 2 },
        UsageChart: { cols: 5, rows: 2}
      };
      }
    })
  );
  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {}
}
