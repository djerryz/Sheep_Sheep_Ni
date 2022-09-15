var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _umaMin = _interopRequireDefault(require("./umtrack-wx-game/uma.min.js"));

_umaMin.default.init({
    appKey: "",
    useOpenid: false,
    // default true
    autoGetOpenid: false,
    debug: true
});

"use strict";

require("adapter-min.js");

__globalAdapter.init();

requirePlugin("cocos");

__globalAdapter.adaptEngine();

require("./ccRequire");

require("./src/settings");

// Introduce Cocos Service here
require("./main");

// TODO: move to common
// Adjust devicePixelRatio
cc.view._maxPixelRatio = 4;

if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) {
    // Release Image objects after uploaded gl texture
    cc.macro.CLEANUP_IMAGE_CACHE = true;
}

window.boot();