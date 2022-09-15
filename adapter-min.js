var _typeof2 = require("@babel/runtime/helpers/typeof");

!function r(o, i, a) {
    function c(t, e) {
        if (!i[t]) {
            if (!o[t]) {
                var n = "function" == typeof require && require;
                if (!e && n) return n(t, !0);
                if (u) return u(t, !0);
                throw (n = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND", 
                n;
            }
            n = i[t] = {
                exports: {}
            }, o[t][0].call(n.exports, function(e) {
                return c(o[t][1][e] || e);
            }, n, n.exports, r, o, i, a);
        }
        return i[t].exports;
    }
    for (var u = "function" == typeof require && require, e = 0; e < a.length; e++) {
        c(a[e]);
    }
    return c;
}({
    1: [ function(e, t, n) {}, {} ],
    2: [ function(e, t, n) {
        "use strict";
        var r = window.fsUtils, o = r.getUserDataPath, i = r.readJsonSync, c = r.makeDirSync, a = r.writeFileSync, s = r.copyFile, l = r.downloadFile, u = r.writeFile, f = r.deleteFile, d = r.rmdirSync, p = r.unzip, h = r.isOutOfStorage, m = !1, y = null, g = !1, b = [], v = [], w = !1, _ = 0, E = /^https?:\/\/.*/;
        cc.assetManager.cacheManager = t.exports = {
            cacheDir: "gamecaches",
            cachedFileName: "cacheList.json",
            cacheEnabled: !0,
            autoClear: !0,
            cacheInterval: 500,
            deleteInterval: 500,
            writeFileInterval: 2e3,
            outOfStorage: !1,
            tempFiles: null,
            cachedFiles: null,
            cacheQueue: {},
            version: "1.0",
            getCache: function getCache(e) {
                return this.cachedFiles.has(e) ? this.cachedFiles.get(e).url : "";
            },
            getTemp: function getTemp(e) {
                return this.tempFiles.has(e) ? this.tempFiles.get(e) : "";
            },
            init: function init() {
                this.cacheDir = o() + "/" + this.cacheDir;
                var e = this.cacheDir + "/" + this.cachedFileName, t = i(e);
                t instanceof Error || !t.version ? (t instanceof Error || d(this.cacheDir, !0), 
                this.cachedFiles = new cc.AssetManager.Cache(), c(this.cacheDir, !0), a(e, JSON.stringify({
                    files: this.cachedFiles._map,
                    version: this.version
                }), "utf8")) : this.cachedFiles = new cc.AssetManager.Cache(t.files), this.tempFiles = new cc.AssetManager.Cache();
            },
            updateLastTime: function updateLastTime(e) {
                this.cachedFiles.has(e) && (this.cachedFiles.get(e).lastTime = Date.now());
            },
            _write: function _write() {
                g = !(y = null), u(this.cacheDir + "/" + this.cachedFileName, JSON.stringify({
                    files: this.cachedFiles._map,
                    version: this.version
                }), "utf8", function() {
                    g = !1;
                    for (var e = 0, t = v.length; e < t; e++) {
                        v[e]();
                    }
                    v.length = 0, v.push.apply(v, b), b.length = 0;
                });
            },
            writeCacheFile: function writeCacheFile(e) {
                y ? e && v.push(e) : (y = setTimeout(this._write.bind(this), this.writeFileInterval), 
                !0 === g ? e && b.push(e) : e && v.push(e));
            },
            _cache: function _cache() {
                var t, n = this;
                for (t in this.cacheQueue) {
                    var e = function e(_e) {
                        if (m = !1, _e) {
                            if (h(_e.message)) return n.outOfStorage = !0, void (n.autoClear && n.clearLRU());
                        } else n.cachedFiles.add(t, {
                            bundle: a,
                            url: u,
                            lastTime: c
                        }), delete n.cacheQueue[t], n.writeCacheFile();
                        cc.js.isEmptyObject(n.cacheQueue) || (m = !0, setTimeout(n._cache.bind(n), n.cacheInterval));
                    }, r = this.cacheQueue[t], o = r.srcUrl, i = r.isCopy, a = r.cacheBundleRoot, c = Date.now().toString(), u = "", u = (a ? "".concat(this.cacheDir, "/").concat(a, "/") : "".concat(this.cacheDir, "/")).concat(c).concat(_++).concat(cc.path.extname(t));
                    return void (i ? s(o, u, e) : l(o, u, null, e));
                }
                m = !1;
            },
            cacheFile: function cacheFile(e, t, n, r, o) {
                !(n = void 0 !== n ? n : this.cacheEnabled) || this.cacheQueue[e] || this.cachedFiles.has(e) || (this.cacheQueue[e] = {
                    srcUrl: t,
                    cacheBundleRoot: r,
                    isCopy: o
                }, m || (m = !0, this.outOfStorage ? m = !1 : setTimeout(this._cache.bind(this), this.cacheInterval)));
            },
            clearCache: function clearCache() {
                var t = this;
                d(this.cacheDir, !0), this.cachedFiles = new cc.AssetManager.Cache(), c(this.cacheDir, !0);
                var e = this.cacheDir + "/" + this.cachedFileName;
                this.outOfStorage = !1, a(e, JSON.stringify({
                    files: this.cachedFiles._map,
                    version: this.version
                }), "utf8"), cc.assetManager.bundles.forEach(function(e) {
                    E.test(e.base) && t.makeBundleFolder(e.name);
                });
            },
            clearLRU: function clearLRU() {
                if (!w) {
                    w = !0;
                    var n = [], r = this;
                    if (this.cachedFiles.forEach(function(t, e) {
                        "internal" !== t.bundle && (r._isZipFile(e) && cc.assetManager.bundles.find(function(e) {
                            return -1 !== e.base.indexOf(t.url);
                        }) || n.push({
                            originUrl: e,
                            url: t.url,
                            lastTime: t.lastTime
                        }));
                    }), n.sort(function(e, t) {
                        return e.lastTime - t.lastTime;
                    }), n.length = Math.floor(n.length / 3), 0 !== n.length) {
                        for (var e = 0, t = n.length; e < t; e++) {
                            this.cachedFiles.remove(n[e].originUrl);
                        }
                        this.writeCacheFile(function() {
                            setTimeout(function e() {
                                var t = n.pop();
                                r._isZipFile(t.originUrl) ? (d(t.url, !0), r._deleteFileCB()) : f(t.url, r._deleteFileCB.bind(r)), 
                                0 < n.length ? setTimeout(e, r.deleteInterval) : w = !1;
                            }, r.deleteInterval);
                        });
                    }
                }
            },
            removeCache: function removeCache(e) {
                var t, n;
                this.cachedFiles.has(e) && (n = (t = this).cachedFiles.remove(e).url, this.writeCacheFile(function() {
                    t._isZipFile(e) ? (d(n, !0), t._deleteFileCB()) : f(n, t._deleteFileCB.bind(t));
                }));
            },
            _deleteFileCB: function _deleteFileCB(e) {
                e || (this.outOfStorage = !1);
            },
            makeBundleFolder: function makeBundleFolder(e) {
                c(this.cacheDir + "/" + e, !0);
            },
            unzipAndCacheBundle: function unzipAndCacheBundle(t, e, n, r) {
                var o = Date.now().toString(), i = "".concat(this.cacheDir, "/").concat(n, "/").concat(o).concat(_++), a = this;
                c(i, !0), p(e, i, function(e) {
                    return e ? (d(i, !0), h(e.message) && (a.outOfStorage = !0, a.autoClear && a.clearLRU()), 
                    void (r && r(e))) : (a.cachedFiles.add(t, {
                        bundle: n,
                        url: i,
                        lastTime: o
                    }), a.writeCacheFile(), void (r && r(null, i)));
                });
            },
            _isZipFile: function _isZipFile(e) {
                return ".zip" === e.slice(-4);
            }
        };
    }, {} ],
    3: [ function(e, t, n) {
        "use strict";
        var r, s, l = e("../cache-manager"), o = window.fsUtils, f = o.fs, d = o.downloadFile, i = o.readText, a = o.readArrayBuffer, c = o.readJson, p = o.loadSubpackage, h = o.getUserDataPath, u = o.exists, m = /^https?:\/\/.*/, y = {}, g = cc.assetManager.downloader, b = cc.assetManager.parser, e = cc.assetManager.presets, v = __globalAdapter.isSubContext;
        g.maxConcurrency = 8, g.maxRequestsPerFrame = 64, e.scene.maxConcurrency = 10, e.scene.maxRequestsPerFrame = 64;
        var w = {}, _ = {};
        function E(e, t, n) {
            "function" == typeof t && (n = t, t = null), m.test(e) ? n && n(new Error("Can not load remote scripts")) : (__cocos_require__(e), 
            n && n(null));
        }
        function x(e, t, n) {
            "function" == typeof t && (n = t, t = null);
            var t = cc.sys;
            (t = (t.platform === t.TAOBAO ? window.document : document).createElement("audio")).src = e, 
            n && n(null, t);
        }
        function O(r, t, o, e, i) {
            var n = L(r, o);
            n.inLocal ? t(n.url, o, i) : n.inCache ? (l.updateLastTime(r), t(n.url, o, function(e, t) {
                e && l.removeCache(r), i(e, t);
            })) : d(r, null, o.header, e, function(e, n) {
                e ? i(e, null) : t(n, o, function(e, t) {
                    e || (l.tempFiles.add(r, n), l.cacheFile(r, n, o.cacheEnabled, o.__cacheBundleRoot__, !0)), 
                    i(e, t);
                });
            });
        }
        function S(e, t, n) {
            a(e, n);
        }
        function T(e, t, n) {
            i(e, n);
        }
        function N(e, t, n) {
            c(e, n);
        }
        var M = v ? function(e, t, n) {
            e = (e = L(e, t).url).slice(r.length + 1);
            e = __cocos_require__(cc.path.changeExtname(e, ".js"));
            n && n(null, e);
        } : function(e, t, n) {
            O(e, N, t, t.onFileProgress, n);
        }, o = v ? function(e, t, n) {
            n(null, "Arial");
        } : function(e, t, n) {
            n(null, __globalAdapter.loadFont(e) || "Arial");
        };
        function A(t, e, n) {
            u(t, function(e) {
                e ? n(null, t) : n(new Error("file ".concat(t, " does not exist!")));
            });
        }
        function C(e, t, n) {
            O(e, A, t, t.onFileProgress, n);
        }
        function D(e, n, r) {
            a(e, function(e, t) {
                return e ? r(e) : void j(t, n, r);
            });
        }
        function P(e, n, r) {
            a(e, function(e, t) {
                return e ? r(e) : void I(t, n, r);
            });
        }
        var j = b.parsePVRTex, I = b.parsePKMTex;
        e = v ? function(e, t, n) {
            n(null, e = L(e, t).url);
        } : C;
        g.downloadDomAudio = x, g.downloadScript = E, b.parsePVRTex = D, b.parsePKMTex = P, 
        g.register({
            ".js": E,
            ".mp3": C,
            ".ogg": C,
            ".wav": C,
            ".m4a": C,
            ".png": e,
            ".jpg": e,
            ".bmp": e,
            ".jpeg": e,
            ".gif": e,
            ".ico": e,
            ".tiff": e,
            ".image": e,
            ".webp": e,
            ".pvr": C,
            ".pkm": C,
            ".font": C,
            ".eot": C,
            ".ttf": C,
            ".woff": C,
            ".svg": C,
            ".ttc": C,
            ".txt": C,
            ".xml": C,
            ".vsh": C,
            ".fsh": C,
            ".atlas": C,
            ".tmx": C,
            ".tsx": C,
            ".plist": C,
            ".fnt": C,
            ".json": M,
            ".ExportJson": C,
            ".binary": C,
            ".bin": C,
            ".dbbin": C,
            ".skel": C,
            ".mp4": C,
            ".avi": C,
            ".mov": C,
            ".mpg": C,
            ".mpeg": C,
            ".rm": C,
            ".rmvb": C,
            bundle: function bundle(e, t, a) {
                var n, c, r = cc.path.basename(e), o = t.version || cc.assetManager.downloader.bundleVers[r];
                if (w[r]) {
                    var i = "subpackages/".concat(r, "/config.").concat(o ? o + "." : "", "json"), u = function u() {
                        M(i, t, function(e, t) {
                            t && (t.base = "subpackages/".concat(r, "/")), a(e, t);
                        });
                    };
                    if (y[r]) return u();
                    p(r, t.onFileProgress, function(e) {
                        e ? a(e, null) : (y[r] = !0, u());
                    });
                } else {
                    m.test(e) || !v && e.startsWith(h()) ? (c = e, n = "src/scripts/".concat(r, "/index.js"), 
                    l.makeBundleFolder(r)) : _[r] ? (c = "".concat(s, "remote/").concat(r), n = "src/scripts/".concat(r, "/index.js"), 
                    l.makeBundleFolder(r)) : (c = "assets/".concat(r), n = "assets/".concat(r, "/index.js")), 
                    __cocos_require__(n), t.__cacheBundleRoot__ = r;
                    i = "".concat(c, "/config.").concat(o ? o + "." : "", "json");
                    M(i, t, function(e, n) {
                        var r, o, i;
                        e ? a && a(e) : n.isZip ? (e = n.zipVersion, e = "".concat(c, "/res.").concat(e ? e + "." : "", "zip"), 
                        r = e, o = t, i = function i(e, t) {
                            e ? a && a(e) : (n.base = t + "/res/", (e = cc.sys).platform !== e.ALIPAY_GAME || e.os !== e.OS_ANDROID || f.accessSync({
                                path: t = t + "res/"
                            }) && (n.base = t), a && a(null, n));
                        }, (e = l.cachedFiles.get(r)) ? (l.updateLastTime(r), i && i(null, e.url)) : m.test(r) ? d(r, null, o.header, o.onFileProgress, function(e, t) {
                            e ? i && i(e) : l.unzipAndCacheBundle(r, t, o.__cacheBundleRoot__, i);
                        }) : l.unzipAndCacheBundle(r, r, o.__cacheBundleRoot__, i)) : (n.base = c + "/", 
                        a && a(null, n));
                    });
                }
            },
            default: function _default(e, t, n) {
                O(e, T, t, t.onFileProgress, n);
            }
        }), b.register({
            ".png": g.downloadDomImage,
            ".jpg": g.downloadDomImage,
            ".bmp": g.downloadDomImage,
            ".jpeg": g.downloadDomImage,
            ".gif": g.downloadDomImage,
            ".ico": g.downloadDomImage,
            ".tiff": g.downloadDomImage,
            ".image": g.downloadDomImage,
            ".webp": g.downloadDomImage,
            ".pvr": D,
            ".pkm": P,
            ".font": o,
            ".eot": o,
            ".ttf": o,
            ".woff": o,
            ".svg": o,
            ".ttc": o,
            ".mp3": x,
            ".ogg": x,
            ".wav": x,
            ".m4a": x,
            ".txt": T,
            ".xml": T,
            ".vsh": T,
            ".fsh": T,
            ".atlas": T,
            ".tmx": T,
            ".tsx": T,
            ".fnt": T,
            ".plist": function plist(e, t, r) {
                i(e, function(e, t) {
                    var n = null;
                    e || (n = cc.plistParser.parse(t)) || (e = new Error("parse failed")), r && r(e, n);
                });
            },
            ".binary": S,
            ".bin": S,
            ".dbbin": S,
            ".skel": S,
            ".ExportJson": N
        });
        var R, L = v ? function(e, t) {
            return {
                url: e = !m.test(e) ? r + "/" + e : e
            };
        } : function(e, t) {
            var n = !1, r = !1;
            return !e.startsWith(h()) && m.test(e) ? t.reload || ((t = l.cachedFiles.get(e)) ? (r = !0, 
            e = t.url) : (t = l.tempFiles.get(e)) && (n = !0, e = t)) : n = !0, {
                url: e,
                inLocal: n,
                inCache: r
            };
        };
        v ? (R = cc.assetManager.init, cc.assetManager.init = function(e) {
            R.call(cc.assetManager, e), r = e.subContextRoot || "";
        }) : (cc.assetManager.transformPipeline.append(function(e) {
            for (var t = e.output = e.input, n = 0, r = t.length; n < r; n++) {
                var o = t[n], i = o.options;
                o.config ? i.__cacheBundleRoot__ = o.config.name : "bundle" !== o.ext && (i.cacheEnabled = void 0 !== i.cacheEnabled && i.cacheEnabled);
            }
        }), R = cc.assetManager.init, cc.assetManager.init = function(e) {
            R.call(cc.assetManager, e), e.subpackages && e.subpackages.forEach(function(e) {
                return w[e] = "subpackages/" + e;
            }), e.remoteBundles && e.remoteBundles.forEach(function(e) {
                return _[e] = !0;
            }), (s = e.server || "") && !s.endsWith("/") && (s += "/"), l.init();
        });
    }, {
        "../cache-manager": 2
    } ],
    4: [ function(e, t, n) {
        "use strict";
        var r, o = cc._Audio;
        o && (r = o.prototype.getDuration, Object.assign(o.prototype, {
            _createElement: function _createElement() {
                var e = this._src._nativeAsset;
                this._element || (this._element = __globalAdapter.createInnerAudioContext()), this._element.src = e.src;
            },
            destroy: function destroy() {
                this._element && (this._element.destroy(), this._element = null);
            },
            setCurrentTime: function setCurrentTime(e) {
                var t = this;
                this._src && this._src._ensureLoaded(function() {
                    t._element.seek(e);
                });
            },
            stop: function stop() {
                var e = this;
                this._src && this._src._ensureLoaded(function() {
                    e._element.seek(0), e._element.stop(), e._unbindEnded(), e.emit("stop"), e._state = o.State.STOPPED;
                });
            },
            _bindEnded: function _bindEnded() {
                var e = this._element;
                e && e.onEnded && !this._onended._binded && (this._onended._binded = !0, e.onEnded(this._onended));
            },
            _unbindEnded: function _unbindEnded() {
                var e = this._element;
                e && e.offEnded && this._onended._binded && (this._onended._binded = !1, e.offEnded && e.offEnded(this._onended));
            },
            getDuration: function getDuration() {
                return r.call(this) || (this._element ? this._element.duration : 0);
            },
            _touchToPlay: function _touchToPlay() {},
            _forceUpdatingState: function _forceUpdatingState() {}
        }));
    }, {} ],
    5: [ function(e, t, n) {
        "use strict";
        cc && cc.audioEngine && (cc.audioEngine._maxAudioInstance = 10);
    }, {} ],
    6: [ function(e, t, n) {
        "use strict";
        var r = cc.internal.inputManager, o = window.__globalAdapter;
        Object.assign(r, {
            setAccelerometerEnabled: function setAccelerometerEnabled(e) {
                var t = cc.director.getScheduler();
                t.enableForTarget(this), e ? (this._registerAccelerometerEvent(), t.scheduleUpdate(this)) : (this._unregisterAccelerometerEvent(), 
                t.unscheduleUpdate(this));
            },
            _registerAccelerometerEvent: function _registerAccelerometerEvent() {
                this._accelCurTime = 0;
                var t = this;
                this._acceleration = new cc.Acceleration(), o.startAccelerometer(function(e) {
                    t._acceleration.x = e.x, t._acceleration.y = e.y, t._acceleration.z = e.y;
                });
            },
            _unregisterAccelerometerEvent: function _unregisterAccelerometerEvent() {
                this._accelCurTime = 0, o.stopAccelerometer();
            }
        });
    }, {} ],
    7: [ function(e, t, n) {
        "use strict";
        function r() {
            s.call(this), this._eventListeners = {
                onKeyboardInput: null,
                onKeyboardConfirm: null,
                onKeyboardComplete: null
            };
        }
        var o, i, a, c, u, s;
        cc && cc.EditBox && (o = cc.EditBox, i = cc.js, a = o.KeyboardReturnType, u = c = null, 
        s = o._ImplClass, i.extend(r, s), o._ImplClass = r, Object.assign(r.prototype, {
            init: function init(e) {
                e ? this._delegate = e : cc.error("EditBox init failed");
            },
            beginEditing: function beginEditing() {
                var t = this;
                this._editing || this._ensureKeyboardHide(function() {
                    var e = t._delegate;
                    t._showKeyboard(), t._registerKeyboardEvent(), t._editing = !0, u = t, e.editBoxEditingDidBegan();
                });
            },
            endEditing: function endEditing() {
                this._hideKeyboard();
                var e = this._eventListeners;
                e.onKeyboardComplete && e.onKeyboardComplete();
            },
            _registerKeyboardEvent: function _registerKeyboardEvent() {
                var n = this, r = this._delegate, e = this._eventListeners;
                e.onKeyboardInput = function(e) {
                    r._string !== e.value && r.editBoxTextChanged(e.value);
                }, e.onKeyboardConfirm = function(e) {
                    r.editBoxEditingReturn();
                    var t = n._eventListeners;
                    t.onKeyboardComplete && t.onKeyboardComplete();
                }, e.onKeyboardComplete = function() {
                    n._editing = !1, u = null, n._unregisterKeyboardEvent(), r.editBoxEditingDidEnded();
                }, __globalAdapter.onKeyboardInput(e.onKeyboardInput), __globalAdapter.onKeyboardConfirm(e.onKeyboardConfirm), 
                __globalAdapter.onKeyboardComplete(e.onKeyboardComplete);
            },
            _unregisterKeyboardEvent: function _unregisterKeyboardEvent() {
                var e = this._eventListeners;
                e.onKeyboardInput && (__globalAdapter.offKeyboardInput(e.onKeyboardInput), e.onKeyboardInput = null), 
                e.onKeyboardConfirm && (__globalAdapter.offKeyboardConfirm(e.onKeyboardConfirm), 
                e.onKeyboardConfirm = null), e.onKeyboardComplete && (__globalAdapter.offKeyboardComplete(e.onKeyboardComplete), 
                e.onKeyboardComplete = null);
            },
            _otherEditing: function _otherEditing() {
                return !!u && u !== this && u._editing;
            },
            _ensureKeyboardHide: function _ensureKeyboardHide(e) {
                var t = this._otherEditing();
                if (!t && !c) return e();
                c && clearTimeout(c), t && u.endEditing(), c = setTimeout(function() {
                    c = null, e();
                }, 600);
            },
            _showKeyboard: function _showKeyboard() {
                var e = this._delegate, t = e.inputMode === o.InputMode.ANY, n = e.maxLength < 0 ? 65535 : e.maxLength;
                __globalAdapter.showKeyboard({
                    defaultValue: e._string,
                    maxLength: n,
                    multiple: t,
                    confirmHold: !1,
                    confirmType: function(e) {
                        switch (e) {
                          case a.DEFAULT:
                          case a.DONE:
                            return "done";

                          case a.SEND:
                            return "send";

                          case a.SEARCH:
                            return "search";

                          case a.GO:
                            return "go";

                          case a.NEXT:
                            return "next";
                        }
                        return "done";
                    }(e.returnType),
                    success: function success(e) {},
                    fail: function fail(e) {
                        cc.warn(e.errMsg);
                    }
                });
            },
            _hideKeyboard: function _hideKeyboard() {
                __globalAdapter.hideKeyboard({
                    success: function success(e) {},
                    fail: function fail(e) {
                        cc.warn(e.errMsg);
                    }
                });
            }
        }));
    }, {} ],
    8: [ function(e, t, n) {
        "use strict";
        var r = cc.internal.inputManager, o = cc.renderer, i = cc.game, a = cc.dynamicAtlasManager, c = i.run;
        Object.assign(i, {
            _banRunningMainLoop: __globalAdapter.isSubContext,
            _firstSceneLaunched: !1,
            run: function run() {
                var e = this;
                cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function() {
                    e._firstSceneLaunched = !0;
                }), c.apply(this, arguments);
            },
            setFrameRate: function setFrameRate(e) {
                this.config.frameRate = e, __globalAdapter.setPreferredFramesPerSecond ? __globalAdapter.setPreferredFramesPerSecond(e) : (this._intervalId && window.cancelAnimFrame(this._intervalId), 
                this._intervalId = 0, this._paused = !0, this._setAnimFrame(), this._runMainLoop());
            },
            _runMainLoop: function _runMainLoop() {
                var e, _t, n, r, o, i;
                this._banRunningMainLoop || (n = (e = this).config, r = cc.director, o = !0, i = n.frameRate, 
                cc.debug.setDisplayStats(n.showFPS), _t = function t() {
                    e._paused || (e._intervalId = window.requestAnimFrame(_t), 30 === i && !__globalAdapter.setPreferredFramesPerSecond && (o = !o) || r.mainLoop());
                }, e._intervalId = window.requestAnimFrame(_t), e._paused = !1);
            },
            _initRenderer: function _initRenderer() {
                var e, t;
                this._rendererInitialized || ((t = cc.sys).platform === t.TAOBAO ? this.frame = this.container = window.document.createElement("DIV") : this.frame = this.container = document.createElement("DIV"), 
                e = __globalAdapter.isSubContext ? window.sharedCanvas || __globalAdapter.getSharedCanvas() : t.platform === t.TAOBAO ? window.canvas : canvas, 
                this.canvas = e, this._determineRenderType(), this.renderType === this.RENDER_TYPE_WEBGL && (t = {
                    stencil: !0,
                    antialias: cc.macro.ENABLE_WEBGL_ANTIALIAS,
                    alpha: cc.macro.ENABLE_TRANSPARENT_CANVAS,
                    preserveDrawingBuffer: !1
                }, o.initWebGL(e, t), this._renderContext = o.device._gl, !cc.macro.CLEANUP_IMAGE_CACHE && a && (a.enabled = !0)), 
                this._renderContext || (this.renderType = this.RENDER_TYPE_CANVAS, o.initCanvas(e), 
                this._renderContext = o.device._ctx), this._rendererInitialized = !0);
            },
            _initEvents: function _initEvents() {
                this.config.registerSystemEvent && r.registerSystemEvent(this.canvas);
                var t = !1;
                __globalAdapter.onAudioInterruptionEnd && __globalAdapter.onAudioInterruptionEnd(function() {
                    cc.audioEngine && cc.audioEngine._restore();
                }), __globalAdapter.onAudioInterruptionBegin && __globalAdapter.onAudioInterruptionBegin(function() {
                    cc.audioEngine && cc.audioEngine._break();
                }), __globalAdapter.onShow && __globalAdapter.onShow(function(e) {
                    t && (t = !1, i.renderType === i.RENDER_TYPE_WEBGL && i._renderContext.finish(), 
                    i.emit(i.EVENT_SHOW, e));
                }), __globalAdapter.onHide && __globalAdapter.onHide(function() {
                    t || (t = !0, i.emit(i.EVENT_HIDE));
                }), this.on(i.EVENT_HIDE, function() {
                    i.pause();
                }), this.on(i.EVENT_SHOW, function() {
                    i.resume();
                });
            },
            end: function end() {}
        });
    }, {} ],
    9: [ function(e, t, n) {
        "use strict";
        var r = cc.internal.inputManager, o = {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
        r && Object.assign(r, {
            _updateCanvasBoundingRect: function _updateCanvasBoundingRect() {},
            registerSystemEvent: function registerSystemEvent(e) {
                if (!this._isRegisterEvent) {
                    this._glView = cc.view;
                    var t, n = this, r = {
                        onTouchStart: this.handleTouchesBegin,
                        onTouchMove: this.handleTouchesMove,
                        onTouchEnd: this.handleTouchesEnd,
                        onTouchCancel: this.handleTouchesCancel
                    };
                    for (t in r) {
                        !function(e) {
                            var t = r[e];
                            __globalAdapter[e](function(e) {
                                e.changedTouches && t.call(n, n.getTouchesByEvent(e, o));
                            });
                        }(t);
                    }
                    this._isRegisterEvent = !0;
                }
            }
        });
    }, {} ],
    10: [ function(e, t, n) {
        "use strict";
        Object.assign(cc.screen, {
            autoFullScreen: function autoFullScreen(e, t) {}
        });
    }, {} ],
    11: [ function(e, t, n) {
        "use strict";
        var r = cc.Texture2D;
        r && Object.assign(r.prototype, {
            initWithElement: function initWithElement(e) {
                e && (this._image = e, this.handleLoadedTexture());
            }
        });
    }, {} ],
    12: [ function(e, t, n) {
        "use strict";
        t.exports = function(e, t) {
            var n = (t = t || __globalAdapter.getSystemInfoSync()).language || "", r = t.system || "iOS", o = t.platform || "iOS";
            e.isNative = !1, e.isBrowser = !1, e.isMobile = !0, e.language = n.substr(0, 2), 
            e.languageCode = n.toLowerCase(), "android" === (o = o.toLowerCase()) ? e.os = e.OS_ANDROID : "ios" === o && (e.os = e.OS_IOS);
            var r = r.toLowerCase(), o = /[\d\.]+/.exec(r = "android p" === r ? "android p 9.0" : r);
            e.osVersion = o ? o[0] : r, e.osMainVersion = parseInt(e.osVersion), e.browserType = null, 
            e.browserVersion = null, o = t.windowWidth, r = t.windowHeight, t = t.pixelRatio || 1, 
            e.windowPixelResolution = {
                width: t * o,
                height: t * r
            }, e.localStorage = window.localStorage, t = !__globalAdapter.isSubContext, r = !1;
            try {
                r = document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp");
            } catch (e) {}
            e.capabilities = {
                canvas: !0,
                opengl: !!t,
                webp: r
            }, e.__audioSupport = {
                ONLY_ONE: !1,
                WEB_AUDIO: !1,
                DELAY_CREATE_CTX: !1,
                format: [ ".mp3" ]
            };
        };
    }, {} ],
    13: [ function(e, t, n) {
        "use strict";
        t.exports = function(e) {
            e._setupContainer = function(e, t, n) {
                var r = e._devicePixelRatio = 1;
                e.isRetinaEnabled() && (r = e._devicePixelRatio = Math.min(e._maxPixelRatio, window.devicePixelRatio || 1)), 
                __globalAdapter.isSubContext || (n *= r, (e = cc.game.canvas).width === (t *= r) && e.height === n || (e.width = t, 
                e.height = n));
            };
        };
    }, {} ],
    14: [ function(e, t, n) {
        "use strict";
        t.exports = function(e) {
            Object.assign(e, {
                _adjustViewportMeta: function _adjustViewportMeta() {},
                setRealPixelResolution: function setRealPixelResolution(e, t, n) {
                    this.setDesignResolutionSize(e, t, n);
                },
                enableAutoFullScreen: function enableAutoFullScreen(e) {
                    cc.warn("cc.view.enableAutoFullScreen() is not supported on minigame platform.");
                },
                isAutoFullScreenEnabled: function isAutoFullScreenEnabled() {
                    return !1;
                },
                setCanvasSize: function setCanvasSize() {
                    cc.warn("cc.view.setCanvasSize() is not supported on minigame platform.");
                },
                setFrameSize: function setFrameSize() {
                    cc.warn("frame size is readonly on minigame platform.");
                },
                _initFrameSize: function _initFrameSize() {
                    var e, t = this._frameSize;
                    __globalAdapter.isSubContext ? (e = window.sharedCanvas || __globalAdapter.getSharedCanvas(), 
                    t.width = e.width, t.height = e.height) : (t.width = window.innerWidth, t.height = window.innerHeight);
                }
            });
        };
    }, {} ],
    15: [ function(e, t, n) {
        "use strict";
        var r = window.__globalAdapter;
        Object.assign(r, {
            adaptSys: e("./BaseSystemInfo"),
            adaptView: e("./View"),
            adaptContainerStrategy: e("./ContainerStrategy")
        });
    }, {
        "./BaseSystemInfo": 12,
        "./ContainerStrategy": 13,
        "./View": 14
    } ],
    16: [ function(e, t, n) {
        "use strict";
        e("./Audio"), e("./AudioEngine"), e("./DeviceMotionEvent"), e("./Editbox"), e("./Game"), 
        e("./InputManager"), e("./AssetManager"), e("./Screen"), e("./Texture2D"), e("./misc");
    }, {
        "./AssetManager": 3,
        "./Audio": 4,
        "./AudioEngine": 5,
        "./DeviceMotionEvent": 6,
        "./Editbox": 7,
        "./Game": 8,
        "./InputManager": 9,
        "./Screen": 10,
        "./Texture2D": 11,
        "./misc": 17
    } ],
    17: [ function(e, t, n) {
        "use strict";
        cc.macro.DOWNLOAD_MAX_CONCURRENT = 10;
    }, {} ],
    18: [ function(e, t, n) {
        "use strict";
        t.exports = {
            cloneMethod: function cloneMethod(e, t, n, r) {
                t[n] && (e[r = r || n] = t[n].bind(t));
            }
        };
    }, {} ],
    19: [ function(e, t, n) {
        "use strict";
        function r(e) {
            this.options = e || {
                locator: {}
            };
        }
        function s() {
            this.cdata = !1;
        }
        function l(e, t) {
            t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber;
        }
        function f(e) {
            if (e) return "\n@" + (e.systemId || "") + "#[line:" + e.lineNumber + ",col:" + e.columnNumber + "]";
        }
        function o(e, t, n) {
            return "string" == typeof e ? e.substr(t, n) : e.length >= t + n || t ? new java.lang.String(e, t, n) + "" : e;
        }
        function d(e, t) {
            (e.currentElement || e.doc).appendChild(t);
        }
        r.prototype.parseFromString = function(e, t) {
            var n = this.options, r = new h(), o = n.domBuilder || new s(), i = n.errorHandler, a = n.locator, c = n.xmlns || {}, u = /\/x?html?$/.test(t), t = u ? p.entityMap : {
                lt: "<",
                gt: ">",
                amp: "&",
                quot: '"',
                apos: "'"
            };
            return a && o.setDocumentLocator(a), r.errorHandler = function(r, e, o) {
                if (!r) {
                    if (e instanceof s) return e;
                    r = e;
                }
                var i = {}, a = r instanceof Function;
                function t(t) {
                    var n = r[t];
                    !n && a && (n = 2 == r.length ? function(e) {
                        r(t, e);
                    } : r), i[t] = n ? function(e) {
                        n("[xmldom " + t + "]\t" + e + f(o));
                    } : function() {};
                }
                return o = o || {}, t("warning"), t("error"), t("fatalError"), i;
            }(i, o, a), r.domBuilder = n.domBuilder || o, u && (c[""] = "http://www.w3.org/1999/xhtml"), 
            c.xml = c.xml || "http://www.w3.org/XML/1998/namespace", e ? r.parse(e, c, t) : r.errorHandler.error("invalid doc source"), 
            o.doc;
        }, s.prototype = {
            startDocument: function startDocument() {
                this.doc = new i().createDocument(null, null, null), this.locator && (this.doc.documentURI = this.locator.systemId);
            },
            startElement: function startElement(e, t, n, r) {
                var o = this.doc, i = o.createElementNS(e, n || t), a = r.length;
                d(this, i), this.currentElement = i, this.locator && l(this.locator, i);
                for (var c = 0; c < a; c++) {
                    var e = r.getURI(c), u = r.getValue(c), n = r.getQName(c), s = o.createAttributeNS(e, n);
                    this.locator && l(r.getLocator(c), s), s.value = s.nodeValue = u, i.setAttributeNode(s);
                }
            },
            endElement: function endElement(e, t, n) {
                var r = this.currentElement;
                r.tagName;
                this.currentElement = r.parentNode;
            },
            startPrefixMapping: function startPrefixMapping(e, t) {},
            endPrefixMapping: function endPrefixMapping(e) {},
            processingInstruction: function processingInstruction(e, t) {
                t = this.doc.createProcessingInstruction(e, t);
                this.locator && l(this.locator, t), d(this, t);
            },
            ignorableWhitespace: function ignorableWhitespace(e, t, n) {},
            characters: function characters(e, t, n) {
                var r;
                (e = o.apply(this, arguments)) && (r = this.cdata ? this.doc.createCDATASection(e) : this.doc.createTextNode(e), 
                this.currentElement ? this.currentElement.appendChild(r) : /^\s*$/.test(e) && this.doc.appendChild(r), 
                this.locator && l(this.locator, r));
            },
            skippedEntity: function skippedEntity(e) {},
            endDocument: function endDocument() {
                this.doc.normalize();
            },
            setDocumentLocator: function setDocumentLocator(e) {
                (this.locator = e) && (e.lineNumber = 0);
            },
            comment: function comment(e, t, n) {
                e = o.apply(this, arguments);
                e = this.doc.createComment(e);
                this.locator && l(this.locator, e), d(this, e);
            },
            startCDATA: function startCDATA() {
                this.cdata = !0;
            },
            endCDATA: function endCDATA() {
                this.cdata = !1;
            },
            startDTD: function startDTD(e, t, n) {
                var r = this.doc.implementation;
                r && r.createDocumentType && (n = r.createDocumentType(e, t, n), this.locator && l(this.locator, n), 
                d(this, n));
            },
            warning: function warning(e) {
                console.warn("[xmldom warning]\t" + e, f(this.locator));
            },
            error: function error(e) {
                console.error("[xmldom error]\t" + e, f(this.locator));
            },
            fatalError: function fatalError(e) {
                throw console.error("[xmldom fatalError]\t" + e, f(this.locator)), e;
            }
        }, "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(e) {
            s.prototype[e] = function() {
                return null;
            };
        });
        var p = e("./entities"), h = e("./sax").XMLReader, i = n.DOMImplementation = e("./dom").DOMImplementation;
        n.XMLSerializer = e("./dom").XMLSerializer, n.DOMParser = r;
    }, {
        "./dom": 20,
        "./entities": 21,
        "./sax": 22
    } ],
    20: [ function(e, t, n) {
        "use strict";
        function d(e) {
            return (d = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        function r(e, t) {
            for (var n in e) {
                t[n] = e[n];
            }
        }
        function o(e, t) {
            var n = e.prototype;
            if (!(n instanceof t)) {
                var r, o = function o() {};
                for (r in o.prototype = t.prototype, o = new o(), n) {
                    o[r] = n[r];
                }
                e.prototype = n = o;
            }
            n.constructor != e && ("function" != typeof e && console.error("unknow Class:" + e), 
            n.constructor = e);
        }
        var i, a = {}, c = (a.ELEMENT_NODE = 1, a.ATTRIBUTE_NODE = 2, a.TEXT_NODE = 3, a.CDATA_SECTION_NODE = 4, 
        a.ENTITY_REFERENCE_NODE = 5, a.ENTITY_NODE = 6, a.PROCESSING_INSTRUCTION_NODE = 7, 
        a.COMMENT_NODE = 8, a.DOCUMENT_NODE = 9, a.DOCUMENT_TYPE_NODE = 10, a.DOCUMENT_FRAGMENT_NODE = 11, 
        a.NOTATION_NODE = 12, {}), u = {};
        c.INDEX_SIZE_ERR = (u[1] = "Index size error", 1), c.DOMSTRING_SIZE_ERR = (u[2] = "DOMString size error", 
        2), c.HIERARCHY_REQUEST_ERR = (u[3] = "Hierarchy request error", 3), c.WRONG_DOCUMENT_ERR = (u[4] = "Wrong document", 
        4), c.INVALID_CHARACTER_ERR = (u[5] = "Invalid character", 5), c.NO_DATA_ALLOWED_ERR = (u[6] = "No data allowed", 
        6), c.NO_MODIFICATION_ALLOWED_ERR = (u[7] = "No modification allowed", 7), c.NOT_FOUND_ERR = (u[8] = "Not found", 
        8), c.NOT_SUPPORTED_ERR = (u[9] = "Not supported", 9), c.INUSE_ATTRIBUTE_ERR = (u[10] = "Attribute in use", 
        10), c.INVALID_STATE_ERR = (u[11] = "Invalid state", 11), c.SYNTAX_ERR = (u[12] = "Syntax error", 
        12), c.INVALID_MODIFICATION_ERR = (u[13] = "Invalid modification", 13), c.NAMESPACE_ERR = (u[14] = "Invalid namespace", 
        14), c.INVALID_ACCESS_ERR = (u[15] = "Invalid access", 15);
        function s(e, t) {
            var n;
            return t instanceof Error ? n = t : (n = this, Error.call(this, u[e]), this.message = u[e], 
            Error.captureStackTrace && Error.captureStackTrace(this, s)), n.code = e, t && (this.message = this.message + ": " + t), 
            n;
        }
        function p() {}
        function l(e, t) {
            this._node = e, this._refresh = t, f(this);
        }
        function f(e) {
            var t = e._node._inc || e._node.ownerDocument._inc;
            if (e._inc != t) {
                var n, r = e._refresh(e._node);
                for (n in V(e, "length", r.length), r) {
                    e[n] = r[n];
                }
                e._inc = t;
            }
        }
        function h() {}
        function m(e, t) {
            for (var n = e.length; n--; ) {
                if (e[n] === t) return n;
            }
        }
        function y(e, t, n, r) {
            r ? t[m(t, r)] = n : t[t.length++] = n, !e || (t = (n.ownerElement = e).ownerDocument) && (r && x(t, e, r), 
            e = e, n = n, (t = t) && t._inc++, "http://www.w3.org/2000/xmlns/" == n.namespaceURI && (e._nsMap[n.prefix ? n.localName : ""] = n.value));
        }
        function g(e, t, n) {
            var r = m(t, n);
            if (!(0 <= r)) throw s(8, new Error(e.tagName + "@" + n));
            for (var o, i = t.length - 1; r < i; ) {
                t[r] = t[++r];
            }
            t.length = i, !e || (o = e.ownerDocument) && (x(o, e, n), n.ownerElement = null);
        }
        function b(e) {
            if (this._features = {}, e) for (var t in e) {
                this._features = e[t];
            }
        }
        function v() {}
        function w(e) {
            return ("<" == e ? "&lt;" : ">" == e && "&gt;") || "&" == e && "&amp;" || '"' == e && "&quot;" || "&#" + e.charCodeAt() + ";";
        }
        function _(e, t) {
            if (t(e)) return 1;
            if (e = e.firstChild) do {
                if (_(e, t)) return 1;
            } while (e = e.nextSibling);
        }
        function E() {}
        function x(e, t, n) {
            e && e._inc++, "http://www.w3.org/2000/xmlns/" == n.namespaceURI && delete t._nsMap[n.prefix ? n.localName : ""];
        }
        function O(e, t, n) {
            if (e && e._inc) {
                e._inc++;
                var r = t.childNodes;
                if (n) r[r.length++] = n; else {
                    for (var o = t.firstChild, i = 0; o; ) {
                        o = (r[i++] = o).nextSibling;
                    }
                    r.length = i;
                }
            }
        }
        function S(e, t) {
            var n = t.previousSibling, r = t.nextSibling;
            return n ? n.nextSibling = r : e.firstChild = r, r ? r.previousSibling = n : e.lastChild = n, 
            O(e.ownerDocument, e), t;
        }
        function T(e, t, n) {
            var r = t.parentNode;
            if (r && r.removeChild(t), 11 === t.nodeType) {
                var o = t.firstChild;
                if (null == o) return t;
                var i = t.lastChild;
            } else o = i = t;
            r = n ? n.previousSibling : e.lastChild;
            for (o.previousSibling = r, i.nextSibling = n, r ? r.nextSibling = o : e.firstChild = o, 
            null == n ? e.lastChild = i : n.previousSibling = i; o.parentNode = e, o !== i && (o = o.nextSibling); ) {}
            return O(e.ownerDocument || e, e), 11 == t.nodeType && (t.firstChild = t.lastChild = null), 
            t;
        }
        function N() {
            this._nsMap = {};
        }
        function M() {}
        function A() {}
        function C() {}
        function D() {}
        function P() {}
        function j() {}
        function I() {}
        function R() {}
        function L() {}
        function k() {}
        function F() {}
        function H() {}
        function B(e, t) {
            var n, r = [], o = 9 == this.nodeType && this.documentElement || this, i = o.prefix, a = o.namespaceURI;
            return W(this, r, e, t, n = a && null == i && null == (i = o.lookupPrefix(a)) ? [ {
                namespace: a,
                prefix: null
            } ] : n), r.join("");
        }
        function U(e, t, n) {
            var r = e.prefix || "", o = e.namespaceURI;
            if ((r || o) && ("xml" !== r || "http://www.w3.org/XML/1998/namespace" !== o) && "http://www.w3.org/2000/xmlns/" != o) {
                for (var i = n.length; i--; ) {
                    var a = n[i];
                    if (a.prefix == r) return a.namespace != o;
                }
                return 1;
            }
        }
        function W(e, t, n, r, o) {
            if (r) {
                if (!(e = r(e))) return;
                if ("string" == typeof e) return void t.push(e);
            }
            switch (e.nodeType) {
              case 1:
                o = o || [];
                var i = e.attributes, a = i.length, c = e.firstChild, u = e.tagName;
                n = "http://www.w3.org/1999/xhtml" === e.namespaceURI || n, t.push("<", u);
                for (var s = 0; s < a; s++) {
                    "xmlns" == (l = i.item(s)).prefix ? o.push({
                        prefix: l.localName,
                        namespace: l.value
                    }) : "xmlns" == l.nodeName && o.push({
                        prefix: "",
                        namespace: l.value
                    });
                }
                for (var l, f, d, s = 0; s < a; s++) {
                    U(l = i.item(s), 0, o) && (f = l.prefix || "", d = l.namespaceURI, t.push(f ? " xmlns:" + f : " xmlns", '="', d, '"'), 
                    o.push({
                        prefix: f,
                        namespace: d
                    })), W(l, t, n, r, o);
                }
                if (U(e, 0, o) && (f = e.prefix || "", d = e.namespaceURI, t.push(f ? " xmlns:" + f : " xmlns", '="', d, '"'), 
                o.push({
                    prefix: f,
                    namespace: d
                })), c || n && !/^(?:meta|link|img|br|hr|input)$/i.test(u)) {
                    if (t.push(">"), n && /^script$/i.test(u)) for (;c; ) {
                        c.data ? t.push(c.data) : W(c, t, n, r, o), c = c.nextSibling;
                    } else for (;c; ) {
                        W(c, t, n, r, o), c = c.nextSibling;
                    }
                    t.push("</", u, ">");
                } else t.push("/>");
                return;

              case 9:
              case 11:
                for (c = e.firstChild; c; ) {
                    W(c, t, n, r, o), c = c.nextSibling;
                }
                return;

              case 2:
                return t.push(" ", e.name, '="', e.value.replace(/[<&"]/g, w), '"');

              case 3:
                return t.push(e.data.replace(/[<&]/g, w));

              case 4:
                return t.push("<![CDATA[", e.data, "]]>");

              case 8:
                return t.push("\x3c!--", e.data, "--\x3e");

              case 10:
                var p = e.publicId, u = e.systemId;
                return t.push("<!DOCTYPE ", e.name), void (p ? (t.push(' PUBLIC "', p), u && "." != u && t.push('" "', u), 
                t.push('">')) : u && "." != u ? t.push(' SYSTEM "', u, '">') : ((u = e.internalSubset) && t.push(" [", u, "]"), 
                t.push(">")));

              case 7:
                return t.push("<?", e.target, " ", e.data, "?>");

              case 5:
                return t.push("&", e.nodeName, ";");

              default:
                t.push("??", e.nodeName);
            }
        }
        function V(e, t, n) {
            e[t] = n;
        }
        s.prototype = Error.prototype, r(c, s), p.prototype = {
            length: 0,
            item: function item(e) {
                return this[e] || null;
            },
            toString: function toString(e, t) {
                for (var n = [], r = 0; r < this.length; r++) {
                    W(this[r], n, e, t);
                }
                return n.join("");
            }
        }, l.prototype.item = function(e) {
            return f(this), this[e];
        }, o(l, p), h.prototype = {
            length: 0,
            item: p.prototype.item,
            getNamedItem: function getNamedItem(e) {
                for (var t = this.length; t--; ) {
                    var n = this[t];
                    if (n.nodeName == e) return n;
                }
            },
            setNamedItem: function setNamedItem(e) {
                var t = e.ownerElement;
                if (t && t != this._ownerElement) throw new s(10);
                t = this.getNamedItem(e.nodeName);
                return y(this._ownerElement, this, e, t), t;
            },
            setNamedItemNS: function setNamedItemNS(e) {
                var t = e.ownerElement;
                if (t && t != this._ownerElement) throw new s(10);
                return t = this.getNamedItemNS(e.namespaceURI, e.localName), y(this._ownerElement, this, e, t), 
                t;
            },
            removeNamedItem: function removeNamedItem(e) {
                e = this.getNamedItem(e);
                return g(this._ownerElement, this, e), e;
            },
            removeNamedItemNS: function removeNamedItemNS(e, t) {
                t = this.getNamedItemNS(e, t);
                return g(this._ownerElement, this, t), t;
            },
            getNamedItemNS: function getNamedItemNS(e, t) {
                for (var n = this.length; n--; ) {
                    var r = this[n];
                    if (r.localName == t && r.namespaceURI == e) return r;
                }
                return null;
            }
        }, b.prototype = {
            hasFeature: function hasFeature(e, t) {
                e = this._features[e.toLowerCase()];
                return !(!e || t && !(t in e));
            },
            createDocument: function createDocument(e, t, n) {
                var r = new E();
                return r.implementation = this, r.childNodes = new p(), (r.doctype = n) && r.appendChild(n), 
                t && (t = r.createElementNS(e, t), r.appendChild(t)), r;
            },
            createDocumentType: function createDocumentType(e, t, n) {
                var r = new j();
                return r.name = e, r.nodeName = e, r.publicId = t, r.systemId = n, r;
            }
        }, v.prototype = {
            firstChild: null,
            lastChild: null,
            previousSibling: null,
            nextSibling: null,
            attributes: null,
            parentNode: null,
            childNodes: null,
            ownerDocument: null,
            nodeValue: null,
            namespaceURI: null,
            prefix: null,
            localName: null,
            insertBefore: function insertBefore(e, t) {
                return T(this, e, t);
            },
            replaceChild: function replaceChild(e, t) {
                this.insertBefore(e, t), t && this.removeChild(t);
            },
            removeChild: function removeChild(e) {
                return S(this, e);
            },
            appendChild: function appendChild(e) {
                return this.insertBefore(e, null);
            },
            hasChildNodes: function hasChildNodes() {
                return null != this.firstChild;
            },
            cloneNode: function cloneNode(e) {
                return function e(t, n, r) {
                    var o = new n.constructor();
                    for (var i in n) {
                        var a = n[i];
                        "object" != d(a) && a != o[i] && (o[i] = a);
                    }
                    n.childNodes && (o.childNodes = new p());
                    o.ownerDocument = t;
                    switch (o.nodeType) {
                      case 1:
                        var c = n.attributes, u = o.attributes = new h(), s = c.length;
                        u._ownerElement = o;
                        for (var l = 0; l < s; l++) {
                            o.setAttributeNode(e(t, c.item(l), !0));
                        }
                        break;

                      case 2:
                        r = !0;
                    }
                    if (r) for (var f = n.firstChild; f; ) {
                        o.appendChild(e(t, f, r)), f = f.nextSibling;
                    }
                    return o;
                }(this.ownerDocument || this, this, e);
            },
            normalize: function normalize() {
                for (var e = this.firstChild; e; ) {
                    var t = e.nextSibling;
                    t && 3 == t.nodeType && 3 == e.nodeType ? (this.removeChild(t), e.appendData(t.data)) : (e.normalize(), 
                    e = t);
                }
            },
            isSupported: function isSupported(e, t) {
                return this.ownerDocument.implementation.hasFeature(e, t);
            },
            hasAttributes: function hasAttributes() {
                return 0 < this.attributes.length;
            },
            lookupPrefix: function lookupPrefix(e) {
                for (var t = this; t; ) {
                    var n = t._nsMap;
                    if (n) for (var r in n) {
                        if (n[r] == e) return r;
                    }
                    t = 2 == t.nodeType ? t.ownerDocument : t.parentNode;
                }
                return null;
            },
            lookupNamespaceURI: function lookupNamespaceURI(e) {
                for (var t = this; t; ) {
                    var n = t._nsMap;
                    if (n && e in n) return n[e];
                    t = 2 == t.nodeType ? t.ownerDocument : t.parentNode;
                }
                return null;
            },
            isDefaultNamespace: function isDefaultNamespace(e) {
                return null == this.lookupPrefix(e);
            }
        }, r(a, v), r(a, v.prototype), E.prototype = {
            nodeName: "#document",
            nodeType: 9,
            doctype: null,
            documentElement: null,
            _inc: 1,
            insertBefore: function insertBefore(e, t) {
                if (11 != e.nodeType) return null == this.documentElement && 1 == e.nodeType && (this.documentElement = e), 
                T(this, e, t), e.ownerDocument = this, e;
                for (var n = e.firstChild; n; ) {
                    var r = n.nextSibling;
                    this.insertBefore(n, t), n = r;
                }
                return e;
            },
            removeChild: function removeChild(e) {
                return this.documentElement == e && (this.documentElement = null), S(this, e);
            },
            importNode: function importNode(e, t) {
                return function e(t, n, r) {
                    var o;
                    switch (n.nodeType) {
                      case 1:
                        (o = n.cloneNode(!1)).ownerDocument = t;

                      case 11:
                        break;

                      case 2:
                        r = !0;
                    }
                    o = o || n.cloneNode(!1);
                    o.ownerDocument = t;
                    o.parentNode = null;
                    if (r) for (var i = n.firstChild; i; ) {
                        o.appendChild(e(t, i, r)), i = i.nextSibling;
                    }
                    return o;
                }(this, e, t);
            },
            getElementById: function getElementById(t) {
                var n = null;
                return _(this.documentElement, function(e) {
                    if (1 == e.nodeType && e.getAttribute("id") == t) return n = e, !0;
                }), n;
            },
            createElement: function createElement(e) {
                var t = new N();
                return t.ownerDocument = this, t.nodeName = e, t.tagName = e, t.childNodes = new p(), 
                (t.attributes = new h())._ownerElement = t;
            },
            createDocumentFragment: function createDocumentFragment() {
                var e = new k();
                return e.ownerDocument = this, e.childNodes = new p(), e;
            },
            createTextNode: function createTextNode(e) {
                var t = new C();
                return t.ownerDocument = this, t.appendData(e), t;
            },
            createComment: function createComment(e) {
                var t = new D();
                return t.ownerDocument = this, t.appendData(e), t;
            },
            createCDATASection: function createCDATASection(e) {
                var t = new P();
                return t.ownerDocument = this, t.appendData(e), t;
            },
            createProcessingInstruction: function createProcessingInstruction(e, t) {
                var n = new F();
                return n.ownerDocument = this, n.tagName = n.target = e, n.nodeValue = n.data = t, 
                n;
            },
            createAttribute: function createAttribute(e) {
                var t = new M();
                return t.ownerDocument = this, t.name = e, t.nodeName = e, t.localName = e, t.specified = !0, 
                t;
            },
            createEntityReference: function createEntityReference(e) {
                var t = new L();
                return t.ownerDocument = this, t.nodeName = e, t;
            },
            createElementNS: function createElementNS(e, t) {
                var n = new N(), r = t.split(":"), o = n.attributes = new h();
                return n.childNodes = new p(), n.ownerDocument = this, n.nodeName = t, n.tagName = t, 
                n.namespaceURI = e, 2 == r.length ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t, 
                o._ownerElement = n;
            },
            createAttributeNS: function createAttributeNS(e, t) {
                var n = new M(), r = t.split(":");
                return n.ownerDocument = this, n.nodeName = t, n.name = t, n.namespaceURI = e, n.specified = !0, 
                2 == r.length ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t, n;
            }
        }, o(E, v), E.prototype.getElementsByTagName = (N.prototype = {
            nodeType: 1,
            hasAttribute: function hasAttribute(e) {
                return null != this.getAttributeNode(e);
            },
            getAttribute: function getAttribute(e) {
                e = this.getAttributeNode(e);
                return e && e.value || "";
            },
            getAttributeNode: function getAttributeNode(e) {
                return this.attributes.getNamedItem(e);
            },
            setAttribute: function setAttribute(e, t) {
                e = this.ownerDocument.createAttribute(e);
                e.value = e.nodeValue = "" + t, this.setAttributeNode(e);
            },
            removeAttribute: function removeAttribute(e) {
                e = this.getAttributeNode(e);
                e && this.removeAttributeNode(e);
            },
            appendChild: function appendChild(e) {
                return 11 === e.nodeType ? this.insertBefore(e, null) : function(e, t) {
                    var n = t.parentNode;
                    n && (r = e.lastChild, n.removeChild(t), r = e.lastChild);
                    var r = e.lastChild;
                    return t.parentNode = e, t.previousSibling = r, t.nextSibling = null, r ? r.nextSibling = t : e.firstChild = t, 
                    e.lastChild = t, O(e.ownerDocument, e, t), t;
                }(this, e);
            },
            setAttributeNode: function setAttributeNode(e) {
                return this.attributes.setNamedItem(e);
            },
            setAttributeNodeNS: function setAttributeNodeNS(e) {
                return this.attributes.setNamedItemNS(e);
            },
            removeAttributeNode: function removeAttributeNode(e) {
                return this.attributes.removeNamedItem(e.nodeName);
            },
            removeAttributeNS: function removeAttributeNS(e, t) {
                t = this.getAttributeNodeNS(e, t);
                t && this.removeAttributeNode(t);
            },
            hasAttributeNS: function hasAttributeNS(e, t) {
                return null != this.getAttributeNodeNS(e, t);
            },
            getAttributeNS: function getAttributeNS(e, t) {
                t = this.getAttributeNodeNS(e, t);
                return t && t.value || "";
            },
            setAttributeNS: function setAttributeNS(e, t, n) {
                t = this.ownerDocument.createAttributeNS(e, t);
                t.value = t.nodeValue = "" + n, this.setAttributeNode(t);
            },
            getAttributeNodeNS: function getAttributeNodeNS(e, t) {
                return this.attributes.getNamedItemNS(e, t);
            },
            getElementsByTagName: function getElementsByTagName(r) {
                return new l(this, function(t) {
                    var n = [];
                    return _(t, function(e) {
                        e === t || 1 != e.nodeType || "*" !== r && e.tagName != r || n.push(e);
                    }), n;
                });
            },
            getElementsByTagNameNS: function getElementsByTagNameNS(r, o) {
                return new l(this, function(t) {
                    var n = [];
                    return _(t, function(e) {
                        e === t || 1 !== e.nodeType || "*" !== r && e.namespaceURI !== r || "*" !== o && e.localName != o || n.push(e);
                    }), n;
                });
            }
        }).getElementsByTagName, E.prototype.getElementsByTagNameNS = N.prototype.getElementsByTagNameNS, 
        o(N, v), M.prototype.nodeType = 2, o(M, v), A.prototype = {
            data: "",
            substringData: function substringData(e, t) {
                return this.data.substring(e, e + t);
            },
            appendData: function appendData(e) {
                e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
            },
            insertData: function insertData(e, t) {
                this.replaceData(e, 0, t);
            },
            appendChild: function appendChild(e) {
                throw new Error(u[3]);
            },
            deleteData: function deleteData(e, t) {
                this.replaceData(e, t, "");
            },
            replaceData: function replaceData(e, t, n) {
                var r = this.data.substring(0, e), t = this.data.substring(e + t);
                this.nodeValue = this.data = n = r + n + t, this.length = n.length;
            }
        }, o(A, v), C.prototype = {
            nodeName: "#text",
            nodeType: 3,
            splitText: function splitText(e) {
                var t = (n = this.data).substring(e), n = n.substring(0, e);
                this.data = this.nodeValue = n, this.length = n.length;
                t = this.ownerDocument.createTextNode(t);
                return this.parentNode && this.parentNode.insertBefore(t, this.nextSibling), t;
            }
        }, o(C, A), D.prototype = {
            nodeName: "#comment",
            nodeType: 8
        }, o(D, A), P.prototype = {
            nodeName: "#cdata-section",
            nodeType: 4
        }, o(P, A), j.prototype.nodeType = 10, o(j, v), I.prototype.nodeType = 12, o(I, v), 
        R.prototype.nodeType = 6, o(R, v), L.prototype.nodeType = 5, o(L, v), k.prototype.nodeName = "#document-fragment", 
        k.prototype.nodeType = 11, o(k, v), F.prototype.nodeType = 7, o(F, v), H.prototype.serializeToString = function(e, t, n) {
            return B.call(e, t, n);
        }, v.prototype.toString = B;
        try {
            Object.defineProperty && (i = function e(t) {
                switch (t.nodeType) {
                  case 1:
                  case 11:
                    var n = [];
                    for (t = t.firstChild; t; ) {
                        7 !== t.nodeType && 8 !== t.nodeType && n.push(e(t)), t = t.nextSibling;
                    }
                    return n.join("");

                  default:
                    return t.nodeValue;
                }
            }, Object.defineProperty(l.prototype, "length", {
                get: function get() {
                    return f(this), this.$$length;
                }
            }), Object.defineProperty(v.prototype, "textContent", {
                get: function get() {
                    return i(this);
                },
                set: function set(e) {
                    switch (this.nodeType) {
                      case 1:
                      case 11:
                        for (;this.firstChild; ) {
                            this.removeChild(this.firstChild);
                        }
                        (e || String(e)) && this.appendChild(this.ownerDocument.createTextNode(e));
                        break;

                      default:
                        this.data = e, this.value = e, this.nodeValue = e;
                    }
                }
            }), V = function V(e, t, n) {
                e["$$" + t] = n;
            });
        } catch (e) {}
        n.DOMImplementation = b, n.XMLSerializer = H;
    }, {} ],
    21: [ function(e, t, n) {
        "use strict";
        n.entityMap = {
            lt: "<",
            gt: ">",
            amp: "&",
            quot: '"',
            apos: "'",
            Agrave: "À",
            Aacute: "Á",
            Acirc: "Â",
            Atilde: "Ã",
            Auml: "Ä",
            Aring: "Å",
            AElig: "Æ",
            Ccedil: "Ç",
            Egrave: "È",
            Eacute: "É",
            Ecirc: "Ê",
            Euml: "Ë",
            Igrave: "Ì",
            Iacute: "Í",
            Icirc: "Î",
            Iuml: "Ï",
            ETH: "Ð",
            Ntilde: "Ñ",
            Ograve: "Ò",
            Oacute: "Ó",
            Ocirc: "Ô",
            Otilde: "Õ",
            Ouml: "Ö",
            Oslash: "Ø",
            Ugrave: "Ù",
            Uacute: "Ú",
            Ucirc: "Û",
            Uuml: "Ü",
            Yacute: "Ý",
            THORN: "Þ",
            szlig: "ß",
            agrave: "à",
            aacute: "á",
            acirc: "â",
            atilde: "ã",
            auml: "ä",
            aring: "å",
            aelig: "æ",
            ccedil: "ç",
            egrave: "è",
            eacute: "é",
            ecirc: "ê",
            euml: "ë",
            igrave: "ì",
            iacute: "í",
            icirc: "î",
            iuml: "ï",
            eth: "ð",
            ntilde: "ñ",
            ograve: "ò",
            oacute: "ó",
            ocirc: "ô",
            otilde: "õ",
            ouml: "ö",
            oslash: "ø",
            ugrave: "ù",
            uacute: "ú",
            ucirc: "û",
            uuml: "ü",
            yacute: "ý",
            thorn: "þ",
            yuml: "ÿ",
            nbsp: " ",
            iexcl: "¡",
            cent: "¢",
            pound: "£",
            curren: "¤",
            yen: "¥",
            brvbar: "¦",
            sect: "§",
            uml: "¨",
            copy: "©",
            ordf: "ª",
            laquo: "«",
            not: "¬",
            shy: "­­",
            reg: "®",
            macr: "¯",
            deg: "°",
            plusmn: "±",
            sup2: "²",
            sup3: "³",
            acute: "´",
            micro: "µ",
            para: "¶",
            middot: "·",
            cedil: "¸",
            sup1: "¹",
            ordm: "º",
            raquo: "»",
            frac14: "¼",
            frac12: "½",
            frac34: "¾",
            iquest: "¿",
            times: "×",
            divide: "÷",
            forall: "∀",
            part: "∂",
            exist: "∃",
            empty: "∅",
            nabla: "∇",
            isin: "∈",
            notin: "∉",
            ni: "∋",
            prod: "∏",
            sum: "∑",
            minus: "−",
            lowast: "∗",
            radic: "√",
            prop: "∝",
            infin: "∞",
            ang: "∠",
            and: "∧",
            or: "∨",
            cap: "∩",
            cup: "∪",
            int: "∫",
            there4: "∴",
            sim: "∼",
            cong: "≅",
            asymp: "≈",
            ne: "≠",
            equiv: "≡",
            le: "≤",
            ge: "≥",
            sub: "⊂",
            sup: "⊃",
            nsub: "⊄",
            sube: "⊆",
            supe: "⊇",
            oplus: "⊕",
            otimes: "⊗",
            perp: "⊥",
            sdot: "⋅",
            Alpha: "Α",
            Beta: "Β",
            Gamma: "Γ",
            Delta: "Δ",
            Epsilon: "Ε",
            Zeta: "Ζ",
            Eta: "Η",
            Theta: "Θ",
            Iota: "Ι",
            Kappa: "Κ",
            Lambda: "Λ",
            Mu: "Μ",
            Nu: "Ν",
            Xi: "Ξ",
            Omicron: "Ο",
            Pi: "Π",
            Rho: "Ρ",
            Sigma: "Σ",
            Tau: "Τ",
            Upsilon: "Υ",
            Phi: "Φ",
            Chi: "Χ",
            Psi: "Ψ",
            Omega: "Ω",
            alpha: "α",
            beta: "β",
            gamma: "γ",
            delta: "δ",
            epsilon: "ε",
            zeta: "ζ",
            eta: "η",
            theta: "θ",
            iota: "ι",
            kappa: "κ",
            lambda: "λ",
            mu: "μ",
            nu: "ν",
            xi: "ξ",
            omicron: "ο",
            pi: "π",
            rho: "ρ",
            sigmaf: "ς",
            sigma: "σ",
            tau: "τ",
            upsilon: "υ",
            phi: "φ",
            chi: "χ",
            psi: "ψ",
            omega: "ω",
            thetasym: "ϑ",
            upsih: "ϒ",
            piv: "ϖ",
            OElig: "Œ",
            oelig: "œ",
            Scaron: "Š",
            scaron: "š",
            Yuml: "Ÿ",
            fnof: "ƒ",
            circ: "ˆ",
            tilde: "˜",
            ensp: " ",
            emsp: " ",
            thinsp: " ",
            zwnj: "‌",
            zwj: "‍",
            lrm: "‎",
            rlm: "‏",
            ndash: "–",
            mdash: "—",
            lsquo: "‘",
            rsquo: "’",
            sbquo: "‚",
            ldquo: "“",
            rdquo: "”",
            bdquo: "„",
            dagger: "†",
            Dagger: "‡",
            bull: "•",
            hellip: "…",
            permil: "‰",
            prime: "′",
            Prime: "″",
            lsaquo: "‹",
            rsaquo: "›",
            oline: "‾",
            euro: "€",
            trade: "™",
            larr: "←",
            uarr: "↑",
            rarr: "→",
            darr: "↓",
            harr: "↔",
            crarr: "↵",
            lceil: "⌈",
            rceil: "⌉",
            lfloor: "⌊",
            rfloor: "⌋",
            loz: "◊",
            spades: "♠",
            clubs: "♣",
            hearts: "♥",
            diams: "♦"
        };
    }, {} ],
    22: [ function(e, t, n) {
        "use strict";
        var r = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, o = new RegExp("[\\-\\.0-9" + r.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]"), i = new RegExp("^" + r.source + o.source + "*(?::" + r.source + o.source + "*)?$"), C = 0, D = 1, P = 2, j = 3, I = 4, R = 5, L = 6, k = 7;
        function a() {}
        function F(e, t) {
            return t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber, t;
        }
        function H(e, t, n) {
            for (var r = e.tagName, o = null, i = e.length; i--; ) {
                var a = e[i], c = a.qName, u = a.value, c = 0 < (l = c.indexOf(":")) ? (s = a.prefix = c.slice(0, l), 
                f = c.slice(l + 1), "xmlns" === s && f) : (s = null, "xmlns" === (f = c) && "");
                a.localName = f, !1 !== c && (null == o && (o = {}, p(n, n = {})), n[c] = o[c] = u, 
                a.uri = "http://www.w3.org/2000/xmlns/", t.startPrefixMapping(c, u));
            }
            for (var s, i = e.length; i--; ) {
                (s = (a = e[i]).prefix) && ("xml" === s && (a.uri = "http://www.w3.org/XML/1998/namespace"), 
                "xmlns" !== s && (a.uri = n[s || ""]));
            }
            var l, f = 0 < (l = r.indexOf(":")) ? (s = e.prefix = r.slice(0, l), e.localName = r.slice(l + 1)) : (s = null, 
            e.localName = r), d = e.uri = n[s || ""];
            if (t.startElement(d, f, r, e), !e.closed) return e.currentNSMap = n, e.localNSMap = o, 
            1;
            if (t.endElement(d, f, r), o) for (s in o) {
                t.endPrefixMapping(s);
            }
        }
        function p(e, t) {
            for (var n in e) {
                t[n] = e[n];
            }
        }
        function B(e) {}
        a.prototype = {
            parse: function parse(e, t, n) {
                var r = this.domBuilder;
                r.startDocument(), p(t, t = {}), function(n, e, r, o, i) {
                    function a(e) {
                        var t = e.slice(1, -1);
                        return t in r ? r[t] : "#" === t.charAt(0) ? 65535 < (t = parseInt(t.substr(1).replace("x", "0x"))) ? (t -= 65536, 
                        String.fromCharCode(55296 + (t >> 10), 56320 + (1023 & t))) : String.fromCharCode(t) : (i.error("entity not found:" + e), 
                        e);
                    }
                    function t(e) {
                        var t;
                        h < e && (t = n.substring(h, e).replace(/&#?\w+;/g, a), f && c(h), o.characters(t, 0, e - h), 
                        h = e);
                    }
                    function c(e, t) {
                        for (;s <= e && (t = l.exec(n)); ) {
                            u = t.index, s = u + t[0].length, f.lineNumber++;
                        }
                        f.columnNumber = e - u + 1;
                    }
                    var u = 0, s = 0, l = /.*(?:\r\n?|\n)|.*$/g, f = o.locator, d = [ {
                        currentNSMap: e
                    } ], p = {}, h = 0;
                    for (;;) {
                        try {
                            var m, y, g = n.indexOf("<", h);
                            if (g < 0) return n.substr(h).match(/^\s*$/) || (m = o.doc, y = m.createTextNode(n.substr(h)), 
                            m.appendChild(y), o.currentElement = y);
                            switch (h < g && t(g), n.charAt(g + 1)) {
                              case "/":
                                var b = n.indexOf(">", g + 3), v = n.substring(g + 2, b), w = d.pop();
                                b < 0 ? (v = n.substring(g + 2).replace(/[\s<].*/, ""), i.error("end tag name: " + v + " is not complete:" + w.tagName), 
                                b = g + 1 + v.length) : v.match(/\s</) && (v = v.replace(/[\s<].*/, ""), i.error("end tag name: " + v + " maybe not complete"), 
                                b = g + 1 + v.length);
                                var _ = w.localNSMap, E = w.tagName == v;
                                if (E || w.tagName && w.tagName.toLowerCase() == v.toLowerCase()) {
                                    if (o.endElement(w.uri, w.localName, v), _) for (var x in _) {
                                        o.endPrefixMapping(x);
                                    }
                                    E || i.fatalError("end tag name: " + v + " is not match the current start tagName:" + w.tagName);
                                } else d.push(w);
                                b++;
                                break;

                              case "?":
                                f && c(g), b = function(e, t, n) {
                                    var r = e.indexOf("?>", t);
                                    if (r) {
                                        t = e.substring(t, r).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                                        if (t) {
                                            t[0].length;
                                            return n.processingInstruction(t[1], t[2]), r + 2;
                                        }
                                        return -1;
                                    }
                                    return -1;
                                }(n, g, o);
                                break;

                              case "!":
                                f && c(g), b = function(e, t, n, r) {
                                    {
                                        if ("-" === e.charAt(t + 2)) {
                                            if ("-" !== e.charAt(t + 3)) return -1;
                                            var o = e.indexOf("--\x3e", t + 4);
                                            return t < o ? (n.comment(e, t + 4, o - t - 4), o + 3) : (r.error("Unclosed comment"), 
                                            -1);
                                        }
                                        if ("CDATA[" == e.substr(t + 3, 6)) {
                                            o = e.indexOf("]]>", t + 9);
                                            return n.startCDATA(), n.characters(e, t + 9, o - t - 9), n.endCDATA(), o + 3;
                                        }
                                        var i = function(e, t) {
                                            var n, r = [], o = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                                            o.lastIndex = t, o.exec(e);
                                            for (;n = o.exec(e); ) {
                                                if (r.push(n), n[1]) return r;
                                            }
                                        }(e, t), r = i.length;
                                        if (1 < r && /!doctype/i.test(i[0][0])) {
                                            o = i[1][0], e = 3 < r && /^public$/i.test(i[2][0]) && i[3][0], t = 4 < r && i[4][0], 
                                            r = i[r - 1];
                                            return n.startDTD(o, e && e.replace(/^(['"])(.*?)\1$/, "$2"), t && t.replace(/^(['"])(.*?)\1$/, "$2")), 
                                            n.endDTD(), r.index + r[0].length;
                                        }
                                    }
                                    return -1;
                                }(n, g, o, i);
                                break;

                              default:
                                f && c(g);
                                var O = new B(), S = d[d.length - 1].currentNSMap, b = function(e, t, n, r, o, i) {
                                    var a, c = ++t, u = C;
                                    for (;;) {
                                        var s = e.charAt(c);
                                        switch (s) {
                                          case "=":
                                            if (u === D) a = e.slice(t, c), u = j; else {
                                                if (u !== P) throw new Error("attribute equal must after attrName");
                                                u = j;
                                            }
                                            break;

                                          case "'":
                                          case '"':
                                            if (u === j || u === D) {
                                                if (u === D && (i.warning('attribute value must after "="'), a = e.slice(t, c)), 
                                                t = c + 1, !(0 < (c = e.indexOf(s, t)))) throw new Error("attribute value no end '" + s + "' match");
                                                l = e.slice(t, c).replace(/&#?\w+;/g, o), n.add(a, l, t - 1), u = R;
                                            } else {
                                                if (u != I) throw new Error('attribute value must after "="');
                                                l = e.slice(t, c).replace(/&#?\w+;/g, o), n.add(a, l, t), i.warning('attribute "' + a + '" missed start quot(' + s + ")!!"), 
                                                t = c + 1, u = R;
                                            }
                                            break;

                                          case "/":
                                            switch (u) {
                                              case C:
                                                n.setTagName(e.slice(t, c));

                                              case R:
                                              case L:
                                              case k:
                                                u = k, n.closed = !0;

                                              case I:
                                              case D:
                                              case P:
                                                break;

                                              default:
                                                throw new Error("attribute invalid close char('/')");
                                            }
                                            break;

                                          case "":
                                            return i.error("unexpected end of input"), u == C && n.setTagName(e.slice(t, c)), 
                                            c;

                                          case ">":
                                            switch (u) {
                                              case C:
                                                n.setTagName(e.slice(t, c));

                                              case R:
                                              case L:
                                              case k:
                                                break;

                                              case I:
                                              case D:
                                                "/" === (l = e.slice(t, c)).slice(-1) && (n.closed = !0, l = l.slice(0, -1));

                                              case P:
                                                u === P && (l = a), u == I ? (i.warning('attribute "' + l + '" missed quot(")!!'), 
                                                n.add(a, l.replace(/&#?\w+;/g, o), t)) : ("http://www.w3.org/1999/xhtml" === r[""] && l.match(/^(?:disabled|checked|selected)$/i) || i.warning('attribute "' + l + '" missed value!! "' + l + '" instead!!'), 
                                                n.add(l, l, t));
                                                break;

                                              case j:
                                                throw new Error("attribute value missed!!");
                                            }
                                            return c;

                                          case "":
                                            s = " ";

                                          default:
                                            if (s <= " ") switch (u) {
                                              case C:
                                                n.setTagName(e.slice(t, c)), u = L;
                                                break;

                                              case D:
                                                a = e.slice(t, c), u = P;
                                                break;

                                              case I:
                                                var l = e.slice(t, c).replace(/&#?\w+;/g, o);
                                                i.warning('attribute "' + l + '" missed quot(")!!'), n.add(a, l, t);

                                              case R:
                                                u = L;
                                            } else switch (u) {
                                              case P:
                                                n.tagName;
                                                "http://www.w3.org/1999/xhtml" === r[""] && a.match(/^(?:disabled|checked|selected)$/i) || i.warning('attribute "' + a + '" missed value!! "' + a + '" instead2!!'), 
                                                n.add(a, a, t), t = c, u = D;
                                                break;

                                              case R:
                                                i.warning('attribute space is required"' + a + '"!!');

                                              case L:
                                                u = D, t = c;
                                                break;

                                              case j:
                                                u = I, t = c;
                                                break;

                                              case k:
                                                throw new Error("elements closed character '/' and '>' must be connected to");
                                            }
                                        }
                                        c++;
                                    }
                                }(n, g, O, S, a, i), T = O.length;
                                if (!O.closed && function(e, t, n, r) {
                                    var o = r[n];
                                    null == o && ((o = e.lastIndexOf("</" + n + ">")) < t && (o = e.lastIndexOf("</" + n)), 
                                    r[n] = o);
                                    return o < t;
                                }(n, b, O.tagName, p) && (O.closed = !0, r.nbsp || i.warning("unclosed xml attribute")), 
                                f && T) {
                                    for (var N = F(f, {}), M = 0; M < T; M++) {
                                        var A = O[M];
                                        c(A.offset), A.locator = F(f, {});
                                    }
                                    o.locator = N, H(O, o, S) && d.push(O), o.locator = f;
                                } else H(O, o, S) && d.push(O);
                                "http://www.w3.org/1999/xhtml" !== O.uri || O.closed ? b++ : b = function(e, t, n, r, o) {
                                    if (/^(?:script|textarea)$/i.test(n)) {
                                        var i = e.indexOf("</" + n + ">", t), e = e.substring(t + 1, i);
                                        if (/[&<]/.test(e)) return /^script$/i.test(n) || (e = e.replace(/&#?\w+;/g, r)), 
                                        o.characters(e, 0, e.length), i;
                                    }
                                    return t + 1;
                                }(n, b, O.tagName, a, o);
                            }
                        } catch (e) {
                            i.error("element parse error: " + e), b = -1;
                        }
                        h < b ? h = b : t(Math.max(g, h) + 1);
                    }
                }(e, t, n, r, this.errorHandler), r.endDocument();
            }
        }, B.prototype = {
            setTagName: function setTagName(e) {
                if (!i.test(e)) throw new Error("invalid tagName:" + e);
                this.tagName = e;
            },
            add: function add(e, t, n) {
                if (!i.test(e)) throw new Error("invalid attribute:" + e);
                this[this.length++] = {
                    qName: e,
                    value: t,
                    offset: n
                };
            },
            length: 0,
            getLocalName: function getLocalName(e) {
                return this[e].localName;
            },
            getLocator: function getLocator(e) {
                return this[e].locator;
            },
            getQName: function getQName(e) {
                return this[e].qName;
            },
            getURI: function getURI(e) {
                return this[e].uri;
            },
            getValue: function getValue(e) {
                return this[e].value;
            }
        }, n.XMLReader = a;
    }, {} ],
    23: [ function(e, t, n) {
        "use strict";
        var r = GameGlobal, o = r.__globalAdapter = {};
        Object.assign(o, {
            init: function init() {
                e("./wrapper/builtin"), r.DOMParser = e("../../common/xmldom/dom-parser").DOMParser, 
                e("./wrapper/unify"), e("./wrapper/fs-utils"), e("../../common/engine/globalAdapter"), 
                e("./wrapper/systemInfo");
            },
            adaptEngine: function adaptEngine() {
                e("./wrapper/error-reporter"), e("../../common/engine"), e("./wrapper/engine"), 
                e("./wrapper/sub-context-adapter");
            }
        });
    }, {
        "../../common/engine": 16,
        "../../common/engine/globalAdapter": 15,
        "../../common/xmldom/dom-parser": 19,
        "./wrapper/builtin": 46,
        "./wrapper/engine": 53,
        "./wrapper/error-reporter": 55,
        "./wrapper/fs-utils": 56,
        "./wrapper/sub-context-adapter": 1,
        "./wrapper/systemInfo": 57,
        "./wrapper/unify": 58
    } ],
    24: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./HTMLAudioElement")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function c() {
            return (c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                var r = function(e, t) {
                    for (;!Object.prototype.hasOwnProperty.call(e, t) && null !== (e = l(e)); ) {}
                    return e;
                }(e, t);
                if (r) {
                    t = Object.getOwnPropertyDescriptor(r, t);
                    return t.get ? t.get.call(arguments.length < 3 ? e : n) : t.value;
                }
            }).apply(this, arguments);
        }
        function u(e, t) {
            return (u = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function s(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = l(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = l(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function l(e) {
            return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        var f = 1, d = {}, e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && u(e, t);
            }(o, i["default"]);
            var e, t, n, r = s(o);
            function o(e) {
                var t;
                !function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), (t = r.call(this))._$sn = f++, t.HAVE_NOTHING = 0, t.HAVE_METADATA = 1, 
                t.HAVE_CURRENT_DATA = 2, t.HAVE_FUTURE_DATA = 3, t.HAVE_ENOUGH_DATA = 4, t.readyState = 0;
                var n = wx.createInnerAudioContext();
                return d[t._$sn] = n, t._canplayEvents = [ "load", "loadend", "canplay", "canplaythrough", "loadedmetadata" ], 
                n.onCanplay(function() {
                    t._loaded = !0, t.readyState = t.HAVE_CURRENT_DATA, t._canplayEvents.forEach(function(e) {
                        t.dispatchEvent({
                            type: e
                        });
                    });
                }), n.onPlay(function() {
                    t._paused = d[t._$sn].paused, t.dispatchEvent({
                        type: "play"
                    });
                }), n.onPause(function() {
                    t._paused = d[t._$sn].paused, t.dispatchEvent({
                        type: "pause"
                    });
                }), n.onEnded(function() {
                    t._paused = d[t._$sn].paused, !1 === d[t._$sn].loop && t.dispatchEvent({
                        type: "ended"
                    }), t.readyState = 4;
                }), n.onError(function() {
                    t._paused = d[t._$sn].paused, t.dispatchEvent({
                        type: "error"
                    });
                }), e ? t.src = e : t._src = "", t._loop = n.loop, t._autoplay = n.autoplay, t._paused = n.paused, 
                t._volume = n.volume, t._muted = !1, t;
            }
            return e = o, (t = [ {
                key: "addEventListener",
                value: function value(e, t) {
                    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                    c(l(o.prototype), "addEventListener", this).call(this, e, t, n), e = String(e).toLowerCase(), 
                    this._loaded && -1 !== this._canplayEvents.indexOf(e) && this.dispatchEvent({
                        type: e
                    });
                }
            }, {
                key: "load",
                value: function value() {}
            }, {
                key: "play",
                value: function value() {
                    d[this._$sn].play();
                }
            }, {
                key: "resume",
                value: function value() {
                    d[this._$sn].resume();
                }
            }, {
                key: "pause",
                value: function value() {
                    d[this._$sn].pause();
                }
            }, {
                key: "stop",
                value: function value() {
                    d[this._$sn].stop();
                }
            }, {
                key: "destroy",
                value: function value() {
                    d[this._$sn].destroy();
                }
            }, {
                key: "canPlayType",
                value: function value() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";
                    return "string" == typeof e && (-1 < e.indexOf("audio/mpeg") || e.indexOf("audio/mp4")) ? "probably" : "";
                }
            }, {
                key: "currentTime",
                get: function get() {
                    return d[this._$sn].currentTime;
                },
                set: function set(e) {
                    d[this._$sn].seek(e);
                }
            }, {
                key: "duration",
                get: function get() {
                    return d[this._$sn].duration;
                }
            }, {
                key: "src",
                get: function get() {
                    return this._src;
                },
                set: function set(e) {
                    this._src = e, this._loaded = !1, this.readyState = this.HAVE_NOTHING, d[this._$sn].src = e;
                }
            }, {
                key: "loop",
                get: function get() {
                    return this._loop;
                },
                set: function set(e) {
                    this._loop = e, d[this._$sn].loop = e;
                }
            }, {
                key: "autoplay",
                get: function get() {
                    return this.autoplay;
                },
                set: function set(e) {
                    this._autoplay = e, d[this._$sn].autoplay = e;
                }
            }, {
                key: "paused",
                get: function get() {
                    return this._paused;
                }
            }, {
                key: "volume",
                get: function get() {
                    return this._volume;
                },
                set: function set(e) {
                    this._volume = e, this._muted || (d[this._$sn].volume = e);
                }
            }, {
                key: "muted",
                get: function get() {
                    return this._muted;
                },
                set: function set(e) {
                    this._muted = e, d[this._$sn].volume = e ? 0 : this._volume;
                }
            }, {
                key: "cloneNode",
                value: function value() {
                    var e = new o();
                    return e.loop = this.loop, e.autoplay = this.autoplay, e.src = this.src, e;
                }
            } ]) && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), o;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./HTMLAudioElement": 32
    } ],
    25: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = function() {
            var e = wx.createCanvas();
            e.type = "canvas";
            e.getContext;
            return e.getBoundingClientRect = function() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            }, e.style = {
                top: "0px",
                left: "0px",
                width: r.innerWidth + "px",
                height: r.innerHeight + "px"
            }, e.addEventListener = function(e, t) {
                document.addEventListener(e, t, 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {});
            }, e.removeEventListener = function(e, t) {
                document.removeEventListener(e, t);
            }, e.dispatchEvent = function() {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
                console.log("canvas.dispatchEvent", e.type, e);
            }, Object.defineProperty(e, "clientWidth", {
                enumerable: !0,
                get: function get() {
                    return r.innerWidth;
                }
            }), Object.defineProperty(e, "clientHeight", {
                enumerable: !0,
                get: function get() {
                    return r.innerHeight;
                }
            }), e;
        };
        var r = e("./WindowProperties");
        t.exports = n.default;
    }, {
        "./WindowProperties": 43
    } ],
    26: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./Node")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function c(e, t) {
            return (c = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function u(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = s(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = s(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function s(e) {
            return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && c(e, t);
            }(o, i["default"]);
            var e, t, n, r = u(o);
            function o() {
                var e;
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), (e = r.call(this)).className = "", e.children = [], e;
            }
            return e = o, t && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./Node": 40
    } ],
    27: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function o(e, t, n) {
            return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0, n.default = o(function e() {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e);
        }), t.exports = n.default;
    }, {} ],
    28: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var r = e("../util/index.js");
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function i(e, t, n) {
            return t && o(e.prototype, t), n && o(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }
        var a = i(function e(t) {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), this.touches = [], this.targetTouches = [], this.changedTouches = [], 
            this.preventDefault = r.noop, this.stopPropagation = r.noop, this.type = t, this.target = window.canvas, 
            this.currentTarget = window.canvas;
        });
        function c(n) {
            return function(e) {
                var t = new a(n);
                t.touches = e.touches, t.targetTouches = Array.prototype.slice.call(e.touches), 
                t.changedTouches = e.changedTouches, t.timeStamp = e.timeStamp, document.dispatchEvent(t);
            };
        }
        n.default = a, wx.onTouchStart(c("touchstart")), wx.onTouchMove(c("touchmove")), 
        wx.onTouchEnd(c("touchend")), wx.onTouchCancel(c("touchcancel")), t.exports = n.default;
    }, {
        "../util/index.js": 50
    } ],
    29: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), Object.defineProperty(n, "MouseEvent", {
            enumerable: !0,
            get: function get() {
                return o.default;
            }
        }), Object.defineProperty(n, "TouchEvent", {
            enumerable: !0,
            get: function get() {
                return r.default;
            }
        });
        var r = i(e("./TouchEvent")), o = i(e("./MouseEvent"));
        function i(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        }
    }, {
        "./MouseEvent": 27,
        "./TouchEvent": 28
    } ],
    30: [ function(e, t, n) {
        "use strict";
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = new WeakMap();
        n.default = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, e), i.set(this, {});
            }
            var t, n, r;
            return t = e, (n = [ {
                key: "addEventListener",
                value: function value(e, t) {
                    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}, r = i.get(this);
                    r || i.set(this, r = {}), r[e] || (r[e] = []), r[e].push(t), n.capture, n.once, 
                    n.passive;
                }
            }, {
                key: "removeEventListener",
                value: function value(e, t) {
                    var n = i.get(this);
                    if (n) {
                        var r = n[e];
                        if (r && 0 < r.length) for (var o = r.length; o--; ) {
                            if (r[o] === t) {
                                r.splice(o, 1);
                                break;
                            }
                        }
                    }
                }
            }, {
                key: "dispatchEvent",
                value: function value() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, t = i.get(this)[e.type];
                    if (t) for (var n = 0; n < t.length; n++) {
                        t[n](e);
                    }
                }
            } ]) && o(t.prototype, n), r && o(t, r), Object.defineProperty(t, "prototype", {
                writable: !1
            }), e;
        }(), t.exports = n.default;
    }, {} ],
    31: [ function(e, t, n) {
        "use strict";
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0, n.default = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, e);
            }
            var t, n, r;
            return t = e, (n = [ {
                key: "construct",
                value: function value() {}
            } ]) && o(t.prototype, n), r && o(t, r), Object.defineProperty(t, "prototype", {
                writable: !1
            }), e;
        }(), t.exports = n.default;
    }, {} ],
    32: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./HTMLMediaElement")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function c(e, t) {
            return (c = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function u(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = s(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = s(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function s(e) {
            return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && c(e, t);
            }(o, i["default"]);
            var e, t, n, r = u(o);
            function o() {
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), r.call(this, "audio");
            }
            return e = o, t && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./HTMLMediaElement": 36
    } ],
    33: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var r = o(e("./Canvas"));
        o(e("./HTMLElement"));
        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        }
        GameGlobal.screencanvas = GameGlobal.screencanvas || new r.default();
        r = GameGlobal.screencanvas.constructor;
        n.default = r, t.exports = n.default;
    }, {
        "./Canvas": 25,
        "./HTMLElement": 34
    } ],
    34: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var r, i = (r = e("./Element")) && r.__esModule ? r : {
            default: r
        }, a = e("./util/index.js"), c = e("./WindowProperties");
        function u(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function s(e, t) {
            return (s = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function l(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = f(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = f(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function f(e) {
            return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && s(e, t);
            }(o, i["default"]);
            var e, t, n, r = l(o);
            function o() {
                var e, t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), (e = r.call(this)).className = "", e.childern = [], e.style = {
                    width: "".concat(c.innerWidth, "px"),
                    height: "".concat(c.innerHeight, "px")
                }, e.insertBefore = a.noop, e.innerHTML = "", e.tagName = t.toUpperCase(), e;
            }
            return e = o, (t = [ {
                key: "setAttribute",
                value: function value(e, t) {
                    this[e] = t;
                }
            }, {
                key: "getAttribute",
                value: function value(e) {
                    return this[e];
                }
            }, {
                key: "clientWidth",
                get: function get() {
                    var e = parseInt(this.style.fontSize, 10) * this.innerHTML.length;
                    return Number.isNaN(e) ? 0 : e;
                }
            }, {
                key: "clientHeight",
                get: function get() {
                    var e = parseInt(this.style.fontSize, 10);
                    return Number.isNaN(e) ? 0 : e;
                }
            }, {
                key: "getBoundingClientRect",
                value: function value() {
                    return {
                        top: 0,
                        left: 0,
                        width: c.innerWidth,
                        height: c.innerHeight
                    };
                }
            }, {
                key: "focus",
                value: function value() {}
            } ]) && u(e.prototype, t), n && u(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), o;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./Element": 26,
        "./WindowProperties": 43,
        "./util/index.js": 50
    } ],
    35: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        (e = e("./HTMLElement")) && e.__esModule;
        e = wx.createImage().constructor;
        n.default = e, t.exports = n.default;
    }, {
        "./HTMLElement": 34
    } ],
    36: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./HTMLElement")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function c(e, t) {
            return (c = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function u(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = s(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = s(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function s(e) {
            return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && c(e, t);
            }(o, i["default"]);
            var e, t, n, r = u(o);
            function o(e) {
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), r.call(this, e);
            }
            return e = o, (t = [ {
                key: "addTextTrack",
                value: function value() {}
            }, {
                key: "captureStream",
                value: function value() {}
            }, {
                key: "fastSeek",
                value: function value() {}
            }, {
                key: "load",
                value: function value() {}
            }, {
                key: "pause",
                value: function value() {}
            }, {
                key: "play",
                value: function value() {}
            } ]) && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), o;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./HTMLElement": 34
    } ],
    37: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./HTMLMediaElement")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function c(e, t) {
            return (c = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function u(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = s(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = s(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function s(e) {
            return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && c(e, t);
            }(o, i["default"]);
            var e, t, n, r = u(o);
            function o() {
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), r.call(this, "video");
            }
            return e = o, t && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./HTMLMediaElement": 36
    } ],
    38: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = function() {
            return wx.createImage();
        };
        (e = e("./HTMLImageElement")) && e.__esModule;
        t.exports = n.default;
    }, {
        "./HTMLImageElement": 35
    } ],
    39: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function o(e, t, n) {
            return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0, n.default = o(function e() {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e);
        }), t.exports = n.default;
    }, {} ],
    40: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./EventTarget.js")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function c(e, t) {
            return (c = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function u(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = s(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function(e) {
                        if (void 0 !== e) return e;
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }(e);
                }(this, r ? (e = s(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function s(e) {
            return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && c(e, t);
            }(o, i["default"]);
            var e, t, n, r = u(o);
            function o() {
                var e;
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, o), (e = r.call(this)).childNodes = [], e;
            }
            return e = o, (t = [ {
                key: "appendChild",
                value: function value(e) {
                    this.childNodes.push(e);
                }
            }, {
                key: "cloneNode",
                value: function value() {
                    var e = Object.create(this);
                    return Object.assign(e, this), e;
                }
            }, {
                key: "removeChild",
                value: function value(t) {
                    var e = this.childNodes.findIndex(function(e) {
                        return e === t;
                    });
                    return -1 < e ? this.childNodes.splice(e, 1) : null;
                }
            } ]) && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), o;
        }();
        n.default = e, t.exports = n.default;
    }, {
        "./EventTarget.js": 30
    } ],
    41: [ function(e, t, n) {
        "use strict";
        function r(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function o(e, t, n) {
            return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), e;
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0, n.default = o(function e() {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e);
        }), t.exports = n.default;
    }, {} ],
    42: [ function(e, t, n) {
        "use strict";
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = new WeakMap(), r = function() {
            function r(e) {
                var t = this, n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [];
                if (!function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, r), this.binaryType = "", this.bufferedAmount = 0, this.extensions = "", 
                this.onclose = null, this.onerror = null, this.onmessage = null, this.onopen = null, 
                this.protocol = "", this.readyState = 3, "string" != typeof e || !/(^ws:\/\/)|(^wss:\/\/)/.test(e)) throw new TypeError("Failed to construct 'WebSocket': The URL '".concat(e, "' is invalid"));
                this.url = e, this.readyState = r.CONNECTING;
                n = wx.connectSocket({
                    url: e,
                    protocols: Array.isArray(n) ? n : [ n ],
                    tcpNoDelay: !0
                });
                return i.set(this, n), n.onClose(function(e) {
                    t.readyState = r.CLOSED, "function" == typeof t.onclose && t.onclose(e);
                }), n.onMessage(function(e) {
                    "function" == typeof t.onmessage && t.onmessage(e);
                }), n.onOpen(function() {
                    t.readyState = r.OPEN, "function" == typeof t.onopen && t.onopen();
                }), n.onError(function(e) {
                    "function" == typeof t.onerror && t.onerror(new Error(e.errMsg));
                }), this;
            }
            var e, t, n;
            return e = r, (t = [ {
                key: "close",
                value: function value(e, t) {
                    this.readyState = r.CLOSING, i.get(this).close({
                        code: e,
                        reason: t
                    });
                }
            }, {
                key: "send",
                value: function value(e) {
                    if (!("string" == typeof e || e instanceof ArrayBuffer || ArrayBuffer.isView(e))) throw new TypeError("Failed to send message: The data ".concat(e, " is invalid"));
                    i.get(this).send({
                        data: e
                    });
                }
            } ]) && o(e.prototype, t), n && o(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), r;
        }();
        (n.default = r).CONNECTING = 0, r.OPEN = 1, r.CLOSING = 2, r.CLOSED = 3, t.exports = n.default;
    }, {} ],
    43: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.screen = n.performance = n.ontouchstart = n.ontouchmove = n.ontouchend = n.innerWidth = n.innerHeight = n.devicePixelRatio = void 0;
        var r = wx.getSystemInfoSync(), o = r.screenWidth, i = r.screenHeight, a = r.devicePixelRatio;
        n.devicePixelRatio = a;
        r = o;
        n.innerWidth = r;
        a = i;
        n.innerHeight = a, n.screen = {
            width: o,
            height: i,
            availWidth: r,
            availHeight: a,
            availLeft: 0,
            availTop: 0
        };
        a = {
            now: Date.now
        };
        n.performance = a;
        n.ontouchstart = null;
        n.ontouchmove = null;
        n.ontouchend = null;
    }, {} ],
    44: [ function(e, t, n) {
        "use strict";
        function o(e) {
            return (o = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var i = (e = e("./EventTarget.js")) && e.__esModule ? e : {
            default: e
        };
        function a(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        function u(e, t) {
            return (u = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e;
            })(e, t);
        }
        function s(n) {
            var r = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var e, t = c(n);
                return function(e, t) {
                    {
                        if (t && ("object" === o(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return l(e);
                }(this, r ? (e = c(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments));
            };
        }
        function l(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
        }
        function c(e) {
            return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
        }
        var f = new WeakMap(), d = new WeakMap(), p = new WeakMap(), h = new WeakMap(), m = new WeakMap();
        function y(e) {
            if ("function" == typeof this["on".concat(e)]) {
                for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) {
                    n[r - 1] = arguments[r];
                }
                this["on".concat(e)].apply(this, n);
            }
        }
        function g(e) {
            this.readyState = e, y.call(this, "readystatechange");
        }
        e = function() {
            !function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && u(e, t);
            }(c, i["default"]);
            var e, t, n, r = s(c);
            function c() {
                var e;
                return function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                }(this, c), (e = r.call(this)).timeout = 0, e.onabort = null, e.onerror = null, 
                e.onload = null, e.onloadstart = null, e.onprogress = null, e.ontimeout = null, 
                e.onloadend = null, e.onreadystatechange = null, e.readyState = 0, e.response = null, 
                e.responseText = null, e.responseType = "", e.responseXML = null, e.status = 0, 
                e.statusText = "", e.upload = {}, e.withCredentials = !1, p.set(l(e), {
                    "content-type": "application/x-www-form-urlencoded"
                }), h.set(l(e), {}), e;
            }
            return e = c, (t = [ {
                key: "abort",
                value: function value() {
                    var e = m.get(this);
                    e && e.abort();
                }
            }, {
                key: "getAllResponseHeaders",
                value: function value() {
                    var t = h.get(this);
                    return Object.keys(t).map(function(e) {
                        return "".concat(e, ": ").concat(t[e]);
                    }).join("\n");
                }
            }, {
                key: "getResponseHeader",
                value: function value(e) {
                    return h.get(this)[e];
                }
            }, {
                key: "open",
                value: function value(e, t) {
                    d.set(this, e), f.set(this, t), g.call(this, c.OPENED);
                }
            }, {
                key: "overrideMimeType",
                value: function value() {}
            }, {
                key: "send",
                value: function value() {
                    var a = this, e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";
                    if (this.readyState !== c.OPENED) throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
                    e = wx.request({
                        data: e,
                        url: f.get(this),
                        method: d.get(this),
                        header: p.get(this),
                        dataType: "other",
                        responseType: "arraybuffer" === this.responseType ? "arraybuffer" : "text",
                        timeout: this.timeout || void 0,
                        success: function success(e) {
                            var t = e.data, n = e.statusCode, e = e.header;
                            switch (a.status = n, h.set(a, e), y.call(a, "loadstart"), g.call(a, c.HEADERS_RECEIVED), 
                            g.call(a, c.LOADING), a.responseType) {
                              case "json":
                                a.responseText = t;
                                try {
                                    a.response = JSON.parse(t);
                                } catch (e) {
                                    a.response = null;
                                }
                                break;

                              case "":
                              case "text":
                                a.responseText = a.response = t;
                                break;

                              case "arraybuffer":
                                a.response = t, a.responseText = "";
                                for (var r = new Uint8Array(t), o = r.byteLength, i = 0; i < o; i++) {
                                    a.responseText += String.fromCharCode(r[i]);
                                }
                                break;

                              default:
                                a.response = null;
                            }
                            g.call(a, c.DONE), y.call(a, "load"), y.call(a, "loadend");
                        },
                        fail: function fail(e) {
                            e = e.errMsg;
                            -1 !== e.indexOf("abort") ? y.call(a, "abort") : -1 !== e.indexOf("timeout") ? y.call(a, "timeout") : y.call(a, "error", e), 
                            y.call(a, "loadend");
                        }
                    });
                    m.set(this, e);
                }
            }, {
                key: "setRequestHeader",
                value: function value(e, t) {
                    var n = p.get(this);
                    n[e] = t, p.set(this, n);
                }
            }, {
                key: "addEventListener",
                value: function value(e, t) {
                    var n;
                    "function" == typeof t && (n = this, this["on" + e] = function(e) {
                        t.call(n, e);
                    });
                }
            } ]) && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", {
                writable: !1
            }), c;
        }();
        (n.default = e).UNSEND = 0, e.OPENED = 1, e.HEADERS_RECEIVED = 2, e.LOADING = 3, 
        e.DONE = 4, t.exports = n.default;
    }, {
        "./EventTarget.js": 30
    } ],
    45: [ function(e, t, n) {
        "use strict";
        function a(e) {
            return (a = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var r = function(e, t) {
            if (!t && e && e.__esModule) return e;
            if (null === e || "object" !== a(e) && "function" != typeof e) return {
                default: e
            };
            t = f(t);
            if (t && t.has(e)) return t.get(e);
            var n, r = {}, o = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (n in e) {
                var i;
                "default" !== n && Object.prototype.hasOwnProperty.call(e, n) && ((i = o ? Object.getOwnPropertyDescriptor(e, n) : null) && (i.get || i.set) ? Object.defineProperty(r, n, i) : r[n] = e[n]);
            }
            r.default = e, t && t.set(e, r);
            return r;
        }(e("./window")), o = l(e("./HTMLElement")), i = l(e("./HTMLVideoElement")), c = l(e("./Image")), u = l(e("./Audio")), s = l(e("./Canvas"));
        function l(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        }
        function f(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(), n = new WeakMap();
            return (f = function f(e) {
                return e ? n : t;
            })(e);
        }
        e("./EventIniter/index.js");
        var d = {}, p = {
            readyState: "complete",
            visibilityState: "visible",
            documentElement: r,
            hidden: !1,
            style: {},
            location: r.location,
            ontouchstart: null,
            ontouchmove: null,
            ontouchend: null,
            head: new o.default("head"),
            body: new o.default("body"),
            createElement: function createElement(e) {
                return "canvas" === e ? new s.default() : "audio" === e ? new u.default() : "img" === e ? new c.default() : "video" === e ? new i.default() : new o.default(e);
            },
            createElementNS: function createElementNS(e, t) {
                return this.createElement(t);
            },
            getElementById: function getElementById(e) {
                return e === r.canvas.id ? r.canvas : null;
            },
            getElementsByTagName: function getElementsByTagName(e) {
                return "head" === e ? [ p.head ] : "body" === e ? [ p.body ] : "canvas" === e ? [ r.canvas ] : [];
            },
            getElementsByName: function getElementsByName(e) {
                return "head" === e ? [ p.head ] : "body" === e ? [ p.body ] : "canvas" === e ? [ r.canvas ] : [];
            },
            querySelector: function querySelector(e) {
                return "head" === e ? p.head : "body" === e ? p.body : "canvas" === e || e === "#".concat(r.canvas.id) ? r.canvas : null;
            },
            querySelectorAll: function querySelectorAll(e) {
                return "head" === e ? [ p.head ] : "body" === e ? [ p.body ] : "canvas" === e ? [ r.canvas ] : [];
            },
            addEventListener: function addEventListener(e, t) {
                d[e] || (d[e] = []), d[e].push(t);
            },
            removeEventListener: function removeEventListener(e, t) {
                var n = d[e];
                if (n && 0 < n.length) for (var r = n.length; r--; ) {
                    if (n[r] === t) {
                        n.splice(r, 1);
                        break;
                    }
                }
            },
            dispatchEvent: function dispatchEvent(e) {
                var t = d[e.type];
                if (t) for (var n = 0; n < t.length; n++) {
                    t[n](e);
                }
            }
        };
        n.default = p, t.exports = n.default;
    }, {
        "./Audio": 24,
        "./Canvas": 25,
        "./EventIniter/index.js": 29,
        "./HTMLElement": 34,
        "./HTMLVideoElement": 37,
        "./Image": 38,
        "./window": 51
    } ],
    46: [ function(e, t, n) {
        "use strict";
        function a(e) {
            return (a = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
                return _typeof2(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
            })(e);
        }
        var c = function(e, t) {
            if (!t && e && e.__esModule) return e;
            if (null === e || "object" !== a(e) && "function" != typeof e) return {
                default: e
            };
            t = s(t);
            if (t && t.has(e)) return t.get(e);
            var n, r = {}, o = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (n in e) {
                var i;
                "default" !== n && Object.prototype.hasOwnProperty.call(e, n) && ((i = o ? Object.getOwnPropertyDescriptor(e, n) : null) && (i.get || i.set) ? Object.defineProperty(r, n, i) : r[n] = e[n]);
            }
            r.default = e, t && t.set(e, r);
            return r;
        }(e("./window")), u = r(e("./document"));
        r(e("./HTMLElement"));
        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        }
        function s(e) {
            if ("function" != typeof WeakMap) return null;
            var t = new WeakMap(), n = new WeakMap();
            return (s = function s(e) {
                return e ? n : t;
            })(e);
        }
        var l = GameGlobal;
        GameGlobal.__isAdapterInjected || (GameGlobal.__isAdapterInjected = !0, function() {
            c.document = u.default, c.addEventListener = function(e, t) {
                c.document.addEventListener(e, t);
            }, c.removeEventListener = function(e, t) {
                c.document.removeEventListener(e, t);
            }, c.dispatchEvent = c.document.dispatchEvent;
            var e = wx.getSystemInfoSync().platform;
            if ("undefined" == typeof __devtoolssubcontext && "devtools" === e) {
                for (var t in c) {
                    var n = Object.getOwnPropertyDescriptor(l, t);
                    n && !0 !== n.configurable || Object.defineProperty(window, t, {
                        value: c[t]
                    });
                }
                for (var r in c.document) {
                    var o = Object.getOwnPropertyDescriptor(l.document, r);
                    o && !0 !== o.configurable || Object.defineProperty(l.document, r, {
                        value: c.document[r]
                    });
                }
                window.parent = window;
            } else {
                for (var i in c) {
                    l[i] = c[i];
                }
                l.window = c, window = l, window.top = window.parent = window;
            }
        }());
    }, {
        "./HTMLElement": 34,
        "./document": 45,
        "./window": 51
    } ],
    47: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0, n.default = {
            get length() {
                return wx.getStorageInfoSync().keys.length;
            },
            key: function key(e) {
                return wx.getStorageInfoSync().keys[e];
            },
            getItem: function getItem(e) {
                return wx.getStorageSync(e);
            },
            setItem: function setItem(e, t) {
                return wx.setStorageSync(e, t);
            },
            removeItem: function removeItem(e) {
                wx.removeStorageSync(e);
            },
            clear: function clear() {
                wx.clearStorageSync();
            }
        }, t.exports = n.default;
    }, {} ],
    48: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        n.default = {
            href: "game.js",
            reload: function reload() {}
        }, t.exports = n.default;
    }, {} ],
    49: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.default = void 0;
        var r = e("./util/index.js"), o = wx.getSystemInfoSync();
        console.log(o);
        var i = o.system, a = o.platform, e = o.language, o = o.version, i = !!i && -1 !== i.toLowerCase().indexOf("android") ? "Android; CPU ".concat(i) : "iPhone; CPU iPhone OS ".concat(i, " like Mac OS X"), o = "Mozilla/5.0 (".concat(i, ") AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/").concat(o, " MiniGame NetType/WIFI Language/").concat(e), c = {
            platform: a,
            language: e,
            appVersion: "5.0 (".concat(i, ") AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"),
            userAgent: o,
            onLine: !0,
            geolocation: {
                getCurrentPosition: r.noop,
                watchPosition: r.noop,
                clearWatch: r.noop
            }
        };
        wx.onNetworkStatusChange && wx.onNetworkStatusChange(function(e) {
            c.onLine = e.isConnected;
        }), n.default = c, t.exports = n.default;
    }, {
        "./util/index.js": 50
    } ],
    50: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.noop = function() {};
    }, {} ],
    51: [ function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = {
            canvas: !0,
            setTimeout: !0,
            setInterval: !0,
            clearTimeout: !0,
            clearInterval: !0,
            requestAnimationFrame: !0,
            cancelAnimationFrame: !0,
            navigator: !0,
            XMLHttpRequest: !0,
            WebSocket: !0,
            Image: !0,
            ImageBitmap: !0,
            Audio: !0,
            FileReader: !0,
            HTMLElement: !0,
            HTMLImageElement: !0,
            HTMLCanvasElement: !0,
            HTMLMediaElement: !0,
            HTMLAudioElement: !0,
            HTMLVideoElement: !0,
            WebGLRenderingContext: !0,
            TouchEvent: !0,
            MouseEvent: !0,
            DeviceMotionEvent: !0,
            localStorage: !0,
            location: !0
        };
        Object.defineProperty(n, "Audio", {
            enumerable: !0,
            get: function get() {
                return l.default;
            }
        }), Object.defineProperty(n, "DeviceMotionEvent", {
            enumerable: !0,
            get: function get() {
                return v.DeviceMotionEvent;
            }
        }), Object.defineProperty(n, "FileReader", {
            enumerable: !0,
            get: function get() {
                return f.default;
            }
        }), Object.defineProperty(n, "HTMLAudioElement", {
            enumerable: !0,
            get: function get() {
                return y.default;
            }
        }), Object.defineProperty(n, "HTMLCanvasElement", {
            enumerable: !0,
            get: function get() {
                return h.default;
            }
        }), Object.defineProperty(n, "HTMLElement", {
            enumerable: !0,
            get: function get() {
                return d.default;
            }
        }), Object.defineProperty(n, "HTMLImageElement", {
            enumerable: !0,
            get: function get() {
                return p.default;
            }
        }), Object.defineProperty(n, "HTMLMediaElement", {
            enumerable: !0,
            get: function get() {
                return m.default;
            }
        }), Object.defineProperty(n, "HTMLVideoElement", {
            enumerable: !0,
            get: function get() {
                return g.default;
            }
        }), Object.defineProperty(n, "Image", {
            enumerable: !0,
            get: function get() {
                return u.default;
            }
        }), Object.defineProperty(n, "ImageBitmap", {
            enumerable: !0,
            get: function get() {
                return s.default;
            }
        }), Object.defineProperty(n, "MouseEvent", {
            enumerable: !0,
            get: function get() {
                return v.MouseEvent;
            }
        }), Object.defineProperty(n, "TouchEvent", {
            enumerable: !0,
            get: function get() {
                return v.TouchEvent;
            }
        }), Object.defineProperty(n, "WebGLRenderingContext", {
            enumerable: !0,
            get: function get() {
                return b.default;
            }
        }), Object.defineProperty(n, "WebSocket", {
            enumerable: !0,
            get: function get() {
                return c.default;
            }
        }), Object.defineProperty(n, "XMLHttpRequest", {
            enumerable: !0,
            get: function get() {
                return a.default;
            }
        }), n.clearTimeout = n.clearInterval = n.canvas = n.cancelAnimationFrame = void 0, 
        Object.defineProperty(n, "localStorage", {
            enumerable: !0,
            get: function get() {
                return w.default;
            }
        }), Object.defineProperty(n, "location", {
            enumerable: !0,
            get: function get() {
                return _.default;
            }
        }), Object.defineProperty(n, "navigator", {
            enumerable: !0,
            get: function get() {
                return i.default;
            }
        }), n.setTimeout = n.setInterval = n.requestAnimationFrame = void 0;
        var o = x(e("./Canvas")), i = x(e("./navigator")), a = x(e("./XMLHttpRequest")), c = x(e("./WebSocket")), u = x(e("./Image")), s = x(e("./ImageBitmap")), l = x(e("./Audio")), f = x(e("./FileReader")), d = x(e("./HTMLElement")), p = x(e("./HTMLImageElement")), h = x(e("./HTMLCanvasElement")), m = x(e("./HTMLMediaElement")), y = x(e("./HTMLAudioElement")), g = x(e("./HTMLVideoElement")), b = x(e("./WebGLRenderingContext")), v = e("./EventIniter/index.js"), w = x(e("./localStorage")), _ = x(e("./location")), E = e("./WindowProperties");
        function x(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        }
        Object.keys(E).forEach(function(e) {
            "default" !== e && "__esModule" !== e && (Object.prototype.hasOwnProperty.call(r, e) || e in n && n[e] === E[e] || Object.defineProperty(n, e, {
                enumerable: !0,
                get: function get() {
                    return E[e];
                }
            }));
        }), GameGlobal.screencanvas = GameGlobal.screencanvas || new o.default();
        var O = GameGlobal.screencanvas;
        n.canvas = O;
        var S = GameGlobal, T = S.setTimeout, N = S.setInterval, e = S.clearTimeout, o = S.clearInterval, O = S.requestAnimationFrame, S = S.cancelAnimationFrame;
        n.cancelAnimationFrame = S, n.requestAnimationFrame = O, n.clearInterval = o, n.clearTimeout = e, 
        n.setInterval = N, n.setTimeout = T;
    }, {
        "./Audio": 24,
        "./Canvas": 25,
        "./EventIniter/index.js": 29,
        "./FileReader": 31,
        "./HTMLAudioElement": 32,
        "./HTMLCanvasElement": 33,
        "./HTMLElement": 34,
        "./HTMLImageElement": 35,
        "./HTMLMediaElement": 36,
        "./HTMLVideoElement": 37,
        "./Image": 38,
        "./ImageBitmap": 39,
        "./WebGLRenderingContext": 41,
        "./WebSocket": 42,
        "./WindowProperties": 43,
        "./XMLHttpRequest": 44,
        "./localStorage": 47,
        "./location": 48,
        "./navigator": 49
    } ],
    52: [ function(e, t, n) {
        "use strict";
        cc.Texture2D && (cc.Texture2D.prototype._checkPackable = function() {
            var e, t, n = cc.dynamicAtlasManager;
            n && (this._isCompressed() ? this._packable = !1 : (e = this.width, t = this.height, 
            !this._image || e > n.maxFrameSize || t > n.maxFrameSize || this._getHash() !== n.Atlas.DEFAULT_HASH ? this._packable = !1 : this._image && this._image.getContext && (this._packable = !0)));
        });
    }, {} ],
    53: [ function(e, t, n) {
        "use strict";
        e("./VideoPlayer"), e("./pc-adapter"), e("./Texture2D");
    }, {
        "./Texture2D": 52,
        "./VideoPlayer": 1,
        "./pc-adapter": 54
    } ],
    54: [ function(e, t, n) {
        "use strict";
        var r = wx.getSystemInfoSync(), i = cc.internal.inputManager, a = cc.internal.eventManager, c = cc.Event.EventKeyboard, u = cc.Event.EventMouse, o = {
            backspace: 8,
            tab: 9,
            enter: 13,
            shift: 16,
            control: 17,
            alt: 18,
            pause: 19,
            capslock: 20,
            escape: 27,
            " ": 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36,
            arrowleft: 37,
            arrowup: 38,
            arrowright: 39,
            arrowdown: 40,
            insert: 45,
            a: 65,
            b: 66,
            c: 67,
            d: 68,
            e: 69,
            f: 70,
            g: 71,
            h: 72,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            m: 77,
            n: 78,
            o: 79,
            p: 80,
            q: 81,
            r: 82,
            s: 83,
            t: 84,
            u: 85,
            v: 86,
            w: 87,
            x: 88,
            y: 89,
            z: 90,
            "*": 106,
            "+": 107,
            "-": 109,
            "/": 111,
            f1: 112,
            f2: 113,
            f3: 114,
            f4: 115,
            f5: 116,
            f6: 117,
            f7: 118,
            f8: 119,
            f9: 120,
            f10: 121,
            f11: 122,
            f12: 123,
            numlock: 144,
            scrolllock: 145,
            ";": 186,
            "=": 187,
            ",": 188,
            ".": 190,
            "`": 192,
            "[": 219,
            "\\": 220,
            "]": 221,
            "'": 222
        }, s = {
            Delete: 46,
            Digit0: 48,
            Digit1: 49,
            Digit2: 50,
            Digit3: 51,
            Digit4: 52,
            Digit5: 53,
            Digit6: 54,
            Digit7: 55,
            Digit8: 56,
            Digit9: 57,
            Numpad0: 96,
            Numpad1: 97,
            Numpad2: 98,
            Numpad3: 99,
            Numpad4: 100,
            Numpad5: 101,
            Numpad6: 102,
            Numpad7: 103,
            Numpad8: 104,
            Numpad9: 105,
            NumpadDecimal: 110
        };
        function l(e) {
            var t = e.key.toLowerCase(), e = e.code;
            return /^\d$/.test(t) || "delete" === t ? s[e] : o[t] || 0;
        }
        __globalAdapter.isSubContext || "windows" !== r.platform || (i.registerSystemEvent = function() {
            var o;
            function e(e, n, r) {
                wx[e](function(e) {
                    var t = i.getMouseEvent(e, o, n);
                    t.setButton(e.button || 0), r(e, t), a.dispatchEvent(t);
                });
            }
            this._isRegisterEvent || (this._glView = cc.view, wx.onKeyDown(function(e) {
                return a.dispatchEvent(new c(l(e), !0));
            }), wx.onKeyUp(function(e) {
                return a.dispatchEvent(new c(l(e), !1));
            }), o = {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            }, e("onMouseDown", u.DOWN, function(e, t) {
                i._mousePressed = !0, i.handleTouchesBegin([ i.getTouchByXY(e.x, e.y, o) ]);
            }), e("onMouseUp", u.UP, function(e, t) {
                i._mousePressed = !1, i.handleTouchesEnd([ i.getTouchByXY(e.x, e.y, o) ]);
            }), e("onMouseMove", u.MOVE, function(e, t) {
                i.handleTouchesMove([ i.getTouchByXY(e.x, e.y, o) ]), i._mousePressed || t.setButton(null);
            }), e("onWheel", u.SCROLL, function(e, t) {
                t.setScrollData(0, -e.deltaY);
            }), this._isRegisterEvent = !0);
        });
    }, {} ],
    55: [ function(e, t, n) {
        "use strict";
        wx.onError && wx.onError(function e(t) {
            wx.offError && wx.offError(e);
            var n, r, o, i = Math.random() < .01;
            !__globalAdapter.isSubContext && i && (!(n = wx.getSystemInfoSync()) || (r = cc.Canvas.instance.node) && ((o = new cc.Node()).color = cc.Color.BLACK, 
            i = o.addComponent(cc.Label), o.height = r.height - 60, o.width = r.width - 60, 
            i.overflow = cc.Label.Overflow.SHRINK, i.horizontalAlign = cc.Label.HorizontalAlign.LEFT, 
            i.verticalAlign = cc.Label.VerticalAlign.TOP, i.fontSize = 24, i.string = "出错了，请截屏发送给游戏开发者（Please send this screenshot to the game developer）\nPlatform: WeChat " + n.version + "\nEngine: Cocos Creator v" + window.CocosEngine + "\nDevice: " + n.brand + " " + n.model + " System: " + n.system + "\nError:\n" + t.message, 
            cc.LabelOutline && (o.addComponent(cc.LabelOutline).color = cc.Color.WHITE), o.once("touchend", function() {
                o.destroy(), setTimeout(function() {
                    cc.director.resume();
                }, 1e3);
            }), o.parent = r, cc.director.pause()));
        });
    }, {} ],
    56: [ function(e, t, n) {
        "use strict";
        var o = wx.getFileSystemManager ? wx.getFileSystemManager() : null, r = /the maximum size of the file storage/, a = {
            fs: o,
            isOutOfStorage: function isOutOfStorage(e) {
                return r.test(e);
            },
            getUserDataPath: function getUserDataPath() {
                return wx.env.USER_DATA_PATH;
            },
            checkFsValid: function checkFsValid() {
                return !!o || (console.warn("can not get the file system!"), !1);
            },
            deleteFile: function deleteFile(t, n) {
                o.unlink({
                    filePath: t,
                    success: function success() {
                        n && n(null);
                    },
                    fail: function fail(e) {
                        console.warn("Delete file failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        n && n(new Error(e.errMsg));
                    }
                });
            },
            downloadFile: function downloadFile(t, e, n, r, o) {
                var i = {
                    url: t,
                    success: function success(e) {
                        200 === e.statusCode ? o && o(null, e.tempFilePath || e.filePath) : (e.filePath && a.deleteFile(e.filePath), 
                        console.warn("Download file failed: path: ".concat(t, " message: ").concat(e.statusCode)), 
                        o && o(new Error(e.statusCode), null));
                    },
                    fail: function fail(e) {
                        console.warn("Download file failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        o && o(new Error(e.errMsg), null);
                    }
                };
                e && (i.filePath = e), n && (i.header = n);
                i = wx.downloadFile(i);
                r && i.onProgressUpdate(r);
            },
            saveFile: function saveFile(t, e, n) {
                wx.saveFile({
                    tempFilePath: t,
                    filePath: e,
                    success: function success(e) {
                        n && n(null);
                    },
                    fail: function fail(e) {
                        console.warn("Save file failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        n && n(new Error(e.errMsg));
                    }
                });
            },
            copyFile: function copyFile(t, e, n) {
                o.copyFile({
                    srcPath: t,
                    destPath: e,
                    success: function success() {
                        n && n(null);
                    },
                    fail: function fail(e) {
                        console.warn("Copy file failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        n && n(new Error(e.errMsg));
                    }
                });
            },
            writeFile: function writeFile(t, e, n, r) {
                o.writeFile({
                    filePath: t,
                    encoding: n,
                    data: e,
                    success: function success() {
                        r && r(null);
                    },
                    fail: function fail(e) {
                        console.warn("Write file failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        r && r(new Error(e.errMsg));
                    }
                });
            },
            writeFileSync: function writeFileSync(t, e, n) {
                try {
                    return o.writeFileSync(t, e, n), null;
                } catch (e) {
                    return console.warn("Write file failed: path: ".concat(t, " message: ").concat(e.message)), 
                    new Error(e.message);
                }
            },
            readFile: function readFile(t, e, n) {
                o.readFile({
                    filePath: t,
                    encoding: e,
                    success: function success(e) {
                        n && n(null, e.data);
                    },
                    fail: function fail(e) {
                        console.warn("Read file failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        n && n(new Error(e.errMsg), null);
                    }
                });
            },
            readDir: function readDir(t, n) {
                o.readdir({
                    dirPath: t,
                    success: function success(e) {
                        n && n(null, e.files);
                    },
                    fail: function fail(e) {
                        console.warn("Read directory failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        n && n(new Error(e.errMsg), null);
                    }
                });
            },
            readText: function readText(e, t) {
                a.readFile(e, "utf8", t);
            },
            readArrayBuffer: function readArrayBuffer(e, t) {
                a.readFile(e, "", t);
            },
            readJson: function readJson(r, o) {
                a.readFile(r, "utf8", function(t, e) {
                    var n = null;
                    if (!t) try {
                        n = JSON.parse(e);
                    } catch (e) {
                        console.warn("Read json failed: path: ".concat(r, " message: ").concat(e.message)), 
                        t = new Error(e.message);
                    }
                    o && o(t, n);
                });
            },
            readJsonSync: function readJsonSync(t) {
                try {
                    var e = o.readFileSync(t, "utf8");
                    return JSON.parse(e);
                } catch (e) {
                    return console.warn("Read json failed: path: ".concat(t, " message: ").concat(e.message)), 
                    new Error(e.message);
                }
            },
            makeDirSync: function makeDirSync(t, e) {
                try {
                    return o.mkdirSync(t, e), null;
                } catch (e) {
                    return console.warn("Make directory failed: path: ".concat(t, " message: ").concat(e.message)), 
                    new Error(e.message);
                }
            },
            rmdirSync: function rmdirSync(t, e) {
                try {
                    o.rmdirSync(t, e);
                } catch (e) {
                    return console.warn("rm directory failed: path: ".concat(t, " message: ").concat(e.message)), 
                    new Error(e.message);
                }
            },
            exists: function exists(e, t) {
                o.access({
                    path: e,
                    success: function success() {
                        t && t(!0);
                    },
                    fail: function fail() {
                        t && t(!1);
                    }
                });
            },
            loadSubpackage: function loadSubpackage(t, e, n) {
                var r = wx.loadSubpackage({
                    name: t,
                    success: function success() {
                        n && n();
                    },
                    fail: function fail(e) {
                        console.warn("Load Subpackage failed: path: ".concat(t, " message: ").concat(e.errMsg)), 
                        n && n(new Error("Failed to load subpackage ".concat(t, ": ").concat(e.errMsg)));
                    }
                });
                return e && r.onProgressUpdate(e), r;
            },
            unzip: function unzip(t, e, n) {
                o.unzip({
                    zipFilePath: t,
                    targetPath: e,
                    success: function success() {
                        n && n(null);
                    },
                    fail: function fail(e) {
                        console.warn("unzip failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error("unzip failed: " + e.errMsg));
                    }
                });
            }
        };
        window.fsUtils = t.exports = a;
    }, {} ],
    57: [ function(e, t, n) {
        "use strict";
        var o = window.__globalAdapter, r = wx.getSystemInfoSync(), i = o.adaptSys;
        Object.assign(o, {
            adaptSys: function adaptSys(e) {
                var t;
                i.call(this, e), "windows" === r.platform ? (e.isMobile = !1, e.os = e.OS_WINDOWS) : o.isDevTool && (-1 < (t = r.system.toLowerCase()).indexOf("android") ? e.os = e.OS_ANDROID : -1 < t.indexOf("ios") && (e.os = e.OS_IOS)), 
                wx.getOpenDataContext ? e.platform = e.WECHAT_GAME : e.platform = e.WECHAT_GAME_SUB, 
                e.getSafeAreaRect = function() {
                    var e = cc.view, t = o.getSafeArea(), n = e.getFrameSize(), r = new cc.Vec2(t.left, t.bottom), t = new cc.Vec2(t.right, t.top), n = {
                        left: 0,
                        top: 0,
                        width: n.width,
                        height: n.height
                    };
                    return e.convertToLocationInView(r.x, r.y, n, r), e.convertToLocationInView(t.x, t.y, n, t), 
                    e._convertPointWithScale(r), e._convertPointWithScale(t), cc.rect(r.x, r.y, t.x - r.x, t.y - r.y);
                };
            }
        });
    }, {} ],
    58: [ function(e, t, n) {
        "use strict";
        var s, l, f, d, r, a, e = e("../../../common/utils");
        function p() {
            var e = wx.getSystemInfoSync();
            return e.deviceOrientation ? "landscape" === e.deviceOrientation : e.screenWidth > e.screenHeight;
        }
        window.__globalAdapter && (s = window.__globalAdapter, l = wx.getSystemInfoSync(), 
        f = l.windowWidth, d = l.windowHeight, s.isSubContext = void 0 === wx.getOpenDataContext, 
        s.isDevTool = "devtools" === l.platform, e.cloneMethod(s, wx, "getSystemInfoSync"), 
        e.cloneMethod(s, wx, "onTouchStart"), e.cloneMethod(s, wx, "onTouchMove"), e.cloneMethod(s, wx, "onTouchEnd"), 
        e.cloneMethod(s, wx, "onTouchCancel"), e.cloneMethod(s, wx, "createInnerAudioContext"), 
        e.cloneMethod(s, wx, "onAudioInterruptionEnd"), e.cloneMethod(s, wx, "onAudioInterruptionBegin"), 
        e.cloneMethod(s, wx, "createVideo"), e.cloneMethod(s, wx, "setPreferredFramesPerSecond"), 
        e.cloneMethod(s, wx, "showKeyboard"), e.cloneMethod(s, wx, "hideKeyboard"), e.cloneMethod(s, wx, "updateKeyboard"), 
        e.cloneMethod(s, wx, "onKeyboardInput"), e.cloneMethod(s, wx, "onKeyboardConfirm"), 
        e.cloneMethod(s, wx, "onKeyboardComplete"), e.cloneMethod(s, wx, "offKeyboardInput"), 
        e.cloneMethod(s, wx, "offKeyboardConfirm"), e.cloneMethod(s, wx, "offKeyboardComplete"), 
        e.cloneMethod(s, wx, "getOpenDataContext"), e.cloneMethod(s, wx, "onMessage"), e.cloneMethod(s, wx, "getSharedCanvas"), 
        e.cloneMethod(s, wx, "loadFont"), e.cloneMethod(s, wx, "onShow"), e.cloneMethod(s, wx, "onHide"), 
        e.cloneMethod(s, wx, "onError"), e.cloneMethod(s, wx, "offError"), r = !1, a = 1, 
        wx.onDeviceOrientationChange && wx.onDeviceOrientationChange(function(e) {
            "landscape" === e.value ? a = 1 : "landscapeReverse" === e.value && (a = -1);
        }), Object.assign(s, {
            startAccelerometer: function startAccelerometer(i) {
                r ? wx.startAccelerometer && wx.startAccelerometer({
                    fail: function fail(e) {
                        console.error("start accelerometer failed", e);
                    }
                }) : (r = !0, wx.onAccelerometerChange && wx.onAccelerometerChange(function(e) {
                    var t, n = {}, r = e.x, o = e.y;
                    p() && (t = r, r = -o, o = t), n.x = r * a, n.y = o * a, n.z = e.z, i && i(n);
                }));
            },
            stopAccelerometer: function stopAccelerometer() {
                wx.stopAccelerometer && wx.stopAccelerometer({
                    fail: function fail(e) {
                        console.error("stop accelerometer failed", e);
                    }
                });
            }
        }), s.getSafeArea = function() {
            var e, t, n = l.safeArea, r = n.top, o = n.left, i = n.bottom, a = n.right, c = n.width, u = n.height;
            return "ios" === l.platform && !s.isDevTool && p() && (e = r, t = o, n = u, r = d - a, 
            o = e, i = d - t - (t = f - (e = i)), a = e, u = c - t, c = n), {
                top: r,
                left: o,
                bottom: i,
                right: a,
                width: c,
                height: u
            };
        });
    }, {
        "../../../common/utils": 18
    } ]
}, {}, [ 23 ]);