import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {SportsCenter} from '../domain/model/sports-center.entity';
import {SportsCenterResource, SportsCentersResponse} from './sports-centers-response';

/**
 * Maps sports center entities to and from API resources.
 *
 * @author José Santana
 */
export class SportsCenterAssembler implements BaseAssembler<SportsCenter, SportsCenterResource, SportsCentersResponse> {

  /**
   * Converts a SportsCentersResponse to an array of SportsCenter entities.
   * @param response - The API response containing sports centers.
   * @returns An array of SportsCenter entities.
   */
  toEntitiesFromResponse = (response: SportsCentersResponse): SportsCenter[] =>
    response.sportsCenters.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a SportsCenterResource to a SportsCenter entity.
   * @param resource - The resource to convert.
   * @returns The converted SportsCenter entity.
   */
  toEntityFromResource = (resource: SportsCenterResource): SportsCenter =>
    new SportsCenter({
      id: resource.id,
      name: resource.name,
      activityType: resource.activityType,
      capacity: resource.capacity,
      latitude: resource.latitude,
      longitude: resource.longitude
    });

  /**
   * Converts a SportsCenter entity to a SportsCenterResource.
   * @param entity - The entity to convert.
   * @returns The converted SportsCenterResource.
   */
  toResourceFromEntity = (entity: SportsCenter): SportsCenterResource =>
    ({
      id: entity.id,
      name: entity.name,
      activityType: entity.activityType,
      capacity: entity.capacity,
      latitude: entity.latitude,
      longitude: entity.longitude
    });
}
