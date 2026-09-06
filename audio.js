/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE AUDIO PROCEDURAL (WEB AUDIO API)
 * Generación matemática 100% autónoma en tiempo real (Cero archivos externos)
 * ============================================================================
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.musicGain = null;
    this.sfxGain = null;
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.bgmStep = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gains
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.12;
      this.musicGain.connect(this.ctx.destination);

      if (this.musicEnabled) {
        this.startBGM();
      }
    } catch (e) {
      console.warn("Web Audio API no soportada:", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // --- EFECTOS DE SONIDO (SFX) ---

  // Sonido de golpe estándar
  playHit() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Golpe crítico pesado
  playCrit() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;

    // Componente grave (impacto)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(260, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.22);
    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.linearRampToValueAtTime(0.01, now + 0.22);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.23);

    // Componente agudo (chispa metálica)
    const hiOsc = this.ctx.createOscillator();
    const hiGain = this.ctx.createGain();
    hiOsc.type = "sawtooth";
    hiOsc.frequency.setValueAtTime(800, now);
    hiOsc.frequency.linearRampToValueAtTime(1600, now + 0.12);
    hiGain.gain.setValueAtTime(0.2, now);
    hiGain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    hiOsc.connect(hiGain);
    hiGain.connect(this.sfxGain);
    hiOsc.start(now);
    hiOsc.stop(now + 0.16);
  }

  // Destrucción de bola
  playDestroy() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Moneda / Recompensa
  playMoney() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Compra en tienda
  playBuy() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const notes = [523.25, 659.25, 783.99]; // C - E - G
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.13);
    });
  }

  // Subida de nivel (Fanfarria arpegiada)
  playLevelUp() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const notes = [440, 554.37, 659.25, 880]; // A major
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.26);
    });
  }

  // Logro desbloqueado
  playAchievement() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const notes = [587.33, 739.99, 880, 1174.66]; // D maj
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.32);
    });
  }

  // Alarma de evento especial
  playEvent() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.25);
    osc.frequency.linearRampToValueAtTime(300, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.52);
  }

  // --- MÚSICA DE FONDO RETRO SYNTH GENERATIVA ---
  startBGM() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.resume();

    const bassScale = [110, 110, 130.81, 146.83, 110, 164.81, 146.83, 130.81]; // A - C - D - E
    const arpScale = [440, 523.25, 659.25, 783.99, 880, 783.99, 659.25, 523.25];

    this.bgmInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;

      const now = this.ctx.currentTime;
      const step = this.bgmStep % 8;

      // Bajo suave
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = "triangle";
        bassOsc.frequency.value = bassScale[step];
        bassGain.gain.setValueAtTime(0.2, now);
        bassGain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.26);
      }

      // Arpegio synth
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = "sine";
      arpOsc.frequency.value = arpScale[step];
      arpGain.gain.setValueAtTime(0.12, now);
      arpGain.gain.linearRampToValueAtTime(0.01, now + 0.16);
      arpOsc.connect(arpGain);
      arpGain.connect(this.musicGain);
      arpOsc.start(now);
      arpOsc.stop(now + 0.17);

      this.bgmStep++;
    }, 220);
  }

  stopBGM() {
    if (!this.bgmPlaying) return;
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  setSFX(enabled) {
    this.sfxEnabled = enabled;
  }

  setMusic(enabled) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
  }
}

// Instancia global
window.AudioMgr = new SoundSystem();
