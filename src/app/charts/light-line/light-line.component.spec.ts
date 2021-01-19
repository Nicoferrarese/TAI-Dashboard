import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightLineComponent } from './light-line.component';

describe('LightLineComponent', () => {
  let component: LightLineComponent;
  let fixture: ComponentFixture<LightLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
