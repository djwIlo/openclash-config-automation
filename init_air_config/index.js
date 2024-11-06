const utils = require('./utils');
const AIRPORT_CONFIG = require('../base_config/base_config');

const initAirConfig = () => {
  console.log('初始化');
  // 定义存储

  // 机场配置序列化数组
  const airConfigArray = utils.readAirConfig(AIRPORT_CONFIG.configFilePath);

  // 获取指定代理、代理组、规则行所索引
  const arrayIndex = utils.getRegExpIndex(airConfigArray);
  
  // 生成自定义代理配置
  const customProxyConfig = utils.getCustomProxyConfig(AIRPORT_CONFIG.listProxyseller, AIRPORT_CONFIG);
  // console.log(customProxyConfig);
  
  // 生成自定义链式代理组配置
  // const customProxyGroppConfig = utils.getCustomProxyGroppConfig(AIRPORT_CONFIG.listRuleseller);

  // 生成自定义规则配置
  const customRuleConfig = utils.getCustomRuleConfig(AIRPORT_CONFIG.listRuleseller);
}

module.exports = initAirConfig