const fs = require('fs');
const utils = require('./utils');
const AIRPORT_CONFIG = require('../base_config/base_config');

const initAirConfig = async () => {
  // 定义存储

  // 机场配置序列化数组
  const airConfigArray = utils.readAirConfig(AIRPORT_CONFIG.configFilePath);
  
  // 获取指定代理、代理组、规则行所索引
  let arrayIndex = utils.getRegExpIndex(airConfigArray);
  
  // 生成自定义代理配置
  const { customProxyConfig, proxySerialize } = utils.getCustomProxyConfig(AIRPORT_CONFIG.listProxyseller, AIRPORT_CONFIG);  

  // 生成自定义规则配置
  const { ruleConfig, storageProxy } = utils.getCustomRuleConfig(AIRPORT_CONFIG.listRuleseller, AIRPORT_CONFIG.listProxyseller);
  
  // 开始写入局域网历史代理使用记录
  try {
    // 读取历史配置文件
    const historyProxyText = await fs.readFileSync(AIRPORT_CONFIG.lanipHistoryProxy);
    const historyProxy = JSON.parse(historyProxyText);
    // 如果正在运行的配置文件中每个设备的代理ip都在历史记录中就不需要重新写入
    console.log('读取到的历史代理使用记录', historyProxy);
    console.log('初始化读取到的代理配置', storageProxy);
    const isWrite = utils.isSubset(historyProxy, storageProxy)
    if (isWrite) {
      console.log('本次初始化配置，历史代理不需要更新'); 
    } else {
      await fs.writeFileSync(AIRPORT_CONFIG.lanipHistoryProxy, JSON.stringify(storageProxy)); // 不要使用nodemon启动项目
    }
  } catch (error) {
    console.log('lanIp历史使用记录写入失败', error);
  }

  // 开始组合配置
  // 插入rule
  airConfigArray.splice(arrayIndex.ruleStartIndex, 0, ...ruleConfig);

  // 获取机场代理配置、香港代理组、链式代理组
  const { getAirProxyConfig, mergeProxyGroup } = utils.getConfigProxySlice(arrayIndex, airConfigArray, proxySerialize)

  // 插入链式代理组
  airConfigArray.splice(arrayIndex.proxyEndIndex + 2, 0, ...mergeProxyGroup);

  // 插入代理
  const mergeProxyConfig = customProxyConfig.concat(...getAirProxyConfig);
  
  airConfigArray.splice(arrayIndex.proxyStartIndex, arrayIndex.proxyEndIndex - arrayIndex.proxyStartIndex + 1, mergeProxyConfig);
  // airConfigArray.splice(arrayIndex.proxyStartIndex, arrayIndex.proxyEndIndex - arrayIndex.proxyStartIndex + 1, '哈哈哈哈哈哈哈哈哈哈哈哈哈\n');

  await fs.writeFileSync(AIRPORT_CONFIG.outputConfigPath, airConfigArray.join(''));
}

module.exports = initAirConfig