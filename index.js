const AIRPORT_CONFIG = require('./base_config/base_config');
const initAirConfig = require('./init_air_config');
// const listenProxySeller = require('./update_config');
const listenRulesSeller = require('./update_rule')

// 初始化机场配置，将自定义代理，规则添加到配置文件中
initAirConfig();

// 监听代理配置
// listenProxySeller();

// 监听规则配置
listenRulesSeller();

// const task = () => {
//   // 监听代理配置
//   listenProxySeller();

//   // 监听规则配置
//   listenRulesSeller();
// }

// setInterval(task, 10000);


AIRPORT_CONFIG.app.use(ctx => {
  console.log(ctx);
  ctx.body = 'Hello Wrold!'
})

AIRPORT_CONFIG.app.listen(AIRPORT_CONFIG.PORT, AIRPORT_CONFIG.HOST, () => {
  console.log(`自动化代理服务已启动！`, `http://${AIRPORT_CONFIG.HOST}:${AIRPORT_CONFIG.PORT}`);
});
