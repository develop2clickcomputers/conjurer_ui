import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOutputComponent } from './custom-output.component';

describe('CustomOutputComponent', () => {
  let component: CustomOutputComponent;
  let fixture: ComponentFixture<CustomOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
