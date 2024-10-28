const fs = require('fs');
const path = require('path')
const { getFileSerialize, parseProxyString, getRegExpIndex } = require('../utils');

// 存储代理、代理组、规则行的索引
const arrayIndex = {};

// 读取代理内容并作初步分割
console.log(__dirname, __filename);

const proxyFile = path.join(__dirname, '../base_config/list_proxyseller.txt');
// const proxyFile = `E:/fwgcloud/phoneUseragent/airport-server/base_config/list_proxyseller.txt`;
const proxyStrings = getFileSerialize(proxyFile)

// 获取配置文件路径
const configFilePath = `/etc/openclash/config.yaml`; // >>>
// const configFilePath = `E:/fwgcloud/phoneUseragent/airport-server/airport_config/overseas/config copy.yaml`; // >>>
const configList = getFileSerialize(configFilePath)

// 获取指定代理、代理组、规则行所索引
getRegExpIndex(arrayIndex, configList);

console.log(arrayIndex);

const proxiesList = configList.slice(arrayIndex.proxyStartIndex, arrayIndex.proxyEndIndex);

// 配置文件代理配置段
let proxyContext = '';

for (let index = 0; index < proxiesList.length; index++) {
  const element = proxiesList[index];
  proxyContext += element + '\n';
}

// 按照 - name 行分割
const entries = proxyContext.split(/(?=-\sname:)/).filter(entry => entry.trim() !== '');

// 每段作为一个数组元素
const proxyConfigMap = entries.map(entry => [entry.trim()]);

// 过滤出机场配置
const proxyConfigList = proxyConfigMap.filter(entry => !entry[0].includes('socks5'));

module.exports = {
  parsedProxies: proxyStrings.map(parseProxyString), //解析每个代理字符串
  arrayIndex,
  configList,
  proxyConfigList
}