import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Reservation} from '../domain/model/reservation.entity';
import {ReservationResource, ReservationsResponse} from './reservations-response';
import {CreateReservationRequest} from './create-reservation.request';

/**
 * Maps reservation entities to and from API resources and requests.
 *
 * @author José Santana
 */
export class ReservationAssembler implements BaseAssembler<Reservation, ReservationResource, ReservationsResponse> {

  /**
   * Converts a ReservationsResponse to an array of Reservation entities.
   * @param response - The API response containing reservations.
   * @returns An array of Reservation entities.
   */
  toEntitiesFromResponse = (response: ReservationsResponse): Reservation[] =>
    response.reservations.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a ReservationResource to a Reservation entity.
   * @param resource - The resource to convert.
   * @returns The converted Reservation entity.
   */
  toEntityFromResource = (resource: ReservationResource): Reservation =>
    new Reservation({
      id: resource.id,
      sportsCenterId: Number(resource.sportsCenterId),
      activityType: resource.activityType,
      participantName: resource.participantName,
      participants: Number(resource.participants),
      weatherTemperature: resource.weatherTemperature,
      reservedAt: new Date(resource.reservedAt)
    });

  /**
   * Converts a Reservation entity to a ReservationResource.
   * @param entity - The entity to convert.
   * @returns The converted ReservationResource.
   */
  toResourceFromEntity = (entity: Reservation): ReservationResource =>
    ({
      id: entity.id,
      ...this.toCreateRequestFromEntity(entity)
    });

  /**
   * Converts a Reservation entity to the request used to create it.
   * @param entity - The entity to convert.
   * @returns The request body without identifier.
   */
  toCreateRequestFromEntity = (entity: Reservation): CreateReservationRequest =>
    ({
      sportsCenterId: entity.sportsCenterId,
      activityType: entity.activityType,
      participantName: entity.participantName,
      participants: entity.participants,
      weatherTemperature: entity.weatherTemperature,
      reservedAt: entity.reservedAt.toISOString()
    });
}
