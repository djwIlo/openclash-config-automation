const fs = require('fs');
const path = require('path')
const AIRPORT_CONFIG = require('../base_config/base_config');
const { getFileSerialize, parseProxyString, getRegExpIndex, getConfigProxySlice } = require('../utils');

// 存储代理、代理组、规则行的索引
const arrayIndex = {};

// 读取代理内容并作初步分割
const proxyStrings = getFileSerialize(AIRPORT_CONFIG.proxyFile);

// 获取配置文件路径
const configList = getFileSerialize(AIRPORT_CONFIG.configFilePath);

// 获取指定代理、代理组、规则行所索引
getRegExpIndex(arrayIndex, configList);

// 获取配置文件代理片段
const proxyConfigList = getConfigProxySlice(arrayIndex, configList);

module.exports = {
  parsedProxies: proxyStrings.map(parseProxyString), //解析每个代理字符串
  arrayIndex,
  configList,
  proxyConfigList
}