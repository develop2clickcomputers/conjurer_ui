import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XMLViewerComponent } from './xml-viewer.component';

describe('XMLViewerComponent', () => {
  let component: XMLViewerComponent;
  let fixture: ComponentFixture<XMLViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XMLViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XMLViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
