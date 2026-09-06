/**
 * ============================================================================
 * BALL DAMAGE - GIMNASIO VIRTUAL DE ENTRENAMIENTO & MINI-JUEGOS
 * ============================================================================
 */

class TrainingSystem {
  constructor() {
    // Minijuego 1: Clics rápidos
    this.tg1Active = false;
    this.tg1Clicks = 0;
    this.tg1TimeLeft = 5.0;
    this.tg1Interval = null;

    // Minijuego 2: Reacción
    this.tg2State = "idle"; // idle, waiting, ready, done
    this.tg2Timeout = null;
    this.tg2StartTime = 0;

    // Minijuego 3: Ritmo
    this.tg3StartTime = 0;
  }

  init() {
    this.setupTG1();
    this.setupTG2();
    this.setupTG3();
  }

  // --- MINIJUEGO 1: FRENESÍ DE CLICS ---
  setupTG1() {
    const btn = document.getElementById("tg1-action-btn");
    const countEl = document.getElementById("tg1-count");
    const timeEl = document.getElementById("tg1-time");
    if (!btn) return;

    btn.addEventListener("click", () => {
      if (!this.tg1Active) {
        // Iniciar
        this.tg1Active = true;
        this.tg1Clicks = 0;
        this.tg1TimeLeft = 5.0;
        countEl.textContent = "0";
        timeEl.textContent = "5.0s";
        btn.textContent = "¡PULSA RÁPIDO AQUÍ!";
        btn.classList.add("pulse-btn");

        this.tg1Interval = setInterval(() => {
          this.tg1TimeLeft -= 0.1;
          if (this.tg1TimeLeft <= 0) {
            this.finishTG1();
          } else {
            timeEl.textContent = `${this.tg1TimeLeft.toFixed(1)}s`;
          }
        }, 100);
      } else {
        // Contar clic
        this.tg1Clicks++;
        countEl.textContent = this.tg1Clicks;
        window.AudioMgr.playHit();
      }
    });
  }

  finishTG1() {
    clearInterval(this.tg1Interval);
    this.tg1Active = false;

    const btn = document.getElementById("tg1-action-btn");
    const timeEl = document.getElementById("tg1-time");
    timeEl.textContent = "0.0s";
    btn.textContent = "DESAFÍO COMPLETADO";
    btn.classList.remove("pulse-btn");

    const clicks = this.tg1Clicks;
    if (clicks >= 15) {
      window.AudioMgr.playAchievement();
      // +15% Dinero por 5 minutos
      window.GameState.addBuff({
        id: "buff_tg1_money",
        name: "+15% Dinero",
        type: "money",
        value: 0.15,
        expiresAt: Date.now() + 5 * 60 * 1000
      });
      if (window.UIMgr) {
        window.UIMgr.showToast(`🔥 ¡Entrenamiento superado! (${clicks} clics) +15% Dinero activado por 5 min.`, "success");
      }
    } else {
      if (window.UIMgr) {
        window.UIMgr.showToast(`Lograste ${clicks} clics. ¡Necesitas 15 para activar el bono!`, "info");
      }
    }

    setTimeout(() => {
      btn.textContent = "INTENTAR DE NUEVO";
    }, 2000);
  }

  // --- MINIJUEGO 2: REFLEJOS NINJA ---
  setupTG2() {
    const btn = document.getElementById("tg2-action-btn");
    const zone = document.getElementById("tg2-zone");
    const statusText = document.getElementById("tg2-status-text");
    if (!btn || !zone) return;

    btn.addEventListener("click", () => {
      if (this.tg2State === "idle" || this.tg2State === "done") {
        this.tg2State = "waiting";
        zone.className = "training-interactive-box reaction-zone waiting";
        statusText.textContent = "🛑 ¡Espera a que se ponga verde... No toques!";
        btn.textContent = "ESPERANDO...";
        btn.disabled = true;

        const delayMs = 1800 + Math.random() * 2500;
        this.tg2Timeout = setTimeout(() => {
          this.tg2State = "ready";
          this.tg2StartTime = Date.now();
          zone.className = "training-interactive-box reaction-zone ready";
          statusText.textContent = "🟢 ¡¡CLIC AHORA MISMO!!";
          btn.textContent = "¡PULSA AQUÍ!";
          btn.disabled = false;
        }, delayMs);
      } else if (this.tg2State === "ready") {
        // Clic a tiempo
        const reactionMs = Date.now() - this.tg2StartTime;
        this.tg2State = "done";
        zone.className = "training-interactive-box reaction-zone";
        btn.disabled = false;
        btn.textContent = "REPETIR TEST";

        if (reactionMs < 450) {
          window.AudioMgr.playAchievement();
          statusText.textContent = `⚡ ¡Excelente reflejo! ${reactionMs}ms`;
          // +10% Daño por 10 minutos
          window.GameState.addBuff({
            id: "buff_tg2_damage",
            name: "+10% Daño",
            type: "damage",
            value: 0.10,
            expiresAt: Date.now() + 10 * 60 * 1000
          });
          if (window.UIMgr) {
            window.UIMgr.showToast(`🎯 ¡Reflejos Ninja! (${reactionMs}ms) +10% Daño activado por 10 min.`, "success");
          }
        } else {
          statusText.textContent = `Tiempo de reacción: ${reactionMs}ms. Intenta bajar de 450ms para ganar el buff.`;
        }
      }
    });

    // Penalización por clic prematuro
    zone.addEventListener("click", (e) => {
      if (e.target === btn) return;
      if (this.tg2State === "waiting") {
        clearTimeout(this.tg2Timeout);
        this.tg2State = "done";
        zone.className = "training-interactive-box reaction-zone";
        statusText.textContent = "❌ ¡Clic muy temprano! Espera a que esté verde.";
        btn.textContent = "INTENTAR DE NUEVO";
        btn.disabled = false;
      }
    });
  }

  // --- MINIJUEGO 3: PULSO RÍTMICO ---
  setupTG3() {
    const btn = document.getElementById("tg3-action-btn");
    const pulseCircle = document.getElementById("rhythm-pulse-circle");
    if (!btn || !pulseCircle) return;

    this.tg3StartTime = Date.now();

    btn.addEventListener("click", () => {
      // El ciclo dura 1500ms en CSS
      const elapsed = (Date.now() - this.tg3StartTime) % 1500;
      // Pico de alineación es al 50% = 750ms
      const diff = Math.abs(elapsed - 750);

      if (diff < 120) {
        // Acierto perfecto
        window.AudioMgr.playCrit();
        window.GameState.addBuff({
          id: "buff_tg3_crit",
          name: "+8% Crítico",
          type: "crit_chance",
          value: 0.08,
          expiresAt: Date.now() + 10 * 60 * 1000
        });
        if (window.UIMgr) {
          window.UIMgr.showToast("💥 ¡Sincronización Perfecta! +8% Prob. Crítica por 10 min.", "success");
        }
      } else {
        window.AudioMgr.playHit();
        if (window.UIMgr) {
          window.UIMgr.showToast("Casi... Alinea el círculo justo cuando alcance el borde.", "info");
        }
      }
    });
  }
}

window.TrainingMgr = new TrainingSystem();
