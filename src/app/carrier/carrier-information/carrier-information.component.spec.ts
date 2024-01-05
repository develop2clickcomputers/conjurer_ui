import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierInformationComponent } from './carrier-information.component';

describe('CarrierInformationComponent', () => {
  let component: CarrierInformationComponent;
  let fixture: ComponentFixture<CarrierInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
