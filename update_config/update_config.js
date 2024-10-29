const fs = require('fs');
const AIRPORT_CONFIG = require('../base_config/base_config');
const { getFileSerialize, parseProxyString, getRegExpIndex, getConfigProxySlice } = require('../utils');

// 存储代理、代理组、规则行的索引
const arrayIndex = {};

// 读取代理内容并作初步分割
const proxyStrings = getFileSerialize(AIRPORT_CONFIG.listProxyseller);

// 获取配置文件路径
const configList = getFileSerialize(AIRPORT_CONFIG.configFilePath);

// 获取指定代理、代理组、规则行所索引
getRegExpIndex(arrayIndex, configList);

// 获取配置文件代理片段
const proxyConfigList = getConfigProxySlice(arrayIndex, configList);

/**
 * 获取Socks5代理配置
 * @returns {Array} Array
 */
// function getProxyConfig() {
//   let proxyConfigContext = [];
//   // 解析每个代理字符串
//   const parsedProxies = proxyStrings.map(parseProxyString);
  
//   // 开始生成配置文件模板
//   parsedProxies.forEach(proxy => {
//     const airportConfig = new AIRPORT_CONFIG(proxy.proxyState, proxy.host, proxy.port, proxy.auth, proxy.password);
//     proxyConfigContext = proxyConfigContext.concat(airportConfig.proxyConfig);
//   });

//   const newProxyConfigContext = proxyConfigContext.concat(proxyConfigList.join('\n').split('\n'));

//   return newProxyConfigContext;
// }

module.exports = {
  parsedProxies: proxyStrings.map(parseProxyString),
  arrayIndex,
  configList,
  proxyConfigList,
  // getProxyConfig
}