import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsDailysnapshotComponent } from './assignments.dailysnapshot.component';

describe('AssignmentsDailysnapshotComponent', () => {
  let component: AssignmentsDailysnapshotComponent;
  let fixture: ComponentFixture<AssignmentsDailysnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsDailysnapshotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsDailysnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
