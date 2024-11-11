const utils = require("./utils");
const AIRPORT_CONFIG = require("../base_config/base_config");

async function listenProxy() {
  const proxies = utils.getCustomProxySerialize(AIRPORT_CONFIG);

  try {
    // 代理可用性检测结果
    const results = await utils.testProxies(proxies);
    // console.log("代理测试结果:", results);
    // const results = [
    //   {
    //     proxyState: '美国-01',
    //     linkProxy: '链式代理-01',
    //     host: '179.60.183.51',
    //     port: '50101',
    //     available: true,
    //     responseTime: 461
    //   },
    //   {
    //     proxyState: '美国-02',
    //     linkProxy: '链式代理-02',
    //     host: '179.60.183.156',
    //     port: '50101',
    //     available: true,
    //     responseTime: 467
    //   },
    //   {
    //     proxyState: '美国-03',
    //     linkProxy: '链式代理-03',
    //     host: '94.131.48.54',
    //     port: '50101',
    //     available: false,
    //     responseTime: null
    //   },
    //   {
    //     proxyState: '美国-04',
    //     linkProxy: '链式代理-04',
    //     host: '94.131.48.15',
    //     port: '50101',
    //     available: false,
    //     responseTime: null
    //   },
    //   {
    //     proxyState: '美国-05',
    //     linkProxy: '链式代理-05',
    //     host: '63.223.67.151',
    //     port: '50101',
    //     available: true,
    //     responseTime: 761
    //   },
    //   {
    //     proxyState: '美国-06',
    //     linkProxy: '链式代理-06',
    //     host: '23.27.3.214',
    //     port: '50101',
    //     available: true,
    //     responseTime: 751
    //   },
    //   {
    //     proxyState: '美国-07',
    //     linkProxy: '链式代理-07',
    //     host: '200.10.34.12',
    //     port: '50101',
    //     available: true,
    //     responseTime: 470
    //   },
    //   {
    //     proxyState: '美国-08',
    //     linkProxy: '链式代理-08',
    //     host: '200.10.35.184',
    //     port: '50101',
    //     available: true,
    //     responseTime: 490
    //   },
    //   {
    //     proxyState: '美国-09',
    //     linkProxy: '链式代理-09',
    //     host: '138.36.93.84',
    //     port: '50101',
    //     available: true,
    //     responseTime: 464
    //   },
    //   {
    //     proxyState: '美国-10',
    //     linkProxy: '链式代理-10',
    //     host: '138.36.93.165',
    //     port: '50101',
    //     available: true,
    //     responseTime: 463
    //   }
    // ]

    // 开始替换坏掉的代理
    const runConfig = utils.updateRunConfig(AIRPORT_CONFIG.outputConfigPath, AIRPORT_CONFIG.lanipHistoryProxy, results);
    // console.log(runConfig);
    
  } catch (error) {
    console.log(console.error("代理测试过程中出现错误:", error));
  }
}
module.exports = listenProxy;
