(() => {
  "use strict";

  const DEFAULT_STATUS = {
    enabled: false,
    source: "local",
    message: "CloudBase map disabled",
    updatedAt: 0,
  };

  let status = { ...DEFAULT_STATUS };
  let pending = null;

  function getConfig() {
    return window.WALL_RUSH_CLOUDBASE_CONFIG || {};
  }

  function isReadyConfig(config) {
    return Boolean(config.enabled && config.env && config.collection && config.mapId);
  }

  function storageKey(config) {
    return config.cacheKey || `wallRushCloudMap:${config.env}:${config.collection}:${config.mapId}`;
  }

  function readCache(config) {
    try {
      const raw = window.localStorage.getItem(storageKey(config));
      if (!raw) return null;
      const cached = JSON.parse(raw);
      const ttl = Number(config.cacheTtlMs || 0);
      if (ttl > 0 && Date.now() - cached.savedAt > ttl) return null;
      return cached.data || null;
    } catch (err) {
      return null;
    }
  }

  function writeCache(config, data) {
    try {
      window.localStorage.setItem(
        storageKey(config),
        JSON.stringify({
          savedAt: Date.now(),
          data,
        })
      );
    } catch (err) {
      // Cache is optional.
    }
  }

  function initCloudBase(config) {
    if (!window.cloudbase) throw new Error("CloudBase SDK is not loaded");
    const initConfig = {
      env: config.env,
      region: config.region || "ap-shanghai",
    };
    if (config.accessKey) initConfig.accessKey = config.accessKey;
    return window.cloudbase.init(initConfig);
  }

  async function signInIfNeeded(app, config) {
    if (config.accessKey || !app.auth) return;
    const auth = typeof app.auth === "function" ? app.auth() : app.auth;
    if (!auth || !auth.signInAnonymously) return;
    const result = await auth.signInAnonymously();
    if (result && result.error) throw result.error;
  }

  function getDataRows(result) {
    if (!result) return [];
    if (Array.isArray(result.data)) return result.data;
    if (result.data && Array.isArray(result.data.data)) return result.data.data;
    if (Array.isArray(result)) return result;
    return [];
  }

  async function fetchMap(config) {
    const app = initCloudBase(config);
    await signInIfNeeded(app, config);
    const db = app.database();
    const result = await db
      .collection(config.collection)
      .where({
        mapId: config.mapId,
        active: true,
      })
      .limit(1)
      .get();
    if (result && result.error) throw result.error;
    const rows = getDataRows(result);
    if (!rows.length) throw new Error(`No active map found: ${config.mapId}`);
    return rows[0];
  }

  async function load() {
    if (pending) return pending;
    const config = getConfig();

    if (!isReadyConfig(config)) {
      status = {
        enabled: Boolean(config.enabled),
        source: "local",
        message: config.enabled ? "CloudBase config is incomplete" : "CloudBase map disabled",
        updatedAt: Date.now(),
      };
      return null;
    }

    pending = (async () => {
      const cached = readCache(config);
      if (cached) {
        status = {
          enabled: true,
          source: "cache",
          message: "CloudBase map loaded from cache",
          updatedAt: Date.now(),
        };
      }

      try {
        const data = await fetchMap(config);
        writeCache(config, data);
        status = {
          enabled: true,
          source: "cloud",
          message: "CloudBase map loaded",
          updatedAt: Date.now(),
        };
        return data;
      } catch (err) {
        if (cached) return cached;
        status = {
          enabled: true,
          source: "local",
          message: err && err.message ? err.message : "CloudBase map load failed",
          updatedAt: Date.now(),
        };
        return null;
      } finally {
        pending = null;
      }
    })();

    return pending;
  }

  window.WallRushCloudMap = {
    load,
    getStatus: () => ({ ...status }),
  };
})();
