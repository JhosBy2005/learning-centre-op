import {Component, computed, inject, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {TranslatePipe} from '@ngx-translate/core';
import {SportsCenter} from '../../../domain/model/sports-center.entity';
import {SportsCentersStore} from '../../../application/sports-centers.store';

/**
 * Card that summarizes the reservations and capacity of a sports center.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-sports-center-summary',
  imports: [MatCardModule, MatListModule, MatIconModule, MatDividerModule, TranslatePipe],
  templateUrl: './sports-center-summary.html',
  styleUrl: './sports-center-summary.css'
})
export class SportsCenterSummary {
  private readonly store = inject(SportsCentersStore);

  /**
   * Sports center to summarize.
   */
  readonly sportsCenter = input.required<SportsCenter>();

  /**
   * Reservations registered for the sports center.
   */
  protected readonly reservations = computed(() =>
    this.store.getReservationsBySportsCenterId(this.sportsCenter().id));

  /**
   * Sum of participants of all the reservations.
   */
  protected readonly totalParticipants = computed(() =>
    this.store.getTotalParticipants(this.sportsCenter().id));

  /**
   * Capacity minus total participants.
   */
  protected readonly availableCapacity = computed(() =>
    this.store.getAvailableCapacity(this.sportsCenter()));
}
