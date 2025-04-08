import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesEpisodeComponent } from './cases.episode.component';

describe('CasesEpisodeComponent', () => {
  let component: CasesEpisodeComponent;
  let fixture: ComponentFixture<CasesEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesEpisodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
