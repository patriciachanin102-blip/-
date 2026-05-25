(() => {
  "use strict";

  const DESIGN_W = 750;
  const DESIGN_H = 1624;
  const PLAYER_ANCHOR = { x: 375, y: 1148 };
  const PLAYER_SCALE = 0.63;
  const WALL_PREP_Y = 470;
  const WALL_PREP_SCALE = 0.58;
  const WALL_FINAL_Y = 980;
  const WALL_FINAL_SCALE = 1.14;
  const WALL_BASE_W = 649;
  const WALL_BASE_H = 566;
  const WALL_HOLE_SCALE_RATIO = PLAYER_SCALE / WALL_FINAL_SCALE;
  const WALL_HOLE_SIZE_MULTIPLIER = 1.2;
  const WALL_HOLE_ANCHOR_Y_RATIO =
    (PLAYER_ANCHOR.y - (WALL_FINAL_Y - (WALL_BASE_H * WALL_FINAL_SCALE) / 2)) / (WALL_BASE_H * WALL_FINAL_SCALE);
  const TOTAL_WALLS = 8;
  const MISS_SCORE_THRESHOLD = 60;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d", { alpha: false });

  const ASSETS = {
    loading: "assets/loading_cover_v6.jpg",
    startPoster: "assets/背景.png",
    homeCharacter: "assets/人物.png",
    track: "assets/f423cafa-c8a1-4c6c-a4ab-cd70a096255d.0f1ac.png",
    trackAlt: "assets/f423cafa-c8a1-4c6c-a4ab-cd70a096255d.0f1ac.png",
    blueBg: "assets/5ecb910b-4a74-46c2-adb9-e7de9fc964e6.df6fd.png",
    enterButton: "assets/进入游戏.png",
    selectRiderAvatar: "assets/156fa79e5.c9ff6_06.png",
    selectPilotAvatar: "assets/156fa79e5.c9ff6_05.png",
    selectConfirm: "assets/156fa79e5.c9ff6_07.png",
    backButton: "assets/返回.png",
    iceWall: "assets/冰墙.png",
    controlUp: "assets/control_up.png",
    controlDown: "assets/control_down.png",
    controlPoint: "assets/control_point.png",
    passedTag: "assets/passed_tag.png",
    replayButton: "assets/replay_button.png",
    maleHead: "assets/男/男头.png",
    maleTorso: "assets/男/男上身.png",
    maleLeftUpperArm: "assets/男/男左上胳膊.png",
    maleLeftLowerArm: "assets/男/男左下臂.png",
    maleRightUpperArm: "assets/男/男右上胳膊.png",
    maleRightLowerArm: "assets/男/男右下臂.png",
    maleLeftUpperLeg: "assets/男/男左上腿.png",
    maleLeftLowerLeg: "assets/男/男左下腿.png",
    maleRightUpperLeg: "assets/男/男右上腿.png",
    maleRightLowerLeg: "assets/男/男右下腿.png",
    maleLeftHand: "assets/男/人物_24.png",
    maleRightHand: "assets/男/人物_26.png",
    pilotAvatar: "assets/a267a89e-aedb-4a2a-a4ac-c196c583b312.5763d.png",
    pilotParts: "assets/d7b39204-ff0a-444d-a775-401a6da49caa.1e2fd.png",
    riderParts: "assets/a535928d-68f9-4381-9f49-c19c9db6a663.3080b.png",
    clothes: "assets/021d375f-4ad5-4846-b4df-93f00e9c806b.1097d.png",
    longParts: "assets/1770c89a-4db6-49c8-9ab3-efe852c6fcf0.32942.png",
    poseSheet: "assets/15ce26f80.c39c1.png",
    sampleWall: "assets/4f811b6d-1214-4e55-8a22-98f0028fe347.6ac47.png",
    guideUi: "assets/1e0d8f916.13d07.png",
    sign: "assets/c8bc5e4c-e7a2-46c4-b4ed-77a1fad7a943.f2274.png",
    goodPack: "assets/c3e5a9a9-9bd8-47e2-a028-4af90384296c.f5b07.png",
    greenFx: "assets/2676730a-dfe8-418e-834f-7b662d5811a8.c808a.png",
    snowPanel: "assets/1d22f75b2.11c76.png",
    bluePanel: "assets/14cc23f37.89b62.png",
    resultBar: "assets/43a3636a-57ba-4133-8c9d-72d4825f835e.d8008.png",
    invite: "assets/4eb9514c-57ba-4332-a342-f27abcc02e0b.a86b0.png",
    gift: "assets/07025000-672a-49c7-8902-ff1205768009.048f5.png",
    glowLine: "assets/4128aa8f-26b7-45d2-ab0e-a3f2e989515a.b5346.png",
    finger: "assets/299d7615-df25-44a6-866c-3ff165164ff4.6053a.png",
    smallPill: "assets/7292cd16-d983-4eec-adf6-04a286c88c08.88661.png",
    blob: "assets/f78718b7-2c14-4181-89cc-97dab4970c34.ab0c5.jpg",
    playCard: "assets/51cb18a5-c9b6-4105-915f-34e2d8fd9350.53b3b.png",
    tutorial: "assets/1e0d8f916.13d07.png",
    failUi: "assets/13627352a.28528.png",
    settingsUi: "assets/13466a668.c572d.png",
    modeUi: "assets/1152fb2e6.02518.png",
  };

  const SLICES = {
    ready: ["titleUi", 307, 27, 276, 73],
    cancelReady: ["titleUi", 307, 106, 276, 72],
    startChallenge: ["titleUi", 584, 106, 275, 72],
    doubleChallenge: ["titleUi", 121, 197, 493, 139],
    snowBase: ["titleUi", 0, 283, 721, 214],
    guideDrag: ["guideUi", 120, 211, 99, 554],
    guideClick: ["guideUi", 237, 212, 89, 307],
    passedTag: ["guideUi", 609, 472, 297, 78],
    pause: ["guideUi", 0, 786, 76, 76],
    good: ["goodPack", 0, 151, 316, 153],
    perfect: ["goodPack", 0, 305, 394, 160],
    crown: ["goodPack", 398, 345, 230, 122],
    failRetry: ["failUi", 648, 933, 220, 61],
    failPanel: ["failUi", 1, 1, 499, 755],
    resultNew: ["resultBar", 746, 0, 309, 151],
  };

  const images = {};
  const wallBuffer = document.createElement("canvas");
  const wallCtx = wallBuffer.getContext("2d");

  const LIMB_LENGTHS = {
    torso: 188,
    head: 48,
    shoulderWidth: 132,
    hipWidth: 100,
    upperArm: 120,
    foreArm: 108,
    upperLeg: 136,
    lowerLeg: 128,
  };

  const READY_POSE = {
    torso: -90,
    lUpperArm: 145,
    lLowerArm: 108,
    rUpperArm: 35,
    rLowerArm: 72,
    lUpperLeg: 124,
    lLowerLeg: 86,
    rUpperLeg: 56,
    rLowerLeg: 94,
  };

  const POSE_PRESETS = [
    {
      name: "大字开合",
      tip: "手脚打开，尽量撑满洞口",
      pose: {
        torso: -90,
        lUpperArm: -164,
        lLowerArm: -172,
        rUpperArm: -16,
        rLowerArm: -8,
        lUpperLeg: 150,
        lLowerLeg: 144,
        rUpperLeg: 30,
        rLowerLeg: 36,
      },
    },
    {
      name: "滑雪抬膝",
      tip: "一条腿抬高，另一条腿稳住",
      pose: {
        torso: -92,
        lUpperArm: 166,
        lLowerArm: 120,
        rUpperArm: -52,
        rLowerArm: -70,
        lUpperLeg: 112,
        lLowerLeg: 88,
        rUpperLeg: -26,
        rLowerLeg: 32,
      },
    },
    {
      name: "空中侧滑",
      tip: "身体倾斜，双腿向右收",
      pose: {
        torso: -112,
        lUpperArm: 154,
        lLowerArm: 176,
        rUpperArm: -22,
        rLowerArm: 4,
        lUpperLeg: -154,
        lLowerLeg: -126,
        rUpperLeg: -24,
        rLowerLeg: 34,
      },
    },
    {
      name: "单脚敬礼",
      tip: "双手靠近头部，左腿弯起",
      pose: {
        torso: -86,
        lUpperArm: -138,
        lLowerArm: -78,
        rUpperArm: -38,
        rLowerArm: -102,
        lUpperLeg: -164,
        lLowerLeg: 112,
        rUpperLeg: 78,
        rLowerLeg: 94,
      },
    },
    {
      name: "弓步冲线",
      tip: "右手前伸，腿部拉成弓步",
      pose: {
        torso: -78,
        lUpperArm: 168,
        lLowerArm: 146,
        rUpperArm: -8,
        rLowerArm: 4,
        lUpperLeg: 164,
        lLowerLeg: 122,
        rUpperLeg: 24,
        rLowerLeg: 72,
      },
    },
    {
      name: "猫腰躲雪",
      tip: "身体压低，两手向前探",
      pose: {
        torso: -62,
        lUpperArm: 178,
        lLowerArm: -174,
        rUpperArm: 2,
        rLowerArm: -4,
        lUpperLeg: 132,
        lLowerLeg: 78,
        rUpperLeg: 46,
        rLowerLeg: 96,
      },
    },
    {
      name: "反向风车",
      tip: "左手上举，右腿外摆",
      pose: {
        torso: -98,
        lUpperArm: -118,
        lLowerArm: -142,
        rUpperArm: 44,
        rLowerArm: 96,
        lUpperLeg: 96,
        lLowerLeg: 112,
        rUpperLeg: -18,
        rLowerLeg: -8,
      },
    },
    {
      name: "冰面芭蕾",
      tip: "一手横伸，单腿向外踢",
      pose: {
        torso: -104,
        lUpperArm: -176,
        lLowerArm: 172,
        rUpperArm: 28,
        rLowerArm: 42,
        lUpperLeg: 112,
        lLowerLeg: 92,
        rUpperLeg: -4,
        rLowerLeg: -18,
      },
    },
    {
      name: "双拳防守",
      tip: "拳头收紧，膝盖一高一低",
      pose: {
        torso: -92,
        lUpperArm: -132,
        lLowerArm: -34,
        rUpperArm: -48,
        rLowerArm: -146,
        lUpperLeg: 136,
        lLowerLeg: 82,
        rUpperLeg: -54,
        rLowerLeg: 56,
      },
    },
    {
      name: "雪道飞踢",
      tip: "右腿踢平，双手保持平衡",
      pose: {
        torso: -84,
        lUpperArm: 176,
        lLowerArm: -168,
        rUpperArm: -18,
        rLowerArm: -36,
        lUpperLeg: 104,
        lLowerLeg: 92,
        rUpperLeg: -8,
        rLowerLeg: -2,
      },
    },
  ];

  const CHARACTERS = [
    {
      id: "male",
      name: "男生",
      short: "稳连击",
      desc: "连击分稳定",
      main: "#60d783",
      dark: "#243b8c",
      accent: "#69dcff",
      pants: "#314a9f",
      skin: "#ffc0a8",
      hair: "#6d3a26",
      tolerance: 0,
      timerBonus: 0,
      comboBonus: 1,
      preview: "riderParts",
      renderer: "maleSprite",
    },
    {
      id: "female",
      name: "女生",
      short: "加宽容",
      desc: "判定宽容 +5",
      main: "#f48aa7",
      dark: "#6c56c8",
      accent: "#ffdc6b",
      pants: "#1d76c7",
      skin: "#ffc0a8",
      hair: "#8b4228",
      tolerance: 5,
      timerBonus: 0,
      comboBonus: 1,
      preview: "clothes",
    },
  ];

  const SELECT_AVATARS = ["selectRiderAvatar", "selectPilotAvatar"];
  const POSE_KEYS = Object.keys(READY_POSE);

  const app = {
    screen: "loading",
    loadingProgress: 0,
    buttons: [],
    selectedCharacter: 0,
    muted: false,
    audio: null,
    lastTime: performance.now(),
    particles: [],
    floatingTexts: [],
    toast: "",
    toastTimer: 0,
    cloudMap: null,
    cloudMapLoading: false,
    cloudMapStatus: "local",
    tutorialSeen: readStorage("wallRushTutorial") === "1",
    best: Number(readStorage("wallRushBest") || 0),
    pointer: {
      down: false,
      drag: null,
      activeButton: null,
      lastPoint: null,
    },
    stage: null,
  };

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      // Storage is optional in private browsing and embedded webviews.
    }
  }

  function setToast(message, seconds = 1.8) {
    app.toast = message;
    app.toastTimer = seconds;
  }

  function loadAssets() {
    const entries = Object.entries(ASSETS);
    let done = 0;
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.onload = () => {
        done += 1;
        images[key] = img;
        app.loadingProgress = done / entries.length;
        if (done === entries.length) {
          setTimeout(() => {
            app.screen = "start";
          }, 250);
        }
      };
      img.onerror = () => {
        done += 1;
        app.loadingProgress = done / entries.length;
        if (done === entries.length) {
          app.screen = "start";
        }
      };
      img.src = src;
    });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(canvas.width / DESIGN_W, 0, 0, canvas.height / DESIGN_H, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  function loop(now) {
    const dt = Math.min((now - app.lastTime) / 1000, 0.04);
    app.lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    if (app.toastTimer > 0) app.toastTimer -= dt;
    updateParticles(dt);
    updateFloatingTexts(dt);
    if (app.screen === "game" && app.stage) updateGame(dt);
  }

  function updateGame(dt) {
    const stage = app.stage;
    if (stage.paused) return;
    if (stage.phase === "delay") {
      stage.intervalLeft -= dt;
      stage.wallPulse += dt;
      if (stage.intervalLeft <= 0) {
        createRound();
      }
      return;
    }

    if (stage.phase === "prep") {
      stage.prepLeft = Math.max(0, stage.prepLeft - dt);
      stage.wallProgress = clamp(1 - stage.prepLeft / stage.prepTotal, 0, 1);
      const tick = Math.ceil(stage.prepLeft);
      if (stage.prepLeft <= 3.1 && tick !== stage.lastTick) {
        stage.lastTick = tick;
        playSound("tick");
      }
      if (stage.prepLeft <= 0) {
        stage.wallProgress = 1;
        playSound("rush");
        resolveRound();
      }
      return;
    }

    if (stage.phase === "charge") {
      stage.prepLeft = Math.max(0, stage.prepLeft - dt);
      stage.wallProgress = Math.min(1, stage.wallProgress + dt * stage.chargeSpeed);
      if (stage.wallProgress >= 1) {
        resolveRound();
      }
      return;
    }

    if (stage.phase === "pass") {
      stage.effectTime -= dt;
      if (stage.effectTime <= 0) {
        if (stage.level > TOTAL_WALLS) {
          finishChallenge();
        } else {
          stage.phase = "delay";
          stage.intervalLeft = random(0.9, 1.75);
          stage.wallPulse = 0;
        }
      }
      return;
    }

    if (stage.phase === "failImpact") {
      stage.effectTime -= dt;
      if (stage.effectTime <= 0) {
        app.screen = "fail";
      }
    }
  }

  function updateParticles(dt) {
    for (let i = app.particles.length - 1; i >= 0; i -= 1) {
      const p = app.particles[i];
      p.life -= dt;
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.spin += p.spinSpeed * dt;
      if (p.life <= 0) app.particles.splice(i, 1);
    }
  }

  function updateFloatingTexts(dt) {
    for (let i = app.floatingTexts.length - 1; i >= 0; i -= 1) {
      const t = app.floatingTexts[i];
      t.life -= dt;
      t.y -= 68 * dt;
      if (t.life <= 0) app.floatingTexts.splice(i, 1);
    }
  }

  function createStage() {
    app.stage = {
      level: 1,
      phase: "delay",
      intervalLeft: 0.35,
      wallPulse: 0,
      prepLeft: 0,
      prepTotal: 0,
      wallProgress: 0,
      chargeSpeed: 1.15,
      currentPose: clonePose(READY_POSE),
      targetPose: clonePose(READY_POSE),
      preset: POSE_PRESETS[0],
      mapSettings: getMapSettings(),
      threshold: 72,
      lastScore: 0,
      bestRound: 0,
      combo: 0,
      scoreTotal: 0,
      roundScores: [],
      misses: [],
      lastTick: 0,
      effectTime: 0,
      worstLabel: "",
      showGuide: !app.tutorialSeen,
      paused: false,
    };
  }

  function createRound() {
    const stage = app.stage;
    const character = CHARACTERS[app.selectedCharacter];
    stage.phase = "prep";
    stage.wallProgress = 0;
    stage.preset = generatePreset(stage.level, stage.mapSettings);
    stage.targetPose = stage.preset.pose;
    stage.currentPose = settlePose(stage.currentPose, stage.level);
    stage.threshold = getLevelThreshold(stage.level, character, stage.mapSettings);
    stage.prepTotal = getLevelPrepTotal(stage.level, character, stage.mapSettings);
    stage.prepLeft = stage.prepTotal;
    stage.chargeSpeed = getLevelChargeSpeed(stage.level, stage.mapSettings);
    stage.lastTick = 0;
  }

  function settlePose(lastPose, level) {
    const mix = level <= 2 ? 0.26 : 0.14;
    const next = clonePose(READY_POSE);
    Object.keys(next).forEach((key) => {
      next[key] = normalizeAngle(lerpAngle(next[key], lastPose[key], mix));
    });
    return constrainPose(next);
  }

  function generatePreset(level, mapSettings = getMapSettings()) {
    const levelConfig = getLevelConfig(level, mapSettings);
    const presets = mapSettings.posePresets && mapSettings.posePresets.length ? mapSettings.posePresets : POSE_PRESETS;
    const base =
      getPresetById(levelConfig && levelConfig.presetId, presets) || presets[Math.floor(Math.random() * presets.length)];
    let pose = clonePose(base.pose);
    const mirrorChance = numberOr(mapSettings.mirrorChance, 0.38);
    const shouldMirror = typeof (levelConfig && levelConfig.mirror) === "boolean" ? levelConfig.mirror : Math.random() < mirrorChance;
    if (shouldMirror) pose = mirrorPose(pose);
    const variance = numberOr(
      levelConfig && levelConfig.variance,
      Math.min(numberOr(mapSettings.varianceMax, 11), numberOr(mapSettings.varianceBase, 4) + level * numberOr(mapSettings.varianceStep, 0.8))
    );
    Object.keys(pose).forEach((key) => {
      pose[key] = normalizeAngle(pose[key] + random(-variance, variance));
    });
    pose = constrainPose(pose);
    return {
      name: shouldMirror ? `${base.name}·反向` : base.name,
      tip: base.tip,
      pose,
    };
  }

  function getMapSettings() {
    const map = app.cloudMap || {};
    return {
      ...(map.settings || {}),
      posePresets: normalizePosePresets(map.posePresets),
      levels: Array.isArray(map.levels) ? map.levels : [],
    };
  }

  function normalizePosePresets(presets) {
    if (!Array.isArray(presets)) return [];
    return presets
      .map((preset) => {
        if (!preset || !isValidPose(preset.pose)) return null;
        return {
          id: String(preset.id || preset.name || ""),
          name: String(preset.name || preset.id || "云端姿势"),
          tip: String(preset.tip || ""),
          pose: constrainPose(clonePose(preset.pose)),
        };
      })
      .filter(Boolean);
  }

  function isValidPose(pose) {
    return Boolean(pose && POSE_KEYS.every((key) => Number.isFinite(Number(pose[key]))));
  }

  function getLevelConfig(level, mapSettings) {
    const levels = mapSettings.levels || [];
    return levels[level - 1] || levels.find((item) => Number(item && item.level) === level) || null;
  }

  function getPresetById(id, presets) {
    if (!id) return null;
    return presets.find((preset) => preset.id === id || preset.name === id) || null;
  }

  function getLevelThreshold() {
    return MISS_SCORE_THRESHOLD;
  }

  function getLevelPrepTotal() {
    return 5;
  }

  function getLevelChargeSpeed(level, mapSettings) {
    const levelConfig = getLevelConfig(level, mapSettings);
    const base = numberOr(levelConfig && levelConfig.chargeSpeed, numberOr(mapSettings.chargeBase, 1.08) + level * numberOr(mapSettings.chargeStep, 0.075));
    return Math.min(numberOr(mapSettings.chargeMax, 1.75), base);
  }

  function numberOr(value, fallback) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function mirrorPose(pose) {
    return {
      torso: normalizeAngle(180 - pose.torso),
      lUpperArm: normalizeAngle(180 - pose.rUpperArm),
      lLowerArm: normalizeAngle(180 - pose.rLowerArm),
      rUpperArm: normalizeAngle(180 - pose.lUpperArm),
      rLowerArm: normalizeAngle(180 - pose.lLowerArm),
      lUpperLeg: normalizeAngle(180 - pose.rUpperLeg),
      lLowerLeg: normalizeAngle(180 - pose.rLowerLeg),
      rUpperLeg: normalizeAngle(180 - pose.lUpperLeg),
      rLowerLeg: normalizeAngle(180 - pose.lLowerLeg),
    };
  }

  function constrainPose(pose) {
    pose.torso = clamp(normalizeAngle(pose.torso), -124, -56);
    clampRelativeAngle(pose, "lUpperArm", "torso", -152, 152);
    clampRelativeAngle(pose, "rUpperArm", "torso", -152, 152);
    clampRelativeAngle(pose, "lUpperLeg", "torso", -154, 154);
    clampRelativeAngle(pose, "rUpperLeg", "torso", -154, 154);
    clampRelativeAngle(pose, "lLowerArm", "lUpperArm", -158, 158);
    clampRelativeAngle(pose, "rLowerArm", "rUpperArm", -158, 158);
    clampRelativeAngle(pose, "lLowerLeg", "lUpperLeg", -152, 152);
    clampRelativeAngle(pose, "rLowerLeg", "rUpperLeg", -152, 152);
    return pose;
  }

  function clampRelativeAngle(pose, key, baseKey, min, max) {
    const relative = clamp(normalizeAngle(pose[key] - pose[baseKey]), min, max);
    pose[key] = normalizeAngle(pose[baseKey] + relative);
  }

  function startCharge() {
    const stage = app.stage;
    if (!stage || stage.phase !== "prep") return;
    stage.phase = "charge";
    const remaining = Math.max(0.001, 1 - stage.wallProgress);
    const rushTime = Math.max(0.38, Math.min(1.1, stage.prepLeft * 0.35));
    stage.chargeSpeed = remaining / rushTime;
    playSound("rush");
    burst(375, 1310, ["#b9f4ff", "#4dd3ff", "#ffffff"], 28, 0.55, 180);
  }

  function resolveRound() {
    const stage = app.stage;
    const result = scorePose(stage.currentPose, stage.targetPose);
    stage.lastScore = result.score;
    stage.bestRound = Math.max(stage.bestRound, result.score);
    stage.worstLabel = result.worstLabel;
    stage.roundScores.push(result.score);
    const pass = result.score >= stage.threshold;

    if (pass) {
      stage.phase = "pass";
      stage.effectTime = result.score >= 92 ? 1.35 : 1.05;
      stage.combo += 1;
      const character = CHARACTERS[app.selectedCharacter];
      const comboScore = Math.round(result.score * (1 + stage.combo * 0.025) * character.comboBonus);
      stage.scoreTotal += comboScore;
      stage.level += 1;
      app.best = Math.max(app.best, stage.scoreTotal);
      writeStorage("wallRushBest", String(app.best));
      playSound(result.score >= 92 ? "perfect" : "success");
      vibrate(35);
      burst(375, 725, ["#fff46a", "#8df8ff", "#ffffff", "#7ded67"], 74, 1.1, 360);
      app.floatingTexts.push({
        text: result.score >= 92 ? "PERFECT" : "GOOD",
        sub: `匹配 ${Math.round(result.score)}%  连击 x${stage.combo}`,
        x: 375,
        y: 512,
        life: 1.2,
        color: result.score >= 92 ? "#fff15f" : "#7df7ff",
      });
    } else {
      stage.phase = "failImpact";
      stage.effectTime = 0.95;
      stage.misses.push({
        level: stage.level,
        score: result.score,
        worstLabel: result.worstLabel,
      });
      stage.combo = 0;
      playSound("fail");
      vibrate([80, 50, 100]);
      burst(375, 755, ["#e9f9ff", "#b8d8ff", "#8fb5ff"], 58, 0.8, 260);
      app.floatingTexts.push({
        text: "撞墙啦",
        sub: `${result.worstLabel} 偏差最大`,
        x: 375,
        y: 540,
        life: 1.0,
        color: "#ff846d",
      });
    }
  }

  function finishChallenge() {
    app.screen = "success";
    playSound("win");
    burst(375, 720, ["#fff46a", "#ff8a65", "#8df8ff", "#ffffff"], 120, 1.4, 440);
    vibrate([45, 40, 45]);
  }

  function scorePose(current, target) {
    const weights = {
      torso: 1.35,
      lUpperArm: 1,
      lLowerArm: 0.85,
      rUpperArm: 1,
      rLowerArm: 0.85,
      lUpperLeg: 1.15,
      lLowerLeg: 1,
      rUpperLeg: 1.15,
      rLowerLeg: 1,
    };
    const labels = {
      torso: "身体倾斜",
      lUpperArm: "左上臂",
      lLowerArm: "左小臂",
      rUpperArm: "右上臂",
      rLowerArm: "右小臂",
      lUpperLeg: "左大腿",
      lLowerLeg: "左小腿",
      rUpperLeg: "右大腿",
      rLowerLeg: "右小腿",
    };
    let weightedError = 0;
    let totalWeight = 0;
    let worst = { key: "torso", diff: 0 };
    Object.keys(weights).forEach((key) => {
      const diff = Math.min(130, angleDiff(current[key], target[key]));
      weightedError += diff * weights[key];
      totalWeight += weights[key];
      if (diff > worst.diff) worst = { key, diff };
    });

    const avgError = weightedError / totalWeight;
    const score = clamp(100 - avgError * 0.86, 0, 100);
    return {
      score,
      worstLabel: labels[worst.key],
      worstDiff: worst.diff,
    };
  }

  async function loadCloudMap() {
    if (!window.WallRushCloudMap || app.cloudMapLoading) return app.cloudMap;
    app.cloudMapLoading = true;
    try {
      const map = await window.WallRushCloudMap.load();
      const status = window.WallRushCloudMap.getStatus();
      app.cloudMapStatus = status.source;
      app.cloudMap = map;
      if (map && status.source === "cloud") setToast("云端地图已加载", 1.2);
      if (map && status.source === "cache") setToast("使用缓存地图", 1.2);
      return map;
    } finally {
      app.cloudMapLoading = false;
    }
  }

  async function beginGame() {
    unlockAudio();
    if (window.WallRushCloudMap && !app.cloudMap && !app.cloudMapLoading) {
      setToast("正在读取地图", 1.2);
      await loadCloudMap();
    }
    createStage();
    app.particles.length = 0;
    app.floatingTexts.length = 0;
    app.screen = "game";
    playSound("start");
  }

  function goSelect() {
    unlockAudio();
    app.screen = "select";
    playSound("click");
  }

  function goStart() {
    app.screen = "start";
    playSound("click");
  }

  function selectCharacter(index) {
    if (!CHARACTERS[index]) return;
    app.selectedCharacter = index;
    playSound("click");
  }

  function retry() {
    beginGame();
  }

  function togglePause() {
    if (app.screen !== "game" || !app.stage) return;
    app.stage.paused = !app.stage.paused;
    app.pointer.drag = null;
    app.pointer.activeButton = null;
    playSound("click");
  }

  function showTutorial() {
    app.screen = "tutorial";
    playSound("click");
  }

  function draw() {
    app.buttons = [];
    ctx.clearRect(0, 0, DESIGN_W, DESIGN_H);
    if (app.screen === "loading") drawLoading();
    if (app.screen === "start") drawStart();
    if (app.screen === "select") drawSelect();
    if (app.screen === "tutorial") drawTutorial();
    if (app.screen === "game") drawGame();
    if (app.screen === "success") drawSuccessScreen();
    if (app.screen === "fail") drawFailScreen();
    drawParticles();
    drawFloatingTexts();
    drawToast();
  }

  function drawLoading() {
    drawImageCover(images.loading, 0, 0, DESIGN_W, DESIGN_H, () => {
      verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#24a9ee", "#8db1ff");
    });
    hideLoadingPercent();
    drawLoadingProgress(app.loadingProgress);
  }

  function hideLoadingPercent() {
    ctx.save();
    const fade = ctx.createRadialGradient(375, 1050, 16, 375, 1050, 96);
    fade.addColorStop(0, "rgba(42, 77, 199, 0.99)");
    fade.addColorStop(0.62, "rgba(48, 84, 207, 0.94)");
    fade.addColorStop(1, "rgba(47, 86, 209, 0)");
    ctx.fillStyle = fade;
    ctx.beginPath();
    ctx.ellipse(375, 1050, 112, 66, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLoadingProgress(pct) {
    const fillW = 296 * clamp(pct, 0, 1);
    if (fillW <= 0) return;
    ctx.save();
    roundRect(ctx, 227, 997, fillW, 8, 4);
    const grad = ctx.createLinearGradient(227, 997, 523, 997);
    grad.addColorStop(0, "#1ce8ff");
    grad.addColorStop(1, "#ffffff");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function drawStart() {
    drawImageCover(images.startPoster || images.track, 0, 0, DESIGN_W, DESIGN_H, () => {
      verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#28acee", "#4c74da");
    });
    drawHomeCharacter();
    imageButton("start", 139, 1370, 472, 133, "", goSelect, "enterButton");
    iconButton("mute", 636, 52, 72, "", () => {
      app.muted = !app.muted;
      playSound("click");
    });
  }

  function drawHomeCharacter() {
    const img = images.homeCharacter;
    if (!img) return;
    const t = performance.now() / 1000;
    const sway = Math.sin(t * 1.75);
    const frame = containRect(img, 18 + sway * 8, 570 + Math.cos(t * 1.75) * 4, 714, 792);
    const cropTop = img.height * 0.04;
    const pivotX = frame.x + frame.w * 0.5;
    const pivotY = frame.y + frame.h * 0.58;
    drawHomeCharacterLayer(img, frame, pivotX, pivotY, sway * 0.035, cropTop);
    drawHomeArmLayer(img, frame, { x: 0.02, y: 0.04, w: 0.42, h: 0.32 }, { x: 0.35, y: 0.26 }, -sway * 0.055, cropTop);
    drawHomeArmLayer(img, frame, { x: 0.58, y: 0.00, w: 0.40, h: 0.34 }, { x: 0.66, y: 0.24 }, sway * 0.055, cropTop);
  }

  function drawHomeCharacterLayer(img, frame, pivotX, pivotY, angle, cropTop) {
    const sourceH = img.height - cropTop;
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle);
    ctx.drawImage(img, 0, cropTop, img.width, sourceH, frame.x - pivotX, frame.y - pivotY, frame.w, frame.h);
    ctx.restore();
  }

  function drawHomeArmLayer(img, frame, clip, pivot, angle, cropTop) {
    const sourceH = img.height - cropTop;
    ctx.save();
    ctx.beginPath();
    ctx.rect(frame.x + frame.w * clip.x, frame.y + frame.h * clip.y, frame.w * clip.w, frame.h * clip.h);
    ctx.clip();
    ctx.translate(frame.x + frame.w * pivot.x, frame.y + frame.h * pivot.y);
    ctx.rotate(angle);
    ctx.drawImage(img, 0, cropTop, img.width, sourceH, -frame.w * pivot.x, -frame.h * pivot.y, frame.w, frame.h);
    ctx.restore();
  }

  function drawSelect() {
    drawImageCover(images.track, 0, 0, DESIGN_W, DESIGN_H, () => verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#5cc8ff", "#5b8ded"));
    ctx.fillStyle = "rgba(5, 48, 141, 0.18)";
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    drawText("选择角色", 375, 250, 52, "#ffffff", "center", 900, "#1b70d8", 9);
    drawText("男生稳连击，女生加宽容度", 375, 302, 25, "#dcfbff", "center", 800);

    const cards = [
      { index: 0, x: 50, y: 390 },
      { index: 1, x: 390, y: 390 },
    ];
    cards.forEach((card) => characterCard(card.index, card.x, card.y, 310, 640));

    drawImageContain(images.selectConfirm, 214, 1128, 322, 112);
    if (!images.selectConfirm) {
      drawIceCard(214, 1140, 322, 90, 45, "#168de8");
      drawText("确认", 375, 1185, 36, "#ffffff", "center", 900);
    }
    app.buttons.push({ id: "confirm", x: 214, y: 1128, w: 322, h: 112, onClick: beginGame });
    imageButton("back", 30, 52, 176, 70, "", goStart, "backButton");
  }

  function characterCard(index, x, y, w, h) {
    const character = CHARACTERS[index];
    const selected = app.selectedCharacter === index;
    const avatarKey = SELECT_AVATARS[index];
    const avatar = avatarKey ? images[avatarKey] : null;

    ctx.save();
    ctx.shadowColor = selected ? "rgba(255, 198, 58, 0.42)" : "rgba(16, 59, 145, 0.20)";
    ctx.shadowBlur = selected ? 24 : 14;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, x, y, w, h, 26);
    ctx.fillStyle = selected ? "#fff2bf" : "rgba(236, 253, 255, 0.94)";
    ctx.fill();
    ctx.lineWidth = selected ? 8 : 4;
    ctx.strokeStyle = selected ? "#ffbd36" : "#5ee3ff";
    ctx.stroke();
    ctx.restore();

    ctx.save();
    roundRect(ctx, x + 22, y + 26, 130, 130, 22);
    ctx.clip();
    verticalGradient(x + 22, y + 26, 130, 130, "#fff6d7", "#93e5ff");
    if (avatar) {
      drawImageCropContain(avatar, 18, 24, 150, 150, x + 22, y + 26, 130, 130);
    } else {
      drawPoseFigure(READY_POSE, { x: x + 81, y: y + 161 }, 0.24, { character, handles: false });
    }
    ctx.restore();

    drawText(character.name, x + 168, y + 58, 36, selected ? "#155ec9" : "#1976d2", "left", 900);
    ctx.save();
    roundRect(ctx, x + 160, y + 90, 112, 40, 20);
    ctx.fillStyle = selected ? "#21c7ff" : "#62aef0";
    ctx.fill();
    ctx.restore();
    drawText(character.short, x + 216, y + 111, 22, "#ffffff", "center", 900);
    drawText(character.desc, x + w / 2, y + 196, 26, "#367fd1", "center", 800);

    ctx.save();
    roundRect(ctx, x + 28, y + 234, w - 56, 300, 24);
    ctx.clip();
    verticalGradient(x + 28, y + 234, w - 56, 300, selected ? "#fff3bd" : "#e1fbff", selected ? "#9defff" : "#a9e6ff");
    drawPoseFigure(READY_POSE, { x: x + w / 2, y: y + 498 }, 0.42, { character, handles: false });
    ctx.restore();

    ctx.save();
    roundRect(ctx, x + 28, y + h - 88, w - 56, 62, 20);
    ctx.fillStyle = selected ? "#ffe276" : "rgba(139, 221, 255, 0.42)";
    ctx.fill();
    ctx.restore();
    drawText(selected ? "已选择" : "点击选择", x + w / 2, y + h - 56, 26, selected ? "#9c5b00" : "#2178c8", "center", 900);

    if (selected) drawCheck(x + w - 34, y + 34, 26);

    app.buttons.push({
      id: `char-${index}`,
      x,
      y,
      w,
      h,
      onClick: () => selectCharacter(index),
    });
  }

  function drawImageCropContain(img, sx, sy, sw, sh, x, y, w, h) {
    if (!img) return;
    const scale = Math.min(w / sw, h / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.drawImage(img, sx, sy, sw, sh, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }

  function drawTutorial() {
    drawImageCover(images.blueBg || images.track, 0, 0, DESIGN_W, DESIGN_H, () => verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#35baf4", "#87a4f4"));
    ctx.fillStyle = "rgba(12, 60, 160, 0.18)";
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    drawImageContain(images.guideUi, -60, 52, 870, 870);
    drawTargetWall(375, 510, 0.42, POSE_PRESETS[1].pose, 0.25);
    drawPoseFigure(POSE_PRESETS[1].pose, { x: 375, y: 990 }, 0.75, {
      character: CHARACTERS[app.selectedCharacter],
      handles: true,
      ghost: false,
    });
    drawImageContain(images.finger, 522, 892, 58, 58);
    spriteButton("tutorialStart", SLICES.startChallenge, 214, 1288, 322, 84, () => {
      app.tutorialSeen = true;
      writeStorage("wallRushTutorial", "1");
      beginGame();
    });
    spriteButton("tutorialBack", SLICES.cancelReady, 214, 1400, 322, 84, goStart);
  }

  function drawGame() {
    const stage = app.stage;
    const character = CHARACTERS[app.selectedCharacter];
    const cameraProgress = getSceneCameraProgress(stage);
    drawGameBackground(cameraProgress);

    drawGameHud(stage);

    if (stage.paused) {
      if (stage.phase !== "delay") {
        const progress = getWallProgress(stage);
        const wall = getWallMotion(progress);
        ctx.save();
        applyChargeCamera(wall.progress);
        drawTargetWall(375, wall.y, wall.scale, stage.targetPose, wall.progress, stage.currentPose);
        drawPoseFigure(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE, { character, handles: false });
        ctx.restore();
      }
      drawPauseOverlay();
      return;
    }

    if (stage.phase === "delay") {
      drawPoseFigure(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE, { character, handles: false });
      drawWallControl(false);
      drawDelay(stage);
      return;
    }

    if (stage.phase === "prep") {
      const progress = getWallProgress(stage);
      const wall = getWallMotion(progress);
      ctx.save();
      applyChargeCamera(wall.progress);
      drawTargetWall(375, wall.y, wall.scale, stage.targetPose, wall.progress, stage.currentPose);
      drawPoseFigure(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE, {
        character,
        handles: true,
      });
      ctx.restore();
      drawMatchMeter(stage);
      drawPrepControls(stage);
      if (stage.showGuide) drawInGameGuide();
      return;
    }

    if (stage.phase === "charge") {
      const progress = getWallProgress(stage);
      const wall = getWallMotion(progress);
      ctx.save();
      applyChargeCamera(wall.progress);
      drawTargetWall(375, wall.y, wall.scale, stage.targetPose, wall.progress, stage.currentPose);
      drawPoseFigure(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE, { character, handles: false });
      drawRushLines(wall.progress);
      ctx.restore();
      drawWallControl(false);
      return;
    }

    if (stage.phase === "pass") {
      ctx.save();
      applyChargeCamera(1);
      drawTargetWall(375, WALL_FINAL_Y, WALL_FINAL_SCALE, stage.targetPose, 1, stage.currentPose);
      drawPoseFigure(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE, { character, handles: false });
      ctx.restore();
      drawWallControl(false);
      drawSuccessBurst(stage);
      drawNextInfo(stage);
      return;
    }

    if (stage.phase === "failImpact") {
      ctx.save();
      applyChargeCamera(1);
      drawPoseFigure(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE, { character, handles: false });
      drawTargetWall(375, WALL_FINAL_Y, WALL_FINAL_SCALE, stage.targetPose, 1, stage.currentPose);
      ctx.restore();
      drawWallControl(false);
      drawCrackOverlay();
      return;
    }
  }

  function getSceneCameraProgress(stage) {
    if (!stage || stage.phase === "delay") return 0;
    if (stage.phase === "pass" || stage.phase === "failImpact") return 1;
    return getWallMotion(getWallProgress(stage)).progress;
  }

  function drawGameBackground(progress) {
    ctx.save();
    applyChargeCamera(progress);
    drawImageCover(images.track, 0, 0, DESIGN_W, DESIGN_H, () => verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#37b9f5", "#397bd6"));
    ctx.fillStyle = "rgba(12, 64, 151, 0.08)";
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    ctx.restore();
  }

  function drawGameHud(stage) {
    const progress = clamp((stage.level - 1) / TOTAL_WALLS, 0, 1);
    iconButton("pause", 36, 70, 64, "", togglePause, "pause");
    iconButton("mute", 650, 70, 64, "", () => {
      app.muted = !app.muted;
      playSound("click");
    }, "sound");
    const passedX = (DESIGN_W - 342) / 2;
    drawImageContain(images.passedTag, passedX, 124, 342, 102);
    if (!images.passedTag) drawSprite(SLICES.passedTag, (DESIGN_W - 270) / 2, 138, 270, 72);
    drawText(`${Math.min(stage.level - 1, TOTAL_WALLS)}`, passedX + 276, 170, 34, "#ffffff", "center", 900);
    drawProgressBar(98, 226, 554, 12, progress, "#27e9ff", "#1a61c5");
    drawCountdown(stage);
  }

  function drawCountdown(stage) {
    if (stage.phase !== "prep" && stage.phase !== "charge") return;
    const timePct = clamp(stage.prepLeft / stage.prepTotal, 0, 1);
    drawIceCard(188, 252, 374, 62, 20, "rgba(234, 253, 255, 0.80)");
    drawText(stage.prepLeft.toFixed(1), 375, 278, 30, timePct < 0.25 ? "#f06d52" : "#1764c9", "center", 900);
    drawProgressBar(222, 300, 306, 10, timePct, timePct < 0.28 ? "#ff756a" : "#34ecff", "#1557bd");
  }

  function drawDelay(stage) {
    const bob = Math.sin(stage.wallPulse * 5) * 10;
    drawImageContain(images.sign, 106, 398 + bob, 538, 238);
  }

  function drawMatchMeter(stage) {
    const result = scorePose(stage.currentPose, stage.targetPose);
    const pct = result.score / 100;
    const isMiss = result.score < stage.threshold;
    drawIceCard(104, 1434, 542, 82, 24, "rgba(234, 253, 255, 0.82)");
    drawText(`${Math.round(result.score)}%`, 375, 1456, 29, isMiss ? "#f04f43" : "#11a36b", "center", 900);
    drawProgressBar(158, 1494, 434, 18, pct, isMiss ? "#ff4d4f" : "#6cf26c", "#2772cc");
  }

  function drawPrepControls(stage) {
    drawWallControl(true);
  }

  function drawWallControl(active) {
    const x = 628;
    const y = 742;
    const w = 86;
    const h = 100;
    drawImageContain(images[active ? "controlUp" : "controlDown"], x, y, w, h);
    if (!images.controlUp || !images.controlDown) {
      ctx.save();
      ctx.globalAlpha = active ? 0.92 : 0.55;
      ctx.fillStyle = "#12345d";
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (active) app.buttons.push({ id: "rush", x: x - 8, y: y - 8, w: w + 16, h: h + 16, onClick: startCharge });
  }

  function applyChargeCamera(progress) {
    const zoom = 1 + progress * 0.14;
    ctx.translate(DESIGN_W / 2, 1060);
    ctx.scale(zoom, zoom);
    ctx.translate(-DESIGN_W / 2, -1060);
  }

  function getWallProgress(stage) {
    return clamp(stage.wallProgress, 0, 1);
  }

  function getWallMotion(progress) {
    const eased = easeInOutSine(clamp(progress, 0, 1));
    return {
      progress: eased,
      y: lerp(WALL_PREP_Y, WALL_FINAL_Y, eased),
      scale: lerp(WALL_PREP_SCALE, WALL_FINAL_SCALE, eased),
    };
  }

  function drawInGameGuide() {
    drawSprite(SLICES.guideDrag, 42, 930, 92, 510);
    drawSprite(SLICES.guideClick, 610, 1130, 82, 280);
    drawImageContain(images.finger, 548, 1030, 58, 58);
  }

  function drawRushLines(progress) {
    ctx.save();
    ctx.globalAlpha = progress * 0.65;
    ctx.strokeStyle = "#bdf6ff";
    ctx.lineWidth = 5;
    for (let i = 0; i < 9; i += 1) {
      const x = 88 + i * 70 + Math.sin(progress * 8 + i) * 8;
      ctx.beginPath();
      ctx.moveTo(x, 610 + i * 18);
      ctx.lineTo(x - 48, 1260);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSuccessBurst(stage) {
    drawImageContain(images.greenFx, 218, 430, 314, 314);
    drawSprite(stage.lastScore >= 92 ? SLICES.perfect : SLICES.good, 162, 500, 426, 170);
    drawText(`${Math.round(stage.lastScore)}%`, 375, 704, 34, "#ffffff", "center", 900, "#1764c9", 5);
  }

  function drawNextInfo(stage) {
    if (stage.level <= TOTAL_WALLS) {
      drawImageContain(images.sign, 136, 1244, 478, 210);
    }
  }

  function drawCrackOverlay() {
    ctx.save();
    ctx.strokeStyle = "rgba(41, 68, 152, 0.85)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    const cracks = [
      [[350, 565], [324, 640], [362, 704], [328, 820]],
      [[390, 586], [456, 664], [430, 748], [500, 870]],
      [[310, 760], [220, 816], [162, 902]],
      [[430, 784], [526, 826], [596, 920]],
    ];
    cracks.forEach((line) => {
      ctx.beginPath();
      line.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      });
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawPauseOverlay() {
    ctx.save();
    ctx.fillStyle = "rgba(7, 31, 96, 0.58)";
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    ctx.restore();

    drawIceCard(92, 440, 566, 526, 34, "rgba(235, 253, 255, 0.94)");
    drawText("暂停中", 375, 540, 64, "#1764c9", "center", 900);
    const passed = Math.max(0, Math.min(app.stage.level - 1, TOTAL_WALLS));
    drawText(`已通过 ${passed}/${TOTAL_WALLS}  当前得分 ${app.stage.scoreTotal}`, 375, 610, 30, "#3486d6", "center", 800);
    pillButton("resume", 202, 690, 346, 78, "继续挑战", togglePause, "cyan");
    pillButton("restartPause", 202, 792, 346, 78, "重新开始", retry, "blue");
    pillButton("selectPause", 202, 894, 346, 78, "更换角色", goSelect, "light");
  }

  function drawSuccessScreen() {
    const stage = app.stage;
    drawImageCover(images.track, 0, 0, DESIGN_W, DESIGN_H, () => verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#34b9f3", "#587ae0"));
    ctx.fillStyle = "rgba(9, 49, 142, 0.18)";
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    drawSprite(SLICES.perfect, 96, 168, 558, 228);
    drawSprite(SLICES.crown, 255, 380, 240, 128);
    drawImageContain(images.snowPanel, 52, 520, 646, 520);
    const avg = getAverageScore(stage);
    drawText(`${stage.scoreTotal}`, 375, 675, 86, "#1764c9", "center", 900);
    drawText(`${TOTAL_WALLS}/${TOTAL_WALLS}`, 270, 808, 38, "#1764c9", "center", 900);
    drawText(`${Math.round(avg)}%`, 482, 808, 38, "#1764c9", "center", 900);
    drawText(`${app.best}`, 375, 920, 42, "#1764c9", "center", 900);
    drawImageContain(images.gift, 470, 760, 126, 76);
    drawResultStats(stage, 96, 968, 558);

    spriteButton("againWin", SLICES.failRetry, 206, 1134, 338, 94, retry);
  }

  function drawFailScreen() {
    const stage = app.stage;
    drawImageCover(images.trackAlt || images.track, 0, 0, DESIGN_W, DESIGN_H, () => verticalGradient(0, 0, DESIGN_W, DESIGN_H, "#39b8f1", "#517be0"));
    ctx.fillStyle = "rgba(12, 37, 106, 0.30)";
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    drawSprite(SLICES.failPanel, 78, 122, 594, 898);
    const passed = Math.max(0, stage.level - 1);
    drawText(`${passed}/${TOTAL_WALLS}`, 375, 500, 78, "#1764c9", "center", 900);
    drawText(`${Math.round(stage.lastScore)}%`, 375, 650, 58, "#f07855", "center", 900);
    drawTargetWall(375, 900, 0.48, stage.targetPose, 0);
    drawPoseFigure(stage.currentPose, { x: 375, y: 1000 }, 0.44, { character: CHARACTERS[app.selectedCharacter], handles: false });
    drawResultStats(stage, 100, 1032, 550);
    spriteButton("retryFail", SLICES.failRetry, 206, 1174, 338, 94, retry);
  }

  function drawResultStats(stage, x, y, w) {
    const avg = Math.round(getAverageScore(stage));
    const bestRound = Math.round(stage.bestRound || 0);
    const miss = stage.misses[stage.misses.length - 1];
    const missText = miss ? `${miss.worstLabel} ${Math.round(miss.score)}%` : "无失误";
    drawIceCard(x - 22, y - 28, w + 44, 142, 22, "rgba(239, 253, 255, 0.82)");
    statLine(x, y, w, "平均匹配", `${avg}%`);
    statLine(x, y + 46, w, "最佳单墙", `${bestRound}%`);
    statLine(x, y + 92, w, "关键失误", missText);
  }

  function statLine(x, y, w, label, value) {
    drawText(label, x, y, 26, "#2d83d4", "left", 800);
    drawText(value, x + w, y, 30, "#1764c9", "right", 900);
  }

  function getAverageScore(stage) {
    if (!stage || stage.roundScores.length === 0) return 0;
    const sum = stage.roundScores.reduce((acc, score) => acc + score, 0);
    return sum / stage.roundScores.length;
  }

  function drawTargetWall(cx, cy, scale, targetPose, impact, shadowPose = targetPose) {
    const w = WALL_BASE_W * scale;
    const h = WALL_BASE_H * scale;
    const wallImpact = clamp(impact, 0, 1);
    wallBuffer.width = Math.ceil(w + 16);
    wallBuffer.height = Math.ceil(h + 16);
    wallCtx.setTransform(1, 0, 0, 1, 8, 8);
    wallCtx.clearRect(-8, -8, w + 16, h + 16);
    wallCtx.save();
    wallCtx.shadowColor = "rgba(16, 36, 103, 0.36)";
    wallCtx.shadowBlur = 20 * scale;
    wallCtx.shadowOffsetY = 12 * scale;
    if (images.iceWall) {
      wallCtx.drawImage(images.iceWall, 0, 0, w, h);
    } else {
      roundRect(wallCtx, 0, 0, w, h, 42 * scale);
      const grad = wallCtx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.35, "#effaff");
      grad.addColorStop(1, "#bdeeff");
      wallCtx.fillStyle = grad;
      wallCtx.fill();
    }
    wallCtx.restore();

    const metrics = getWallPoseMetrics(cx, cy, scale);
    const holeScale = metrics.poseScale * WALL_HOLE_SIZE_MULTIPLIER;

    wallCtx.save();
    wallCtx.globalCompositeOperation = "destination-out";
    drawPoseMask(wallCtx, targetPose, metrics.localAnchor, holeScale, "#000", 1.02);
    wallCtx.restore();

    wallCtx.save();
    wallCtx.globalCompositeOperation = "destination-over";
    wallCtx.globalAlpha = 0.34;
    drawPoseMask(wallCtx, shadowPose, metrics.localAnchor, holeScale, "#000000", 0.82);
    wallCtx.restore();

    wallCtx.save();
    wallCtx.globalAlpha = lerp(0.54, 0.74, wallImpact);
    drawPoseMask(wallCtx, targetPose, metrics.localAnchor, holeScale, "#6ca4ce", 1.04, true);
    wallCtx.restore();

    ctx.save();
    ctx.drawImage(wallBuffer, cx - wallBuffer.width / 2, cy - wallBuffer.height / 2);
    ctx.restore();
  }

  function getWallPoseMetrics(cx, cy, scale) {
    const w = WALL_BASE_W * scale;
    const h = WALL_BASE_H * scale;
    const localAnchor = {
      x: w / 2,
      y: h * WALL_HOLE_ANCHOR_Y_RATIO,
    };
    return {
      localAnchor,
      worldAnchor: {
        x: cx - w / 2 + localAnchor.x,
        y: cy - h / 2 + localAnchor.y,
      },
      poseScale: scale * WALL_HOLE_SCALE_RATIO,
    };
  }

  function drawPoseShadow(pose, anchor, scale) {
    ctx.save();
    ctx.globalAlpha = 0.22;
    drawPoseMask(ctx, pose, anchor, scale, "#244f7d", 0.72, false);
    ctx.globalAlpha = 0.42;
    drawPoseMask(ctx, pose, anchor, scale, "#94e9ff", 0.82, true);
    ctx.restore();
  }

  function drawPoseMask(targetCtx, pose, anchor, scale, color, inflate = 1, outlineOnly = false) {
    const joints = getJoints(pose, anchor, scale);
    targetCtx.save();
    targetCtx.lineCap = "round";
    targetCtx.lineJoin = "round";
    targetCtx.strokeStyle = color;
    targetCtx.fillStyle = color;
    targetCtx.lineWidth = 62 * scale * inflate;
    drawLine(targetCtx, joints.leftHip, joints.leftKnee);
    drawLine(targetCtx, joints.leftKnee, joints.leftFoot);
    drawLine(targetCtx, joints.rightHip, joints.rightKnee);
    drawLine(targetCtx, joints.rightKnee, joints.rightFoot);
    targetCtx.lineWidth = 50 * scale * inflate;
    drawLine(targetCtx, joints.leftShoulder, joints.leftElbow);
    drawLine(targetCtx, joints.leftElbow, joints.leftHand);
    drawLine(targetCtx, joints.rightShoulder, joints.rightElbow);
    drawLine(targetCtx, joints.rightElbow, joints.rightHand);
    targetCtx.lineWidth = 88 * scale * inflate;
    drawLine(targetCtx, joints.hip, joints.shoulder);
    targetCtx.beginPath();
    targetCtx.ellipse(
      joints.head.x,
      joints.head.y,
      38 * scale * inflate,
      43 * scale * inflate,
      degToRad(pose.torso + 90) * 0.08,
      0,
      Math.PI * 2
    );
    if (outlineOnly) targetCtx.stroke();
    else targetCtx.fill();
    targetCtx.restore();
  }

  function drawPoseFigure(pose, anchor, scale, options = {}) {
    const character = options.character || CHARACTERS[app.selectedCharacter];
    const joints = getJoints(pose, anchor, scale);
    const silhouette = options.silhouette;

    ctx.save();

    if (options.ghost) {
      drawPoseShadow(pose, anchor, scale);
      ctx.restore();
      return;
    }

    if (!silhouette) {
      ctx.save();
      ctx.globalAlpha *= 0.2;
      ctx.fillStyle = "#0e438c";
      ctx.beginPath();
      ctx.ellipse(anchor.x, anchor.y + 232 * scale, 168 * scale, 32 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!silhouette && character.renderer === "maleSprite" && maleSpritesReady()) {
      drawMaleSpriteFigure(pose, joints, scale);
      if (options.handles) drawHandles(joints, scale);
      ctx.restore();
      return;
    }

    const outline = silhouette ? "#ffffff" : "#172f72";
    const limbDark = silhouette ? "#ffffff" : character.dark;
    const limbMain = silhouette ? "#ffffff" : character.pants;
    const jacket = silhouette ? "#ffffff" : character.main;
    const accent = silhouette ? "#ffffff" : character.accent;

    drawSegment(joints.leftHip, joints.leftKnee, 48 * scale, outline);
    drawSegment(joints.leftKnee, joints.leftFoot, 45 * scale, outline);
    drawSegment(joints.rightHip, joints.rightKnee, 48 * scale, outline);
    drawSegment(joints.rightKnee, joints.rightFoot, 45 * scale, outline);
    drawSegment(joints.leftHip, joints.leftKnee, 38 * scale, limbMain);
    drawSegment(joints.leftKnee, joints.leftFoot, 35 * scale, limbMain);
    drawSegment(joints.rightHip, joints.rightKnee, 38 * scale, limbMain);
    drawSegment(joints.rightKnee, joints.rightFoot, 35 * scale, limbMain);

    drawSegment(joints.leftShoulder, joints.leftElbow, 43 * scale, outline);
    drawSegment(joints.leftElbow, joints.leftHand, 38 * scale, outline);
    drawSegment(joints.rightShoulder, joints.rightElbow, 43 * scale, outline);
    drawSegment(joints.rightElbow, joints.rightHand, 38 * scale, outline);
    drawSegment(joints.leftShoulder, joints.leftElbow, 33 * scale, limbDark);
    drawSegment(joints.leftElbow, joints.leftHand, 28 * scale, limbDark);
    drawSegment(joints.rightShoulder, joints.rightElbow, 33 * scale, limbDark);
    drawSegment(joints.rightElbow, joints.rightHand, 28 * scale, limbDark);

    drawBoot(joints.leftFoot, pose.lLowerLeg, scale, limbDark);
    drawBoot(joints.rightFoot, pose.rLowerLeg, scale, limbDark);
    drawHand(joints.leftHand, scale, character.skin);
    drawHand(joints.rightHand, scale, character.skin);

    drawHipBridge(joints, scale, limbMain, outline, jacket, pose.torso);
    drawTorso(joints, scale, jacket, outline, accent, pose.torso);
    drawHead(joints, scale, character);

    if (options.handles) drawHandles(joints, scale);
    ctx.restore();
  }

  function maleSpritesReady() {
    return (
      images.maleHead &&
      images.maleTorso &&
      images.maleLeftUpperArm &&
      images.maleLeftLowerArm &&
      images.maleRightUpperArm &&
      images.maleRightLowerArm &&
      images.maleLeftUpperLeg &&
      images.maleLeftLowerLeg &&
      images.maleRightUpperLeg &&
      images.maleRightLowerLeg &&
      images.maleLeftHand &&
      images.maleRightHand
    );
  }

  function drawMaleSpriteFigure(pose, joints, scale) {
    drawMaleJointPatches(joints, scale, "back");
    drawLimbSpriteY(images.maleRightUpperLeg, joints.rightHip, joints.rightKnee, 60 * scale, 26 * scale, 34 * scale);
    drawLimbSpriteY(images.maleRightLowerLeg, joints.rightKnee, joints.rightFoot, 44 * scale, 34 * scale, 22 * scale);
    drawLimbSpriteY(images.maleLeftUpperLeg, joints.leftHip, joints.leftKnee, 60 * scale, 26 * scale, 34 * scale);
    drawLimbSpriteY(images.maleLeftLowerLeg, joints.leftKnee, joints.leftFoot, 44 * scale, 34 * scale, 22 * scale);
    drawMaleHipBridge(joints, scale);

    drawLimbSpriteX(images.maleRightUpperArm, joints.rightShoulder, joints.rightElbow, 58 * scale, 28 * scale, 34 * scale);
    drawLimbSpriteX(images.maleRightLowerArm, joints.rightHand, joints.rightElbow, 46 * scale, 22 * scale, 34 * scale);
    drawLimbSpriteX(images.maleLeftUpperArm, joints.leftElbow, joints.leftShoulder, 58 * scale, 34 * scale, 28 * scale);
    drawLimbSpriteX(images.maleLeftLowerArm, joints.leftElbow, joints.leftHand, 46 * scale, 34 * scale, 22 * scale);

    drawMaleTorsoSprite(joints, scale);
    drawMaleJointPatches(joints, scale, "front");
    drawMaleHand(images.maleLeftHand, joints.leftHand, pose.lLowerArm, scale, -1);
    drawMaleHand(images.maleRightHand, joints.rightHand, pose.rLowerArm, scale, 1);
    drawMaleHead(joints, pose.torso, scale);
  }

  function drawMaleJointPatches(joints, scale, layer) {
    const patches =
      layer === "back"
        ? [
            [joints.leftHip, 42, 34, "#314a9f"],
            [joints.rightHip, 42, 34, "#314a9f"],
            [joints.leftShoulder, 34, 30, "#60d783"],
            [joints.rightShoulder, 34, 30, "#60d783"],
          ]
        : [
            [joints.leftKnee, 34, 30, "#314a9f"],
            [joints.rightKnee, 34, 30, "#314a9f"],
            [joints.leftElbow, 32, 27, "#314a9f"],
            [joints.rightElbow, 32, 27, "#314a9f"],
            [joints.shoulder, 52, 22, "#60d783"],
            [joints.head, 28, 18, "#60d783"],
          ];
    ctx.save();
    patches.forEach(([point, rx, ry, color]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(point.x, point.y, rx * scale, ry * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawMaleTorsoSprite(joints, scale) {
    const angle = Math.atan2(joints.hip.y - joints.shoulder.y, joints.hip.x - joints.shoulder.x);
    const height = 208 * scale;
    const width = 132 * scale;
    ctx.save();
    ctx.translate(joints.shoulder.x, joints.shoulder.y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.drawImage(images.maleTorso, -width / 2, -16 * scale, width, height);
    ctx.restore();
  }

  function drawMaleHipBridge(joints, scale) {
    const angle = Math.atan2(joints.hip.y - joints.shoulder.y, joints.hip.x - joints.shoulder.x);
    ctx.save();
    ctx.translate(joints.hip.x, joints.hip.y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.fillStyle = "#243b8c";
    roundRect(ctx, -66 * scale, -48 * scale, 132 * scale, 82 * scale, 28 * scale);
    ctx.fill();
    ctx.fillStyle = "#314a9f";
    roundRect(ctx, -58 * scale, -40 * scale, 116 * scale, 70 * scale, 24 * scale);
    ctx.fill();
    ctx.fillStyle = "#60d783";
    roundRect(ctx, -48 * scale, -72 * scale, 96 * scale, 52 * scale, 20 * scale);
    ctx.fill();
    ctx.restore();
  }

  function drawLimbSpriteX(img, start, end, thickness, overlapStart = 0, overlapEnd = 0) {
    const len = distance(start, end);
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(angle);
    ctx.drawImage(img, -overlapStart, -thickness / 2, len + overlapStart + overlapEnd, thickness);
    ctx.restore();
  }

  function drawLimbSpriteY(img, start, end, width, overlapStart = 0, overlapEnd = 0) {
    const len = distance(start, end);
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.drawImage(img, -width / 2, -overlapStart, width, len + overlapStart + overlapEnd);
    ctx.restore();
  }

  function drawMaleHand(img, point, angleDeg, scale, side) {
    const w = 26 * scale;
    const h = 50 * scale;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(degToRad(angleDeg) + side * 0.18);
    ctx.drawImage(img, -w / 2, -h * 0.18, w, h);
    ctx.restore();
  }

  function drawMaleHead(joints, torsoAngle, scale) {
    const w = 72 * scale;
    const h = 86 * scale;
    ctx.save();
    ctx.translate(joints.head.x, joints.head.y);
    ctx.rotate(degToRad(torsoAngle + 90) * 0.08);
    ctx.drawImage(images.maleHead, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function drawTorso(joints, scale, jacket, outline, accent, torsoAngle) {
    const angle = degToRad(torsoAngle);
    ctx.save();
    ctx.translate(joints.shoulder.x, joints.shoulder.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = outline;
    roundRect(ctx, -70 * scale, -28 * scale, 140 * scale, 170 * scale, 38 * scale);
    ctx.fill();
    ctx.fillStyle = jacket;
    roundRect(ctx, -58 * scale, -18 * scale, 116 * scale, 150 * scale, 30 * scale);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(12 * scale, 42 * scale, 44 * scale, 18 * scale, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHipBridge(joints, scale, pants, outline, jacket, torsoAngle) {
    const angle = degToRad(torsoAngle);
    ctx.save();
    ctx.translate(joints.hip.x, joints.hip.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = outline;
    roundRect(ctx, -62 * scale, -48 * scale, 124 * scale, 80 * scale, 30 * scale);
    ctx.fill();
    ctx.fillStyle = pants;
    roundRect(ctx, -52 * scale, -38 * scale, 104 * scale, 64 * scale, 24 * scale);
    ctx.fill();
    ctx.fillStyle = jacket;
    roundRect(ctx, -46 * scale, -76 * scale, 92 * scale, 58 * scale, 22 * scale);
    ctx.fill();
    ctx.restore();
  }

  function drawHead(joints, scale, character) {
    ctx.save();
    ctx.fillStyle = "#192f72";
    ctx.beginPath();
    ctx.arc(joints.head.x, joints.head.y, 52 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = character.skin;
    ctx.beginPath();
    ctx.arc(joints.head.x, joints.head.y + 2 * scale, 42 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = character.hair;
    ctx.beginPath();
    ctx.arc(joints.head.x, joints.head.y - 18 * scale, 42 * scale, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = character.accent;
    roundRect(ctx, joints.head.x - 52 * scale, joints.head.y - 38 * scale, 104 * scale, 34 * scale, 17 * scale);
    ctx.fill();
    ctx.fillStyle = "#7de0ff";
    roundRect(ctx, joints.head.x - 42 * scale, joints.head.y - 31 * scale, 84 * scale, 20 * scale, 10 * scale);
    ctx.fill();
    ctx.fillStyle = "#333965";
    ctx.beginPath();
    ctx.arc(joints.head.x - 14 * scale, joints.head.y + 6 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.arc(joints.head.x + 14 * scale, joints.head.y + 6 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e46e63";
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.arc(joints.head.x, joints.head.y + 16 * scale, 14 * scale, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.restore();
  }

  function drawHandles(joints, scale) {
    const handles = [
      { point: joints.leftHand, kind: "end" },
      { point: joints.rightHand, kind: "end" },
      { point: joints.leftFoot, kind: "end" },
      { point: joints.rightFoot, kind: "end" },
      { point: joints.leftElbow, kind: "joint" },
      { point: joints.rightElbow, kind: "joint" },
      { point: joints.leftKnee, kind: "joint" },
      { point: joints.rightKnee, kind: "joint" },
      { point: joints.head, kind: "head" },
    ];
    handles.forEach((handle) => {
      const p = handle.point;
      const r = handle.kind === "head" ? 24 * scale : handle.kind === "joint" ? 16 * scale : 20 * scale;
      ctx.save();
      ctx.globalAlpha = handle.kind === "joint" ? 0.46 : 0.56;
      if (images.controlPoint) {
        drawImageContain(images.controlPoint, p.x - r, p.y - r, r * 2, r * 2);
      } else {
        ctx.shadowColor = handle.kind === "joint" ? "#fff36a" : "#00f0ff";
        ctx.shadowBlur = 12 * scale;
        ctx.fillStyle = handle.kind === "head" ? "#fff86c" : handle.kind === "joint" ? "#ffb83d" : "#45eaff";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawSegment(a, b, width, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawLine(targetCtx, a, b) {
    targetCtx.beginPath();
    targetCtx.moveTo(a.x, a.y);
    targetCtx.lineTo(b.x, b.y);
    targetCtx.stroke();
  }

  function drawHand(point, scale, color) {
    ctx.save();
    ctx.fillStyle = "#172f72";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 18 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 14 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBoot(point, angleDeg, scale, color) {
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(degToRad(angleDeg));
    ctx.fillStyle = "#162858";
    roundRect(ctx, -12 * scale, -18 * scale, 58 * scale, 34 * scale, 16 * scale);
    ctx.fill();
    ctx.fillStyle = color;
    roundRect(ctx, -8 * scale, -14 * scale, 48 * scale, 24 * scale, 12 * scale);
    ctx.fill();
    ctx.restore();
  }

  function getJoints(pose, anchor, scale) {
    const torsoA = degToRad(pose.torso);
    const torso = vec(torsoA, LIMB_LENGTHS.torso * scale);
    const perp = vec(torsoA + Math.PI / 2, 1);
    const hip = { x: anchor.x, y: anchor.y };
    const shoulder = { x: hip.x + torso.x, y: hip.y + torso.y };
    const leftShoulder = add(shoulder, mul(perp, -LIMB_LENGTHS.shoulderWidth * scale * 0.5));
    const rightShoulder = add(shoulder, mul(perp, LIMB_LENGTHS.shoulderWidth * scale * 0.5));
    const leftHip = add(hip, mul(perp, -LIMB_LENGTHS.hipWidth * scale * 0.5));
    const rightHip = add(hip, mul(perp, LIMB_LENGTHS.hipWidth * scale * 0.5));

    const leftElbow = add(leftShoulder, vec(degToRad(pose.lUpperArm), LIMB_LENGTHS.upperArm * scale));
    const leftHand = add(leftElbow, vec(degToRad(pose.lLowerArm), LIMB_LENGTHS.foreArm * scale));
    const rightElbow = add(rightShoulder, vec(degToRad(pose.rUpperArm), LIMB_LENGTHS.upperArm * scale));
    const rightHand = add(rightElbow, vec(degToRad(pose.rLowerArm), LIMB_LENGTHS.foreArm * scale));

    const leftKnee = add(leftHip, vec(degToRad(pose.lUpperLeg), LIMB_LENGTHS.upperLeg * scale));
    const leftFoot = add(leftKnee, vec(degToRad(pose.lLowerLeg), LIMB_LENGTHS.lowerLeg * scale));
    const rightKnee = add(rightHip, vec(degToRad(pose.rUpperLeg), LIMB_LENGTHS.upperLeg * scale));
    const rightFoot = add(rightKnee, vec(degToRad(pose.rLowerLeg), LIMB_LENGTHS.lowerLeg * scale));

    const head = add(shoulder, vec(torsoA, (LIMB_LENGTHS.head + 10) * scale));
    return {
      hip,
      shoulder,
      leftShoulder,
      rightShoulder,
      leftHip,
      rightHip,
      leftElbow,
      rightElbow,
      leftHand,
      rightHand,
      leftKnee,
      rightKnee,
      leftFoot,
      rightFoot,
      head,
    };
  }

  function hitHandle(point) {
    const stage = app.stage;
    if (!stage || stage.phase !== "prep") return null;
    const joints = getJoints(stage.currentPose, PLAYER_ANCHOR, PLAYER_SCALE);
    const handles = [
      { id: "leftHand", point: joints.leftHand },
      { id: "rightHand", point: joints.rightHand },
      { id: "leftFoot", point: joints.leftFoot },
      { id: "rightFoot", point: joints.rightFoot },
      { id: "leftElbow", point: joints.leftElbow },
      { id: "rightElbow", point: joints.rightElbow },
      { id: "leftKnee", point: joints.leftKnee },
      { id: "rightKnee", point: joints.rightKnee },
      { id: "head", point: joints.head },
    ];
    let best = null;
    let bestDist = Infinity;
    handles.forEach((handle) => {
      const d = distance(point, handle.point);
      if (d < bestDist) {
        best = handle;
        bestDist = d;
      }
    });
    return bestDist <= 72 ? best.id : null;
  }

  function dragHandle(id, point) {
    const stage = app.stage;
    if (!stage || stage.phase !== "prep") return;
    stage.showGuide = false;
    app.tutorialSeen = true;
    writeStorage("wallRushTutorial", "1");
    const pose = stage.currentPose;
    if (id === "head") {
      const angle = radToDeg(Math.atan2(point.y - PLAYER_ANCHOR.y, point.x - PLAYER_ANCHOR.x));
      pose.torso = clamp(normalizeAngle(angle), -125, -55);
      constrainPose(pose);
      return;
    }

    const joints = getJoints(pose, PLAYER_ANCHOR, PLAYER_SCALE);
    const jointMap = {
      leftElbow: { base: joints.leftShoulder, key: "lUpperArm" },
      rightElbow: { base: joints.rightShoulder, key: "rUpperArm" },
      leftKnee: { base: joints.leftHip, key: "lUpperLeg" },
      rightKnee: { base: joints.rightHip, key: "rUpperLeg" },
    };
    if (jointMap[id]) {
      const config = jointMap[id];
      pose[config.key] = normalizeAngle(radToDeg(Math.atan2(point.y - config.base.y, point.x - config.base.x)));
      constrainPose(pose);
      return;
    }

    const map = {
      leftHand: {
        base: joints.leftShoulder,
        first: "lUpperArm",
        second: "lLowerArm",
        l1: LIMB_LENGTHS.upperArm * PLAYER_SCALE,
        l2: LIMB_LENGTHS.foreArm * PLAYER_SCALE,
        previousMid: joints.leftElbow,
      },
      rightHand: {
        base: joints.rightShoulder,
        first: "rUpperArm",
        second: "rLowerArm",
        l1: LIMB_LENGTHS.upperArm * PLAYER_SCALE,
        l2: LIMB_LENGTHS.foreArm * PLAYER_SCALE,
        previousMid: joints.rightElbow,
      },
      leftFoot: {
        base: joints.leftHip,
        first: "lUpperLeg",
        second: "lLowerLeg",
        l1: LIMB_LENGTHS.upperLeg * PLAYER_SCALE,
        l2: LIMB_LENGTHS.lowerLeg * PLAYER_SCALE,
        previousMid: joints.leftKnee,
      },
      rightFoot: {
        base: joints.rightHip,
        first: "rUpperLeg",
        second: "rLowerLeg",
        l1: LIMB_LENGTHS.upperLeg * PLAYER_SCALE,
        l2: LIMB_LENGTHS.lowerLeg * PLAYER_SCALE,
        previousMid: joints.rightKnee,
      },
    };
    const config = map[id];
    if (!config) return;
    const solved = solveTwoBone(config.base, point, config.l1, config.l2, config.previousMid);
    pose[config.first] = normalizeAngle(radToDeg(Math.atan2(solved.mid.y - config.base.y, solved.mid.x - config.base.x)));
    pose[config.second] = normalizeAngle(radToDeg(Math.atan2(solved.end.y - solved.mid.y, solved.end.x - solved.mid.x)));
    constrainPose(pose);
  }

  function solveTwoBone(base, target, l1, l2, previousMid) {
    let dx = target.x - base.x;
    let dy = target.y - base.y;
    let d = Math.hypot(dx, dy);
    const minD = Math.abs(l1 - l2) + 1;
    const maxD = l1 + l2 - 1;
    d = clamp(d, minD, maxD);
    const ux = dx === 0 && dy === 0 ? 1 : dx / Math.hypot(dx, dy);
    const uy = dx === 0 && dy === 0 ? 0 : dy / Math.hypot(dx, dy);
    const adjustedEnd = { x: base.x + ux * d, y: base.y + uy * d };
    const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    const px = base.x + ux * a;
    const py = base.y + uy * a;
    const p1 = { x: px - uy * h, y: py + ux * h };
    const p2 = { x: px + uy * h, y: py - ux * h };
    const mid = distance(p1, previousMid) <= distance(p2, previousMid) ? p1 : p2;
    return { mid, end: adjustedEnd };
  }

  function drawParticles() {
    app.particles.forEach((p) => {
      const a = clamp(p.life / p.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        roundRect(ctx, -p.size * 0.6, -p.size * 0.34, p.size * 1.2, p.size * 0.68, 2);
        ctx.fill();
      } else if (p.shape === "star") {
        drawStar(0, 0, p.size, p.size * 0.48, p.color);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawFloatingTexts() {
    app.floatingTexts.forEach((t) => {
      const a = clamp(t.life / 1.2, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      if (t.text === "PERFECT") {
        drawSprite(SLICES.perfect, t.x - 210, t.y - 70, 420, 170);
      } else if (t.text === "GOOD") {
        drawSprite(SLICES.good, t.x - 170, t.y - 72, 340, 165);
      } else {
        drawImageContain(images.sign, t.x - 180, t.y - 88, 360, 160);
      }
      ctx.restore();
    });
  }

  function drawToast() {
    if (app.toastTimer <= 0) return;
    ctx.save();
    ctx.globalAlpha = clamp(app.toastTimer, 0, 1);
    drawIceCard(196, 130, 358, 64, 24, "rgba(238, 253, 255, 0.92)");
    drawText(app.toast || "", 375, 163, 24, "#1764c9", "center", 900);
    ctx.restore();
  }

  function burst(x, y, colors, count, life, power) {
    for (let i = 0; i < count; i += 1) {
      const angle = random(-Math.PI, Math.PI);
      const speed = random(power * 0.25, power);
      const shapeRoll = Math.random();
      app.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - random(20, 160),
        gravity: random(160, 430),
        life: random(life * 0.55, life),
        maxLife: life,
        age: 0,
        size: random(5, 17),
        spin: random(0, Math.PI * 2),
        spinSpeed: random(-8, 8),
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapeRoll > 0.72 ? "rect" : shapeRoll > 0.52 ? "star" : "circle",
      });
    }
  }

  function pillButton(id, x, y, w, h, label, onClick, theme = "blue") {
    const palettes = {
      blue: ["#37a7ff", "#116acb", "#ffffff"],
      cyan: ["#44e4ff", "#1788dc", "#ffffff"],
      light: ["#e9fbff", "#9cd8ff", "#1764c9"],
    };
    const colors = palettes[theme] || palettes.blue;
    ctx.save();
    ctx.shadowColor = "rgba(15, 49, 132, 0.32)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, x, y, w, h, h / 2);
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = theme === "light" ? "#2d92e9" : "#0d59bd";
    ctx.stroke();
    ctx.restore();
    drawText(label, x + w / 2, y + h / 2 + 11, Math.min(38, h * 0.42), colors[2], "center", 900);
    app.buttons.push({ id, x, y, w, h, onClick });
  }

  function imageButton(id, x, y, w, h, label, onClick, imageKey) {
    ctx.save();
    ctx.shadowColor = "rgba(17, 67, 165, 0.35)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 9;
    if (images[imageKey]) {
      drawImageContain(images[imageKey], x, y, w, h);
    } else {
      pillButton(id, x, y, w, h, label, onClick, "light");
      ctx.restore();
      return;
    }
    ctx.restore();
    if (label) drawText(label, x + w / 2, y + h / 2 + 12, 42, "#2474dc", "center", 900);
    app.buttons.push({ id, x, y, w, h, onClick });
  }

  function iconButton(id, x, y, size, label, onClick, icon = "sound") {
    ctx.save();
    ctx.shadowColor = "rgba(14, 70, 172, 0.34)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(x, y, x, y + size);
    grad.addColorStop(0, "#45e9ff");
    grad.addColorStop(1, "#176bd4");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    if (icon === "pause") {
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, x + size * 0.32, y + size * 0.26, size * 0.12, size * 0.48, size * 0.04);
      ctx.fill();
      roundRect(ctx, x + size * 0.56, y + size * 0.26, size * 0.12, size * 0.48, size * 0.04);
      ctx.fill();
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x + size * 0.46, y + size * 0.62, size * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x + size * 0.54, y + size * 0.28, size * 0.08, size * 0.36);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = size * 0.055;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.6, y + size * 0.28);
      ctx.quadraticCurveTo(x + size * 0.76, y + size * 0.24, x + size * 0.78, y + size * 0.41);
      ctx.stroke();
    }

    if (icon === "sound" && app.muted) {
      ctx.strokeStyle = "#ffe86a";
      ctx.lineWidth = size * 0.07;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.28, y + size * 0.28);
      ctx.lineTo(x + size * 0.74, y + size * 0.74);
      ctx.stroke();
    }
    ctx.restore();
    if (label) drawText(label, x + size / 2, y + size / 2 + 9, Math.min(24, size * 0.34), "#ffffff", "center", 900);
    app.buttons.push({ id, x, y, w: size, h: size, onClick });
  }

  function drawIceCard(x, y, w, h, r, fill) {
    ctx.save();
    ctx.shadowColor = "rgba(23, 55, 135, 0.25)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(39, 139, 224, 0.78)";
    ctx.stroke();
    ctx.restore();
  }

  function drawProgressBar(x, y, w, h, pct, color, track) {
    ctx.save();
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.fillStyle = track;
    ctx.fill();
    roundRect(ctx, x + 3, y + 3, (w - 6) * clamp(pct, 0, 1), h - 6, (h - 6) / 2);
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "#ffffff");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function drawCheck(x, y, r) {
    ctx.save();
    ctx.fillStyle = "#25d6ff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#fff36a";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x - 2, y + 13);
    ctx.lineTo(x + 18, y - 16);
    ctx.stroke();
    ctx.restore();
  }

  function drawStar(x, y, outer, inner, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? outer : inner;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawText(text, x, y, size, color, align = "center", weight = 700, strokeColor = null, strokeWidth = 0) {
    ctx.save();
    ctx.font = `${weight} ${size}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (strokeColor && strokeWidth) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.lineJoin = "round";
      ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawImageCover(img, x, y, w, h, fallback) {
    if (fallback) fallback();
    if (!img) {
      return;
    }
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function drawImageContain(img, x, y, w, h) {
    if (!img) return;
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }

  function containRect(img, x, y, w, h) {
    if (!img) return { x, y, w, h };
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    return { x: x + (w - dw) / 2, y: y + (h - dh) / 2, w: dw, h: dh };
  }

  function drawSprite(slice, x, y, w, h) {
    const [key, sx, sy, sw, sh] = slice;
    const img = images[key];
    if (!img) return;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function spriteButton(id, slice, x, y, w, h, onClick) {
    if (!images[slice[0]]) {
      const labels = {
        tutorialStart: "开始挑战",
        tutorialBack: "返回",
        againWin: "再来一局",
        selectWin: "更换角色",
        retryFail: "再来一局",
        selectFail: "更换角色",
      };
      pillButton(id, x, y, w, h, labels[id] || "确认", onClick, id.includes("select") || id.includes("Back") ? "light" : "cyan");
      return;
    }
    ctx.save();
    ctx.shadowColor = "rgba(17, 67, 165, 0.35)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 7;
    drawSprite(slice, x, y, w, h);
    ctx.restore();
    app.buttons.push({ id, x, y, w, h, onClick });
  }

  function verticalGradient(x, y, w, h, top, bottom) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }

  function roundRect(targetCtx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    targetCtx.beginPath();
    targetCtx.moveTo(x + radius, y);
    targetCtx.lineTo(x + w - radius, y);
    targetCtx.quadraticCurveTo(x + w, y, x + w, y + radius);
    targetCtx.lineTo(x + w, y + h - radius);
    targetCtx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    targetCtx.lineTo(x + radius, y + h);
    targetCtx.quadraticCurveTo(x, y + h, x, y + h - radius);
    targetCtx.lineTo(x, y + radius);
    targetCtx.quadraticCurveTo(x, y, x + radius, y);
    targetCtx.closePath();
  }

  function pointerPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * DESIGN_W,
      y: ((event.clientY - rect.top) / rect.height) * DESIGN_H,
    };
  }

  function hitButton(point) {
    for (let i = app.buttons.length - 1; i >= 0; i -= 1) {
      const b = app.buttons[i];
      if (point.x >= b.x && point.x <= b.x + b.w && point.y >= b.y && point.y <= b.y + b.h) {
        return b;
      }
    }
    return null;
  }

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    unlockAudio();
    const point = pointerPoint(event);
    app.pointer.down = true;
    app.pointer.lastPoint = point;
    app.pointer.drag = null;
    app.pointer.activeButton = null;
    if (app.screen === "game" && app.stage && app.stage.phase === "prep") {
      const handle = hitHandle(point);
      if (handle) {
        app.pointer.drag = handle;
        playSound("grab");
        dragHandle(handle, point);
        return;
      }
    }
    const button = hitButton(point);
    if (button) {
      app.pointer.activeButton = button;
      playSound("click");
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!app.pointer.down) return;
    event.preventDefault();
    const point = pointerPoint(event);
    app.pointer.lastPoint = point;
    if (app.pointer.drag) {
      dragHandle(app.pointer.drag, point);
    }
  });

  function finishPointer(event) {
    if (!app.pointer.down) return;
    event.preventDefault();
    const point = pointerPoint(event);
    if (app.pointer.drag) {
      app.pointer.drag = null;
      playSound("drop");
    } else if (app.pointer.activeButton) {
      const button = app.pointer.activeButton;
      if (point.x >= button.x && point.x <= button.x + button.w && point.y >= button.y && point.y <= button.y + button.h) {
        button.onClick();
      }
    }
    app.pointer.down = false;
    app.pointer.activeButton = null;
  }

  canvas.addEventListener("pointerup", finishPointer);
  canvas.addEventListener("pointercancel", finishPointer);
  canvas.addEventListener("lostpointercapture", () => {
    app.pointer.down = false;
    app.pointer.drag = null;
    app.pointer.activeButton = null;
  });

  function unlockAudio() {
    if (!app.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      app.audio = new AudioContext();
    }
    if (app.audio.state === "suspended") {
      app.audio.resume().catch(() => {});
    }
  }

  function playSound(name) {
    if (app.muted || !app.audio) return;
    const now = app.audio.currentTime;
    const patterns = {
      click: [[640, 0, 0.055, "sine", 0.04]],
      grab: [[420, 0, 0.07, "triangle", 0.035]],
      drop: [[360, 0, 0.055, "triangle", 0.03]],
      tick: [[860, 0, 0.05, "square", 0.025]],
      start: [[520, 0, 0.06, "sine", 0.04], [780, 0.06, 0.07, "sine", 0.04]],
      rush: [[180, 0, 0.1, "sawtooth", 0.04], [260, 0.05, 0.18, "sawtooth", 0.035]],
      success: [[620, 0, 0.08, "sine", 0.045], [820, 0.08, 0.08, "sine", 0.045], [1040, 0.16, 0.12, "sine", 0.045]],
      perfect: [[680, 0, 0.08, "sine", 0.045], [920, 0.07, 0.08, "sine", 0.05], [1220, 0.14, 0.16, "triangle", 0.045]],
      fail: [[230, 0, 0.16, "sawtooth", 0.05], [130, 0.12, 0.22, "sawtooth", 0.035]],
      win: [[520, 0, 0.08, "sine", 0.04], [680, 0.08, 0.08, "sine", 0.04], [840, 0.16, 0.08, "sine", 0.04], [1080, 0.24, 0.2, "triangle", 0.045]],
    };
    const notes = patterns[name] || patterns.click;
    notes.forEach(([freq, delay, duration, type, gain]) => {
      tone(freq, now + delay, duration, type, gain);
    });
  }

  function tone(freq, start, duration, type, gainValue) {
    const osc = app.audio.createOscillator();
    const gain = app.audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(app.audio.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function clonePose(pose) {
    return { ...pose };
  }

  function vec(angle, length) {
    return { x: Math.cos(angle) * length, y: Math.sin(angle) * length };
  }

  function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  function mul(a, n) {
    return { x: a.x * n, y: a.y * n };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  function angleDiff(a, b) {
    return Math.abs(normalizeAngle(a - b));
  }

  function normalizeAngle(angle) {
    let a = ((angle + 180) % 360 + 360) % 360 - 180;
    if (a === -180) a = 180;
    return a;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpAngle(a, b, t) {
    return a + normalizeAngle(b - a) * t;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function easeInCubic(t) {
    return t * t * t;
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  window.addEventListener("resize", resize);
  resize();
  loadAssets();
  requestAnimationFrame(loop);
})();
