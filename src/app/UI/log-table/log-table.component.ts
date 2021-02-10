import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { LogTableDataSource} from './log-table-datasource';
import { Record } from '../dash/service/line-data';
import {LogServiceService} from '../log-service/log-service.service';
import {ServiceLine} from '../dash/service/service.service';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.css']
})
export class LogTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort ;
  @ViewChild(MatTable) table!: MatTable<Record>;
  dataSource!: LogTableDataSource;
  dataLength = 0;
  errorMessage = 'hello';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [// 'measureTimestamp' ,
                      'data', // ];
                      'taiLane1NumberOfVehicles', // ];
                      'taiLane2NumberOfVehicles' ,
                      'LightLevel' ];
  constructor(private Service: LogServiceService, private api: ServiceLine) {}
  ngOnInit(): void {
    this.api.updated.subscribe(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      this.FillTable();
    });
    this.FillTable();
    // aggiorno solo al cambio impostazioni, facilita fruizione dati.
    // interval(1000 * 30).subscribe( x => {
    //     this.FillTable();
    //   }
    // );
  }
  ngAfterViewInit(): void {
    /*
    * this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    * */
  }
  FillTable(): void{
    this.dataSource = new LogTableDataSource(this.Service);
    this.Service.getRecordCount().subscribe({
      next: Item => {
        this.dataLength = Item;
      },
      error: err => this.errorMessage = err
    });
    // this.table.renderRows();
  }
}
