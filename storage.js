/**
 * ============================================================================
 * BALL DAMAGE - SISTEMA DE PERSISTENCIA (LOCALSTORAGE / BACKUP)
 * ============================================================================
 */

const STORAGE_KEY = "ball_damage_v2_save";

class StorageManager {
  constructor() {
    this.autoSaveInterval = null;
  }

  init() {
    this.load();
    this.startAutoSave();
  }

  // Guardar estado actual en localStorage
  save() {
    try {
      const data = JSON.stringify(window.GameState.state);
      localStorage.setItem(STORAGE_KEY, data);
      return true;
    } catch (e) {
      console.error("Error al guardar la partida:", e);
      return false;
    }
  }

  // Cargar estado de localStorage
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        // Mezclar recursivamente con DEFAULT_GAME_STATE para asegurar retrocompatibilidad
        window.GameState.state = this.deepMerge(JSON.parse(JSON.stringify(DEFAULT_GAME_STATE)), parsed);
        window.GameState.notify("loaded");
        return true;
      }
    } catch (e) {
      console.warn("No se pudo cargar la partida existente:", e);
    }
    return false;
  }

  // Auto-guardado cada 10 segundos
  startAutoSave() {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
    this.autoSaveInterval = setInterval(() => {
      this.save();
    }, 10000);
  }

  // Reiniciar partida completa
  resetGame() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.GameState.state = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
      window.GameState.notify("reset");
      return true;
    } catch (e) {
      console.error("Error al reiniciar la partida:", e);
      return false;
    }
  }

  // Exportar a texto JSON codificado
  exportSaveString() {
    try {
      const data = JSON.stringify(window.GameState.state);
      return btoa(encodeURIComponent(data));
    } catch (e) {
      return null;
    }
  }

  // Importar desde texto
  importSaveString(str) {
    try {
      const decoded = decodeURIComponent(atob(str.trim()));
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === "object" && parsed.level) {
        window.GameState.state = this.deepMerge(JSON.parse(JSON.stringify(DEFAULT_GAME_STATE)), parsed);
        this.save();
        window.GameState.notify("loaded");
        return true;
      }
    } catch (e) {
      console.error("Error al importar la partida:", e);
    }
    return false;
  }

  deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target && target[key] instanceof Object && !Array.isArray(source[key])) {
        Object.assign(source[key], this.deepMerge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
}

window.StorageMgr = new StorageManager();
