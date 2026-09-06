/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE SKINS & PERSONALIZACIÓN COSMÉTICA (SKINS SYSTEM)
 * ============================================================================
 */

const SKINS_CATALOG = [
  // --- SKINS DE BOLAS ---
  {
    id: "ball_default",
    name: "Esfera Clásica",
    category: "ball",
    icon: "⚪",
    rarity: "common",
    cssClass: "skin-ball-default",
    desc: "El diseño original y pulido de esferas de energía."
  },
  {
    id: "ball_fire",
    name: "Esfera de Fuego",
    category: "ball",
    icon: "🔥",
    rarity: "rare",
    cssClass: "skin-ball-fire",
    desc: "Aura ardiente con magma fundido y calor intenso."
  },
  {
    id: "ball_ice",
    name: "Esfera de Hielo",
    category: "ball",
    icon: "❄️",
    rarity: "rare",
    cssClass: "skin-ball-ice",
    desc: "Cristales de escarcha glaciar con destellos helados."
  },
  {
    id: "ball_galaxy",
    name: "Esfera Galaxia",
    category: "ball",
    icon: "🌌",
    rarity: "epic",
    cssClass: "skin-ball-galaxy",
    desc: "Vórtice estelar con nebulosas y estrellas en órbita."
  },
  {
    id: "ball_gold_skin",
    name: "Esfera Dorada Pura",
    category: "ball",
    icon: "👑",
    rarity: "legendary",
    cssClass: "skin-ball-gold",
    desc: "Bañada en oro de 24 kilates con reflejo resplandeciente."
  },
  {
    id: "ball_cyber",
    name: "Esfera Neón Matrix",
    category: "ball",
    icon: "☣️",
    rarity: "cosmic",
    cssClass: "skin-ball-cyber",
    desc: "Circuitos cibernéticos verdes hipertecnológicos."
  },

  // --- SKINS DE HERRAMIENTAS ---
  {
    id: "weapon_default",
    name: "Forja Clásica",
    category: "weapon",
    icon: "🗡️",
    rarity: "common",
    desc: "El acabado metálico tradicional para todo tu arsenal."
  },
  {
    id: "weapon_lightning",
    name: "Filo Eléctrico",
    category: "weapon",
    icon: "⚡",
    rarity: "rare",
    desc: "Descargas eléctricas azules que rodean tus armas."
  },
  {
    id: "weapon_crimson",
    name: "Hoja Carmesí",
    category: "weapon",
    icon: "🩸",
    rarity: "rare",
    desc: "Tinte rojo escarlata vampírico para golpes desgarradores."
  },
  {
    id: "weapon_rainbow",
    name: "Prisma RGB",
    category: "weapon",
    icon: "🌈",
    rarity: "epic",
    desc: "Cromado iridiscente que cicla por todos los tonos del espectro."
  },
  {
    id: "weapon_diamond",
    name: "Diamante Celestial",
    category: "weapon",
    icon: "💎",
    rarity: "legendary",
    desc: "Estructura de diamante puro con refracción luminosa suprema."
  },

  // --- SKINS DE EFECTOS DE DAÑO (PARTÍCULAS) ---
  {
    id: "fx_default",
    name: "Chispas Celestes",
    category: "fx",
    icon: "💥",
    rarity: "common",
    particleColors: ["#38bdf8", "#00e5ff", "#ffffff"],
    desc: "Partículas de chispas clásicas en tonos cian y celeste."
  },
  {
    id: "fx_fire",
    name: "Furia Ígnea",
    category: "fx",
    icon: "🔥",
    rarity: "rare",
    particleColors: ["#f97316", "#ef4444", "#fbbf24"],
    desc: "Explosiones de llamaradas y brasas volcánicas al golpear."
  },
  {
    id: "fx_lightning",
    name: "Trueno Amarillo",
    category: "fx",
    icon: "⚡",
    rarity: "epic",
    particleColors: ["#eab308", "#facc15", "#ffffff"],
    desc: "Relámpagos eléctricos que chisporrotean al hacer daño."
  },
  {
    id: "fx_kawaii",
    name: "Estrellas & Corazones",
    category: "fx",
    icon: "💖",
    rarity: "legendary",
    particleColors: ["#ec4899", "#f43f5e", "#fb7185", "#fef08a"],
    desc: "Destellos de estrellas resplandecientes y corazones mágicos."
  },
  {
    id: "fx_void",
    name: "Almas del Vacío",
    category: "fx",
    icon: "💀",
    rarity: "cosmic",
    particleColors: ["#a855f7", "#7e22ce", "#38bdf8", "#000000"],
    desc: "Neblina oscura y espectral proveniente de otra dimensión."
  },

  // --- SKINS DE CURSOR ---
  {
    id: "cursor_default",
    name: "Mira Arcade",
    category: "cursor",
    icon: "🎯",
    rarity: "common",
    cssClass: "cursor-default",
    desc: "Puntero estándar de crosshair limpio y preciso."
  },
  {
    id: "cursor_sword",
    name: "Espada Neón",
    category: "cursor",
    icon: "⚔️",
    rarity: "epic",
    cssClass: "cursor-sword",
    desc: "Cursor estilizado con forma de filo luminoso."
  },
  {
    id: "cursor_wand",
    name: "Varita Mágica",
    category: "cursor",
    icon: "🪄",
    rarity: "legendary",
    cssClass: "cursor-wand",
    desc: "Puntero con aura mágica y destellos dorados."
  },
  {
    id: "cursor_gauntlet",
    name: "Guantelete",
    category: "cursor",
    icon: "🧤",
    rarity: "cosmic",
    cssClass: "cursor-gauntlet",
    desc: "Cursor robusto con forma de puño de poder cósmico."
  }
];

class SkinsSystem {
  constructor() {
    this.SKINS_CATALOG = SKINS_CATALOG;
    this.currentCategoryFilter = "all";
  }

  init() {
    this.applyActiveSkins();
    this.setupFilterButtons();
    this.renderSkinsUI();
  }

  setupFilterButtons() {
    const buttons = document.querySelectorAll(".chip-skin-filter");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategoryFilter = btn.dataset.category;
        this.renderSkinsUI();
      });
    });
  }

  equipSkin(category, skinId) {
    const s = window.GameState.state;
    if (!s.skins) {
      s.skins = {
        equippedBall: "default",
        equippedWeapon: "default",
        equippedFx: "default",
        equippedCursor: "default",
        unlocked: ["ball_default", "weapon_default", "fx_default", "cursor_default"]
      };
    }

    if (!s.skins.unlocked.includes(skinId)) return false;

    if (category === "ball") s.skins.equippedBall = skinId;
    else if (category === "weapon") s.skins.equippedWeapon = skinId;
    else if (category === "fx") s.skins.equippedFx = skinId;
    else if (category === "cursor") s.skins.equippedCursor = skinId;

    this.applyActiveSkins();
    this.renderSkinsUI();
    window.AudioMgr.playHit();
    window.GameState.notify("skin_equipped");

    const skin = SKINS_CATALOG.find(sk => sk.id === skinId);
    if (window.UIMgr && skin) {
      window.UIMgr.showToast(`🎨 ¡Skin equipada: ${skin.name}!`, "success");
    }
    return true;
  }

  applyActiveSkins() {
    const s = window.GameState.state;
    if (!s.skins) return;

    // Aplicar clase de cursor a la arena
    const arena = document.getElementById("ball-arena");
    if (arena) {
      arena.classList.remove("cursor-default", "cursor-sword", "cursor-wand", "cursor-gauntlet");
      const cursorSkin = SKINS_CATALOG.find(sk => sk.id === s.skins.equippedCursor);
      if (cursorSkin && cursorSkin.cssClass) {
        arena.classList.add(cursorSkin.cssClass);
      }
    }
  }

  getBallSkinClass() {
    const s = window.GameState.state;
    const skinId = (s.skins && s.skins.equippedBall) || "ball_default";
    const skin = SKINS_CATALOG.find(sk => sk.id === skinId);
    return skin && skin.cssClass ? skin.cssClass : "";
  }

  getDamageParticleColors() {
    const s = window.GameState.state;
    const skinId = (s.skins && s.skins.equippedFx) || "fx_default";
    const skin = SKINS_CATALOG.find(sk => sk.id === skinId);
    return skin && skin.particleColors ? skin.particleColors : ["#38bdf8", "#00e5ff", "#ffffff"];
  }

  renderSkinsUI() {
    const grid = document.getElementById("skins-grid");
    if (!grid) return;

    const s = window.GameState.state;
    const unlocked = (s.skins && s.skins.unlocked) || ["ball_default", "weapon_default", "fx_default", "cursor_default"];

    const filter = this.currentCategoryFilter;
    const filtered = SKINS_CATALOG.filter(sk => {
      if (filter === "all") return true;
      return sk.category === filter;
    });

    grid.innerHTML = "";

    filtered.forEach(skin => {
      const isUnlocked = unlocked.includes(skin.id);
      let isEquipped = false;

      if (skin.category === "ball") isEquipped = (s.skins.equippedBall === skin.id);
      else if (skin.category === "weapon") isEquipped = (s.skins.equippedWeapon === skin.id);
      else if (skin.category === "fx") isEquipped = (s.skins.equippedFx === skin.id);
      else if (skin.category === "cursor") isEquipped = (s.skins.equippedCursor === skin.id);

      const card = document.createElement("div");
      card.className = `skin-card ${isUnlocked ? "unlocked" : "locked"} ${isEquipped ? "equipped" : ""}`;

      let btnHTML = "";
      if (isEquipped) {
        btnHTML = `<button class="btn-skin-equip is-equipped" disabled>✓ EQUIPADA</button>`;
      } else if (isUnlocked) {
        btnHTML = `<button class="btn-skin-equip" onclick="window.SkinsMgr.equipSkin('${skin.category}', '${skin.id}')">EQUIPAR</button>`;
      } else {
        btnHTML = `<button class="btn-skin-equip locked" disabled>🔒 EN COFRES</button>`;
      }

      card.innerHTML = `
        <div class="skin-top">
          <div class="skin-icon-wrap rarity-${skin.rarity}">${skin.icon}</div>
          <span class="rarity-badge rarity-${skin.rarity}">${skin.rarity}</span>
        </div>
        <div class="skin-name">${skin.name}</div>
        <div class="skin-category-tag">${this.getCategoryLabel(skin.category)}</div>
        <div class="skin-desc">${skin.desc}</div>
        ${btnHTML}
      `;

      grid.appendChild(card);
    });
  }

  getCategoryLabel(cat) {
    if (cat === "ball") return "Esfera";
    if (cat === "weapon") return "Herramienta";
    if (cat === "fx") return "Efectos";
    if (cat === "cursor") return "Cursor";
    return cat;
  }
}

window.SkinsMgr = new SkinsSystem();
