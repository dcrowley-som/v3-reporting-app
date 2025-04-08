import { Routes } from '@angular/router';
import {AppLayoutComponent} from './app.layout/app.layout.component';
import {CasesOverviewComponent} from './cases/cases.overview/cases.overview.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CasesMonthlyComponent} from './cases/cases.monthly/cases.monthly.component';
import {CasesProviderComponent} from './cases/cases.provider/cases.provider.component';
import {AssignmentsOverviewComponent} from './assignments/assignments.overview/assignments.overview.component';
import {AssignmentsProviderComponent} from './assignments/assignments.provider/assignments.provider.component';
import {AssignmentsConcurrencyComponent} from './assignments/assignments.concurrency/assignments.concurrency.component';
import {UnmatchedComponent} from './invoices/unmatched/unmatched.component';

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
      }, {
        path: 'cases/monthly',
        component: CasesMonthlyComponent
      },
      {
        path: 'cases/provider',
        component: CasesProviderComponent
      },
      {
        path: 'assignments',
        component: AssignmentsOverviewComponent
      },
      {
        path: 'assignments/provider',
        component: AssignmentsProviderComponent
      },
      {
        path: 'assignments/concurrency',
        component: AssignmentsConcurrencyComponent
      },
      {
        path: 'billing/unmatched',
        component: UnmatchedComponent
      }
    ]
  }
];
