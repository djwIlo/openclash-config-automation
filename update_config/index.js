const fs = require('fs');
const updateConfig = require('./update_config');
const AIRPORT_CONFIG = require('../base_config/base_config');

// 将代理配置添加到机场配置当中
const proxyConfig = getProxyConfig();

// 将代理插入到配置文件原来的位置
updateConfig.configList.splice(updateConfig.arrayIndex.proxyStartIndex, updateConfig.arrayIndex.proxyEndIndex - updateConfig.arrayIndex.proxyStartIndex + 1, ...proxyConfig);

// 将规则插入到配置文件指定位置
updateConfig.configList.splice(updateConfig.arrayIndex.ruleStartIndex, 0, );

// 给每一行添加换行符
const configMap = updateConfig.configList.map(item => item + '\n');

// 将配置信息从数组转为字符串
const config = configMap.join('')

// 开始生成配置文件
fs.writeFileSync(AIRPORT_CONFIG.outputConfigPath, config);

// 获取Socks5代理配置函数
function getProxyConfig() {
  let proxyConfigContext = [];
  
  // 开始生成配置文件模板
  updateConfig.parsedProxies.forEach(proxy => {
    const airportConfig = new AIRPORT_CONFIG(proxy.proxyState, proxy.host, proxy.port, proxy.auth, proxy.password)
    proxyConfigContext = proxyConfigContext.concat(airportConfig.proxyConfig);
  });

  const newProxyConfigContext = proxyConfigContext.concat(updateConfig.proxyConfigList.join('\n').split('\n'))

  return newProxyConfigContext;
}
