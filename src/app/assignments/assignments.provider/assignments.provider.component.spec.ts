import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsProviderComponent } from './assignments.provider.component';

describe('AssignmentsProviderComponent', () => {
  let component: AssignmentsProviderComponent;
  let fixture: ComponentFixture<AssignmentsProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
