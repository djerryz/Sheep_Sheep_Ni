// mkdir sheep_crack && cd sheep_crack
// npm install protobufjs --save
// vim sheep_test.js

const protobufjs = require('protobufjs');

/* 基于代码:
t.encode = function(t, e) {
   return e || (e = a.create()), null != t.chessIndex && Object.hasOwnProperty.call(t, "chessIndex") && e.uint32(8).int32(t.chessIndex), null != t.timeTag && Object.hasOwnProperty.call(t, "timeTag") && e.uint32(16).int32(t.timeTag), 
e;},
*/
function MatchStepInfo_encode(t,e){
	e.uint32(8).int32(t.chessIndex)
	e.uint32(16).int32(t.timeTag)
	return e
}

// 看到第10和11步，我们直接创建一个特殊值的f
f = {
    "gameType": 0,
    "stepInfoList": [
        {
            "chessIndex": 0,
            "timeTag": 0
        }
    ]
}

/* 基于代码:
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