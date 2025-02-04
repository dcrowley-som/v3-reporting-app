import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-assignments.provider',
  imports: [],
  templateUrl: './assignments.provider.component.html',
  standalone: true,
  styleUrl: './assignments.provider.component.scss'
})
export class AssignmentsProviderComponent implements OnInit {
  private queryParams: any;
  public providerParam: string = '';
  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      if (params['provider']) {
        this.providerParam = params['provider'];
      }
    });
  }
}
