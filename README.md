# 穿墙冲冲冲 H5

移动端竖屏闯关游戏原型，使用现有雪墙主题素材完成开始页、角色选择页、教程页、闯关页、成功页和失败页。

## 素材规划

- 背景：`f423cafa...png`、`747fdd81...png` 用作闯关雪道，`5f04ee12...png` 用作开始页，`loading_cover_v6.jpg` 用作加载视觉。
- UI：`f4c60159...png`、`1c2f99750...png`、`1e0d8f916...png`、`13627352a...png`、`43a3636a...png` 已按图集坐标切成开始挑战、取消准备、教程条、已通过、再来一局、分享好友等可点击部件。
- 角色：`a535928d...png`、`d7b39204...png`、`1770c89a...png`、`021d375f...png` 提供服装、肢体、手部和鞋帽风格；游戏内用 canvas 骨骼角色还原这套色彩和造型，以支持实时拖拽。
- 玩法参考：`15ce26f80...png`、`4f811b6d...png` 展示了角色穿过雪墙的目标姿势，游戏内扩展为随机目标姿势库。
- 特效：`c3e5a9a9...png`、`2676730a...png`、`4128aa8f...png`、`07025000...png` 用于成功、连击、礼物和发光反馈。
- 教程/提示：`299d7615...png`、`1e0d8f916...png`、`c8bc5e4c...png` 用于拖拽提示和雪墙提示风格。

## 玩法规则

- 每轮随机生成一面雪墙和一个目标姿势。
- 玩家拖动发光圆点控制头部、双手、双脚；手脚使用二段 IK，拖手腕会带动肘部，拖脚踝会带动膝盖。
- 倒计时结束或点击素材按钮后，雪墙向角色移动并触发判定。
- 判定基于躯干、上臂、小臂、大腿、小腿的角度误差加权评分。
- 分数达到当前关卡阈值则过墙，触发素材里的 Good/Perfect 贴纸、粒子、连击和音效；低于阈值则进入失败页。
- 总共 8 面墙，默认准备/判定倒计时 5 秒，阈值逐关提高，墙面间隔随机。
- 闯关中支持暂停、继续、重开、更换角色和静音。
- 结算页展示总分、通关进度、平均匹配、最佳单墙、关键失误和历史最佳。

## 运行

直接打开 `index.html` 即可运行。也可以在当前目录启动任意静态服务器后访问页面。

## CloudBase map 配置

项目已经接入 CloudBase map 数据读取，默认关闭，关闭时会继续使用本地 `POSE_PRESETS`。

1. 在 CloudBase 控制台创建云开发环境，并复制环境 ID。
2. 在数据库里创建集合 `wall_rush_maps`。
3. 新增一条文档，内容可以参考 `cloudbase-map.example.json`。至少需要：
   - `mapId`: `default`
   - `active`: `true`
   - `posePresets`: 姿势库数组，每个姿势要包含 `torso`、`lUpperArm`、`lLowerArm`、`rUpperArm`、`rLowerArm`、`lUpperLeg`、`lLowerLeg`、`rUpperLeg`、`rLowerLeg`
   - `levels`: 可选，用于指定每关使用的 `presetId`、`threshold`、`prepTotal`、`variance`、`mirror`
4. 在 `cloudbase-config.js` 中打开配置：

```js
window.WALL_RUSH_CLOUDBASE_CONFIG = {
  enabled: true,
  env: "你的环境ID",
  region: "ap-shanghai",
  accessKey: "",
  collection: "wall_rush_maps",
  mapId: "default",
  cacheKey: "wallRushCloudMap",
  cacheTtlMs: 5 * 60 * 1000,
};
```

如果数据库权限需要登录，请在 CloudBase 控制台开启匿名登录；如果你使用静态托管白名单或安全来源限制，也要把当前访问域名加入允许列表。

云端读取成功后，开局会优先使用云端地图；读取失败会自动回落到本地地图。读取成功的数据会缓存 5 分钟，短暂断网时可以继续使用缓存。
