import {Component, effect, input, linkedSignal, OnInit, signal, ViewChild} from '@angular/core';
import {Drawer} from 'primeng/drawer';
import {CasesParams} from '../../models/cases-params';
import {EpisodeService} from '../../services/episode.service';
import {Table, TableModule} from 'primeng/table';
import {DatePipe, DecimalPipe, SlicePipe} from '@angular/common';
import {Panel} from 'primeng/panel';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {ScrollPanel} from 'primeng/scrollpanel';

@Component({
  selector: 'app-cases-details',
  imports: [
    Drawer,
    TableModule,
    DatePipe,
    SlicePipe,
    DecimalPipe,
    Panel,
    Button,
    Tag,
    IconField,
    InputIcon,
    InputText,
    ScrollPanel
  ],
  templateUrl: './cases.details.component.html',
  standalone: true,
  styleUrl: './cases.details.component.scss'
})
export class CasesDetailsComponent implements OnInit {
  @ViewChild('dt') myTable: Table | undefined;
  casesParams = input<CasesParams>();
  showDrawer = false;
  public rows = signal<any[]>([]);
  cols: any[] = [];
  downloadName = 'cases-details';
  selectedRow: any | undefined;
  showRow = false;
  constructor(
    private episodeService: EpisodeService,
  ) {
    effect(() => {
      if (this.casesParams() !== undefined) {
        this.showDrawer = true;
        this.fetchData(this.casesParams()!);
      }
    });
  }

  ngOnInit() {
    // do nothing
  }

  onRowSelect($event: any) {
    this.showRow = true;
  }

  public drawerHeader = linkedSignal<string>(() => {
    if (this.rows().length && this.casesParams() && this.casesParams()?.user) {
      return 'Cases Details for ' + this.rows()[0].responsibleProvName;
    } else {
      return 'Cases Details';
    }
  });

  onHide() {
    // do nothing
  }

  onFilter($event: any) {
    this.myTable?.filterGlobal($event.target.value, 'contains');
  }

  private fetchData(params: CasesParams): void {
    this.episodeService.details(
      params.selectedRange as string, params.categories, params.user, params.dates
    ).subscribe((data: any) => {
      if (data.result.length) {
        for (let key of Object.keys(data.result[0])) {
          this.cols.push({ field: key, header: key });
        }
        if (this.casesParams()?.user) {
          this.downloadName = 'cases-details-for_' + data.result[0].responsibleProvName;
        }
      }
      this.rows.set(data.result);
    });
  }
}
