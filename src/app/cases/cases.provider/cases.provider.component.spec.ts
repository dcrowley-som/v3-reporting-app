import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesProviderComponent } from './cases.provider.component';

describe('CasesProviderComponent', () => {
  let component: CasesProviderComponent;
  let fixture: ComponentFixture<CasesProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
