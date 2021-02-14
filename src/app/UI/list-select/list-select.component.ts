import {Component, OnInit, ViewChild} from '@angular/core';
import { ServiceLine} from '../dash/service/service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss']
})


export class ListSelectComponent implements OnInit {

  selectedValue = '';
  frmOptions!: FormGroup;
  @ViewChild('picker') picker: any;
  public hidden = true;
  public date!: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 15;
  public maxDate = new Date();
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  // tslint:disable-next-line:variable-name
  constructor(public service: ServiceLine, public _fb: FormBuilder ) {  }
  ngOnInit(): void {

    const StarterDate = new Date();
    const FinishDate = new Date();
    const GroupTime = '30_minutes';
    const car = '100';
    const cat = '2';
    if (FinishDate.getMinutes() > 45) {FinishDate.setMinutes(45, 0, 0); }
    else if (FinishDate.getMinutes() >= 30 && FinishDate.getMinutes() < 45 ) { FinishDate.setMinutes(30, 0, 0); }
    else if (FinishDate.getMinutes() >= 15 && FinishDate.getMinutes() < 30 ) { FinishDate.setMinutes(15, 0, 0); }
    else { FinishDate.setMinutes(0, 0, 0); }
    StarterDate.setHours(FinishDate.getHours() - 24, FinishDate.getMinutes());
    this.frmOptions = this._fb.group({
      DateSelectedFinish: FinishDate,
      DateSelectedStart: StarterDate,
      Record_Group_Time: GroupTime,
      MaxVehicles: car,
      Category: cat,
    });
    }
  SendToService(value: any): void{
    this.service.UpdateServiceValues(value);
  }
  noClick(): void{
    this.hidden = !this.hidden;
  }
}
