import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {environment} from '../../../../../environments/environment';

/**
 * Main layout of the application with toolbar and sidenav.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatSidenavModule,
    MatButtonModule, MatIconModule, MatListModule, TranslatePipe, LanguageSwitcher],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Path of the logo stored in assets.
   */
  protected readonly logoPath = environment.logoPath;

  /**
   * Indicates if the screen is a handset.
   */
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches)),
    {initialValue: false});

  /**
   * Indicates if the sidenav is opened.
   */
  protected readonly opened = signal(true);

  /**
   * Navigation options of the sidenav.
   */
  protected readonly options = [
    {link: '/home', label: 'menu.home', icon: 'home'},
    {link: '/reservations/new', label: 'menu.new-reservation', icon: 'event_available'}
  ];

  /**
   * Opens or closes the sidenav.
   */
  protected toggleMenu(): void {
    this.opened.update(value => !value);
  }
}
