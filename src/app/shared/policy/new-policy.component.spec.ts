import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPolicyComponent } from './new-policy.component';

describe('NewPolicyComponent', () => {
  let component: NewPolicyComponent;
  let fixture: ComponentFixture<NewPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
