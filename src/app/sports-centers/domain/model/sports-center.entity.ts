import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Represents a sports center of the UrbanFit network.
 *
 * @remarks
 * Each sports center is specialized in a single activity type and has a maximum capacity of participants.
 *
 * @author José Santana
 */
export class SportsCenter implements BaseEntity {
  /**
   * Unique identifier of the sports center.
   */
  #id: number;

  /**
   * Name of the sports center.
   */
  #name: string;

  /**
   * Activity type offered by the sports center (fitness, yoga, swimming or cycling).
   */
  #activityType: string;

  /**
   * Maximum number of participants allowed.
   */
  #capacity: number;

  /**
   * Latitude of the sports center location.
   */
  #latitude: number;

  /**
   * Longitude of the sports center location.
   */
  #longitude: number;

  /**
   * Creates a new sports center entity.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    name: string;
    activityType: string;
    capacity: number;
    latitude: number;
    longitude: number;
  }) {
    this.#id = props.id;
    this.#name = props.name;
    this.#activityType = props.activityType;
    this.#capacity = props.capacity;
    this.#latitude = props.latitude;
    this.#longitude = props.longitude;
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  get activityType(): string {
    return this.#activityType;
  }

  set activityType(value: string) {
    this.#activityType = value;
  }

  get capacity(): number {
    return this.#capacity;
  }

  set capacity(value: number) {
    this.#capacity = value;
  }

  get latitude(): number {
    return this.#latitude;
  }

  set latitude(value: number) {
    this.#latitude = value;
  }

  get longitude(): number {
    return this.#longitude;
  }

  set longitude(value: number) {
    this.#longitude = value;
  }
}
