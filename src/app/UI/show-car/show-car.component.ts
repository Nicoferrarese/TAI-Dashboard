import {Component, Input, OnInit} from '@angular/core';
import {ServiceLine} from '../dash/service/service.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-show-car',
  templateUrl: './show-car.component.html',
  styleUrls: ['./show-car.component.css']
})
export class ShowCarComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  N_auto1 = 0;
  // tslint:disable-next-line:variable-name
  N_auto2 = 0;
  color = 'success';
  // @ts-ignore
  @Input() title: string;
  constructor(private api: ServiceLine) { }
  ngOnInit(): void {
    this.api.updatedCarNumber.subscribe(() => {
      this.Fill();
    });
    console.log('i fill');
  }
  public Fill(): void{
    this.api.getCars().subscribe(value => {
      this.N_auto1 = value[0];
      this.N_auto2 = value[1];
      value[2] = value[2] / 2;
      if (this.N_auto1 <= (0.75 * value[2])){ this.color = 'success'; }
      if (this.N_auto1 >  (0.75 * value[2]) && this.N_auto1 < (0.90 * value[2]) ){ this.color = 'warning'; }
      if (this.N_auto1 >= (0.90 * value[2])){ this.color = 'danger'; }

      if (this.N_auto2 <= (0.75 * value[2])){ this.color = 'success'; }
      if (this.N_auto2 >  (0.75 * value[2]) && this.N_auto2 < (0.90 * value[2]) ){ this.color = 'warning'; }
      if (this.N_auto2 >= (0.90 * value[2])){ this.color = 'danger'; }
    });
  }
}
