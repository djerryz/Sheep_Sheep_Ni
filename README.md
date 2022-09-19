<div align="center"><img src="./pic/logo.png"/></div>

🐍 **[查看v1版本](./v1/README.md)** 🐍



# 🐏了个🐏 - v2

## 一、完成一次挑战

### 正常流程

1. GET /sheep/v1/game/map_info_ex?matchType=3

   拿到 map_md5 和 map_seed


2. POST /sheep/v1/game/game_over_ex?

   提交 MatchPlayInfo

用户完成游戏，小程序算出MatchPlayInfo的后，发起game_over请求



### 分析算法

v2/index.js, 关键代码:

```javascript
MatchPlayInfo() -->  for (var o = 0; o < t.stepInfoList.length; ++o) c.protocol.MatchStepInfo.encode(t.stepInfoList[o], e.uint32(34).fork()).ldelim();  --> case 1-4: ...

var f = {
	gameType: g.default.getInstance().gameType,
	stepInfoList: p
}

y = k.protocol.MatchPlayInfo.create(f)
v = k.protocol.MatchPlayInfo.encode(y).finish()
b = "", _ = 0; _ < v.length; _++) b += String.fromCharCode(v[_])  <-- MatchPlayInfo = base64(b)
```

MatchPlayInfo() 函数的输入有且仅 **gameType , mapId , mapSeed, stepInfoList** 



crack 尝试瞬间完成挑战: 

1. 先请求一次挑战，拿到mapSeed

2. 将mapSeed带入运算, 得到MatchPlayInfo， 发起game_over ,  跳过游戏过程

3. code:

   ```python
   import base64
   
   pass ...晚点
   ```



