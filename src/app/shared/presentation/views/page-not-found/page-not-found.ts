import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Displays fallback content for unknown routes.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-page-not-found',
  imports: [MatButton, MatIcon, TranslatePipe],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})
export class PageNotFound implements OnInit {
  /**
   * The invalid path that led to this page.
   */
  protected invalidPath = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /**
   * Initializes the component and sets the invalid path from the route.
   */
  ngOnInit(): void {
    this.invalidPath = '/' + this.route.snapshot.url.map(url => url.path).join('/');
  }

  /**
   * Navigates to the home page.
   */
  protected navigateToHome(): void {
    this.router.navigate(['home']).then();
  }
}
