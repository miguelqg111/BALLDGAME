/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE COFRES & UNBOXING (CHESTS SYSTEM)
 * ============================================================================
 */

const CHEST_TIERS = {
  common: {
    id: "common",
    name: "Cofre Común",
    icon: "📦",
    color: "#94a3b8",
    badgeClass: "rarity-common",
    ballsRequired: 25,
    minMoney: 100,
    maxMoney: 350,
    minXP: 30,
    maxXP: 80,
    petDropRate: 0.25,
    petPool: ["dog", "cat", "rabbit"],
    skinDropRate: 0.15,
    skinPool: ["ball_fire", "weapon_lightning"]
  },
  rare: {
    id: "rare",
    name: "Cofre Raro",
    icon: "🎁",
    color: "#3b82f6",
    badgeClass: "rarity-rare",
    ballsRequired: 75,
    minMoney: 1000,
    maxMoney: 3500,
    minXP: 250,
    maxXP: 600,
    petDropRate: 0.30,
    petPool: ["fox", "owl", "wolf"],
    skinDropRate: 0.22,
    skinPool: ["ball_ice", "weapon_crimson", "fx_fire"]
  },
  epic: {
    id: "epic",
    name: "Cofre Épico",
    icon: "🔮",
    color: "#a855f7",
    badgeClass: "rarity-epic",
    ballsRequired: 175,
    minMoney: 15000,
    maxMoney: 40000,
    minXP: 2000,
    maxXP: 6000,
    petDropRate: 0.35,
    petPool: ["panda", "phoenix", "lion"],
    skinDropRate: 0.30,
    skinPool: ["ball_galaxy", "weapon_rainbow", "fx_lightning", "cursor_sword"]
  },
  legendary: {
    id: "legendary",
    name: "Cofre Legendario",
    icon: "👑",
    color: "#f59e0b",
    badgeClass: "rarity-legendary",
    ballsRequired: 400,
    minMoney: 150000,
    maxMoney: 500000,
    minXP: 25000,
    maxXP: 75000,
    petDropRate: 0.45,
    petPool: ["dragon", "alien", "unicorn"],
    skinDropRate: 0.40,
    skinPool: ["ball_gold_skin", "weapon_diamond", "fx_kawaii", "cursor_wand"]
  },
  cosmic: {
    id: "cosmic",
    name: "Cofre Cósmico Divino",
    icon: "🌌",
    color: "#00e5ff",
    badgeClass: "rarity-cosmic",
    ballsRequired: 1000,
    minMoney: 2000000,
    maxMoney: 10000000,
    minXP: 250000,
    maxXP: 800000,
    minShards: 3,
    maxShards: 8,
    petDropRate: 0.60,
    petPool: ["kraken", "mecha", "titan"],
    skinDropRate: 0.55,
    skinPool: ["ball_cyber", "fx_void", "cursor_gauntlet"]
  }
};

class ChestsSystem {
  constructor() {
    this.openingChestTier = null;
    this.isOpening = false;
  }

  init() {
    this.setupListeners();
    this.updateHUDWidget();
  }

  setupListeners() {
    // Botón HUD para abrir modal de inventario de cofres
    const hudBtn = document.getElementById("hud-chest-btn");
    if (hudBtn) {
      hudBtn.addEventListener("click", () => {
        this.openChestsModal();
      });
    }

    // Botones de cierre de modal
    const modal = document.getElementById("chests-modal");
    const btnClose = document.getElementById("btn-chests-modal-close");
    if (btnClose && modal) {
      btnClose.addEventListener("click", () => {
        if (!this.isOpening) modal.classList.add("hidden");
      });
    }
  }

  // Notificación al destruir una bola
  onBallDestroyed() {
    const s = window.GameState.state;
    s.chestProgress = (s.chestProgress || 0) + 1;

    // Verificar hitos de cofres
    const totalDestroyed = s.stats.ballsDestroyed;

    // Cada 25 bolas -> cofre común
    if (totalDestroyed % 25 === 0) {
      this.grantChest("common");
    }
    // Cada 75 bolas -> cofre raro
    if (totalDestroyed % 75 === 0) {
      this.grantChest("rare");
    }
    // Cada 175 bolas -> cofre épico
    if (totalDestroyed % 175 === 0) {
      this.grantChest("epic");
    }
    // Cada 400 bolas -> cofre legendario
    if (totalDestroyed % 400 === 0) {
      this.grantChest("legendary");
    }
    // Cada 1,000 bolas -> cofre cósmico
    if (totalDestroyed % 1000 === 0) {
      this.grantChest("cosmic");
    }

    this.updateHUDWidget();
  }

  grantChest(tierId) {
    const s = window.GameState.state;
    if (!s.chests) s.chests = { common: 0, rare: 0, epic: 0, legendary: 0, cosmic: 0 };
    s.chests[tierId] = (s.chests[tierId] || 0) + 1;

    const tier = CHEST_TIERS[tierId];
    window.AudioMgr.playLevelUp();
    if (window.UIMgr) {
      window.UIMgr.showToast(`🎁 ¡HAS GANADO UN ${tier.name.toUpperCase()}!`, "achievement");
    }

    this.updateHUDWidget();
    this.renderChestsInventory();
  }

  getTotalChestsCount() {
    const s = window.GameState.state;
    if (!s.chests) return 0;
    return Object.values(s.chests).reduce((a, b) => a + b, 0);
  }

  updateHUDWidget() {
    const countEl = document.getElementById("hud-chest-count");
    const btn = document.getElementById("hud-chest-btn");
    const total = this.getTotalChestsCount();

    if (countEl) countEl.textContent = total;
    if (btn) {
      btn.classList.toggle("pulse-btn", total > 0);
    }
  }

  openChestsModal() {
    const modal = document.getElementById("chests-modal");
    if (!modal) return;
    this.renderChestsInventory();
    modal.classList.remove("hidden");
  }

  renderChestsInventory() {
    const container = document.getElementById("chests-grid");
    if (!container) return;

    const s = window.GameState.state;
    container.innerHTML = "";

    Object.values(CHEST_TIERS).forEach(tier => {
      const count = (s.chests && s.chests[tier.id]) || 0;
      const card = document.createElement("div");
      card.className = "chest-card";

      card.innerHTML = `
        <div class="chest-card-top">
          <span class="chest-icon">${tier.icon}</span>
          <span class="rarity-badge ${tier.badgeClass}">${tier.name}</span>
        </div>
        <div class="chest-meta">
          <span class="chest-qty">Disponibles: <strong>${count}</strong></span>
        </div>
        <button class="btn-open-chest ${count > 0 ? "pulse-btn" : ""}" 
          ${count <= 0 ? "disabled" : ""} 
          onclick="window.ChestsMgr.startOpenChest('${tier.id}')">
          ${count > 0 ? "¡ABRIR COFRE!" : "SIN COFRES"}
        </button>
      `;

      container.appendChild(card);
    });
  }

  // --- APERTURA INTERACTIVA (UNBOXING) ---
  startOpenChest(tierId) {
    const s = window.GameState.state;
    if (!s.chests || (s.chests[tierId] || 0) <= 0 || this.isOpening) return;

    s.chests[tierId]--;
    this.isOpening = true;
    this.openingChestTier = CHEST_TIERS[tierId];

    // Mostrar escena de unboxing
    const unboxScene = document.getElementById("chest-unboxing-scene");
    const unboxIcon = document.getElementById("unbox-chest-icon");
    const unboxRays = document.getElementById("unbox-rays");
    const unboxLoot = document.getElementById("unbox-loot-container");
    const btnDone = document.getElementById("unbox-btn-done");

    if (unboxScene) unboxScene.classList.remove("hidden");
    if (unboxLoot) unboxLoot.innerHTML = "";
    if (btnDone) btnDone.classList.add("hidden");

    if (unboxIcon) {
      unboxIcon.textContent = this.openingChestTier.icon;
      unboxIcon.className = "unbox-chest-sprite chest-shake-anim";
    }
    if (unboxRays) unboxRays.classList.remove("active");

    window.AudioMgr.playEvent();

    // Tras 1.4 segundos de vibración, abrir con explosión de rayos y sonido
    setTimeout(() => {
      if (unboxIcon) unboxIcon.className = "unbox-chest-sprite chest-opened-anim";
      if (unboxRays) unboxRays.classList.add("active");
      window.AudioMgr.playAchievement();

      // Generar botín
      const loot = this.generateLoot(this.openingChestTier);
      this.displayLoot(loot);

      if (btnDone) {
        btnDone.classList.remove("hidden");
        btnDone.onclick = () => {
          unboxScene.classList.add("hidden");
          this.isOpening = false;
          this.updateHUDWidget();
          this.renderChestsInventory();
          window.GameState.notify("chest_opened");
        };
      }
    }, 1400);
  }

  generateLoot(tier) {
    const loot = [];
    const s = window.GameState.state;

    // 1. Dinero
    const moneyAmount = Math.floor(tier.minMoney + Math.random() * (tier.maxMoney - tier.minMoney));
    s.money += moneyAmount;
    s.stats.totalMoneyEarned += moneyAmount;
    loot.push({ type: "money", label: `$${window.CombatMgr.formatNumber(moneyAmount)} Dinero`, icon: "💰" });

    // 2. XP
    const xpAmount = Math.floor(tier.minXP + Math.random() * (tier.maxXP - tier.minXP));
    window.GameState.addXP(xpAmount);
    loot.push({ type: "xp", label: `+${window.CombatMgr.formatNumber(xpAmount)} XP`, icon: "⭐" });

    // 3. Fragmentos de prestigio (en cósmico)
    if (tier.minShards) {
      const shards = Math.floor(tier.minShards + Math.random() * (tier.maxShards - tier.minShards + 1));
      s.prestigeShards += shards;
      loot.push({ type: "shards", label: `+${shards} ⭐ Fragmentos Cósmicos`, icon: "⭐" });
    }

    // 4. Drop de Mascota
    if (tier.petPool && Math.random() < tier.petDropRate && window.PetsMgr) {
      const randomPetId = tier.petPool[Math.floor(Math.random() * tier.petPool.length)];
      const pet = window.PetsMgr.PETS_CATALOG.find(p => p.id === randomPetId);
      if (pet) {
        if (!s.pets.owned.includes(pet.id)) {
          s.pets.owned.push(pet.id);
          loot.push({ type: "pet", label: `¡NUEVA MASCOTA! ${pet.name}`, icon: pet.icon });
        } else {
          // Compensación si ya la tiene
          const bonusMoney = tier.maxMoney * 2;
          s.money += bonusMoney;
          loot.push({ type: "pet_dup", label: `Mascota Repetida: +$${window.CombatMgr.formatNumber(bonusMoney)}`, icon: pet.icon });
        }
      }
    }

    // 5. Drop de Skin
    if (tier.skinPool && Math.random() < tier.skinDropRate && window.SkinsMgr) {
      const randomSkinId = tier.skinPool[Math.floor(Math.random() * tier.skinPool.length)];
      const skin = window.SkinsMgr.SKINS_CATALOG.find(sk => sk.id === randomSkinId);
      if (skin) {
        if (!s.skins.unlocked.includes(skin.id)) {
          s.skins.unlocked.push(skin.id);
          loot.push({ type: "skin", label: `¡NUEVA SKIN! ${skin.name}`, icon: skin.icon });
        }
      }
    }

    return loot;
  }

  displayLoot(lootList) {
    const container = document.getElementById("unbox-loot-container");
    if (!container) return;

    lootList.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "loot-card animate-loot";
      card.style.animationDelay = `${idx * 0.15}s`;
      card.innerHTML = `
        <span class="loot-icon">${item.icon}</span>
        <span class="loot-label">${item.label}</span>
      `;
      container.appendChild(card);
    });
  }
}

window.ChestsMgr = new ChestsSystem();
