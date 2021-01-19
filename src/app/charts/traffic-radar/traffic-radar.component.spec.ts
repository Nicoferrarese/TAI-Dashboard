import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficRadarComponent } from './traffic-radar.component';

describe('TrafficRadarComponent', () => {
  let component: TrafficRadarComponent;
  let fixture: ComponentFixture<TrafficRadarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficRadarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
