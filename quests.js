/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE MISIONES DIARIAS Y SALÓN DE 24 LOGROS
 * ============================================================================
 */

const ACHIEVEMENTS_LIST = [
  {
    id: "first_blood",
    name: "Primera Bola",
    desc: "Destruye tu primera bola en la arena.",
    icon: "🎯",
    rewardMoney: 50,
    rewardXp: 20,
    check: (s) => s.stats.ballsDestroyed >= 1
  },
  {
    id: "ball_popper_50",
    name: "Destructor Novato",
    desc: "Destruye 50 bolas en total.",
    icon: "💥",
    rewardMoney: 300,
    rewardXp: 100,
    check: (s) => s.stats.ballsDestroyed >= 50
  },
  {
    id: "ball_slayer_500",
    name: "Aniquilador de Esferas",
    desc: "Destruye 500 bolas.",
    icon: "⚔️",
    rewardMoney: 2500,
    rewardXp: 800,
    check: (s) => s.stats.ballsDestroyed >= 500
  },
  {
    id: "ball_master_2000",
    name: "Señor del Vacío",
    desc: "Destruye 2,000 bolas.",
    icon: "👑",
    rewardMoney: 25000,
    rewardXp: 5000,
    check: (s) => s.stats.ballsDestroyed >= 2000
  },
  {
    id: "pocket_change",
    name: "Primeros Ahorros",
    desc: "Consigue tus primeros $100.",
    icon: "🪙",
    rewardMoney: 100,
    rewardXp: 50,
    check: (s) => s.stats.totalMoneyEarned >= 100
  },
  {
    id: "wealthy_10k",
    name: "Billetera Llena",
    desc: "Acumula un total de $10,000 en ganancias.",
    icon: "💰",
    rewardMoney: 2000,
    rewardXp: 1000,
    check: (s) => s.stats.totalMoneyEarned >= 10000
  },
  {
    id: "millionaire",
    name: "Millonario",
    desc: "Consigue $1,000,000 en ganancias.",
    icon: "🏦",
    rewardMoney: 100000,
    rewardXp: 20000,
    check: (s) => s.stats.totalMoneyEarned >= 1000000
  },
  {
    id: "billionaire",
    name: "Magnate Cósmico",
    desc: "Consigue $1,000,000,000.",
    icon: "💎",
    rewardMoney: 50000000,
    rewardXp: 500000,
    check: (s) => s.stats.totalMoneyEarned >= 1000000000
  },
  {
    id: "level_5",
    name: "En Crecimiento",
    desc: "Alcanza el Nivel 5 de jugador.",
    icon: "⭐",
    rewardMoney: 150,
    rewardXp: 50,
    check: (s) => s.level >= 5
  },
  {
    id: "level_10",
    name: "Veterano de Batalla",
    desc: "Alcanza el Nivel 10.",
    icon: "🌟",
    rewardMoney: 800,
    rewardXp: 300,
    check: (s) => s.level >= 10
  },
  {
    id: "level_25",
    name: "Maestro de Guerra",
    desc: "Alcanza el Nivel 25.",
    icon: "🎖️",
    rewardMoney: 15000,
    rewardXp: 5000,
    check: (s) => s.level >= 25
  },
  {
    id: "level_50",
    name: "Semidiós Destructor",
    desc: "Alcanza el Nivel 50.",
    icon: "🏆",
    rewardMoney: 500000,
    rewardXp: 100000,
    check: (s) => s.level >= 50
  },
  {
    id: "collector_3",
    name: "Coleccionista Principiante",
    desc: "Posee al menos 3 herramientas distintas.",
    icon: "🗡️",
    rewardMoney: 400,
    rewardXp: 150,
    check: (s) => s.ownedWeapons.length >= 3
  },
  {
    id: "collector_7",
    name: "Arsenal Pesado",
    desc: "Posee 7 herramientas distintas.",
    icon: "🛡️",
    rewardMoney: 10000,
    rewardXp: 4000,
    check: (s) => s.ownedWeapons.length >= 7
  },
  {
    id: "arsenal_master",
    name: "Maestro de las Armas",
    desc: "Posee todas las 12 herramientas del catálogo.",
    icon: "🔱",
    rewardMoney: 10000000,
    rewardXp: 1000000,
    check: (s) => s.ownedWeapons.length >= 12
  },
  {
    id: "crit_strike_10",
    name: "Golpe Certero",
    desc: "Asesta 10 golpes críticos.",
    icon: "⚡",
    rewardMoney: 200,
    rewardXp: 80,
    check: (s) => s.stats.highestCrit > 0
  },
  {
    id: "crit_master_100",
    name: "Asesino Letal",
    desc: "Realiza un golpe crítico superior a 1,000 de daño.",
    icon: "🩸",
    rewardMoney: 5000,
    rewardXp: 2000,
    check: (s) => s.stats.highestCrit >= 1000
  },
  {
    id: "combo_10",
    name: "En Racha",
    desc: "Alcanza un Combo de al menos x10.",
    icon: "🔥",
    rewardMoney: 250,
    rewardXp: 100,
    check: (s) => s.stats.maxCombo >= 10
  },
  {
    id: "combo_25",
    name: "Furia Desatada",
    desc: "Alcanza un Combo de al menos x25.",
    icon: "🌋",
    rewardMoney: 2500,
    rewardXp: 1000,
    check: (s) => s.stats.maxCombo >= 25
  },
  {
    id: "combo_50",
    name: "Combo Master",
    desc: "Alcanza un Combo extraordinario de x50.",
    icon: "⚡",
    rewardMoney: 20000,
    rewardXp: 8000,
    check: (s) => s.stats.maxCombo >= 50
  },
  {
    id: "golden_hunter",
    name: "Toque de Midas",
    desc: "Consigue derrotar una Bola Dorada.",
    icon: "👑",
    rewardMoney: 5000,
    rewardXp: 2500,
    check: (s) => s.stats.ballsDestroyed >= 10 && s.money >= 500
  },
  {
    id: "training_champion",
    name: "Atleta Disciplinado",
    desc: "Activa al menos un potenciador en el Gimnasio de Entrenamiento.",
    icon: "🏋️",
    rewardMoney: 500,
    rewardXp: 200,
    check: (s) => s.activeBuffs.length > 0
  },
  {
    id: "daily_hero",
    name: "Misionero Ejemplar",
    desc: "Completa y reclama al menos 5 misiones diarias.",
    icon: "📅",
    rewardMoney: 3000,
    rewardXp: 1500,
    check: (s) => s.stats.missionsCompleted >= 5
  },
  {
    id: "prestige_rebirth",
    name: "Renacido Cósmico",
    desc: "Realiza tu primer Prestigio (Rebirth).",
    icon: "♻️",
    rewardMoney: 50000,
    rewardXp: 25000,
    check: (s) => s.prestigeCount >= 1
  }
];

class QuestsSystem {
  constructor() {
    this.countdownInterval = null;
  }

  init() {
    this.checkDailyMissions();
    this.startMidnightCountdown();
    this.checkAchievements();
    this.renderMissions();
    this.renderAchievements();
  }

  // --- MISIONES DIARIAS ---
  getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  checkDailyMissions() {
    const s = window.GameState.state;
    const today = this.getTodayString();

    if (s.lastMissionDate !== today || !s.dailyMissions || s.dailyMissions.length === 0) {
      s.lastMissionDate = today;
      s.dailyMissions = this.generateDailyMissions();
      window.GameState.notify("missions_generated");
    }
  }

  generateDailyMissions() {
    const lvl = window.GameState.state.level;
    const targetBalls = 20 + lvl * 5;
    const targetMoney = Math.floor(100 * Math.pow(1.3, Math.min(lvl, 15)));
    const targetClicks = 30 + lvl * 10;

    return [
      {
        id: "daily_balls",
        desc: `Destruye ${targetBalls} bolas en combate`,
        type: "balls",
        current: 0,
        target: targetBalls,
        rewardMoney: Math.floor(targetMoney * 0.8),
        rewardXp: 50 + lvl * 15,
        claimed: false
      },
      {
        id: "daily_money",
        desc: `Consigue $${window.CombatMgr.formatNumber(targetMoney)} de dinero`,
        type: "money",
        current: 0,
        target: targetMoney,
        rewardMoney: Math.floor(targetMoney * 0.5),
        rewardXp: 40 + lvl * 12,
        claimed: false
      },
      {
        id: "daily_clicks",
        desc: `Asesta ${targetClicks} golpes en la arena`,
        type: "clicks",
        current: 0,
        target: targetClicks,
        rewardMoney: Math.floor(targetMoney * 0.6),
        rewardXp: 30 + lvl * 10,
        claimed: false
      }
    ];
  }

  startMidnightCountdown() {
    const clockEl = document.getElementById("missions-reset-clock");
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow - now;

      if (diffMs <= 0) {
        this.checkDailyMissions();
        this.renderMissions();
        return;
      }

      const h = Math.floor(diffMs / (1000 * 60 * 60));
      const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (clockEl) {
        clockEl.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      }
    }, 1000);
  }

  onBallDestroyed(typeId) {
    const s = window.GameState.state;
    if (s.dailyMissions) {
      s.dailyMissions.forEach(m => {
        if (m.type === "balls" && !m.claimed) {
          m.current++;
        }
      });
      this.updateBadges();
      this.renderMissions();
    }
    this.checkAchievements();
  }

  onMoneyGained(amount) {
    const s = window.GameState.state;
    if (s.dailyMissions) {
      s.dailyMissions.forEach(m => {
        if (m.type === "money" && !m.claimed) {
          m.current += amount;
        }
      });
      this.updateBadges();
      this.renderMissions();
    }
    this.checkAchievements();
  }

  onHit() {
    const s = window.GameState.state;
    if (s.dailyMissions) {
      s.dailyMissions.forEach(m => {
        if (m.type === "clicks" && !m.claimed) {
          m.current++;
        }
      });
      this.updateBadges();
      this.renderMissions();
    }
    this.checkAchievements();
  }

  onWeaponBought() {
    this.checkAchievements();
  }

  onUpgradeBought() {
    this.checkAchievements();
  }

  claimMission(index) {
    const s = window.GameState.state;
    const mission = s.dailyMissions[index];
    if (!mission || mission.claimed || mission.current < mission.target) return;

    mission.claimed = true;
    s.stats.missionsCompleted++;

    window.GameState.addMoney(mission.rewardMoney);
    window.GameState.addXP(mission.rewardXp);
    window.AudioMgr.playAchievement();

    if (window.UIMgr) {
      window.UIMgr.showToast(`✓ ¡Misión reclamada! +$${window.CombatMgr.formatNumber(mission.rewardMoney)} y +${mission.rewardXp} XP`, "success");
    }

    this.updateBadges();
    this.renderMissions();
    this.checkAchievements();
  }

  renderMissions() {
    const list = document.getElementById("missions-list");
    if (!list) return;

    const s = window.GameState.state;
    list.innerHTML = "";

    (s.dailyMissions || []).forEach((m, idx) => {
      const isComplete = m.current >= m.target;
      const pct = Math.min(100, Math.round((m.current / m.target) * 100));

      const card = document.createElement("div");
      card.className = "mission-card";

      let actionBtn = "";
      if (m.claimed) {
        actionBtn = `<button class="btn-claim" disabled>✓ RECLAMADA</button>`;
      } else if (isComplete) {
        actionBtn = `<button class="btn-claim pulse-btn" onclick="window.QuestsMgr.claimMission(${idx})">RECLAMAR RECOMPENSA</button>`;
      } else {
        actionBtn = `<button class="btn-claim" disabled>EN PROGRESO</button>`;
      }

      card.innerHTML = `
        <div class="mission-header">
          <span class="mission-title">🎯 ${m.desc}</span>
          <span class="mission-rewards">+$${window.CombatMgr.formatNumber(m.rewardMoney)} • +${m.rewardXp} XP</span>
        </div>
        <div class="mission-progress-bar">
          <div class="mission-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="mission-footer">
          <span class="mission-count">${window.CombatMgr.formatNumber(m.current)} / ${window.CombatMgr.formatNumber(m.target)} (${pct}%)</span>
          ${actionBtn}
        </div>
      `;

      list.appendChild(card);
    });
  }

  // --- LOGROS ---
  checkAchievements() {
    const s = window.GameState.state;
    let newUnlocked = false;

    ACHIEVEMENTS_LIST.forEach(ach => {
      if (!s.claimedAchievements.includes(ach.id)) {
        if (ach.check(s)) {
          s.claimedAchievements.push(ach.id);
          s.stats.achievementsUnlocked = s.claimedAchievements.length;
          newUnlocked = true;

          // Recompensa automática
          window.GameState.addMoney(ach.rewardMoney);
          window.GameState.addXP(ach.rewardXp);
          window.AudioMgr.playAchievement();

          if (window.UIMgr) {
            window.UIMgr.showToast(`🏆 ¡LOGRO DESBLOQUEADO: ${ach.name}! (+$${window.CombatMgr.formatNumber(ach.rewardMoney)})`, "achievement");
          }
        }
      }
    });

    if (newUnlocked) {
      this.updateBadges();
      this.renderAchievements();
    }
  }

  renderAchievements() {
    const grid = document.getElementById("achievements-grid");
    const countEl = document.getElementById("achievements-unlocked-count");
    if (!grid) return;

    const s = window.GameState.state;
    if (countEl) countEl.textContent = s.claimedAchievements.length;

    grid.innerHTML = "";
    ACHIEVEMENTS_LIST.forEach(ach => {
      const isUnlocked = s.claimedAchievements.includes(ach.id);

      const card = document.createElement("div");
      card.className = `achievement-card ${isUnlocked ? "unlocked" : ""}`;

      card.innerHTML = `
        <div class="ach-icon-box">${ach.icon}</div>
        <div class="ach-content">
          <div class="ach-name">${ach.name}</div>
          <div class="ach-desc">${ach.desc}</div>
          <div class="ach-reward">Recompensa: +$${window.CombatMgr.formatNumber(ach.rewardMoney)} • +${ach.rewardXp} XP</div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  updateBadges() {
    const s = window.GameState.state;
    const missionBadge = document.getElementById("missions-badge");
    const achBadge = document.getElementById("achievements-badge");

    const hasClaimableMission = (s.dailyMissions || []).some(m => !m.claimed && m.current >= m.target);
    if (missionBadge) {
      missionBadge.classList.toggle("hidden", !hasClaimableMission);
    }

    if (achBadge) {
      achBadge.classList.toggle("hidden", true);
    }
  }
}

window.QuestsMgr = new QuestsSystem();
