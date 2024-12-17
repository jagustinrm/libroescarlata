import { Howl } from 'howler';

interface SoundConfig {
  name: string;
  source: string;
  volume?: number;
  loop?: boolean;
}

const sounds: Record<string, Howl> = {};

export const soundService = {
  play(config: SoundConfig) {
    if (!sounds[config.name]) {
      sounds[config.name] = new Howl({
        src: [config.source],
        volume: config.volume || 1.0,
        loop: config.loop || false,
      });
    }
    sounds[config.name].play();
  },

  stop(name: string) {
    if (sounds[name]) {
      sounds[name].stop();
    }
  },

  stopAll() {
    Object.values(sounds).forEach((sound) => sound.stop());
  },
};
