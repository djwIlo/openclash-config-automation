const fs = require('fs');
const AIRPORT_CONFIG = require('../base_config/base_config')
const updateConfig = require('../update_config/update_config');
const { getFileSerialize, getProxyConfig } = require('../utils');
const { assignProxiesForAllLanIPs, lanToProxyMap } = require('../utils/ruleAssign');

const listenRulesSeller = () => {
  console.log('rule');
  
}

// 获取基础rule配置
const baseRuleConfig = getFileSerialize(AIRPORT_CONFIG.listRuleseller);
console.log(baseRuleConfig);


// 获取代理序列化数组
console.log(updateConfig.parsedProxies);

const proxies =  getProxyConfig(updateConfig.parsedProxies, updateConfig.proxyConfigList)
const configMap = proxies.map(item => item + '\n');
fs.writeFileSync('./custom_rule.yaml', configMap.join(''));

// >>>>>>>>>
const proxyIpList = [
  '179.60.183.51',
  '179.60.183.156',
  '94.131.48.54',
  '94.131.48.15',
  '63.223.67.151',
  '23.27.3.214',
  '200.10.34.12',
  '200.10.35.184',
  '138.36.93.84',
  '138.36.93.165'
]
const IPLIST = [
  { ip: '192.168.3.5', mac: '02:b3:fb:2b:37:00' },
  { ip: '192.168.3.6', mac: '02:b3:fb:2b:37:01' },
  { ip: '192.168.3.7', mac: '02:b3:fb:2b:37:02' },
  { ip: '192.168.3.8', mac: '02:b3:fb:2b:37:03' },
  { ip: '192.168.3.9', mac: '02:b3:fb:2b:37:04' },
  { ip: '192.168.3.10', mac: '02:b3:fb:2b:37:05' },
  { ip: '192.168.3.11', mac: '02:b3:fb:2b:37:06' },
  { ip: '192.168.3.12', mac: '02:b3:fb:2b:37:07' },
  { ip: '192.168.3.13', mac: '02:b3:fb:2b:37:08' },
  { ip: '192.168.3.14', mac: '02:b3:fb:2b:37:09' },
  { ip: '192.168.3.15', mac: '02:b3:fb:2b:37:10' },
  { ip: '192.168.3.16', mac: '02:b3:fb:2b:37:11' },
  { ip: '192.168.3.17', mac: '02:b3:fb:2b:37:12' },
  { ip: '192.168.3.18', mac: '02:b3:fb:2b:37:13' },
  { ip: '192.168.3.19', mac: '02:b3:fb:2b:37:14' },
  { ip: '192.168.3.20', mac: '02:b3:fb:2b:37:15' },
  { ip: '192.168.3.21', mac: '02:b3:fb:2b:37:16' },
  { ip: '192.168.3.22', mac: '02:b3:fb:2b:37:17' },
  { ip: '192.168.3.23', mac: '02:b3:fb:2b:37:18' },
  { ip: '192.168.3.24', mac: '02:b3:fb:2b:37:19' },
  { ip: '192.168.3.25', mac: '02:b3:fb:2b:37:20' },
  { ip: '192.168.3.26', mac: '02:b3:fb:2b:37:21' },
  { ip: '192.168.3.27', mac: '02:b3:fb:2b:37:22' },
  { ip: '192.168.3.28', mac: '02:b3:fb:2b:37:23' },
  { ip: '192.168.3.29', mac: '02:b3:fb:2b:37:24' },
  { ip: '192.168.3.30', mac: '02:b3:fb:2b:37:25' },
  { ip: '192.168.3.31', mac: '02:b3:fb:2b:37:26' },
  { ip: '192.168.3.32', mac: '02:b3:fb:2b:37:27' },
  { ip: '192.168.3.33', mac: '02:b3:fb:2b:37:28' },
  { ip: '192.168.3.34', mac: '02:b3:fb:2b:37:29' },
  { ip: '192.168.3.35', mac: '02:b3:fb:2b:37:30' },
  { ip: '192.168.3.36', mac: '02:b3:fb:2b:37:31' },
  { ip: '192.168.3.37', mac: '02:b3:fb:2b:37:32' },
  { ip: '192.168.3.38', mac: '02:b3:fb:2b:37:33' },
  { ip: '192.168.3.39', mac: '02:b3:fb:2b:37:34' },
  { ip: '192.168.3.40', mac: '02:b3:fb:2b:37:35' },
  { ip: '192.168.3.41', mac: '02:b3:fb:2b:37:36' },
  { ip: '192.168.3.42', mac: '02:b3:fb:2b:37:37' },
  { ip: '192.168.3.43', mac: '02:b3:fb:2b:37:38' },
  { ip: '192.168.3.44', mac: '02:b3:fb:2b:37:39' },
  { ip: '192.168.3.45', mac: '02:b3:fb:2b:37:40' },
  { ip: '192.168.3.46', mac: '02:b3:fb:2b:37:41' },
  { ip: '192.168.3.47', mac: '02:b3:fb:2b:37:42' },
  { ip: '192.168.3.48', mac: '02:b3:fb:2b:37:43' },
  { ip: '192.168.3.49', mac: '02:b3:fb:2b:37:44' },
  { ip: '192.168.3.50', mac: '02:b3:fb:2b:37:45' },
  { ip: '192.168.3.51', mac: '02:b3:fb:2b:37:46' },
  { ip: '192.168.3.52', mac: '02:b3:fb:2b:37:47' },
  { ip: '192.168.3.53', mac: '02:b3:fb:2b:37:48' },
  { ip: '192.168.3.54', mac: '02:b3:fb:2b:37:49' },
  { ip: '192.168.3.55', mac: '02:b3:fb:2b:37:50' },
  { ip: '192.168.3.56', mac: '02:b3:fb:2b:37:51' },
  { ip: '192.168.3.57', mac: '02:b3:fb:2b:37:52' },
  { ip: '192.168.3.58', mac: '02:b3:fb:2b:37:53' },
  { ip: '192.168.3.59', mac: '02:b3:fb:2b:37:54' },
  { ip: '192.168.3.60', mac: '02:b3:fb:2b:37:55' },
  { ip: '192.168.3.61', mac: '02:b3:fb:2b:37:56' },
  { ip: '192.168.3.62', mac: '02:b3:fb:2b:37:57' },
  { ip: '192.168.3.63', mac: '02:b3:fb:2b:37:58' },
  { ip: '192.168.3.64', mac: '02:b3:fb:2b:37:59' },
  { ip: '192.168.3.65', mac: '02:b3:fb:2b:37:60' },
  { ip: '192.168.3.66', mac: '02:b3:fb:2b:37:61' },
  { ip: '192.168.3.67', mac: '02:b3:fb:2b:37:62' },
  { ip: '192.168.3.68', mac: '02:b3:fb:2b:37:63' },
  { ip: '192.168.3.69', mac: '02:b3:fb:2b:37:64' },
  { ip: '192.168.3.70', mac: '02:b3:fb:2b:37:65' },
  { ip: '192.168.3.71', mac: '02:b3:fb:2b:37:66' },
  { ip: '192.168.3.72', mac: '02:b3:fb:2b:37:67' },
  { ip: '192.168.3.73', mac: '02:b3:fb:2b:37:68' },
  { ip: '192.168.3.74', mac: '02:b3:fb:2b:37:69' },
  { ip: '192.168.3.75', mac: '02:b3:fb:2b:37:70' },
  { ip: '192.168.3.76', mac: '02:b3:fb:2b:37:71' },
  { ip: '192.168.3.77', mac: '02:b3:fb:2b:37:72' },
  { ip: '192.168.3.78', mac: '02:b3:fb:2b:37:73' },
  { ip: '192.168.3.79', mac: '02:b3:fb:2b:37:74' },
  { ip: '192.168.3.80', mac: '02:b3:fb:2b:37:75' },
  { ip: '192.168.3.81', mac: '02:b3:fb:2b:37:76' },
  { ip: '192.168.3.82', mac: '02:b3:fb:2b:37:77' },
  { ip: '192.168.3.83', mac: '02:b3:fb:2b:37:78' },
  { ip: '192.168.3.84', mac: '02:b3:fb:2b:37:79' },
  { ip: '192.168.3.85', mac: '02:b3:fb:2b:37:80' },
  { ip: '192.168.3.86', mac: '02:b3:fb:2b:37:81' },
  { ip: '192.168.3.87', mac: '02:b3:fb:2b:37:82' },
  { ip: '192.168.3.88', mac: '02:b3:fb:2b:37:83' },
  { ip: '192.168.3.89', mac: '02:b3:fb:2b:37:84' },
  { ip: '192.168.3.90', mac: '02:b3:fb:2b:37:85' },
  { ip: '192.168.3.91', mac: '02:b3:fb:2b:37:86' },
  { ip: '192.168.3.92', mac: '02:b3:fb:2b:37:87' },
  { ip: '192.168.3.93', mac: '02:b3:fb:2b:37:88' },
  { ip: '192.168.3.94', mac: '02:b3:fb:2b:37:89' },
  { ip: '192.168.3.95', mac: '02:b3:fb:2b:37:90' },
  { ip: '192.168.3.96', mac: '02:b3:fb:2b:37:91' },
  { ip: '192.168.3.97', mac: '02:b3:fb:2b:37:92' },
  { ip: '192.168.3.98', mac: '02:b3:fb:2b:37:93' },
  { ip: '192.168.3.99', mac: '02:b3:fb:2b:37:94' },
  { ip: '192.168.3.100', mac: '02:b3:fb:2b:37:95' },
  { ip: '192.168.3.101', mac: '02:b3:fb:2b:37:96' },
  { ip: '192.168.3.102', mac: '02:b3:fb:2b:37:97' },
  { ip: '192.168.3.103', mac: '02:b3:fb:2b:37:98' },
  { ip: '192.168.3.104', mac: '02:b3:fb:2b:37:99' }
];

// 开始给每个局域网ip分配代理
assignProxiesForAllLanIPs(IPLIST);
console.log(lanToProxyMap);

// 开始生成基础规则配置
let rulesContext = ''
for (let index = 0; index < baseRuleConfig.length; index++) {
  const element = baseRuleConfig[index];
  rulesContext += element + '\n'
}

// 去除不需要设置代理的ip
console.log(AIRPORT_CONFIG.notProxyIp);
const requireProxyIp = IPLIST.filter(item => !AIRPORT_CONFIG.notProxyIp.includes(item.ip));
console.log(requireProxyIp);



// 开始生成代理IP规则
for (let index = 0; index < requireProxyIp.length; index++) {
  rulesContext += `- SRC-IP-CIDR,${requireProxyIp[index].ip}/32,${updateConfig.parsedProxies[index].proxyState} # ${requireProxyIp[index].mac}` + '\n'
}

// 开始写入配置
fs.writeFileSync('./custom_rule.list', rulesContext);

module.exports = listenRulesSeller;