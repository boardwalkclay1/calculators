// storage-engine.js
// Unified storage layer for all calculators

export const StorageEngine = {
  mode: "local", // "local" or "cloud"

  init() {
    const saved = localStorage.getItem("calculator-storage-mode");
    if (saved) this.mode = saved;
  },

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem("calculator-storage-mode", mode);
  },

  save(key, data) {
    if (this.mode === "local") return this.saveLocal(key, data);
    return this.saveCloud(key, data);
  },

  load(key) {
    if (this.mode === "local") return this.loadLocal(key);
    return this.loadCloud(key);
  },

  delete(key) {
    if (this.mode === "local") return this.deleteLocal(key);
    return this.deleteCloud(key);
  },

  // -------------------------
  // LOCAL STORAGE
  // -------------------------
  saveLocal(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Local save error:", e);
      return false;
    }
  },

  loadLocal(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Local load error:", e);
      return null;
    }
  },

  deleteLocal(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error("Local delete error:", e);
      return false;
    }
  },

  // -------------------------
  // CLOUD STORAGE (future)
  // -------------------------
  async saveCloud(key, data) {
    console.warn("Cloud mode not implemented yet.");
    return false;
  },

  async loadCloud(key) {
    console.warn("Cloud mode not implemented yet.");
    return null;
  },

  async deleteCloud(key) {
    console.warn("Cloud mode not implemented yet.");
    return false;
  }
};

StorageEngine.init();
