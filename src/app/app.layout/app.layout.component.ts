import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {Drawer} from 'primeng/drawer';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {StyleClass} from 'primeng/styleclass';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {EpisodeService} from '../services/episode.service';
import {CasesDetailsComponent} from '../cases/cases.details/cases.details.component';
import {CasesParams} from '../models/cases-params';
import {AppService} from '../services/app.service';

@Component({
  selector: 'app-app.layout',
  imports: [
    Button,
    Drawer,
    Menu,
    NgOptimizedImage,
    Ripple,
    StyleClass,
    RouterLink,
    RouterOutlet,
    CasesDetailsComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './app.layout.component.html',
  styleUrl: './app.layout.component.scss'
})
export class AppLayoutComponent {
  showMenu = true;
  userMenuItems: MenuItem[] | undefined;
  detailsParams: CasesParams | undefined;
  appVersion: string;
  constructor(
    private appService: AppService,
    private episodeService: EpisodeService
  ) {
    this.episodeService.casesParams$.subscribe((data: any) => {
      this.detailsParams = data;
    });
    this.appVersion = appService.appVersion;
    this.userMenuItems = [
      {
        label: 'tester@som.umaryland.edu',
        icon: 'pi pi-user'
      },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('.show-app-dark-mode');
    }
  }

  toggleSideDrawer() {
    this.showMenu = !this.showMenu;
  }

  private logout() {
    alert('log out not implemented');
  }
}
