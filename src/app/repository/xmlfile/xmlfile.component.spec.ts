import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlfileComponent } from './xmlfile.component';

describe('XmlfileComponent', () => {
  let component: XmlfileComponent;
  let fixture: ComponentFixture<XmlfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
