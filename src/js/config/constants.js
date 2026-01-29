/**
 * Game mode and entity type constants. Use instead of string literals.
 * @module config/constants
 */

/** @constant {Object.<string, string>} */
export const MODES = {
  TIME_ATTACK: 'time_attack',
  UNTIL_LOSE: 'until_lose'
};

/** @constant {Object.<string, string>} */
export const ENEMY_TYPES = {
  FLYING: 'flying',
  CLIMBING: 'climbing',
  GROUND: 'ground'
};

/** @constant {Object.<string, string>} */
export const FRIEND_TYPES = {
  FLYING: 'flying',
  HEARTS: 'hearts'
};
