import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmatchedComponent } from './unmatched.component';

describe('UnmatchedComponent', () => {
  let component: UnmatchedComponent;
  let fixture: ComponentFixture<UnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnmatchedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
