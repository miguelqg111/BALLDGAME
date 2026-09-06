/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE BOLAS, TIPOS, FÍSICA Y PROGRESIÓN
 * ============================================================================
 */

const BALL_TYPES = {
  normal: {
    id: "normal",
    name: "Normal",
    cssClass: "ball-normal",
    icon: "⚪",
    color: "#38bdf8",
    hpMult: 1.0,
    moneyMult: 1.0,
    xpMult: 1.0,
    speed: 0.8,
    size: 72,
    weight: 60
  },
  fast: {
    id: "fast",
    name: "Rápida",
    cssClass: "ball-fast",
    icon: "⚡",
    color: "#a855f7",
    hpMult: 0.75,
    moneyMult: 1.25,
    xpMult: 1.8,
    speed: 2.8,
    size: 62,
    weight: 22
  },
  tank: {
    id: "tank",
    name: "Tanque",
    cssClass: "ball-tank",
    icon: "🛡️",
    color: "#94a3b8",
    hpMult: 4.5,
    moneyMult: 3.5,
    xpMult: 2.5,
    speed: 0.4,
    size: 88,
    weight: 15
  },
  gold: {
    id: "gold",
    name: "Dorada",
    cssClass: "ball-gold",
    icon: "👑",
    color: "#f59e0b",
    hpMult: 2.0,
    moneyMult: 15.0,
    xpMult: 5.0,
    speed: 1.8,
    size: 76,
    weight: 3
  },
  special: {
    id: "special",
    name: "Cósmica",
    cssClass: "ball-special",
    icon: "🔮",
    color: "#f43f5e",
    hpMult: 6.0,
    moneyMult: 8.0,
    xpMult: 6.0,
    speed: 1.2,
    size: 82,
    weight: 5
  }
};

class Ball {
  constructor(arena, typeData, hp, x, y) {
    this.arena = arena;
    this.typeData = typeData;
    this.maxHp = hp;
    this.hp = hp;
    this.x = x;
    this.y = y;
    this.size = typeData.size;

    // Velocidad de movimiento
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * typeData.speed;
    this.vy = Math.sin(angle) * typeData.speed;

    this.element = null;
    this.hpFill = null;
    this.hpText = null;
    this.isDead = false;

    this.createDOM();
  }

  createDOM() {
    this.element = document.createElement("div");
    const skinClass = window.SkinsMgr ? window.SkinsMgr.getBallSkinClass() : "";
    this.element.className = `game-ball ${this.typeData.cssClass} ${skinClass}`;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.element.innerHTML = `
      <div class="ball-inner">
        <span class="ball-icon">${this.typeData.icon}</span>
        <span class="ball-type-tag">${this.typeData.name}</span>
      </div>
      <div class="ball-hp-container">
        <div class="ball-hp-fill" style="width: 100%;"></div>
      </div>
      <div class="ball-hp-text">${window.CombatMgr.formatNumber(this.hp)}</div>
    `;

    this.hpFill = this.element.querySelector(".ball-hp-fill");
    this.hpText = this.element.querySelector(".ball-hp-text");

    // Evento de clic / toque
    this.element.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.isDead) return;

      const rect = this.element.getBoundingClientRect();
      const clickX = e.clientX || (rect.left + rect.width / 2);
      const clickY = e.clientY || (rect.top + rect.height / 2);

      // Efecto squash en DOM
      this.element.classList.remove("ball-hit-anim");
      void this.element.offsetWidth;
      this.element.classList.add("ball-hit-anim");

      window.CombatMgr.processHit(this, clickX, clickY);
    });

    this.arena.appendChild(this.element);
  }

  takeDamage(amount) {
    if (this.isDead) return true;
    this.hp = Math.max(0, this.hp - amount);
    this.updateHpBar();

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  updateHpBar() {
    const pct = Math.max(0, (this.hp / this.maxHp) * 100);
    if (this.hpFill) this.hpFill.style.width = `${pct}%`;
    if (this.hpText) this.hpText.textContent = window.CombatMgr.formatNumber(this.hp);
  }

  updatePosition(bounds) {
    if (this.isDead) return;

    this.x += this.vx;
    this.y += this.vy;

    const radius = this.size / 2;
    const minX = radius + 8;
    const maxX = bounds.width - radius - 8;
    const minY = radius + 36; // espacio para la barra de HP
    const maxY = bounds.height - radius - 8;

    // Rebote horizontal seguro
    if (this.x <= minX) {
      this.x = minX;
      this.vx = Math.abs(this.vx);
    } else if (this.x >= maxX) {
      this.x = maxX;
      this.vx = -Math.abs(this.vx);
    }

    // Rebote vertical seguro
    if (this.y <= minY) {
      this.y = minY;
      this.vy = Math.abs(this.vy);
    } else if (this.y >= maxY) {
      this.y = maxY;
      this.vy = -Math.abs(this.vy);
    }

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  die() {
    this.isDead = true;
    window.AudioMgr.playDestroy();

    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Explosión de partículas
    window.CombatMgr.spawnDestroyExplosion(centerX, centerY, this.typeData.color);

    // Calcular recompensas
    const lvl = window.GameState.state.level;
    const baseReward = Math.max(1, Math.round((lvl * 1.5 + 2) * this.typeData.moneyMult));
    const baseXP = Math.max(1, Math.round((lvl * 2.0 + 3) * this.typeData.xpMult));

    const finalMoney = window.GameState.addMoney(baseReward);
    window.GameState.addXP(baseXP);

    // Moneda animada y texto flotante
    window.CombatMgr.spawnFlyingCoin(centerX, centerY, finalMoney);
    window.CombatMgr.spawnFloatingMoney(centerX, centerY - 25, finalMoney);

    // Métricas
    window.GameState.state.stats.ballsDestroyed++;
    window.GameState.notify("ball_destroyed");

    // Despachar evento para misiones/logros
    if (window.QuestsMgr) {
      window.QuestsMgr.onBallDestroyed(this.typeData.id);
      window.QuestsMgr.onMoneyGained(finalMoney);
    }
    if (window.ChestsMgr) {
      window.ChestsMgr.onBallDestroyed();
    }

    // Remover elemento del DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  destroyImmediate() {
    this.isDead = true;
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

class BallManager {
  constructor() {
    this.arena = null;
    this.balls = [];
    this.maxBalls = 1;
  }

  init() {
    this.arena = document.getElementById("ball-arena");
    this.updateMaxBalls();
  }

  // Determinar cuántas bolas simultáneas permite el nivel
  updateMaxBalls() {
    const lvl = window.GameState.state.level;
    if (lvl < 5) this.maxBalls = 1;
    else if (lvl < 10) this.maxBalls = 2;
    else if (lvl < 20) this.maxBalls = 3;
    else if (lvl < 35) this.maxBalls = 4;
    else if (lvl < 50) this.maxBalls = 5;
    else this.maxBalls = Math.min(8, 6 + Math.floor((lvl - 50) / 25));
  }

  // Calcular HP según nivel con progresión escalada
  calculateHp(typeData) {
    const lvl = window.GameState.state.level;
    let baseHp = 1;

    if (lvl === 1) baseHp = 1;
    else if (lvl === 2) baseHp = 5;
    else if (lvl === 3) baseHp = 15;
    else if (lvl === 4) baseHp = 40;
    else if (lvl === 5) baseHp = 100;
    else if (lvl <= 10) baseHp = 100 + (lvl - 5) * 180; // ~1000 en lvl 10
    else if (lvl <= 20) baseHp = 1000 * Math.pow(1.48, lvl - 10); // ~50k en lvl 20
    else baseHp = 50000 * Math.pow(1.35, lvl - 20);

    return Math.max(1, Math.round(baseHp * typeData.hpMult));
  }

  // Elegir tipo de bola con pesos aleatorios según nivel
  pickRandomBallType() {
    const lvl = window.GameState.state.level;
    const types = [BALL_TYPES.normal];

    if (lvl >= 3) types.push(BALL_TYPES.fast);
    if (lvl >= 6) types.push(BALL_TYPES.tank);
    if (lvl >= 10) types.push(BALL_TYPES.special);

    // Bola dorada disponible desde nivel 2
    if (lvl >= 2) types.push(BALL_TYPES.gold);

    const totalWeight = types.reduce((acc, t) => acc + t.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const t of types) {
      if (rand < t.weight) return t;
      rand -= t.weight;
    }
    return BALL_TYPES.normal;
  }

  // Generar nueva bola en la arena
  spawnBall(forceType = null) {
    if (!this.arena) return;

    const bounds = this.arena.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const typeData = forceType || this.pickRandomBallType();
    const hp = this.calculateHp(typeData);

    const radius = typeData.size / 2;
    const x = radius + 20 + Math.random() * (bounds.width - radius * 2 - 40);
    const y = radius + 40 + Math.random() * (bounds.height - radius * 2 - 60);

    const ball = new Ball(this.arena, typeData, hp, x, y);
    this.balls.push(ball);
  }

  // Actualización en cada frame
  update() {
    if (!this.arena) return;
    const bounds = this.arena.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    // Limpiar bolas muertas
    this.balls = this.balls.filter(b => !b.isDead);

    // Mover bolas activas
    for (const b of this.balls) {
      b.updatePosition(bounds);
    }

    // Spawn si hay menos del cupo máximo
    this.updateMaxBalls();
    if (this.balls.length < this.maxBalls) {
      this.spawnBall();
    }
  }

  clearAll() {
    for (const b of this.balls) {
      b.destroyImmediate();
    }
    this.balls = [];
  }
}

window.BallMgr = new BallManager();
