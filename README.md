<div align="center"><img src="./pic/logo.png"/></div>

ð **[æ¥çv1çæ¬](./v1/README.md)** 

ð <a href="https://mp.weixin.qq.com/s/LfjOqtlYTDwoCYF33nTfxw" target="_blank">v2å·æ¦-è§é¢æ¼ç¤º</a>

# ðäºä¸ªð - v2

## ä¸ãå·æ¥å¸¸ææ (é¦å)

ä»£ç ä½ç½®å¨ v2/sheep_crackï¼ ä¸é¢æ¯å³äºåæè¿æ¬¾ç¨åºçè·¯ç¨ï¼ ç¨æ¶çº¦3å°æ¶ã

ð <a href="https://mp.weixin.qq.com/s/LfjOqtlYTDwoCYF33nTfxw" target="_blank">v2å·æ¦-è§é¢æ¼ç¤º</a>



### 1. åææ­£å¸¸ä¸å¡é»è¾

è¯·æ±ææ:

* GET /sheep/v1/game/map_info_ex?matchType=3

  æ¿å° map_md5 å map_seed

è¯·æ±æ¸¸æå°å¾:

* GET /maps/{map_id}.txt

å®æææ:

* POST /sheep/v1/game/game_over_ex?

  æäº¤ MatchPlayInfo

æ¥è¯¢æç»©:

* GET /sheep/v1/game/personal_info

  éè¿ daily_count ï¼ today_time ç­å¤æ­ä»æ¥ææå®ææåµ



### 2. ç¡®è®¤ç®æ 

è·³è¿æ­£å¸¸çæ¸¸æè¿ç¨ï¼ç´æ¥æé æ¸¸æå®æçç»æåé¦ç»æå¡å¨ï¼ä»¥æ­¤å¿«éå¹¶æç»­çå·æ¥å¸¸ææå®ææ°



### 3. é»çåæåç«¯å¤çé»è¾

é¦åï¼è§å¯éæ¾å·²æåå®æææçè¯·æ±éæ¾æ¯å¦ææ:

1. å®æææï¼æåï¼éæ¾ï¼æ æ



æ¥ä¸æ¥ï¼ç¡®è®¤å¨ä¸å¤©åè½å¦å¤æ¬¡æåï¼è¥å¯ï¼ä»£è¡¨å¯ä»¥å·:

1. å®æä¸æ¬¡ææ(å¯ä»¥åèä¸é¢çç¯¡æ¹æ¹å¼, ä½¿å¾æ¸¸æåå¾ç®å) ï¼ è§å¯daily_count ï¼ today_timeååï¼ç¡®è®¤æå¡ç«¯è®¤å¯æ¸¸æå®æ
2. æ¸é¤æ¬å°ç¼å­ `Documents\WeChat Files\{wxid}\Applet\{æ¸¸æid}`
3. åæ¬¡å è½½æ¸¸æï¼ å¦æåç«¯æåèµ·`/sheep/v1/game/user_rank_info`è¯·æ±ï¼åä¸¢å¼æ
4. åæ¬¡å®æä¸æ¬¡ææï¼ è§å¯å° daily_count å  1
5. ä»¥ä¸è¯æåæ¥è½æ¯å¯ä»¥å¤æ¬¡å®æææçï¼è¿ä¸ºåç»­çå·åäºéºå«



æ¥ä¸æ¥ï¼å¨ä¸ç¥éMatchPlayInfoçæé æåµä¸ï¼éè¿æ¹é æ¬å°æ°æ®ï¼ä½¿å¾æ¸¸æåå¾ç®åï¼å®ææ¸¸æï¼è§¦åMatchPlayInfoççæï¼å¹¶æ¨éç»æå°æå¡ç«¯ï¼è§å¯æå¡ç«¯çå¤çé»è¾:

* éè¿ä¿®æ¹ map_md5 ä¸ºåä¸å³, ææå®ææ æ
* éè¿ä¿®æ¹ map_map_seed å¨ä¸º0 , ææå®æææ
* éè¿ä¿®æ¹ blockTypeData ä½¿å¾å¾åä¸è´, ææå®æææ



æåï¼ç¡®è®¤game_over_exä¸map_info_exæ¯å¦æååå³ç³»ï¼

* ç¹å»æ¸¸æï¼è¯·æ±map_info_ex
* å®ææ¸¸æï¼æ­¤æ¶æåï¼ä¸è¦æç»æå¡ç«¯ï¼åæ¬¡éæ¾map_info_exï¼æ­¤æ¶æå¡ç«¯ä¸åäºä¸åçmap_seed
* å°å®ææ¸¸æçåæ¾éç»æå¡ç«¯
* è§å¯å°æ¸¸æä¾ç¶é¡ºå©å®æ



å°ç»:

* åæ¥åå¯ä»¥å¤æ¬¡å®æ
* game_over_exä¸map_info_exæ²¡æååå³ç³»
* è¾¾æå®æä»»å¡çå³é®æèåºå«ï¼ä»å¨æé åº MatchPlayInfo



### 4. åæåç«¯æé ç®æ³

ä»£ç å·²ç»æåå°v2/index.jsï¼ 

```javascript
// 1. è¿å¥æ¸¸æ -> è°ç¨å è½½å°å¾çä¸¤ä¸ªå½æ° getTodayMap , getLevelMapData, -> åè°ç¨äº beginGameData
e.prototype.beginGame = function() {
    var t = this;
    cc.game.emit(s.EMITKEY.TTSTARTRECORD), this.gameLayer.activeInHierarchy ? console.log("å·²ç»æå¼ mainLayer 1") : c.default.getTodayMap(h.default.getInstance().gameType, function() {
        for (var e = h.default.getInstance().mapMd5s, o = [], n = 0, i = function(i) {
            c.default.getLevelMapData(e[i], function(a) {
                n++, o[i] = a, n == e.length && (t.beginGameData(o), d.default.setGameLevelData(o));
            });
        }, a = 0; a < e.length; a++) i(a);
    });
}

// 2.1 å è½½å°å¾
// getLevelMapData->
t.loadMapDataFromLocalStorageOrNetWork = function(e) {
    return new Promise(function(o, n) {
        var i = s.STORAGEKEY.GAMEMAP + e, a = t.getItem(i);
        if (a) o(a); else {
            var r = "https://cat-match-static.easygame2021.com/maps/" + e + ".txt";
            cc.assetManager.loadRemote(r, {
                ext: ".txt"
            }
    });
}
// 2.2 å è½½å°å¾
// getTodayMap->
t.getTodayMap = function(t, e) {
    p.default.get({
        url: "/sheep/v1/game/map_info_ex",
        params: {
            matchType: t
        }
}

// 3. å¤çæ¸¸ææ°æ® --> è°ç¨initLevelLayer
e.prototype.beginGameData = function(t) {
    var e = this;
    cc.game.emit(s.EMITKEY.SHOWTRANSITLAYER, function(o) {
        e.gameLayer.activeInHierarchy ? console.log("å·²ç»æå¼ mainLayer 2") : (console.log("å¯ä»¥æå¼äº mainLayer"), 
                                                                           e.gameLayer.getComponent(p.default).initLevelLayer(t), e.node.active = !1, o());
    });
},
     
// 4. åå§ç­çº§å±? --> åå§ålevelDataArray
e.prototype.initLevelLayer = function(t) {
	this.levelDataArray = JSON.parse(JSON.stringify(t));

// 5. å¼å§ææ --> ä½¿ç¨ levelDataArray, å¹¶è°ç¨initNextLevelMap
e.prototype.playNextLevelMap = function() {
	var e = JSON.parse(JSON.stringify(this.levelDataArray))[this.playLevelNum];
	this.gameIsWin = !1, this.gameIsStopFunc(!1), this.adaptScreen(), this.chessboard.getComponent(u.default).initNextLevelMap(e, this),

// 6. ä¸çº§å°å¾ --> è°ç¨initBlockNodeLayer
e.prototype.initNextLevelMap = function(t, e) {
    this.initBlockNodeLayer(!1), cc.game.emit(l.EMITKEY.SHOWMASKLAYER, 3), this.refreshIndex(), 

// 7. initBlockNodeLayer --> è®¾ç½®cardId
e.prototype.initBlockNodeLayer = function(t) {
	var e = this.nowLevelData.levelData, o = 0;
    for (var n in e) for (var i in e[n]) e[n][i].cardId = o, o++, t ? this.addBlockFunc(e[n][i], cc.winSize.height) : this.addBlockFunc(e[n][i], 0);

// 8. addOp --> ä½¿ç¨cardId
addOp(t.cardDataObj.cardId)

// 9. addOpå¨ä½å¡«å operationList
t.prototype.addOp = function(t, e) {
	this.operationList.push(o);
}

//10. operationListç®åºp
for (var u = g.default.getInstance().operationList, p = [], d = 0, h = 0; h < u.length; h++) 
    p.push({
        chessIndex: u[h].id,
        timeTag: 0 == d ? 0 : u[h].time - d
    })
    d = u[h].time;

// 11. pç®åºf
var f = {
    gameType: g.default.getInstance().gameType,
    stepInfoList: p
},
                     
// 12. fåå§åMatchPlayInfo(), å¾å° v
v = k.protocol.MatchPlayInfo.encode(k.protocol.MatchPlayInfo.create(f)).finish()
ä»¤f_c = create(f) = new t(e) = function t(t) {if (this.stepInfoList = [], t) for (var e = Object.keys(t), o = 0; o < e.length; ++o) null != t[e[o]] && (this[e[o]] = t[e[o]]);}
encode(f_c) = for (var o = 0; o < t.stepInfoList.length; ++o) c.protocol.MatchStepInfo.encode(t.stepInfoList[o], e.uint32(34).fork()).ldelim();
        
// 13. éè¿vç®åºb
b = "", _ = 0; _ < v.length; _++) b += String.fromCharCode(v[_]);

// 14. base64ç¼ç b,å¾å° MatchPlayInfo
MatchPlayInfo: S.default.base64_encode(b)
```

å¨æè°è¯ï¼å¨æ­¥éª¤11ææ­ç¹ï¼è§å¯10çæçpåºè¯¥æ¯æè§å¾çï¼è½ç¡®è®¤på³å¯ç¡®è®¤MatchPlayInfoã



### 5. å°è¯æ¬å°æé 

åæåç«¯ç®æ³ï¼æä½³çæ¹å¼å½ç¶æ¯å¨æè°è¯ï¼ç®åæ²¡ææ¾å°æ¯è¾å¥½çç´æ¥å»è°å°ç¨åºçæ¹æ¡ãè¿ä¸ªè¿ç¨ï¼æä¹æèå°åç»­å¯ä»¥åªåçæ¹åï¼å³å¦ä½å¨æè°è¯å°ç¨åº:

* å°ç¨åºåºäºæµè§å¨åæ ¸ï¼åºäºè¯¥å±é¢çè°è¯æå·§(éå å½ä»¤ç­)?
* wxapkg éæåï¼å¼å¥ç±»ä¼¼webconsoleçè°è¯åº? -- ç®ååç°è§£å¯åç´æ¥ç¯¡æ¹æ¯å¯ä»¥æ§è¡ï¼ä½æå®æ¤çº¿ç¨æ£æ¥ç¯¡æ¹

è¿ä¸æ¯æ¬é¡¹ç®éç¹ï¼æ¥ä¸æ¥å°±çº¯éæçè§åº¦ï¼è¿ååºç®æ³ã



çå°å³é®æä½å½æ°æ¯æ e.uint32(8).int32 å e.uint32(16).int32 ç­ç­ï¼å¼å§ä»¥ä¸ºuint32çä¸ååæ å°å°ä¸åçå·ä½å½æ°ï¼åé¢å¹éäºä¸ï¼åç°protobufjsåºåçå³æè¿ç±»å½æ°åæ³, å¦ [è¿ä¸ªgité¡¹ç®](https://github.com/dbtcs1/ignite-cli-case-study4/blob/73230d0a99a1093a42c8dd39d8f005abef8544cf/vue/src/store/generated/cosmos/cosmos-sdk/cosmos.authz.v1beta1/module/types/tendermint/abci/types.js)

å¦æè¶³å¤ç»å¿ï¼ä½ ä¼åç°ä»£ç ä¸­æå¾å¤ç¹å¾, å¦ `prototype`, `"./protobuf.min": "protobuf.min"`ç­ï¼é£ä¹ï¼å¾æ¾ç¶æä½ f åéçå°±æ¯æ¥èª protobufjs éé¢çå½æ°ã



éè¿éæä»£ç ï¼ååºå¦ä¸:

```javascript
// mkdir sheep_crack && cd sheep_crack
// npm install protobufjs --save
// vim sheep_test.js

const protobufjs = require('protobufjs');

/* åºäºä»£ç :
t.encode = function(t, e) {
   return e || (e = a.create()), null != t.chessIndex && Object.hasOwnProperty.call(t, "chessIndex") && e.uint32(8).int32(t.chessIndex), null != t.timeTag && Object.hasOwnProperty.call(t, "timeTag") && e.uint32(16).int32(t.timeTag), 
e;},
*/
function MatchStepInfo_encode(t,e){
	e.uint32(8).int32(t.chessIndex)
	e.uint32(16).int32(t.timeTag)
	return e
}

// çå°ç¬¬10å11æ­¥ï¼æä»¬ç´æ¥åå»ºä¸ä¸ªç¹æ®å¼çf
f = {
    "gameType": 0,
    "stepInfoList": [
        {
            "chessIndex": 0,
            "timeTag": 0
        }
    ]
}

/* åºäºä»£ç :
}, t.encode = function(t, e) {
if (e || (e = a.create()), null != t.gameType && Object.hasOwnProperty.call(t, "gameType") && e.uint32(8).int32(t.gameType), 
	null != t.mapId && Object.hasOwnProperty.call(t, "mapId") && e.uint32(16).int32(t.mapId), 
	null != t.mapSeed && Object.hasOwnProperty.call(t, "mapSeed") && e.uint32(24).int32(t.mapSeed), 
	null != t.stepInfoList && t.stepInfoList.length) for (var o = 0; o < t.stepInfoList.length; ++o) 		c.protocol.MatchStepInfo.encode(t.stepInfoList[o], e.uint32(34).fork()).ldelim();
 	return e;
}
*/
t=f
e = protobufjs.Writer.create()
e.uint32(8).int32(t.gameType)
for (var o = 0; o < t.stepInfoList.length; ++o) {
	MatchStepInfo_encode(f.stepInfoList[o], e.uint32(34).fork()).ldelim()
}

v=e.finish()
b = ""
for (var _ = 0; _ < v.length; _++){
	b += String.fromCharCode(v[_]);
}
b = Buffer.from(b).toString('base64');
console.log(b)
```

çå°sheep_test.jsçè¾åºç»æåä¸æ¬¡æ­£å¸¸å®æææçç»æçå¤´é¨æ¯è¾ï¼å5ä¸ªå­ç¬¦åªæä¸ä¸ªæåºå«:

![](pic/v2_test.png)

åºæ¬å°±æ¯å«ä¹ä¸ç¦»åã



### 6. è§£ç MatchPlayInfo

ä¸é¢æ¯ç¨äºä¸ä¸ªç¹æ®å¼çfï¼ä½çå®çfå¼å®éä¸è¦èµ°å¾å¤§ä¸æ®µä»£ç é»è¾ï¼éæçå¤ªçè¦äºï¼é£ä¹å¾èªç¶çæ³å°å»è§£ç ä¸æ¬¡æåææçMatchPlayInfoï¼ççå®ææææ¯å¦ä½æé ï¼é£ä¹æç§å¶æ ·å­å»æé ï¼å°±å¯ä»¥è¾¾æç®æ ã



éè¿éè¯»ææ¡£ï¼å¥é¨æ¡ä¾åç¸å³æºç ï¼äºè§£å°protobufjs ææ´å ä¼ç¾ä¸å¸¸ç¨çä½¿ç¨æ¹å¼ã

æ¥ä¸æ¥å®è·µï¼ è¿åprotoæä»¶ç»æ:

```protobuf
// cd sheep_crack/ 
// vi yang.proto
package yang;
syntax = "proto3";

// https://developers.google.com/protocol-buffers/docs/proto3
// åºäºä»£ç :
// o.MatchPlayInfo = function() {
// return t.prototype.gameType = 0, t.prototype.mapId = 0, t.prototype.mapSeed = 0, t.prototype.stepInfoList = r.emptyArray, t.create = function(e) {
// case 1: n.gameType = t.int32();  IDå·å¾éè¦ï¼éè¦ä¸ä¸å¯¹åº
// case 2: n.mapId = t.int32();
// case 3: n.mapSeed = t.int32();
// case 4: n.stepInfoList.push(c.protocol.MatchStepInfo.decode(t, t.uint32()));
message MatchPlayInfo {
	int32 gameType = 1; // game_typeæègameTypeçåæ³é½å¯ä»¥
	int32 mapId = 2;
	int32 mapSeed = 3;
	repeated MatchStepInfo stepInfoList = 4;
}

// åºäºä»£ç :
// o.MatchStepInfo = function() {
// return t.prototype.chessIndex = 0, t.prototype.timeTag = 0, t.create = function(e) {
// case 1: n.chessIndex = t.int32();
// case 2: n.timeTag = t.int32();
message MatchStepInfo {
	int32 chessIndex = 1;
	int32 timeTag = 2;
}
```



è§£ç ç®æ³:

```javascript
// cd sheep_crack/ 
// vi sheep_v2_crack_decode_demo.js
const protobuf = require('protobufjs');

// è¾å¥å®ææææ¶çMatchPlayInfo
const success_challenge_playinfo = "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"

protobuf.load("yang.proto", function(err, root) {
    if (err)
        throw err;

    // è·å¾ message ç±»å
    var MatchPlayInfo = root.lookupType("yang.MatchPlayInfo");
	var MatchStepInfo = root.lookupType("yang.MatchStepInfo");
    
    var _debase64 = Buffer.from(success_challenge_playinfo, 'base64');
	const message = MatchPlayInfo.decode(_debase64);
	console.log(message)
	console.log(message.stepInfoList[10])
});
```



è§£åºæ¥å¦ä¸:

![](pic/decode_demo.png)



### 7. å¼å·

ç¥éMatchPlayInfoçææï¼æ¥ä¸æ¥å°±å¯ä»¥ä»»ææé MatchPlayInfoå®æææ, é¨åé»è¾:

```javascript
var time_array = [
    {},
    { chessIndex: 100, timeTag: 303 },
    ...
]

var new_time_array = [];
for (var _ = 0; _ < time_array.length; _++){
    new_time_array.push(MatchStepInfo.create(time_array[_]))
}

var payload = { 
    stepInfoList: new_time_array,
    mapSeed: XXXX,
    gameType: XXX
};

var message = MatchPlayInfo.create(payload);
var buffer = MatchPlayInfo.encode(message).finish();

Buffer.from(buffer).toString('base64');
```

éåä¸ä¸ªé»è¾ç¼ºé·ï¼æé ä¸æ¬¡MatchPlayInfoå³å¯æ éå·ï¼ä¸éè¦éå¤æé ã







