import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {Drawer} from 'primeng/drawer';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {StyleClass} from 'primeng/styleclass';
import {RouterLink, RouterOutlet} from '@angular/router';

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
    NgClass
  ],
  standalone: true,
  templateUrl: './app.layout.component.html',
  styleUrl: './app.layout.component.scss'
})
export class AppLayoutComponent {
  showMenu = true;
  userMenuItems: MenuItem[] | undefined;

  constructor() {
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
