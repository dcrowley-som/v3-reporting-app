import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsOverviewComponent } from './assignments.overview.component';

describe('AssignmentsOverviewComponent', () => {
  let component: AssignmentsOverviewComponent;
  let fixture: ComponentFixture<AssignmentsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
