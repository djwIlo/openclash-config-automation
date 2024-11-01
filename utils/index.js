const fs = require("fs");
// const updateConfig = require('../update_config/update_config');
const AIRPORT_CONFIG = require('../base_config/base_config');

/**
 * 读取文件并且将内容序列化
 * @param {String} filePath 文件地址
 * @returns {Array} 返回一个数组
 */
function getFileSerialize(filePath) {
  try {
    const fileContext = fs.readFileSync(filePath, "utf8");
    const data = fileContext.split('\n')
    return data;
  } catch (err) {
    console.error("读取文件错误:", err);
  }
}

/**
 * 解析 getFileSerialize 返回的代理信息
 * @param {Array} proxyString 
 * @returns {Object} Object
 */
function parseProxyString(proxyString) {
  let parts = proxyString.split('@'); // 分离状态、认证信息、host和port
  let proxyState = parts[0];
  let authInfo = parts[1].split(':'); // 分离用户名、密码
  let hostInfo = parts[2].split(':'); // 分离host、port
  
  return {
    proxyState: proxyState,
    auth: authInfo[0], // 用户名
    password: authInfo[1], // 密码
    host: hostInfo[0], // IP地址
    port: parseInt(hostInfo[1]) // 端口
  };
}

/**
 * 获取代理、代理组、规则在配置文件所在行索引
 * @param {Object} arrayIndex 索引存储
 * @param {Array} configList 配置文件序列化数组
 * @returns {Object} Object
 */
function getRegExpIndex(arrayIndex, configList) {
  // 代理开始行正则
  const proxiesStartRegExp = /^proxies:$/;

  // 代理结束行正则
  const proxiesEndRegExp = /^proxy-groups:$/;

  // 规则开始行正则
  const ruleStartRegExp = /^rules:$/;

  for (let index = 0; index < configList.length; index++) {
    const element = configList[index];
    if (element.includes('proxies:') && proxiesStartRegExp.test(element)) {
      arrayIndex.proxyStartIndex = index + 1
    }

    if (element.includes('proxy-groups:') && proxiesEndRegExp.test(element)) {
      arrayIndex.proxyEndIndex = index - 1
    }

    if (element.includes('rules:') && ruleStartRegExp.test(element)) {
      arrayIndex.ruleStartIndex = index + 1
    }
  }
}

/**
 * 获取配置文件中的代理片段
 * @param {Object} arrayIndex 索引存储
 * @param {Array} configList 配置文件序列化数组
 * @returns {Array} Array
 */
function getConfigProxySlice(arrayIndex, configList) {
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
  return proxyConfigList;
}

/**
 * 获取Socks5代理配置
 * @param {Array} parsedProxies 
 * @param {Array} proxyConfigList 
 * @returns {Array} Array
 */
function getProxyConfig(parsedProxies, proxyConfigList) {
  let proxyConfigContext = [];
  // 解析每个代理字符串
  // const parsedProxies = proxyStrings.map(parseProxyString);
  
  // 开始生成配置文件模板
  parsedProxies.forEach(proxy => {
    const airportConfig = new AIRPORT_CONFIG(proxy.proxyState, proxy.host, proxy.port, proxy.auth, proxy.password);
    proxyConfigContext = proxyConfigContext.concat(airportConfig.proxyConfig);
  });

  const newProxyConfigContext = proxyConfigContext.concat(proxyConfigList.join('\n').split('\n'));

  return newProxyConfigContext;
}

module.exports = {
  getFileSerialize,
  parseProxyString,
  getRegExpIndex,
  getConfigProxySlice,
  getProxyConfig
}