import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesMonthlyComponent } from './cases.monthly.component';

describe('CasesMonthlyComponent', () => {
  let component: CasesMonthlyComponent;
  let fixture: ComponentFixture<CasesMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
