import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdvisorsComponent } from './client-advisors.component';

describe('ClientAdvisorsComponent', () => {
  let component: ClientAdvisorsComponent;
  let fixture: ComponentFixture<ClientAdvisorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAdvisorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdvisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
