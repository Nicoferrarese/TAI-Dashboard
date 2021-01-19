import {Component, Input, OnInit} from '@angular/core';
import {ServiceLine} from '../dash/service/service.service';

@Component({
  selector: 'app-usage-card',
  templateUrl: './usage-card.component.html',
  styleUrls: ['./usage-card.component.scss']
})
export class UsageCardComponent implements OnInit {

  Utilizzo = 0;
  color = 'success';
  // @ts-ignore
  @Input() title: string;
  constructor(private configService: ServiceLine) { }
  ngOnInit(): void {
    setInterval( () =>
      this.configService.getUsage().subscribe(value => {
        this.Utilizzo = value;
        if (this.Utilizzo <= 75){ this.color = 'success'; }
        if (this.Utilizzo > 75 && this.Utilizzo < 90 ){ this.color = 'warning'; }
        if (this.Utilizzo >= 90  ){ this.color = 'danger'; }
      }), (3000));
  }

}
