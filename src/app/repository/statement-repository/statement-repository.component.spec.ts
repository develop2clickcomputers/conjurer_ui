import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementRepositoryComponent } from './statement-repository.component';

describe('StatementRepositoryComponent', () => {
  let component: StatementRepositoryComponent;
  let fixture: ComponentFixture<StatementRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
