const fs = require('fs');
const utils = require('./utils');
const AIRPORT_CONFIG = require('../base_config/base_config');

const initAirConfig = () => {
  // 定义存储

  // 机场配置序列化数组
  const airConfigArray = utils.readAirConfig(AIRPORT_CONFIG.configFilePath);

  // 获取指定代理、代理组、规则行所索引
  let arrayIndex = utils.getRegExpIndex(airConfigArray);
  
  // 生成自定义代理配置
  const customProxyConfig = utils.getCustomProxyConfig(AIRPORT_CONFIG.listProxyseller, AIRPORT_CONFIG);
  
  // 生成自定义链式代理组配置
  // >>>
  // const customProxyGroppConfig = utils.getCustomProxyGroppConfig(AIRPORT_CONFIG.listRuleseller);

  // 生成自定义规则配置
  const { ruleConfig, storageProxy } = utils.getCustomRuleConfig(AIRPORT_CONFIG.listRuleseller, AIRPORT_CONFIG.listProxyseller);
  
  // 开始写入局域网历史代理使用记录
  try {
    fs.writeFileSync(AIRPORT_CONFIG.lanipHistoryProxy, JSON.stringify(storageProxy)); // 不要使用nodemon启动项目
  } catch (error) {
    console.log('lanIp历史使用记录写入失败', error);
  }

  // 开始组合配置 
  // 插入rule
  airConfigArray.splice(arrayIndex.ruleStartIndex, 0, ...ruleConfig);

  // 插入链式代理组
  // >>>

  // 插入代理
  const getAirProxyConfig = utils.getConfigProxySlice(arrayIndex, airConfigArray)

  const mergeProxyConfig = customProxyConfig.concat(...getAirProxyConfig);

  arrayIndex = utils.getRegExpIndex(airConfigArray);
  
  airConfigArray.splice(arrayIndex.proxyStartIndex, arrayIndex.proxyEndIndex - arrayIndex.proxyStartIndex + 1, ...mergeProxyConfig);

  fs.writeFileSync(AIRPORT_CONFIG.outputConfigPath, airConfigArray.join(''));
}

module.exports = initAirConfig