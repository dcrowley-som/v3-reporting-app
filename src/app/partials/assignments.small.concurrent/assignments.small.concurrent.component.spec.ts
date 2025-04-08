import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsSmallConcurrentComponent } from './assignments.small.concurrent.component';

describe('AssignmentsSmallConcurrentComponent', () => {
  let component: AssignmentsSmallConcurrentComponent;
  let fixture: ComponentFixture<AssignmentsSmallConcurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsSmallConcurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsSmallConcurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
