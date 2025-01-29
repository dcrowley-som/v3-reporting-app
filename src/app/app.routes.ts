import { Routes } from '@angular/router';
import {AppLayoutComponent} from './app.layout/app.layout.component';
import {CasesOverviewComponent} from './cases/cases.overview/cases.overview.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'cases',
        component: CasesOverviewComponent
      }
    ]
  }
];
