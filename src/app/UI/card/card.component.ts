import { Component, Input, OnInit } from '@angular/core';
import { ServiceLine} from '../../UI/dash/service/service.service';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  // @ts-ignore
  @Input() title: string;
  constructor(private configService: ServiceLine) { }
  ngOnInit(): void {
  }
}
