import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseLineComponent } from './use-line.component';

describe('UseLineComponent', () => {
  let component: UseLineComponent;
  let fixture: ComponentFixture<UseLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
