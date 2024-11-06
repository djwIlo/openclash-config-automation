const AIRPORT_CONFIG = require('../base_config/base_config');
const updateConfig = require('../update_config/update_config');
const { getFileSerialize, getProxyConfig } = require('../utils');

// 获取基础rule配置
const baseRuleConfig = getFileSerialize(AIRPORT_CONFIG.listRuleseller);

console.log(updateConfig.parsedProxies);

const listenRulesSeller = () => {
  console.log('rule');
  
  // console.log(baseRuleConfig);
}

module.exports = listenRulesSeller;