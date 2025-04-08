import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsConcurrencyComponent } from './assignments.concurrency.component';

describe('AssignmentsConcurrencyComponent', () => {
  let component: AssignmentsConcurrencyComponent;
  let fixture: ComponentFixture<AssignmentsConcurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsConcurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsConcurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
