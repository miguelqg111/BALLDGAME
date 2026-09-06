/**
 * ============================================================================
 * BALL DAMAGE - ECONOMÍA: TIENDA DE HERRAMIENTAS Y ÁRBOL DE MEJORAS
 * ============================================================================
 */

const WEAPONS_CATALOG = [
  {
    id: "fist",
    name: "Puño Básico",
    multiplier: 1,
    cost: 0,
    rarity: "common",
    icon: "👊",
    desc: "Tus propios nudillos. El inicio de todo guerrero destructor."
  },
  {
    id: "glove",
    name: "Guante de Boxeo",
    multiplier: 2,
    cost: 50,
    rarity: "common",
    icon: "🥊",
    desc: "Acolchado resistente que duplica el impacto de cada golpe."
  },
  {
    id: "dagger",
    name: "Daga de Acero",
    multiplier: 3,
    cost: 180,
    rarity: "uncommon",
    icon: "🗡️",
    desc: "Filo templado para desinflar bolas con rapidez quirúrgica."
  },
  {
    id: "sword",
    name: "Espada de Caballero",
    multiplier: 5,
    cost: 500,
    rarity: "uncommon",
    icon: "⚔️",
    desc: "Forjada con hierro noble. Corta con contundencia letal."
  },
  {
    id: "hammer",
    name: "Maza de Guerra",
    multiplier: 10,
    cost: 5000,
    rarity: "rare",
    icon: "🔨",
    desc: "Poderoso mazo pesado capaz de quebrar las bolas tanque más duras."
  },
  {
    id: "battleaxe",
    name: "Hacha de Batalla",
    multiplier: 15,
    cost: 18000,
    rarity: "rare",
    icon: "🪓",
    desc: "Doble filo letal que desgarra la resistencia de cualquier objetivo."
  },
  {
    id: "drill",
    name: "Taladro Industrial",
    multiplier: 25,
    cost: 50000,
    rarity: "epic",
    icon: "⚙️",
    desc: "Motor de alta rotación con broca de carburo de tungsteno."
  },
  {
    id: "laser",
    name: "Cañón Láser",
    multiplier: 50,
    cost: 250000,
    rarity: "epic",
    icon: "🔫",
    desc: "Rayo de energía continua que vaporiza el núcleo de las bolas."
  },
  {
    id: "plasma_blade",
    name: "Espada de Plasma",
    multiplier: 100,
    cost: 1000000,
    rarity: "legendary",
    icon: "⚡",
    desc: "Energía sobrecalentada a un millón de grados Celsius."
  },
  {
    id: "antimatter",
    name: "Blaster de Antimateria",
    multiplier: 250,
    cost: 10000000,
    rarity: "legendary",
    icon: "🌌",
    desc: "Dispara micro-cargas de antimateria que aniquilan la materia al contacto."
  },
  {
    id: "celestial",
    name: "Martillo Celestial",
    multiplier: 500,
    cost: 50000000,
    rarity: "mythic",
    icon: "🔱",
    desc: "Artefacto divino imbuido con la fuerza gravitatoria de una estrella."
  },
  {
    id: "titan_gauntlet",
    name: "Guantelete del Infinito",
    multiplier: 1500,
    cost: 500000000,
    rarity: "cosmic",
    icon: "💎",
    desc: "El arma definitiva. Un solo chasquido desintegra cualquier enemigo."
  }
];

const UPGRADES_CATALOG = [
  {
    id: "flat_damage",
    name: "Daño Físico Base",
    category: "damage",
    icon: "⚔️",
    baseCost: 20,
    costMult: 1.48,
    desc: "+2 de daño plano a la base antes de multiplicadores.",
    getEffectText: (lvl) => `+${lvl * 2} Daño Base (Siguiente: +${(lvl + 1) * 2})`
  },
  {
    id: "pct_damage",
    name: "Potencia de Ataque",
    category: "damage",
    icon: "💥",
    baseCost: 100,
    costMult: 1.62,
    desc: "+15% de daño acumulable en cada golpe.",
    getEffectText: (lvl) => `+${lvl * 15}% Daño Global (Siguiente: +${(lvl + 1) * 15}%)`
  },
  {
    id: "crit_chance",
    name: "Precisión Quirúrgica",
    category: "crit",
    icon: "🎯",
    baseCost: 150,
    costMult: 1.82,
    maxLevel: 25,
    desc: "+2.5% probabilidad de asestar impactos críticos.",
    getEffectText: (lvl) => `${(5 + lvl * 2.5).toFixed(1)}% Prob. Crítica (Base: 5%)`
  },
  {
    id: "crit_mult",
    name: "Fuerza Crítica",
    category: "crit",
    icon: "⚡",
    baseCost: 300,
    costMult: 1.95,
    desc: "+0.5x multiplicador adicional a los golpes críticos.",
    getEffectText: (lvl) => `${(2.0 + lvl * 0.5).toFixed(1)}x Daño Crítico`
  },
  {
    id: "money_bonus",
    name: "Imán de Oro",
    category: "money",
    icon: "💰",
    baseCost: 75,
    costMult: 1.55,
    desc: "+15% de dinero obtenido por cada bola destruida.",
    getEffectText: (lvl) => `+${lvl * 15}% Ganancias de Oro`
  },
  {
    id: "auto_drone",
    name: "Drone Centinela",
    category: "speed",
    icon: "🤖",
    baseCost: 250,
    costMult: 2.1,
    desc: "Dispara automáticamente a las bolas en pantalla cada segundo.",
    getEffectText: (lvl) => lvl === 0 ? "Inactivo (Comprar nivel 1)" : `${lvl} Disparos automáticos / seg`
  },
  {
    id: "combo_time",
    name: "Resonancia de Combo",
    category: "combo",
    icon: "🔥",
    baseCost: 120,
    costMult: 1.6,
    maxLevel: 15,
    desc: "+0.4 segundos adicionales de margen antes de que el combo se reinicie.",
    getEffectText: (lvl) => `${(3.0 + lvl * 0.4).toFixed(1)}s Duración de Combo`
  },
  {
    id: "xp_bonus",
    name: "Sabiduría Ancestral",
    category: "xp",
    icon: "⭐",
    baseCost: 90,
    costMult: 1.6,
    desc: "+25% de ganancia de experiencia (XP) por cada bola destruida.",
    getEffectText: (lvl) => `+${lvl * 25}% Experiencia Obtenida`
  }
];

class EconomySystem {
  constructor() {
    this.currentUpgradeFilter = "all";
  }

  init() {
    this.setupUIListeners();
    this.renderShop();
    this.renderUpgrades();
  }

  setupUIListeners() {
    // Filtros de mejoras
    const filterButtons = document.querySelectorAll(".chip-filter");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentUpgradeFilter = btn.dataset.filter;
        this.renderUpgrades();
      });
    });
  }

  // --- TIENDA DE HERRAMIENTAS ---
  buyWeapon(weaponId) {
    const weapon = WEAPONS_CATALOG.find(w => w.id === weaponId);
    if (!weapon) return false;

    const s = window.GameState.state;
    if (s.ownedWeapons.includes(weaponId)) return false;

    if (s.money >= weapon.cost) {
      s.money -= weapon.cost;
      s.ownedWeapons.push(weaponId);
      s.equippedWeaponId = weaponId; // Auto-equipar arma nueva más fuerte

      window.AudioMgr.playBuy();
      if (window.UIMgr) {
        window.UIMgr.showToast(`🎉 ¡Compraste y equipaste: ${weapon.name}!`, "success");
      }

      window.GameState.notify("weapon_bought");
      if (window.QuestsMgr) {
        window.QuestsMgr.onWeaponBought();
      }

      this.renderShop();
      return true;
    }
    return false;
  }

  equipWeapon(weaponId) {
    const s = window.GameState.state;
    if (!s.ownedWeapons.includes(weaponId)) return false;

    s.equippedWeaponId = weaponId;
    window.AudioMgr.playHit();
    window.GameState.notify("weapon_equipped");
    this.renderShop();
    return true;
  }

  renderShop() {
    const grid = document.getElementById("weapons-grid");
    if (!grid) return;

    const s = window.GameState.state;
    const equippedWeapon = WEAPONS_CATALOG.find(w => w.id === s.equippedWeaponId) || WEAPONS_CATALOG[0];

    // Actualizar banner de arma equipada
    const eqName = document.getElementById("equipped-name");
    const eqMult = document.getElementById("equipped-mult");
    if (eqName) eqName.textContent = equippedWeapon.name;
    if (eqMult) eqMult.textContent = `x${equippedWeapon.multiplier} Daño`;

    grid.innerHTML = "";
    WEAPONS_CATALOG.forEach(weapon => {
      const isOwned = s.ownedWeapons.includes(weapon.id);
      const isEquipped = s.equippedWeaponId === weapon.id;
      const canAfford = s.money >= weapon.cost;

      const card = document.createElement("div");
      card.className = `weapon-card ${isEquipped ? "equipped" : ""}`;

      let actionBtn = "";
      if (isEquipped) {
        actionBtn = `<button class="btn-weapon-equip is-equipped" disabled>✓ EQUIPADO</button>`;
      } else if (isOwned) {
        actionBtn = `<button class="btn-weapon-equip" onclick="window.EconomyMgr.equipWeapon('${weapon.id}')">EQUIPAR</button>`;
      } else {
        actionBtn = `
          <button class="btn-weapon-buy" ${!canAfford ? "disabled" : ""} onclick="window.EconomyMgr.buyWeapon('${weapon.id}')">
            💰 $${window.CombatMgr.formatNumber(weapon.cost)}
          </button>
        `;
      }

      card.innerHTML = `
        <div class="weapon-top">
          <div class="weapon-icon-wrap">${weapon.icon}</div>
          <span class="rarity-badge rarity-${weapon.rarity}">${weapon.rarity}</span>
        </div>
        <div class="weapon-name">${weapon.name}</div>
        <div class="weapon-mult">x${window.CombatMgr.formatNumber(weapon.multiplier)} Daño</div>
        <div class="weapon-desc">${weapon.desc}</div>
        ${actionBtn}
      `;

      grid.appendChild(card);
    });
  }

  // --- ÁRBOL DE MEJORAS ---
  getUpgradeCost(upgradeId) {
    const upg = UPGRADES_CATALOG.find(u => u.id === upgradeId);
    if (!upg) return 0;
    const lvl = window.GameState.state.upgrades[upgradeId] || 0;
    return Math.floor(upg.baseCost * Math.pow(upg.costMult, lvl));
  }

  buyUpgrade(upgradeId) {
    const upg = UPGRADES_CATALOG.find(u => u.id === upgradeId);
    if (!upg) return false;

    const s = window.GameState.state;
    const currentLvl = s.upgrades[upgradeId] || 0;

    if (upg.maxLevel && currentLvl >= upg.maxLevel) return false;

    const cost = this.getUpgradeCost(upgradeId);
    if (s.money >= cost) {
      s.money -= cost;
      s.upgrades[upgradeId] = currentLvl + 1;

      window.AudioMgr.playBuy();
      window.GameState.notify("upgrade_bought");

      if (window.QuestsMgr) {
        window.QuestsMgr.onUpgradeBought();
      }

      this.renderUpgrades();
      return true;
    }
    return false;
  }

  renderUpgrades() {
    const list = document.getElementById("upgrades-list");
    if (!list) return;

    const s = window.GameState.state;
    const filter = this.currentUpgradeFilter;

    const filtered = UPGRADES_CATALOG.filter(u => {
      if (filter === "all") return true;
      return u.category === filter;
    });

    list.innerHTML = "";
    filtered.forEach(upg => {
      const lvl = s.upgrades[upg.id] || 0;
      const isMax = upg.maxLevel && lvl >= upg.maxLevel;
      const cost = this.getUpgradeCost(upg.id);
      const canAfford = s.money >= cost;

      const row = document.createElement("div");
      row.className = "upgrade-row";

      let buyBtn = "";
      if (isMax) {
        buyBtn = `<button class="btn-buy-upgrade" disabled>MÁXIMO</button>`;
      } else {
        buyBtn = `
          <button class="btn-buy-upgrade" ${!canAfford ? "disabled" : ""} onclick="window.EconomyMgr.buyUpgrade('${upg.id}')">
            💰 $${window.CombatMgr.formatNumber(cost)}
          </button>
        `;
      }

      row.innerHTML = `
        <div class="upgrade-icon">${upg.icon}</div>
        <div class="upgrade-info">
          <div class="upgrade-title">
            ${upg.name}
            <span class="upgrade-level-badge">Nivel ${lvl}${upg.maxLevel ? ` / ${upg.maxLevel}` : ""}</span>
          </div>
          <div class="upgrade-desc">${upg.desc}</div>
          <div class="upgrade-effect">${upg.getEffectText(lvl)}</div>
        </div>
        ${buyBtn}
      `;

      list.appendChild(row);
    });
  }
}

window.EconomyMgr = new EconomySystem();
