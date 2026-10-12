import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';
import {SportsCentersStore} from '../../../../sports-centers/application/sports-centers.store';
import {SportsCenterSummary} from '../../../../sports-centers/presentation/components/sports-center-summary/sports-center-summary';

/**
 * Home view that shows the summary of the sports centers.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-home',
  imports: [MatGridListModule, MatProgressSpinnerModule, TranslatePipe, SportsCenterSummary],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly store = inject(SportsCentersStore);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Number of columns of the grid list (two per row, one on handsets).
   */
  protected readonly columns = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches ? 1 : 2)),
    {initialValue: 2});

  constructor() {
    this.store.refresh();
  }
}
