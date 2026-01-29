/**
 * Paths to audio files. Relative to project root (index.html).
 * @module config/audio
 * @type {{ music: Object.<string, string>, sfx: Object.<string, string> }}
 */
export const AUDIO = {
  music: {
    background: 'audio/background-music.mp3'
  },
  sfx: {
    enemyHit: 'audio/enemy_hit.wav',
    spiderHit: 'audio/spider_hit.wav',
    playerHit: 'audio/player_hit.wav',
    jump: 'audio/jump.wav',
    potion: 'audio/potion.wav',
    potionHit: 'audio/potion_hit.mp3',
    heart: 'audio/heart.wav',
    gameOver: 'audio/game_over.wav',
    win: 'audio/win.wav'
  }
};
