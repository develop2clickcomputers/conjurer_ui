import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderCommissionComponent } from './rider-commission.component';

describe('RiderCommissionComponent', () => {
  let component: RiderCommissionComponent;
  let fixture: ComponentFixture<RiderCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
