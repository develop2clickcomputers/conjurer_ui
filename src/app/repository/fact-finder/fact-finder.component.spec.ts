import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactFinderComponent } from './fact-finder.component';

describe('FactFinderComponent', () => {
  let component: FactFinderComponent;
  let fixture: ComponentFixture<FactFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
