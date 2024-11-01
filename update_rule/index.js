const fs = require('fs');
const AIRPORT_CONFIG = require('../base_config/base_config')
const updateConfig = require('../update_config/update_config');
const { getFileSerialize, getProxyConfig } = require('../utils');

// 获取基础rule配置
const baseRuleConfig = getFileSerialize(AIRPORT_CONFIG.listRuleseller);
// console.log(baseRuleConfig);


// 获取代理序列化数组
const proxies =  getProxyConfig(updateConfig.parsedProxies, updateConfig.proxyConfigList)
console.log(proxies);

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
  { ip: '192.168.3.1', mac: 'b0:df:c1:7b:a3:e8' },
  { ip: '192.168.3.51', mac: '02:b3:fb:2b:37:6d' },
  { ip: '192.168.3.102', mac: 'd4:93:90:19:ec:28' },
  { ip: '192.168.3.101', mac: '6c:1f:f7:01:dc:90' },
  { ip: '192.168.3.97', mac: '92:e7:d0:21:f2:e6' },
  { ip: '192.168.3.205', mac: '06:89:53:f4:1c:40' },
  { ip: '192.168.3.252', mac: '00:0c:29:22:37:38' }
];
// <<<<<<<<<

// 开始生成基础规则配置
let rulesContext = ''
for (let index = 0; index < baseRuleConfig.length; index++) {
  const element = baseRuleConfig[index];
  // console.log(element);
  rulesContext += element + '\n'
}

// 开始生成代理IP规则
for (let index = 0; index < IPLIST.length; index++) {
  const element = IPLIST[index];
  // console.log(element);
  if (element.ip != '192.168.3.1' && element.ip != '192.168.3.2' && element.ip != '192.168.3.3' && element.ip != '192.168.3.252') {
    rulesContext += `- SRC-IP-CIDR,${element.ip}/32,DIRECT # ${element.mac}` + '\n'
  }
}

// console.log(rulesContext);
// 开始写入配置
fs.writeFileSync('./custom_rule.list', rulesContext);