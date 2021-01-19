import { Component, OnInit } from '@angular/core';
import { ServiceLine} from '../dash/service/service.service';
import { FormBuilder, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss']
})


export class ListSelectComponent implements OnInit {
  selectedValue = '';
  frmOptions!: FormGroup;

  // tslint:disable-next-line:variable-name
  constructor(public service: ServiceLine, public _fb: FormBuilder ) {  }
  ngOnInit(): void {
    this.frmOptions = this._fb.group({
      FilterNumber: '2',
      MaxNumber: '60',
      Hour: '3',
      DateSelectedFinish: '',
      DateSelectedStart: '',
      Category: '3'
    });
    }
  SendToService(value: any): void{
    this.service.PushData(value);
  }
  SendToServiceRadar(value: any): void{
    this.service.PushDataRadar(value);
  }
}
