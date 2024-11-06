const fs = require('fs');
const getArpScanResults = require('./lanIp');

/**
 * 机场配置序列化
 * @param {string} file 
 * @returns {Array}
 */
function readAirConfig(file) {
  try {
    const airText = fs.readFileSync(file, 'utf8');

    const airSerialize = airText.split('\n');

    return airSerialize;
  } catch (error) {
    return error;
  }
}

/**
 * 获取代理、代理组、规则在配置文件所在行索引
 * @param {Array} configArray 机场配置文件序列化数组
 * @returns {Object} arrayIndex
 */
function getRegExpIndex(configArray) {
  let arrayIndex = {}

  // 代理开始行正则
  const proxiesStartRegExp = /^proxies:.*/;

  // 代理结束行正则
  const proxiesEndRegExp = /^proxy-groups:.*/;

  // 规则开始行正则
  const ruleStartRegExp = /^rules:.*/;

  for (let index = 0; index < configArray.length; index++) {
    const element = configArray[index];
    if (element.includes('proxies:') && proxiesStartRegExp.test(element)) {
      arrayIndex.proxyStartIndex = index + 1;
    }

    if (element.includes('proxy-groups:') && proxiesEndRegExp.test(element)) {
      arrayIndex.proxyEndIndex = index - 1;
    }

    if (element.includes('rules:') && ruleStartRegExp.test(element)) {
      arrayIndex.ruleStartIndex = index + 1;
    }
  }

  return arrayIndex;
}

/**
 * 生成自定义代理配置
 * @param {string} file list_proxyseller.txt的文件路径
 * @param {Object} AIRPORT_CONFIG 基础常量
 * @returns {Array} Array
 */
function getCustomProxyConfig(file, AIRPORT_CONFIG) {
  try {
    let proxyConfig = [];
    const proxyText = fs.readFileSync(file, "utf8");
    const proxyArray = proxyText.split('\n');
    proxyArray.forEach(element => {
      const itemArr = element.split('@');
      const proxyName = itemArr[0].split(':');
      const proxyAuth = itemArr[1].split(':');
      const proxyNetwork = itemArr[2].split(':');      
      const proxy = new AIRPORT_CONFIG(proxyName[0], proxyNetwork[0], proxyNetwork[1], proxyAuth[0], proxyAuth[1]);
      const proxyMap = proxy.proxyConfig.map(item => item + '\n').join('');
      proxyConfig.push(proxyMap);
    });
    return proxyConfig;
  } catch (err) {
    console.error("读取文件错误:", err);
  }
}

/**
 * 生成自定义链式代理组配置
 */
function getCustomProxyGroppConfig() {

}

/**
 * 生成自定义规则配置
 * @param {string} file 规则文件路径
 * @param {Array} proxyIp 代理IP数组
 * @returns {Array} 规则配置文件数组
 */
function getCustomRuleConfig(file, proxyIp) {
  const ruleText = fs.readFileSync(file, "utf8");
  const ruleArray = ruleText.split('\n');
  // console.log(ruleArray);
  const results = getArpScanResults();
  console.log('同步获取的 IP 和 MAC 地址:', results);
}

module.exports = {
  readAirConfig,
  getRegExpIndex,
  getCustomProxyConfig,
  getCustomProxyGroppConfig,
  getCustomRuleConfig
}