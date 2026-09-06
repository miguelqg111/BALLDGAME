/**
 * ============================================================================
 * BALL DAMAGE - GESTOR DE INTERFAZ DE USUARIO (UIMANAGER)
 * ============================================================================
 */

const GUIDED_OBJECTIVES = [
  {
    desc: "Destruye tu primera bola haciendo clic sobre ella en la arena.",
    check: (s) => s.stats.ballsDestroyed >= 1,
    getProgress: (s) => `${Math.min(1, s.stats.ballsDestroyed)} / 1`
  },
  {
    desc: "Destruye bolas hasta acumular al menos $50 de dinero.",
    check: (s) => s.money >= 50 || s.ownedWeapons.includes("glove"),
    getProgress: (s) => `$${Math.min(50, s.money)} / $50`
  },
  {
    desc: "Ve a la Tienda 🛒 y compra el Guante de Boxeo.",
    check: (s) => s.ownedWeapons.includes("glove"),
    getProgress: (s) => s.ownedWeapons.includes("glove") ? "1 / 1" : "0 / 1"
  },
  {
    desc: "Entra a Mejoras ⚡ y compra tu primer nivel de Daño Físico.",
    check: (s) => (s.upgrades.flat_damage || 0) >= 1,
    getProgress: (s) => `${Math.min(1, s.upgrades.flat_damage || 0)} / 1`
  },
  {
    desc: "Haz clics consecutivos rápidos para alcanzar un Combo x5.",
    check: (s) => s.combo >= 5 || s.stats.maxCombo >= 5,
    getProgress: (s) => `${Math.min(5, Math.max(s.combo, s.stats.maxCombo))} / 5`
  },
  {
    desc: "Destruye bolas y acumula experiencia hasta alcanzar el Nivel 5.",
    check: (s) => s.level >= 5,
    getProgress: (s) => `Nivel ${s.level} / 5`
  },
  {
    desc: "Ve a Entrenamiento 🏋️ y completa un minijuego para obtener un buff.",
    check: (s) => s.activeBuffs.length > 0,
    getProgress: (s) => s.activeBuffs.length > 0 ? "1 / 1" : "0 / 1"
  },
  {
    desc: "Consigue $500 y compra la Espada de Caballero en la Tienda.",
    check: (s) => s.ownedWeapons.includes("sword"),
    getProgress: (s) => s.ownedWeapons.includes("sword") ? "1 / 1" : `$${Math.min(500, s.money)} / $500`
  },
  {
    desc: "Alcanza el Nivel 10 para desbloquear la aparición de Bolas Cósmicas.",
    check: (s) => s.level >= 10,
    getProgress: (s) => `Nivel ${s.level} / 10`
  },
  {
    desc: "Avanza hacia el Nivel 30 para desbloquear el primer Prestigio ♻️.",
    check: (s) => s.level >= 30,
    getProgress: (s) => `Nivel ${s.level} / 30`
  },
  {
    desc: "¡Objetivo Maestro! Realiza tu primer Prestigio Cósmico.",
    check: (s) => s.prestigeCount >= 1,
    getProgress: (s) => `${s.prestigeCount} / 1`
  }
];

class UIManager {
  constructor() {
    this.currentTab = "arena";
    this.tutorialCurrentSlide = 1;
    this.tutorialTotalSlides = 5;
  }

  init() {
    this.setupStartScreen();
    this.setupTabNavigation();
    this.setupTutorial();
    this.setupSettingsView();
    this.setupIOModal();
    this.setupLevelUpModal();
    this.subscribeToState();
    this.updateHUD();
    this.updateObjective();
    this.renderLocalRanking();
  }

  // --- TRANSICIÓN DE PANTALLA INICIAL ---
  setupStartScreen() {
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    const btnPlay = document.getElementById("btn-start-play");
    const hudLogo = document.getElementById("hud-logo-btn");

    const enterGame = (targetTab = "arena") => {
      window.AudioMgr.init();
      window.AudioMgr.resume();
      window.AudioMgr.playBuy();

      startScreen.classList.remove("active");
      gameContainer.classList.remove("hidden");
      this.switchTab(targetTab);

      // Si nunca vio el tutorial, mostrarlo al entrar por primera vez
      if (!window.GameState.state.settings.tutorialCompleted) {
        this.openTutorial();
      }
    };

    if (btnPlay) btnPlay.addEventListener("click", () => enterGame("arena"));

    const navButtons = document.querySelectorAll(".start-nav-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        enterGame(btn.dataset.tab);
      });
    });

    // Volver al menú inicial desde el HUD
    if (hudLogo) {
      hudLogo.addEventListener("click", () => {
        startScreen.classList.add("active");
        gameContainer.classList.add("hidden");
      });
    }

    // Botones de audio rápido en HUD
    const btnSound = document.getElementById("hud-btn-sound");
    const btnMusic = document.getElementById("hud-btn-music");

    if (btnSound) {
      btnSound.addEventListener("click", () => {
        const current = window.GameState.state.settings.sfx;
        window.GameState.state.settings.sfx = !current;
        window.AudioMgr.setSFX(!current);
        btnSound.classList.toggle("muted", current);
        this.syncSettingsUI();
      });
    }

    if (btnMusic) {
      btnMusic.addEventListener("click", () => {
        const current = window.GameState.state.settings.music;
        window.GameState.state.settings.music = !current;
        window.AudioMgr.setMusic(!current);
        btnMusic.classList.toggle("muted", current);
        this.syncSettingsUI();
      });
    }
  }

  // --- NAVEGACIÓN POR PESTAÑAS ---
  setupTabNavigation() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Actualizar botones de navegación
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Mostrar/ocultar vistas
    const views = [
      "shop", "upgrades", "training", "missions", "achievements", "stats", "prestige", "settings", "pets", "skins"
    ];

    views.forEach(v => {
      const viewEl = document.getElementById(`tab-${v}`);
      if (viewEl) {
        viewEl.classList.toggle("hidden", v !== tabName);
      }
    });

    // En pantallas de escritorio, si es 'arena' nos aseguramos de refrescar
    if (tabName === "stats") {
      this.updateStatsView();
      this.renderLocalRanking();
    } else if (tabName === "shop") {
      window.EconomyMgr.renderShop();
    } else if (tabName === "upgrades") {
      window.EconomyMgr.renderUpgrades();
    } else if (tabName === "prestige") {
      window.PrestigeMgr.renderPrestigeUI();
    } else if (tabName === "pets") {
      if (window.PetsMgr) window.PetsMgr.renderPetsUI();
    } else if (tabName === "skins") {
      if (window.SkinsMgr) window.SkinsMgr.renderSkinsUI();
    }
  }

  // --- TUTORIAL INTERACTIVO ---
  setupTutorial() {
    const modal = document.getElementById("tutorial-modal");
    const btnSkip = document.getElementById("tut-btn-skip");
    const btnPrev = document.getElementById("tut-btn-prev");
    const btnNext = document.getElementById("tut-btn-next");

    const closeTut = () => {
      modal.classList.add("hidden");
      window.GameState.state.settings.tutorialCompleted = true;
      window.StorageMgr.save();
    };

    if (btnSkip) btnSkip.addEventListener("click", closeTut);

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (this.tutorialCurrentSlide < this.tutorialTotalSlides) {
          this.setTutorialSlide(this.tutorialCurrentSlide + 1);
        } else {
          closeTut();
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (this.tutorialCurrentSlide > 1) {
          this.setTutorialSlide(this.tutorialCurrentSlide - 1);
        }
      });
    }
  }

  openTutorial() {
    const modal = document.getElementById("tutorial-modal");
    if (modal) {
      this.setTutorialSlide(1);
      modal.classList.remove("hidden");
    }
  }

  setTutorialSlide(slideNum) {
    this.tutorialCurrentSlide = slideNum;
    const slides = document.querySelectorAll(".tutorial-slide");
    slides.forEach(s => {
      s.classList.toggle("active", parseInt(s.dataset.step, 10) === slideNum);
    });

    const dots = document.querySelectorAll(".tut-dots .dot");
    dots.forEach((d, idx) => {
      d.classList.toggle("active", idx + 1 === slideNum);
    });

    const btnPrev = document.getElementById("tut-btn-prev");
    const btnNext = document.getElementById("tut-btn-next");

    if (btnPrev) btnPrev.disabled = slideNum === 1;
    if (btnNext) {
      btnNext.textContent = slideNum === this.tutorialTotalSlides ? "¡COMENZAR A JUGAR!" : "Siguiente";
    }
  }

  // --- CONFIGURACIÓN & AJUSTES ---
  setupSettingsView() {
    const soundToggle = document.getElementById("setting-sound");
    const musicToggle = document.getElementById("setting-music");
    const particlesToggle = document.getElementById("setting-particles");
    const themeBtn = document.getElementById("setting-toggle-theme");

    const btnTutorial = document.getElementById("setting-btn-tutorial");
    const btnSave = document.getElementById("setting-btn-save");
    const btnExport = document.getElementById("setting-btn-export");
    const btnImport = document.getElementById("setting-btn-import");
    const btnReset = document.getElementById("setting-btn-reset");

    this.syncSettingsUI();

    if (soundToggle) {
      soundToggle.addEventListener("change", (e) => {
        window.GameState.state.settings.sfx = e.target.checked;
        window.AudioMgr.setSFX(e.target.checked);
        const hudSound = document.getElementById("hud-btn-sound");
        if (hudSound) hudSound.classList.toggle("muted", !e.target.checked);
      });
    }

    if (musicToggle) {
      musicToggle.addEventListener("change", (e) => {
        window.GameState.state.settings.music = e.target.checked;
        window.AudioMgr.setMusic(e.target.checked);
        const hudMusic = document.getElementById("hud-btn-music");
        if (hudMusic) hudMusic.classList.toggle("muted", !e.target.checked);
      });
    }

    if (particlesToggle) {
      particlesToggle.addEventListener("change", (e) => {
        window.GameState.state.settings.particles = e.target.checked;
      });
    }

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const body = document.body;
        const isDark = body.classList.contains("dark-theme");
        if (isDark) {
          body.classList.remove("dark-theme");
          body.classList.add("light-theme");
          window.GameState.state.settings.theme = "light";
        } else {
          body.classList.remove("light-theme");
          body.classList.add("dark-theme");
          window.GameState.state.settings.theme = "dark";
        }
      });
    }

    if (btnTutorial) btnTutorial.addEventListener("click", () => this.openTutorial());

    if (btnSave) {
      btnSave.addEventListener("click", () => {
        const ok = window.StorageMgr.save();
        if (ok) this.showToast("💾 Partida guardada con éxito en el navegador.", "success");
        else this.showToast("No se pudo guardar la partida.", "danger");
      });
    }

    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const saveStr = window.StorageMgr.exportSaveString();
        this.openIOModal("EXPORTAR PARTIDA", "Copia esta clave de texto para respaldar tu partida:", saveStr, false);
      });
    }

    if (btnImport) {
      btnImport.addEventListener("click", () => {
        this.openIOModal("IMPORTAR PARTIDA", "Pega el código de guardado en el recuadro inferior:", "", true);
      });
    }

    // Toggle para bloquear advertencias
    const muteWarningsToggle = document.getElementById("setting-mute-warnings");
    if (muteWarningsToggle) {
      muteWarningsToggle.addEventListener("change", (e) => {
        window.GameState.state.settings.muteWarnings = e.target.checked;
        window.StorageMgr.save();
        this.showToast(
          e.target.checked
            ? "⚠️ Advertencias bloqueadas: Las acciones se ejecutarán directamente sin confirmación."
            : "✓ Advertencias activadas: Se solicitará confirmación antes de acciones críticas.",
          "info"
        );
      });
    }

    // Selector de multiplicador de XP
    const xpChips = document.querySelectorAll("#xp-multiplier-chips .chip-mult");
    xpChips.forEach(chip => {
      chip.addEventListener("click", () => {
        xpChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const mult = parseFloat(chip.dataset.mult) || 1;
        window.GameState.state.settings.xpMultiplier = mult;
        window.StorageMgr.save();
        this.showToast(`⭐ Ganancia de XP multiplicada por x${mult}`, "success");
      });
    });

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        const skipWarning = window.GameState.state.settings.muteWarnings;
        if (skipWarning || confirm("⚠️ ¿ESTÁS ABSOLUTAMENTE SEGURO?\n\nEsta acción borrará todo tu nivel, dinero, herramientas y estadísticas de este navegador.")) {
          window.StorageMgr.resetGame();
          window.location.reload();
        }
      });
    }
  }

  syncSettingsUI() {
    const s = window.GameState.state.settings;
    const soundToggle = document.getElementById("setting-sound");
    const musicToggle = document.getElementById("setting-music");
    const particlesToggle = document.getElementById("setting-particles");
    const muteToggle = document.getElementById("setting-mute-warnings");

    if (soundToggle) soundToggle.checked = s.sfx;
    if (musicToggle) musicToggle.checked = s.music;
    if (particlesToggle) particlesToggle.checked = s.particles;
    if (muteToggle) muteToggle.checked = !!s.muteWarnings;

    const currentMult = s.xpMultiplier || 1;
    const xpChips = document.querySelectorAll("#xp-multiplier-chips .chip-mult");
    xpChips.forEach(chip => {
      chip.classList.toggle("active", parseFloat(chip.dataset.mult) === currentMult);
    });

    if (s.theme === "light") {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    }
  }

  // --- MODAL DE EXPORTAR / IMPORTAR ---
  setupIOModal() {
    const modal = document.getElementById("io-modal");
    const btnClose = document.getElementById("btn-io-close");
    if (btnClose) btnClose.addEventListener("click", () => modal.classList.add("hidden"));
  }

  openIOModal(title, desc, initialValue, isImport) {
    const modal = document.getElementById("io-modal");
    const titleEl = document.getElementById("io-modal-title");
    const descEl = document.getElementById("io-modal-desc");
    const textEl = document.getElementById("io-modal-textarea");
    const actionBtn = document.getElementById("btn-io-action");

    if (!modal) return;
    titleEl.textContent = title;
    descEl.textContent = desc;
    textEl.value = initialValue;

    if (isImport) {
      actionBtn.textContent = "CARGAR DATOS";
      actionBtn.onclick = () => {
        const ok = window.StorageMgr.importSaveString(textEl.value);
        if (ok) {
          this.showToast("✓ Partida importada correctamente.", "success");
          modal.classList.add("hidden");
          setTimeout(() => window.location.reload(), 500);
        } else {
          this.showToast("❌ Código de partida inválido o corrupto.", "danger");
        }
      };
    } else {
      actionBtn.textContent = "COPIAR AL PORTAPAPELES";
      actionBtn.onclick = () => {
        navigator.clipboard.writeText(textEl.value).then(() => {
          this.showToast("✓ Código copiado al portapapeles.", "success");
        }).catch(() => {
          textEl.select();
        });
      };
    }

    modal.classList.remove("hidden");
  }

  // --- MODAL DE SUBIDA DE NIVEL ---
  setupLevelUpModal() {
    const modal = document.getElementById("levelup-modal");
    const btn = document.getElementById("levelup-btn-continue");
    if (btn) btn.addEventListener("click", () => modal.classList.add("hidden"));
  }

  showLevelUpModal(level, bonusCash) {
    const modal = document.getElementById("levelup-modal");
    const numEl = document.getElementById("levelup-number");
    const rewEl = document.getElementById("levelup-rewards");
    if (!modal) return;

    numEl.textContent = `NIVEL ${level}`;
    rewEl.textContent = `+ $${window.CombatMgr.formatNumber(bonusCash)} Dinero extra • Nuevos multiplicadores`;
    modal.classList.remove("hidden");
  }

  // --- ACTUALIZACIÓN DE HUD Y OBJETIVO ---
  subscribeToState() {
    window.GameState.subscribe(() => {
      this.updateHUD();
      this.updateObjective();
    });
  }

  updateHUD() {
    const s = window.GameState.state;

    // Nivel y XP
    const lvlEl = document.getElementById("hud-level");
    const xpFill = document.getElementById("hud-xp-fill");
    const xpText = document.getElementById("hud-xp-text");
    const reqXP = window.GameState.getXpRequired();

    if (lvlEl) lvlEl.textContent = s.level;
    if (xpFill) {
      const pct = Math.min(100, Math.round((s.xp / reqXP) * 100));
      xpFill.style.width = `${pct}%`;
    }
    if (xpText) xpText.textContent = `${window.CombatMgr.formatNumber(s.xp)} / ${window.CombatMgr.formatNumber(reqXP)} XP`;

    // Dinero
    const moneyEl = document.getElementById("hud-money");
    if (moneyEl) moneyEl.textContent = `$${window.CombatMgr.formatNumber(s.money)}`;

    // Daño
    const dmgEl = document.getElementById("hud-damage");
    if (dmgEl) dmgEl.textContent = window.CombatMgr.formatNumber(window.GameState.calculateFinalDamage(false));

    // Combo
    const comboEl = document.getElementById("hud-combo");
    const comboBar = document.getElementById("hud-combo-timer");
    if (comboEl) {
      const mult = window.GameState.getComboMultiplier().toFixed(1);
      comboEl.textContent = `x${mult} (${s.combo})`;
    }
    if (comboBar) {
      comboBar.style.width = `${window.CombatMgr.getComboTimePercent()}%`;
    }

    // Buffs Activos
    const buffsContainer = document.getElementById("hud-active-buffs");
    if (buffsContainer) {
      const now = Date.now();
      buffsContainer.innerHTML = "";
      s.activeBuffs.forEach(b => {
        if (b.expiresAt > now) {
          const remainingSecs = Math.max(0, Math.round((b.expiresAt - now) / 1000));
          const m = Math.floor(remainingSecs / 60);
          const sec = remainingSecs % 60;
          const badge = document.createElement("div");
          badge.className = "buff-badge";
          badge.innerHTML = `⚡ ${b.name} (${m}:${String(sec).padStart(2, "0")})`;
          buffsContainer.appendChild(badge);
        }
      });
    }
  }

  updateObjective() {
    const s = window.GameState.state;
    let idx = s.currentObjectiveIndex || 0;

    // Verificar si el objetivo actual fue completado
    while (idx < GUIDED_OBJECTIVES.length && GUIDED_OBJECTIVES[idx].check(s)) {
      idx++;
      s.currentObjectiveIndex = idx;
    }

    const descEl = document.getElementById("objective-description");
    const progEl = document.getElementById("objective-progress");

    if (idx < GUIDED_OBJECTIVES.length) {
      const obj = GUIDED_OBJECTIVES[idx];
      if (descEl) descEl.textContent = obj.desc;
      if (progEl) progEl.textContent = obj.getProgress(s);
    } else {
      if (descEl) descEl.textContent = "🏆 ¡Has completado todos los objetivos guiados principales!";
      if (progEl) progEl.textContent = "DOMINIO TOTAL";
    }
  }

  updateStatsView() {
    const s = window.GameState.state;
    const stBalls = document.getElementById("st-balls-destroyed");
    const stMoney = document.getElementById("st-total-money");
    const stHit = document.getElementById("st-highest-hit");
    const stCrit = document.getElementById("st-highest-crit");
    const stCombo = document.getElementById("st-max-combo");
    const stLevel = document.getElementById("st-max-level");
    const stClicks = document.getElementById("st-total-clicks");
    const stTime = document.getElementById("st-playtime");
    const stPrest = document.getElementById("st-prestige-count");

    if (stBalls) stBalls.textContent = window.CombatMgr.formatNumber(s.stats.ballsDestroyed);
    if (stMoney) stMoney.textContent = `$${window.CombatMgr.formatNumber(s.stats.totalMoneyEarned)}`;
    if (stHit) stHit.textContent = window.CombatMgr.formatNumber(s.stats.highestHit);
    if (stCrit) stCrit.textContent = window.CombatMgr.formatNumber(s.stats.highestCrit);
    if (stCombo) stCombo.textContent = `x${s.stats.maxCombo}`;
    if (stLevel) stLevel.textContent = s.stats.maxLevel;
    if (stClicks) stClicks.textContent = window.CombatMgr.formatNumber(s.stats.totalClicks);

    const m = Math.floor(s.stats.playTimeSeconds / 60);
    const sec = s.stats.playTimeSeconds % 60;
    if (stTime) stTime.textContent = `${m}m ${sec}s`;
    if (stPrest) stPrest.textContent = s.stats.prestigeCount;
  }

  renderLocalRanking() {
    const tbody = document.getElementById("ranking-body");
    if (!tbody) return;

    const s = window.GameState.state;
    const records = [
      { cat: "⭐ Nivel Más Alto", val: `Nivel ${s.stats.maxLevel}`, status: "Activo" },
      { cat: "💥 Mayor Daño Crítico", val: `${window.CombatMgr.formatNumber(s.stats.highestCrit)} Daño`, status: "Récord Personal" },
      { cat: "🔥 Mayor Racha de Combo", val: `x${s.stats.maxCombo} Combo`, status: "Imbatible" },
      { cat: "⚪ Bolas Destruidas", val: `${window.CombatMgr.formatNumber(s.stats.ballsDestroyed)} Esferas`, status: "Acumulativo" },
      { cat: "💰 Fortuna Total Ganada", val: `$${window.CombatMgr.formatNumber(s.stats.totalMoneyEarned)}`, status: "Verificado" },
      { cat: "♻️ Prestigios Realizados", val: `${s.stats.prestigeCount} Renacimientos`, status: "Ascensión" }
    ];

    tbody.innerHTML = "";
    records.forEach((r, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>#${idx + 1}</strong></td>
        <td>${r.cat}</td>
        <td><strong>${r.val}</strong></td>
        <td><span style="color: var(--accent-green); font-weight:700;">● ${r.status}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  // --- TOASTS NOTIFICATIONS ---
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    else if (type === "achievement") icon = "🏆";
    else if (type === "danger") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => toast.remove(), 300);
      }
    }, 3800);
  }
}

window.UIMgr = new UIManager();
