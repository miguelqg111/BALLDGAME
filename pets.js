/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE MASCOTAS (PETS SYSTEM & COMPANIONS)
 * ============================================================================
 */

const PETS_CATALOG = [
  // --- COMUNES ---
  {
    id: "dog",
    name: "Perro Fiel",
    icon: "🐶",
    rarity: "common",
    desc: "El mejor amigo del destructor. Olfatea monedas extra en cada bola.",
    bonusDesc: "+5% Dinero",
    damageMult: 0,
    moneyMult: 0.05,
    xpMult: 0,
    critChance: 0,
    critMult: 0
  },
  {
    id: "cat",
    name: "Gato Ágil",
    icon: "🐱",
    rarity: "common",
    desc: "Garras afiladas que arañan la resistencia de cualquier objetivo.",
    bonusDesc: "+5% Daño",
    damageMult: 0.05,
    moneyMult: 0,
    xpMult: 0,
    critChance: 0,
    critMult: 0
  },
  {
    id: "rabbit",
    name: "Conejo Veloz",
    icon: "🐰",
    rarity: "common",
    desc: "Acelera tu aprendizaje con saltos llenos de energía y entusiasmo.",
    bonusDesc: "+10% Experiencia (XP)",
    damageMult: 0,
    moneyMult: 0,
    xpMult: 0.10,
    critChance: 0,
    critMult: 0
  },

  // --- RARAS ---
  {
    id: "fox",
    name: "Zorro Astuto",
    icon: "🦊",
    rarity: "rare",
    desc: "Estratega nato que combina recolección voraz con mordiscos sorpresa.",
    bonusDesc: "+10% Dinero • +5% Daño",
    damageMult: 0.05,
    moneyMult: 0.10,
    xpMult: 0,
    critChance: 0,
    critMult: 0
  },
  {
    id: "owl",
    name: "Búho Sabio",
    icon: "🦉",
    rarity: "rare",
    desc: "Visión nocturna periférica para detectar los puntos más débiles.",
    bonusDesc: "+20% XP • +5% Prob. Crítica",
    damageMult: 0,
    moneyMult: 0,
    xpMult: 0.20,
    critChance: 5,
    critMult: 0
  },
  {
    id: "wolf",
    name: "Lobo Cazador",
    icon: "🐺",
    rarity: "rare",
    desc: "Su aullido de batalla infunde terror y potencia tus ataques continuos.",
    bonusDesc: "+12% Daño • +0.5s Combo",
    damageMult: 0.12,
    moneyMult: 0,
    xpMult: 0,
    critChance: 0,
    critMult: 0
  },

  // --- ÉPICAS ---
  {
    id: "panda",
    name: "Panda Zen",
    icon: "🐼",
    rarity: "epic",
    desc: "Equilibrio supremo entre fuerza destructiva y acumulación de riqueza.",
    bonusDesc: "+15% Dinero • +15% Daño",
    damageMult: 0.15,
    moneyMult: 0.15,
    xpMult: 0,
    critChance: 0,
    critMult: 0
  },
  {
    id: "phoenix",
    name: "Fénix de Fuego",
    icon: "🦅",
    rarity: "epic",
    desc: "Llamaradas legendarias que queman las esferas con calor abrasador.",
    bonusDesc: "+18% Daño • +10% Prob. Crítica",
    damageMult: 0.18,
    moneyMult: 0,
    xpMult: 0,
    critChance: 10,
    critMult: 0
  },
  {
    id: "lion",
    name: "León Dorado",
    icon: "🦁",
    rarity: "epic",
    desc: "El rey de la sabana. Atrae fortunas doradas con su presencia regia.",
    bonusDesc: "+25% Dinero • +10% XP",
    damageMult: 0,
    moneyMult: 0.25,
    xpMult: 0.10,
    critChance: 0,
    critMult: 0
  },

  // --- LEGENDARIAS ---
  {
    id: "dragon",
    name: "Dragón Ígneo",
    icon: "🐉",
    rarity: "legendary",
    desc: "Aliento de magma capaz de derretir cualquier bola blindada.",
    bonusDesc: "+25% Daño • +15% Dinero",
    damageMult: 0.25,
    moneyMult: 0.15,
    xpMult: 0,
    critChance: 0,
    critMult: 0
  },
  {
    id: "alien",
    name: "Alien Cósmico",
    icon: "👽",
    rarity: "legendary",
    desc: "Tecnología interdimensional que dobla las leyes de la probabilidad.",
    bonusDesc: "+20% Prob. Crítica • +20% Daño",
    damageMult: 0.20,
    moneyMult: 0,
    xpMult: 0,
    critChance: 20,
    critMult: 0
  },
  {
    id: "unicorn",
    name: "Unicornio Astral",
    icon: "🦄",
    rarity: "legendary",
    desc: "Brillo místico que transmuta cada victoria en una lluvia cósmica.",
    bonusDesc: "+30% XP • +25% Dinero",
    damageMult: 0,
    moneyMult: 0.25,
    xpMult: 0.30,
    critChance: 0,
    critMult: 0
  },

  // --- MÍTICAS ---
  {
    id: "kraken",
    name: "Kraken Abisal",
    icon: "🐙",
    rarity: "mythic",
    desc: "Monstruo de las profundidades con fuerza colosal de aplastamiento.",
    bonusDesc: "+40% Daño • +1.0x Daño Crítico",
    damageMult: 0.40,
    moneyMult: 0,
    xpMult: 0,
    critChance: 0,
    critMult: 1.0
  },
  {
    id: "mecha",
    name: "Mecha Centinela",
    icon: "🤖",
    rarity: "mythic",
    desc: "Autómata militar equipado con micro-misiles dirigidos.",
    bonusDesc: "+35% Daño • +20% XP • Disparo Auto",
    damageMult: 0.35,
    moneyMult: 0,
    xpMult: 0.20,
    critChance: 5,
    critMult: 0
  },

  // --- CÓSMICA ---
  {
    id: "titan",
    name: "Titán Galáctico",
    icon: "🌌",
    rarity: "cosmic",
    desc: "Entidad divina que sostiene las constelaciones. Poder supremo absoluto.",
    bonusDesc: "+60% Daño • +40% Dinero • +15% Crítico • +50% XP",
    damageMult: 0.60,
    moneyMult: 0.40,
    xpMult: 0.50,
    critChance: 15,
    critMult: 1.5
  }
];

class PetsSystem {
  constructor() {
    this.PETS_CATALOG = PETS_CATALOG;
    this.companionEl = null;
    this.orbitAngle = 0;
  }

  init() {
    this.setupCompanionElement();
    this.renderPetsUI();
    this.updateCompanionVisual();
  }

  getEquippedPet() {
    const s = window.GameState.state;
    const equippedId = (s.pets && s.pets.equipped) || "dog";
    return PETS_CATALOG.find(p => p.id === equippedId) || PETS_CATALOG[0];
  }

  getDamageMultiplier() {
    const pet = this.getEquippedPet();
    return 1 + (pet.damageMult || 0);
  }

  getMoneyMultiplier() {
    const pet = this.getEquippedPet();
    return 1 + (pet.moneyMult || 0);
  }

  getXpMultiplier() {
    const pet = this.getEquippedPet();
    return 1 + (pet.xpMult || 0);
  }

  getCritChanceBonus() {
    const pet = this.getEquippedPet();
    return pet.critChance || 0;
  }

  getCritMultBonus() {
    const pet = this.getEquippedPet();
    return pet.critMult || 0;
  }

  equipPet(petId) {
    const s = window.GameState.state;
    if (!s.pets) s.pets = { owned: ["dog"], equipped: "dog" };
    if (!s.pets.owned.includes(petId)) return false;

    s.pets.equipped = petId;
    window.AudioMgr.playHit();
    this.updateCompanionVisual();
    this.renderPetsUI();
    window.GameState.notify("pet_equipped");
    if (window.UIMgr) {
      const pet = PETS_CATALOG.find(p => p.id === petId);
      window.UIMgr.showToast(`🐾 ¡Mascota equipada: ${pet.name}!`, "success");
    }
    return true;
  }

  setupCompanionElement() {
    const arena = document.getElementById("ball-arena");
    if (!arena) return;

    // Verificar si ya existe
    let comp = document.getElementById("pet-companion-sprite");
    if (!comp) {
      comp = document.createElement("div");
      comp.id = "pet-companion-sprite";
      comp.className = "pet-companion-float";
      arena.appendChild(comp);
    }
    this.companionEl = comp;
  }

  updateCompanionVisual() {
    if (!this.companionEl) this.setupCompanionElement();
    if (!this.companionEl) return;

    const pet = this.getEquippedPet();
    this.companionEl.innerHTML = `
      <div class="pet-sprite-inner rarity-border-${pet.rarity}">
        <span class="pet-sprite-icon">${pet.icon}</span>
      </div>
      <span class="pet-sprite-nametag">${pet.name}</span>
    `;
  }

  // Mover suavemente a la mascota flotando en la arena
  updateCompanionMovement() {
    if (!this.companionEl) return;
    this.orbitAngle += 0.02;

    const arena = document.getElementById("ball-arena");
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    if (rect.width <= 0) return;

    // Posición flotante con oscilación suave en el lateral superior derecho
    const baseX = rect.width - 90;
    const baseY = 80;
    const floatX = baseX + Math.sin(this.orbitAngle * 0.8) * 18;
    const floatY = baseY + Math.cos(this.orbitAngle * 1.2) * 14;

    this.companionEl.style.left = `${floatX}px`;
    this.companionEl.style.top = `${floatY}px`;
  }

  renderPetsUI() {
    const grid = document.getElementById("pets-grid");
    if (!grid) return;

    const s = window.GameState.state;
    const owned = (s.pets && s.pets.owned) || ["dog"];
    const equipped = (s.pets && s.pets.equipped) || "dog";

    grid.innerHTML = "";

    PETS_CATALOG.forEach(pet => {
      const isOwned = owned.includes(pet.id);
      const isEquipped = equipped === pet.id;

      const card = document.createElement("div");
      card.className = `pet-card ${isOwned ? "owned" : "locked"} ${isEquipped ? "equipped" : ""}`;

      let btnHTML = "";
      if (isEquipped) {
        btnHTML = `<button class="btn-pet-equip is-equipped" disabled>✓ EQUIPADA</button>`;
      } else if (isOwned) {
        btnHTML = `<button class="btn-pet-equip" onclick="window.PetsMgr.equipPet('${pet.id}')">EQUIPAR</button>`;
      } else {
        btnHTML = `<button class="btn-pet-equip locked" disabled>🔒 EN COFRES</button>`;
      }

      card.innerHTML = `
        <div class="pet-top">
          <div class="pet-icon-wrap rarity-${pet.rarity}">${pet.icon}</div>
          <span class="rarity-badge rarity-${pet.rarity}">${pet.rarity}</span>
        </div>
        <div class="pet-name">${pet.name}</div>
        <div class="pet-desc">${pet.desc}</div>
        <div class="pet-bonus-badge">${pet.bonusDesc}</div>
        ${btnHTML}
      `;

      grid.appendChild(card);
    });
  }
}

window.PetsMgr = new PetsSystem();
