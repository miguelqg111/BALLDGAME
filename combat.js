/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE COMBATE, CRÍTICOS, COMBOS & PARTÍCULAS CANVAS
 * ============================================================================
 */

class CombatSystem {
  constructor() {
    this.fxCanvas = null;
    this.fxCtx = null;
    this.particles = [];
    this.floatingCoins = [];
    this.comboTimerMs = 0;
    this.maxComboTimeMs = 3000; // 3 segundos base
    this.lastComboRecord = 0;
  }

  init() {
    this.fxCanvas = document.getElementById("fx-canvas");
    if (this.fxCanvas) {
      this.fxCtx = this.fxCanvas.getContext("2d");
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
    }
  }

  resizeCanvas() {
    if (!this.fxCanvas) return;
    this.fxCanvas.width = window.innerWidth;
    this.fxCanvas.height = window.innerHeight;
  }

  // --- PROCESAR GOLPE EN UNA BOLA ---
  processHit(ball, clientX, clientY) {
    const isCrit = Math.random() * 100 < window.GameState.getCritChance();
    const damage = window.GameState.calculateFinalDamage(isCrit);

    // Actualizar estadística de mayor golpe
    if (damage > window.GameState.state.stats.highestHit) {
      window.GameState.state.stats.highestHit = damage;
    }
    if (isCrit && damage > window.GameState.state.stats.highestCrit) {
      window.GameState.state.stats.highestCrit = damage;
    }
    window.GameState.state.stats.totalClicks++;
    if (window.QuestsMgr) window.QuestsMgr.onHit();

    // Audio
    if (isCrit) {
      window.AudioMgr.playCrit();
      this.triggerScreenShake();
    } else {
      window.AudioMgr.playHit();
    }

    // Aumentar combo
    this.incrementCombo();

    // Partículas de impacto
    if (window.GameState.state.settings.particles) {
      const pColor = isCrit ? "#ff3366" : (ball.typeData ? ball.typeData.color : "#38bdf8");
      this.spawnImpactSparks(clientX, clientY, isCrit ? 22 : 12, pColor);
    }

    // Texto flotante de daño
    this.spawnFloatingDamage(clientX, clientY, damage, isCrit);

    // Aplicar daño a la bola
    const isDestroyed = ball.takeDamage(damage);

    return { damage, isCrit, isDestroyed };
  }

  // --- SISTEMA DE COMBO ---
  incrementCombo() {
    const s = window.GameState.state;
    s.combo++;

    // Duración de combo aumentada por mejoras
    const bonusTimeLevel = s.upgrades.combo_time || 0;
    this.maxComboTimeMs = 3000 + (bonusTimeLevel * 400);
    this.comboTimerMs = this.maxComboTimeMs;

    if (s.combo > s.stats.maxCombo) {
      s.stats.maxCombo = s.combo;
      if (s.combo > 15 && s.combo % 10 === 0 && s.combo > this.lastComboRecord) {
        this.lastComboRecord = s.combo;
        if (window.UIMgr) {
          window.UIMgr.showToast(`🔥 ¡NUEVO RÉCORD DE COMBO! x${s.combo}`, "info");
        }
      }
    }

    window.GameState.notify("combo");
  }

  updateCombo(dtMs) {
    const s = window.GameState.state;
    if (s.combo > 0) {
      this.comboTimerMs -= dtMs;
      if (this.comboTimerMs <= 0) {
        s.combo = 0;
        this.comboTimerMs = 0;
        window.GameState.notify("combo");
      }
    }
  }

  getComboTimePercent() {
    if (this.maxComboTimeMs <= 0) return 0;
    return Math.max(0, Math.min(100, (this.comboTimerMs / this.maxComboTimeMs) * 100));
  }

  // --- EFECTOS VISUALES & PARTÍCULAS CANVAS ---
  spawnImpactSparks(x, y, count, fallbackColor) {
    const palette = window.SkinsMgr ? window.SkinsMgr.getDamageParticleColors() : [fallbackColor];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const pColor = palette[Math.floor(Math.random() * palette.length)] || fallbackColor;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: pColor,
        alpha: 1,
        life: 0.4 + Math.random() * 0.3
      });
    }
  }

  spawnDestroyExplosion(x, y, color) {
    if (!window.GameState.state.settings.particles) return;
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: color,
        alpha: 1,
        life: 0.6 + Math.random() * 0.4
      });
    }
  }

  // Moneda voladora animada hacia el contador del HUD
  spawnFlyingCoin(startX, startY, amount) {
    if (!window.GameState.state.settings.particles) return;

    const moneyPill = document.getElementById("hud-money-box");
    let targetX = 200;
    let targetY = 30;

    if (moneyPill) {
      const rect = moneyPill.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    this.floatingCoins.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      progress: 0,
      amount: amount,
      speed: 0.035 + Math.random() * 0.02
    });
  }

  // Animación continua del Canvas
  renderFX(dt) {
    if (!this.fxCtx || !this.fxCanvas) return;
    this.fxCtx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);

    // Renderizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravedad suave
      p.life -= dt;
      p.alpha = Math.max(0, p.life);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.fxCtx.save();
      this.fxCtx.globalAlpha = p.alpha;
      this.fxCtx.fillStyle = p.color;
      this.fxCtx.shadowColor = p.color;
      this.fxCtx.shadowBlur = 8;
      this.fxCtx.beginPath();
      this.fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.fxCtx.fill();
      this.fxCtx.restore();
    }

    // Renderizar monedas voladoras
    for (let i = this.floatingCoins.length - 1; i >= 0; i--) {
      const c = this.floatingCoins[i];
      c.progress += c.speed;

      // Trayectoria bezier curva
      const t = c.progress;
      const invT = 1 - t;
      const controlX = (c.x + c.targetX) / 2 + 50;
      const controlY = Math.min(c.y, c.targetY) - 80;

      const curX = invT * invT * c.x + 2 * invT * t * controlX + t * t * c.targetX;
      const curY = invT * invT * c.y + 2 * invT * t * controlY + t * t * c.targetY;

      this.fxCtx.save();
      this.fxCtx.fillStyle = "#f59e0b";
      this.fxCtx.shadowColor = "#f59e0b";
      this.fxCtx.shadowBlur = 12;
      this.fxCtx.beginPath();
      this.fxCtx.arc(curX, curY, 8, 0, Math.PI * 2);
      this.fxCtx.fill();

      // Borde dorado
      this.fxCtx.lineWidth = 2;
      this.fxCtx.strokeStyle = "#fef08a";
      this.fxCtx.stroke();
      this.fxCtx.restore();

      if (c.progress >= 1) {
        // Al llegar a la meta, hacer pop al icono del HUD
        const moneyIcon = document.querySelector(".money-pill .stat-icon");
        if (moneyIcon) {
          moneyIcon.classList.remove("gain-pop");
          void moneyIcon.offsetWidth;
          moneyIcon.classList.add("gain-pop");
        }
        window.AudioMgr.playMoney();
        this.floatingCoins.splice(i, 1);
      }
    }
  }

  // Textos flotantes DOM (para renderizado tipográfico nítido)
  spawnFloatingDamage(x, y, damage, isCrit) {
    const el = document.createElement("div");
    el.className = `floating-text ${isCrit ? "floating-crit" : "floating-damage"}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = isCrit ? `💥 ¡CRÍTICO! -${this.formatNumber(damage)}` : `-${this.formatNumber(damage)}`;

    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 850);
  }

  spawnFloatingMoney(x, y, amount) {
    const el = document.createElement("div");
    el.className = "floating-text floating-money";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = `💰 +$${this.formatNumber(amount)}`;

    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 850);
  }

  triggerScreenShake() {
    const arena = document.getElementById("arena-section");
    if (!arena || !window.GameState.state.settings.particles) return;
    arena.classList.remove("screen-shake");
    void arena.offsetWidth;
    arena.classList.add("screen-shake");
  }

  formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "k";
    return num.toLocaleString();
  }
}

window.CombatMgr = new CombatSystem();
