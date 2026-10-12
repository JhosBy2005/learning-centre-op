import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a reservation returned by the API.
 *
 * @author José Santana
 */
export interface ReservationResource extends BaseResource {
  id: number;
  sportsCenterId: number;
  activityType: string;
  participantName: string;
  participants: number;
  weatherTemperature: number;
  reservedAt: string;
}

/**
 * Response envelope for reservation collection queries.
 */
export interface ReservationsResponse extends BaseResponse {
  /**
   * The list of reservations returned by the API.
   */
  reservations: ReservationResource[];
}
