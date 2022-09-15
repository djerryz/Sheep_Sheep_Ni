var moduleMap = {
    "assets/internal/index.js": function assetsInternalIndexJs() {
        return require("assets/internal/index.js");
    },
    "src/scripts/resources/index.js": function srcScriptsResourcesIndexJs() {
        return require("src/scripts/resources/index.js");
    },
    "assets/start-scene/index.js": function assetsStartSceneIndexJs() {
        return require("assets/start-scene/index.js");
    },
    "src/scripts/main/index.js": function srcScriptsMainIndexJs() {
        return require("src/scripts/main/index.js");
    }
    // tail
};

window.__cocos_require__ = function(moduleName) {
    var func = moduleMap[moduleName];
    if (!func) {
        throw new Error("cannot find module ".concat(moduleName));
    }
    return func();
};