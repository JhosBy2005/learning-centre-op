/**
 * Minimal contract implemented by domain entities across bounded contexts.
 *
 * @author José Santana
 */
export interface BaseEntity {
  /**
   * Unique identifier for the entity.
   */
  id: number;
}
