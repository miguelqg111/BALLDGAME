/**
 * ============================================================================
 * BALL DAMAGE - ESTADO GLOBAL DEL JUEGO (GAMESTATE)
 * ============================================================================
 */

const DEFAULT_GAME_STATE = {
  // Progresión básica
  level: 1,
  xp: 0,
  money: 0,
  baseDamage: 1,
  
  // Equipamiento
  equippedWeaponId: "fist",
  ownedWeapons: ["fist"],
  
  // Niveles de mejoras normales (upgradeId -> level)
  upgrades: {
    flat_damage: 0,
    pct_damage: 0,
    crit_chance: 0,
    crit_mult: 0,
    money_bonus: 0,
    auto_drone: 0,
    combo_time: 0,
    xp_bonus: 0
  },

  // Sistema de Combo
  combo: 0,
  maxCombo: 0,
  comboTimeRemaining: 0,

  // Sistema de Prestigio
  prestigeCount: 0,
  prestigeShards: 0,
  prestigeUpgrades: {
    perm_damage: 0,
    perm_money: 0,
    perm_crit: 0,
    perm_xp: 0,
    starter_boost: 0
  },

  // Estadísticas históricas
  stats: {
    ballsDestroyed: 0,
    totalMoneyEarned: 0,
    totalClicks: 0,
    highestHit: 0,
    highestCrit: 0,
    maxCombo: 0,
    maxLevel: 1,
    playTimeSeconds: 0,
    prestigeCount: 0,
    missionsCompleted: 0,
    achievementsUnlocked: 0
  },

  // Misiones y Logros
  claimedAchievements: [],
  dailyMissions: [],
  lastMissionDate: "",

  // Buffs de entrenamiento activos [ { id, name, type, value, expiresAt } ]
  activeBuffs: [],

  // Sistema de Cofres
  chests: {
    common: 1, // 1 cofre común inicial de regalo
    rare: 0,
    epic: 0,
    legendary: 0,
    cosmic: 0
  },
  chestProgress: 0,
  ballsPerChest: 25,

  // Sistema de Mascotas
  pets: {
    owned: ["dog"], // Comienza con el Perro Fiel desbloqueado
    equipped: "dog"
  },

  // Sistema de Skins
  skins: {
    equippedBall: "default",
    equippedWeapon: "default",
    equippedFx: "default",
    equippedCursor: "default",
    unlocked: ["ball_default", "weapon_default", "fx_default", "cursor_default"]
  },

  // Objetivo guiado actual
  currentObjectiveIndex: 0,

  // Configuración
  settings: {
    sfx: true,
    music: true,
    particles: true,
    theme: "dark",
    tutorialCompleted: false,
    muteWarnings: false,
    xpMultiplier: 1
  }
};

class GameStateManager {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
    this.listeners = new Set();
  }

  // Suscribirse a cambios de estado
  subscribe(fn) {
    this.listeners.add(fn);
  }

  notify(changeType) {
    this.listeners.forEach(fn => fn(this.state, changeType));
  }

  // --- MATEMÁTICAS Y FÓRMULAS CENTRALES ---

  // XP necesaria para pasar al siguiente nivel
  getXpRequired(level = this.state.level) {
    return Math.floor(25 * Math.pow(1.32, level - 1) + (level - 1) * 15);
  }

  // Multiplicador de arma equipada
  getWeaponMultiplier() {
    if (typeof WEAPONS_CATALOG !== "undefined") {
      const weapon = WEAPONS_CATALOG.find(w => w.id === this.state.equippedWeaponId);
      if (weapon) return weapon.multiplier;
    }
    return 1;
  }

  // Bonificación de combo en porcentaje
  getComboMultiplier() {
    if (this.state.combo <= 0) return 1.0;
    // Escala suave: combo 10 -> 1.25x, combo 50 -> 2.25x, combo 100 -> 3.5x
    return 1.0 + Math.min(3.5, this.state.combo * 0.025);
  }

  // Multiplicador de daño de mejoras normales
  getUpgradeDamageMultiplier() {
    const pctLevel = this.state.upgrades.pct_damage || 0;
    return 1 + pctLevel * 0.15; // +15% por nivel
  }

  // Multiplicador de prestigio permanente
  getPrestigeDamageMultiplier() {
    const permLevel = this.state.prestigeUpgrades.perm_damage || 0;
    return 1 + permLevel * 0.20 + this.state.prestigeCount * 0.10; // +20% por nivel + 10% por renacimiento
  }

  // Multiplicador de buffs temporales (Entrenamiento / Eventos)
  getBuffDamageMultiplier() {
    let mult = 1.0;
    const now = Date.now();
    this.state.activeBuffs = this.state.activeBuffs.filter(b => b.expiresAt > now);

    this.state.activeBuffs.forEach(b => {
      if (b.type === "damage") mult *= (1 + b.value);
    });

    if (window.activeGameEvent && window.activeGameEvent.type === "damage_rush") {
      mult *= 2.0;
    }

    return mult;
  }

  // Daño Total Calculado
  calculateFinalDamage(isCrit = false) {
    const flatLevel = this.state.upgrades.flat_damage || 0;
    const baseTotal = this.state.baseDamage + (flatLevel * 2);

    const weaponMult = this.getWeaponMultiplier();
    const upgMult = this.getUpgradeDamageMultiplier();
    const comboMult = this.getComboMultiplier();
    const prestigeMult = this.getPrestigeDamageMultiplier();
    const buffMult = this.getBuffDamageMultiplier();
    const petMult = window.PetsMgr ? window.PetsMgr.getDamageMultiplier() : 1.0;

    let total = baseTotal * weaponMult * upgMult * comboMult * prestigeMult * buffMult * petMult;

    if (isCrit) {
      const critMultLevel = this.state.upgrades.crit_mult || 0;
      const petCritMult = window.PetsMgr ? window.PetsMgr.getCritMultBonus() : 0;
      const critMult = 2.0 + (critMultLevel * 0.5) + petCritMult; // Base 2x + 0.5x por nivel + mascota
      total *= critMult;
    }

    return Math.max(1, Math.round(total));
  }

  // Probabilidad crítica (0 a 100%)
  getCritChance() {
    const critLevel = this.state.upgrades.crit_chance || 0;
    const permCrit = this.state.prestigeUpgrades.perm_crit || 0;
    const petCritChance = window.PetsMgr ? window.PetsMgr.getCritChanceBonus() : 0;
    let chance = 5 + (critLevel * 2.5) + (permCrit * 3) + petCritChance; // Base 5% + upgrades + mascota

    // Buffs temporales
    const now = Date.now();
    this.state.activeBuffs.forEach(b => {
      if (b.expiresAt > now && b.type === "crit_chance") {
        chance += b.value * 100;
      }
    });

    return Math.min(85, chance); // Máximo 85%
  }

  // Multiplicador de Dinero
  getMoneyMultiplier() {
    const moneyLevel = this.state.upgrades.money_bonus || 0;
    const permMoney = this.state.prestigeUpgrades.perm_money || 0;
    const petMoneyMult = window.PetsMgr ? window.PetsMgr.getMoneyMultiplier() : 1.0;
    let mult = (1 + moneyLevel * 0.15) * (1 + permMoney * 0.25) * petMoneyMult;

    // Buffs temporales
    const now = Date.now();
    this.state.activeBuffs.forEach(b => {
      if (b.expiresAt > now && b.type === "money") {
        mult *= (1 + b.value);
      }
    });

    // Combo da hasta +50% extra de dinero
    mult *= (1 + Math.min(0.5, this.state.combo * 0.01));

    return mult;
  }

  // Multiplicador de Experiencia (XP)
  getXpMultiplier() {
    const xpUpg = this.state.upgrades.xp_bonus || 0;
    const permXp = this.state.prestigeUpgrades.perm_xp || 0;
    const customMult = this.state.settings.xpMultiplier || 1;
    const petXpMult = window.PetsMgr ? window.PetsMgr.getXpMultiplier() : 1.0;
    return (1 + xpUpg * 0.25) * (1 + permXp * 0.35) * customMult * petXpMult;
  }

  // --- RECOMPENSAS Y MODIFICACIONES ---

  addMoney(amount) {
    const finalAmount = Math.max(1, Math.round(amount * this.getMoneyMultiplier()));
    this.state.money += finalAmount;
    this.state.stats.totalMoneyEarned += finalAmount;
    this.notify("money");
    return finalAmount;
  }

  addXP(amount) {
    const finalXP = Math.max(1, Math.round(amount * this.getXpMultiplier()));
    this.state.xp += finalXP;
    let req = this.getXpRequired();

    while (this.state.xp >= req) {
      this.state.xp -= req;
      this.levelUp();
      req = this.getXpRequired();
    }

    this.notify("xp");
  }

  levelUp() {
    this.state.level++;
    if (this.state.level > this.state.stats.maxLevel) {
      this.state.stats.maxLevel = this.state.level;
    }

    // Regalo de subida de nivel
    const bonusCash = Math.floor(30 * Math.pow(1.25, this.state.level - 1));
    this.state.money += bonusCash;
    this.state.stats.totalMoneyEarned += bonusCash;

    // +1 Daño base por cada 5 niveles
    if (this.state.level % 5 === 0) {
      this.state.baseDamage += 1;
    }

    window.AudioMgr.playLevelUp();
    if (window.UIMgr) {
      window.UIMgr.showLevelUpModal(this.state.level, bonusCash);
    }

    this.notify("level");
  }

  // Manejo de Buff temporal
  addBuff(buff) {
    // Reemplaza o agrega
    this.state.activeBuffs = this.state.activeBuffs.filter(b => b.id !== buff.id);
    this.state.activeBuffs.push(buff);
    this.notify("buffs");
  }
}

// Instancia global
window.GameState = new GameStateManager();
