/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE PRESTIGIO (REBIRTH & MEJORAS PERMANENTES)
 * ============================================================================
 */

const PRESTIGE_UPGRADES_CATALOG = [
  {
    id: "perm_damage",
    name: "Fuerza Ancestral",
    icon: "⚔️",
    baseCost: 1,
    costMult: 1.8,
    desc: "+20% daño total acumulativo para siempre.",
    getEffectText: (lvl) => `+${lvl * 20}% Daño Permanente`
  },
  {
    id: "perm_money",
    name: "Fortuna Celestial",
    icon: "💰",
    baseCost: 2,
    costMult: 2.0,
    desc: "+25% dinero total ganado por toda la eternidad.",
    getEffectText: (lvl) => `+${lvl * 25}% Dinero Permanente`
  },
  {
    id: "perm_crit",
    name: "Ojo Cósmico",
    icon: "🎯",
    baseCost: 3,
    costMult: 2.2,
    maxLevel: 10,
    desc: "+3% probabilidad crítica adicional perpetua.",
    getEffectText: (lvl) => `+${lvl * 3}% Prob. Crítica Permanente`
  },
  {
    id: "perm_xp",
    name: "Trascendencia Cósmica",
    icon: "⭐",
    baseCost: 2,
    costMult: 2.0,
    desc: "+35% ganancia de XP permanente para siempre.",
    getEffectText: (lvl) => `+${lvl * 35}% XP Permanente`
  },
  {
    id: "starter_boost",
    name: "Salto de Inicio",
    icon: "🚀",
    baseCost: 5,
    costMult: 2.5,
    maxLevel: 5,
    desc: "Comienza cada nuevo renacimiento con niveles y dinero de ventaja.",
    getEffectText: (lvl) => lvl === 0 ? "Inicia en nivel 1" : `Inicia en Nivel ${1 + lvl * 3} con $${lvl * 250}`
  }
];

class PrestigeSystem {
  constructor() {
    this.minLevel = 30; // Nivel necesario para desbloquear prestigio
  }

  init() {
    this.setupListeners();
    this.renderPrestigeUI();
  }

  setupListeners() {
    const btnOpen = document.getElementById("btn-open-prestige-modal");
    const modal = document.getElementById("prestige-modal");
    const btnCancel = document.getElementById("btn-prestige-cancel");
    const btnCancelX = document.getElementById("btn-prestige-cancel-x");
    const btnConfirm = document.getElementById("btn-prestige-confirm");

    if (btnOpen) {
      btnOpen.addEventListener("click", () => {
        if (this.canPrestige()) {
          if (window.GameState.state.settings.muteWarnings) {
            this.executePrestige();
          } else {
            this.updateModalEstimate();
            if (modal) modal.classList.remove("hidden");
          }
        }
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.add("hidden");
    };

    if (btnCancel) btnCancel.addEventListener("click", closeModal);
    if (btnCancelX) btnCancelX.addEventListener("click", closeModal);

    if (btnConfirm) {
      btnConfirm.addEventListener("click", () => {
        this.executePrestige();
        closeModal();
      });
    }
  }

  canPrestige() {
    return window.GameState.state.level >= this.minLevel;
  }

  calculateShardsGain() {
    const lvl = window.GameState.state.level;
    if (lvl < this.minLevel) return 0;

    // Base: nivel - 25 elevado a 1.35 + bonus de bolas destruidas
    const lvlBonus = Math.pow(lvl - (this.minLevel - 5), 1.35);
    const ballsBonus = Math.floor(window.GameState.state.stats.ballsDestroyed / 200);

    return Math.max(1, Math.floor(lvlBonus + ballsBonus));
  }

  updateModalEstimate() {
    const shards = this.calculateShardsGain();
    const modalGain = document.getElementById("prestige-modal-gain-shards");
    if (modalGain) {
      modalGain.textContent = `+${window.CombatMgr.formatNumber(shards)}`;
    }
  }

  executePrestige() {
    if (!this.canPrestige()) return;

    const s = window.GameState.state;
    const gainedShards = this.calculateShardsGain();

    // Incrementar estadísticas de prestigio
    s.prestigeCount++;
    s.prestigeShards += gainedShards;
    s.stats.prestigeCount++;

    // Reinicio de valores normales
    const starterLvl = s.prestigeUpgrades.starter_boost || 0;
    s.level = 1 + starterLvl * 3;
    s.xp = 0;
    s.money = starterLvl * 250;
    s.baseDamage = 1 + Math.floor(starterLvl / 2);
    s.combo = 0;

    // Reiniciar mejoras normales
    for (const key in s.upgrades) {
      s.upgrades[key] = 0;
    }

    // Mantener armas obtenidas pero re-equipar fist o glove según starter_boost
    if (starterLvl >= 2 && s.ownedWeapons.includes("glove")) {
      s.equippedWeaponId = "glove";
    } else {
      s.equippedWeaponId = "fist";
    }

    // Limpiar bolas de la arena
    if (window.BallMgr) {
      window.BallMgr.clearAll();
      window.BallMgr.spawnBall();
    }

    window.AudioMgr.playAchievement();
    if (window.UIMgr) {
      window.UIMgr.showToast(`♻️ ¡PRESTIGIO REALIZADO! Has obtenido +${gainedShards} ⭐ Fragmentos.`, "achievement");
      window.UIMgr.switchTab("arena");
    }

    window.GameState.notify("prestige");
    if (window.QuestsMgr) {
      window.QuestsMgr.checkAchievements();
    }

    this.renderPrestigeUI();
  }

  getPrestigeUpgradeCost(upgId) {
    const upg = PRESTIGE_UPGRADES_CATALOG.find(u => u.id === upgId);
    if (!upg) return 1;
    const lvl = window.GameState.state.prestigeUpgrades[upgId] || 0;
    return Math.floor(upg.baseCost * Math.pow(upg.costMult, lvl));
  }

  buyPrestigeUpgrade(upgId) {
    const upg = PRESTIGE_UPGRADES_CATALOG.find(u => u.id === upgId);
    if (!upg) return false;

    const s = window.GameState.state;
    const currentLvl = s.prestigeUpgrades[upgId] || 0;
    if (upg.maxLevel && currentLvl >= upg.maxLevel) return false;

    const cost = this.getPrestigeUpgradeCost(upgId);
    if (s.prestigeShards >= cost) {
      s.prestigeShards -= cost;
      s.prestigeUpgrades[upgId] = currentLvl + 1;

      window.AudioMgr.playBuy();
      window.GameState.notify("prestige_upgrade_bought");
      this.renderPrestigeUI();
      return true;
    }
    return false;
  }

  renderPrestigeUI() {
    const shardsCountEl = document.getElementById("prestige-shards-count");
    const shardsGainEl = document.getElementById("prestige-shards-gain");
    const btnPrestige = document.getElementById("btn-open-prestige-modal");
    const reqNotice = document.getElementById("prestige-req-notice");
    const grid = document.getElementById("prestige-upgrades-grid");

    const s = window.GameState.state;
    const canDo = this.canPrestige();
    const shardsGain = this.calculateShardsGain();

    if (shardsCountEl) shardsCountEl.textContent = window.CombatMgr.formatNumber(s.prestigeShards);
    if (shardsGainEl) shardsGainEl.textContent = `+${window.CombatMgr.formatNumber(shardsGain)} ⭐ Fragmentos`;

    if (btnPrestige) {
      btnPrestige.disabled = !canDo;
      if (canDo) {
        btnPrestige.classList.add("pulse-btn");
      } else {
        btnPrestige.classList.remove("pulse-btn");
      }
    }

    if (reqNotice) {
      if (canDo) {
        reqNotice.innerHTML = `<span style="color: var(--accent-green);">✓ ¡REQUISITO CUMPLIDO! Puedes renacer ahora.</span>`;
      } else {
        reqNotice.innerHTML = `<span>Requiere alcanzar el <strong>NIVEL ${this.minLevel}</strong> para renacer (Nivel actual: ${s.level}).</span>`;
      }
    }

    if (!grid) return;
    grid.innerHTML = "";

    PRESTIGE_UPGRADES_CATALOG.forEach(upg => {
      const lvl = s.prestigeUpgrades[upg.id] || 0;
      const isMax = upg.maxLevel && lvl >= upg.maxLevel;
      const cost = this.getPrestigeUpgradeCost(upg.id);
      const canAfford = s.prestigeShards >= cost;

      const card = document.createElement("div");
      card.className = "weapon-card";

      let actionBtn = "";
      if (isMax) {
        actionBtn = `<button class="btn-weapon-buy" disabled>MÁXIMO</button>`;
      } else {
        actionBtn = `
          <button class="btn-weapon-buy" ${!canAfford ? "disabled" : ""} onclick="window.PrestigeMgr.buyPrestigeUpgrade('${upg.id}')">
            ⭐ ${cost} Fragmentos
          </button>
        `;
      }

      card.innerHTML = `
        <div class="weapon-top">
          <div class="weapon-icon-wrap">${upg.icon}</div>
          <span class="rarity-badge rarity-epic">Nivel ${lvl}${upg.maxLevel ? ` / ${upg.maxLevel}` : ""}</span>
        </div>
        <div class="weapon-name">${upg.name}</div>
        <div class="weapon-desc">${upg.desc}</div>
        <div class="weapon-mult">${upg.getEffectText(lvl)}</div>
        ${actionBtn}
      `;

      grid.appendChild(card);
    });
  }
}

window.PrestigeMgr = new PrestigeSystem();
