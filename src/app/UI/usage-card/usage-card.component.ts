import {Component, Input, OnInit} from '@angular/core';
import {ServiceLine} from '../dash/service/service.service';

@Component({
  selector: 'app-usage-card',
  templateUrl: './usage-card.component.html',
  styleUrls: ['./usage-card.component.scss']
})
export class UsageCardComponent implements OnInit {

  Utilizzo = [0, 0];
  color = 'success';

  // @ts-ignore
  @Input() title: string;
  constructor(private configService: ServiceLine) { }
  ngOnInit(): void {
    this.configService.updatedCarNumber.subscribe(() => {
      this.Fill();
    });
  }
  public Fill(): void{
    this.configService.getUsage().subscribe(value => {
      this.Utilizzo[0] = value[0];
      if (this.Utilizzo[0] <= 75){ this.color = 'success'; }
      if (this.Utilizzo[0] > 75 && this.Utilizzo[0] < 90 ){ this.color = 'warning'; }
      if (this.Utilizzo[0] >= 90  ){ this.color = 'danger'; }
      this.Utilizzo[1] = value[1];
      if (this.Utilizzo[1] <= 75){ this.color = 'success'; }
      if (this.Utilizzo[1] > 75 && this.Utilizzo[1] < 90 ){ this.color = 'warning'; }
      if (this.Utilizzo[1] >= 90  ){ this.color = 'danger'; }
    });
  }
}
