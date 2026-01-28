/**
 * Game configuration. All magic numbers are collected here for easy balancing and maintenance.
 */
export const CONFIG = {
  canvas: {
    width: 1000,
    height: 500
  },
  game: {
    groundMargin: 40,
    maxSpeed: 4,
    maxParticles: 50,
    enemyInterval: 1000,
    friendInterval: 1000,
    heartsFriendInterval: 5000,
    winningScore: 40,
    maxTime: 60000,
    initialHearts: 5,
    maxEnemiesOnScreen: 2,
    maxFriendsOnScreen: 1,
    maxHearts: 5
  },
  player: {
    width: 129,
    height: 129,
    maxSpeed: 2.5,
    weight: 1,
    fps: 15
  },
  background: {
    width: 1667,
    height: 500
  },
  floatingMessage: {
    targetX: 130,
    targetY: 50
  }
};
