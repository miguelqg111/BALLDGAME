/**
 * ============================================================================
 * BALL DAMAGE - CICLO PRINCIPAL (GAME LOOP), EVENTOS ESPECIALES & DRONES
 * ============================================================================
 */

window.activeGameEvent = null;

class MainGameEngine {
  constructor() {
    this.lastFrameTime = performance.now();
    this.bgCanvas = null;
    this.bgCtx = null;
    this.bgBalls = [];
    this.eventTimerInterval = null;
    this.droneInterval = null;
    this.playTimeInterval = null;
    this.randomEventCheckInterval = null;
  }

  init() {
    // 1. Inicializar persistencia
    window.StorageMgr.init();

    // 2. Inicializar subsistemas
    window.CombatMgr.init();
    window.BallMgr.init();
    window.EconomyMgr.init();
    window.TrainingMgr.init();
    window.QuestsMgr.init();
    window.PrestigeMgr.init();
    window.ChestsMgr.init();
    window.PetsMgr.init();
    window.SkinsMgr.init();
    window.UIMgr.init();

    // 3. Inicializar Canvas de fondo animado
    this.initBackgroundCanvas();

    // 4. Iniciar sistemas periódicos
    this.startPlaytimeTracker();
    this.startDroneLoop();
    this.startRandomEventsScheduler();

    // 5. Iniciar primera bola
    if (window.BallMgr.balls.length === 0) {
      window.BallMgr.spawnBall();
    }

    // 6. Iniciar ciclo de renderizado requestAnimationFrame
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // --- BUCLE PRINCIPAL (60 FPS) ---
  gameLoop(currentTime) {
    const dtMs = Math.min(100, currentTime - this.lastFrameTime);
    const dt = dtMs / 1000;
    this.lastFrameTime = currentTime;

    // Actualizar combos
    window.CombatMgr.updateCombo(dtMs);

    // Actualizar bolas en la arena
    window.BallMgr.update();

    // Actualizar movimiento de mascota acompañante en la arena
    if (window.PetsMgr) window.PetsMgr.updateCompanionMovement();

    // Renderizar efectos de partículas y monedas en el canvas FX
    window.CombatMgr.renderFX(dt);

    // Renderizar bolas de fondo animadas
    this.renderBackgroundCanvas();

    // Actualizar barra de combo y HUD
    window.UIMgr.updateHUD();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // --- DRONE CENTINELA DE ATAQUE AUTOMÁTICO ---
  startDroneLoop() {
    if (this.droneInterval) clearInterval(this.droneInterval);
    this.droneInterval = setInterval(() => {
      const droneLevel = window.GameState.state.upgrades.auto_drone || 0;
      if (droneLevel > 0 && window.BallMgr.balls.length > 0) {
        // Atacar a la primera bola disponible
        const targetBall = window.BallMgr.balls[0];
        if (targetBall && !targetBall.isDead) {
          const rect = targetBall.element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          for (let i = 0; i < droneLevel; i++) {
            setTimeout(() => {
              if (targetBall && !targetBall.isDead) {
                window.CombatMgr.processHit(targetBall, centerX, centerY);
              }
            }, i * 180);
          }
        }
      }
    }, 1000);
  }

  // --- SEGUIMIENTO DE TIEMPO JUGADO ---
  startPlaytimeTracker() {
    if (this.playTimeInterval) clearInterval(this.playTimeInterval);
    this.playTimeInterval = setInterval(() => {
      window.GameState.state.stats.playTimeSeconds++;
    }, 1000);
  }

  // --- EVENTOS ESPECIALES ALEATORIOS (SECCIÓN 18) ---
  startRandomEventsScheduler() {
    if (this.randomEventCheckInterval) clearInterval(this.randomEventCheckInterval);
    // Cada 45 segundos evalúa si se desata un evento
    this.randomEventCheckInterval = setInterval(() => {
      if (!window.activeGameEvent && Math.random() < 0.38) {
        this.triggerRandomEvent();
      }
    }, 45000);
  }

  triggerRandomEvent() {
    const events = [
      {
        type: "damage_rush",
        title: "⚡ ¡FIEBRE DE DAÑO!",
        desc: "¡Multiplicador de Daño x2 durante los próximos 10 segundos!",
        icon: "⚡",
        duration: 10
      },
      {
        type: "frenzy",
        title: "🔥 ¡MODO FRENESÍ!",
        desc: "¡Aparición masiva de bolas ultrarrápidas con vida reducida!",
        icon: "🔥",
        duration: 12
      },
      {
        type: "golden_ball",
        title: "👑 ¡BOLA DORADA DETECTADA!",
        desc: "¡Una esfera del tesoro ha entrado a la arena! ¡Destrúyela!",
        icon: "👑",
        duration: 10
      }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    this.activateEvent(ev);
  }

  activateEvent(ev) {
    window.activeGameEvent = ev;
    window.AudioMgr.playEvent();

    const banner = document.getElementById("event-banner");
    const iconEl = document.getElementById("event-icon");
    const titleEl = document.getElementById("event-title");
    const descEl = document.getElementById("event-desc");
    const timerEl = document.getElementById("event-timer");

    if (banner) {
      iconEl.textContent = ev.icon;
      titleEl.textContent = ev.title;
      descEl.textContent = ev.desc;
      timerEl.textContent = `${ev.duration}s`;
      banner.classList.remove("hidden");
    }

    if (ev.type === "golden_ball") {
      window.BallMgr.spawnBall(BALL_TYPES.gold);
    } else if (ev.type === "frenzy") {
      // Spawn múltiple inmediato
      for (let i = 0; i < 3; i++) {
        window.BallMgr.spawnBall(BALL_TYPES.fast);
      }
    }

    let remaining = ev.duration;
    if (this.eventTimerInterval) clearInterval(this.eventTimerInterval);

    this.eventTimerInterval = setInterval(() => {
      remaining--;
      if (timerEl) timerEl.textContent = `${remaining}s`;

      if (remaining <= 0) {
        clearInterval(this.eventTimerInterval);
        window.activeGameEvent = null;
        if (banner) banner.classList.add("hidden");
      }
    }, 1000);
  }

  // --- CANVAS DE FONDO SUTIL & PROFESIONAL ---
  initBackgroundCanvas() {
    this.bgCanvas = document.getElementById("bg-canvas");
    if (!this.bgCanvas) return;
    this.bgCtx = this.bgCanvas.getContext("2d");

    const resize = () => {
      this.bgCanvas.width = window.innerWidth;
      this.bgCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Crear orbes de fondo
    this.bgBalls = [];
    const colors = ["#00e5ff", "#3b82f6", "#a855f7", "#ec4899"];
    for (let i = 0; i < 18; i++) {
      this.bgBalls.push({
        x: Math.random() * this.bgCanvas.width,
        y: Math.random() * this.bgCanvas.height,
        radius: 20 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.04 + Math.random() * 0.08
      });
    }
  }

  renderBackgroundCanvas() {
    if (!this.bgCtx || !this.bgCanvas) return;
    this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

    for (const b of this.bgBalls) {
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -b.radius) b.x = this.bgCanvas.width + b.radius;
      if (b.x > this.bgCanvas.width + b.radius) b.x = -b.radius;
      if (b.y < -b.radius) b.y = this.bgCanvas.height + b.radius;
      if (b.y > this.bgCanvas.height + b.radius) b.y = -b.radius;

      const grad = this.bgCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, "transparent");

      this.bgCtx.save();
      this.bgCtx.globalAlpha = b.alpha;
      this.bgCtx.fillStyle = grad;
      this.bgCtx.beginPath();
      this.bgCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.bgCtx.fill();
      this.bgCtx.restore();
    }
  }
}

// Iniciar juego cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  window.Engine = new MainGameEngine();
  window.Engine.init();
});
