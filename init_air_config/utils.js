const fs = require("fs");
const getArpScanResults = require("./lanIp");
const getProxyResult = require("./proxyIp");

/**
 * 机场配置序列化
 * @param {string} file
 * @returns {Array}
 */
function readAirConfig(file) {
  try {
    const airText = fs.readFileSync(file, "utf8");

    const airSerialize = airText.split("\n").map((item) => item + "\n");

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
  let arrayIndex = {};

  // 代理开始行正则
  const proxiesStartRegExp = /^proxies:.*/;

  // 代理结束行正则
  const proxiesEndRegExp = /^proxy-groups:.*/;

  // 规则开始行正则
  const ruleStartRegExp = /^rules:.*/;

  for (let index = 0; index < configArray.length; index++) {
    const element = configArray[index];
    if (element.includes("proxies:") && proxiesStartRegExp.test(element)) {
      arrayIndex.proxyStartIndex = index + 1;
    }

    if (element.includes("proxy-groups:") && proxiesEndRegExp.test(element)) {
      arrayIndex.proxyEndIndex = index - 1;
    }

    if (element.includes("rules:") && ruleStartRegExp.test(element)) {
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
    let proxyConfig1 = [];
    let proxySerialize = [];
    const proxyText = fs.readFileSync(file, "utf8");
    const proxyArray = proxyText.split("\n");
    proxyArray.forEach((element) => {
      const itemArr = element.split("@");
      const proxyName = itemArr[0].split(":");
      const proxyAuth = itemArr[1].split(":");
      const proxyNetwork = itemArr[2].split(":");
      const proxy = new AIRPORT_CONFIG(
        proxyName[0],
        proxyNetwork[0],
        proxyNetwork[1],
        proxyAuth[0],
        proxyAuth[1]
      );

      proxyConfig1.push(proxy.proxyConfig.join("\n") + "\n");

      const proxyObj = {
        proxyState: proxyName[0], // 代理名称
        linkProxy: proxyName[1], // 链式代理名称
        auth: proxyAuth[0], // 用户名
        password: proxyAuth[1], // 密码
        host: proxyNetwork[0], // IP地址
        port: parseInt(proxyNetwork[1]) // 端口
      }
      proxySerialize.push(proxyObj)
    });

    const customProxyConfig = proxyConfig1.join("")

    return { customProxyConfig, proxySerialize };
  } catch (err) {
    console.error("读取文件错误:", err);
  }
}

/**
 * 生成自定义规则配置
 * @param {string} ruleFile 规则文件路径
 * @param {string} proxyFile 代理文件路径
 * @returns {Object} 规则配置文件数组
 */
function getCustomRuleConfig(ruleFile, proxyFile) {
  const ruleText = fs.readFileSync(ruleFile, "utf8");
  const ruleArray = ruleText.split("\n"); //基础rule配置
  const lanIp = getArpScanResults();
  const proxyIp = getProxyResult(proxyFile);
  const { assignProxy, storageProxy } = assignProxies(lanIp, proxyIp);
  const ruleConfig = ruleArray
    .concat(...assignProxy)
    .map((item) => item + "\n");
  return { ruleConfig, storageProxy };
}

/**
 * 分配代理并存储历史代理使用记录
 * @param {*} lanIp
 * @param {*} proxyIp
 * @returns
 */
function assignProxies(lanIp, proxyIp) {
  const assignProxy = lanIp.map((element, index) => {
    const proxy = proxyIp[index % proxyIp.length]; // 通过取模重新分配
    return `- SRC-IP-CIDR,${element.ip}/32,${proxy.proxyState} # 代理: ${proxy.host} 设备mac: ${element.mac}`;
  });

  const storageProxy = {};

  lanIp.forEach((element, index) => {
    const proxy = proxyIp[index % proxyIp.length];
    storageProxy[element.mac] = [proxy.host]; // 将分配结果存入对象
  });

  return { assignProxy, storageProxy };
}

/**
 * 获取配置文件中的代理片段
 * @param {Object} arrayIndex 索引存储
 * @param {Array} configList 配置文件序列化数组
 * @param {Array} proxySerialize 自定义代理序列化数组
 * @returns {Array} Array
 */
function getConfigProxySlice(arrayIndex, configList, proxySerialize) {
  const proxiesList = configList.slice(
    arrayIndex.proxyStartIndex,
    arrayIndex.proxyEndIndex
  );
  // 配置文件代理配置段
  let proxyContext = "";
  for (let index = 0; index < proxiesList.length; index++) {
    const element = proxiesList[index];
    proxyContext += element;
  }
  // 按照 - name 行分割
  const entries = proxyContext
    .split(/(?=-\sname:)/)
    .filter((entry) => entry.trim() !== "");
  // 每段作为一个数组元素
  const proxyConfigMap = entries.map((entry) => [entry.trim() + "\n"]);

  // 过滤出机场配置
  // const proxyConfigList = proxyConfigMap.filter(entry => !entry[0].includes('socks5')).join('');
  const proxyConfigList = proxyConfigMap.filter(
    (entry) => !entry[0].includes("socks5")
  );

  // 生成香港代理组
  const hkProxyGroup = getHKProxyGroup(proxyConfigList);

  // 生成链式代理组
  const linkProxyGroup = getLinkProxyGroup(proxySerialize)
  
  // 合并代理组
  const mergeProxyGroup = linkProxyGroup.concat(hkProxyGroup)

  const getAirProxyConfig = [proxyConfigList.join("")];

  return { getAirProxyConfig, mergeProxyGroup};
}

/**
 * 生成香港代理组
 * @param {Array} proxyConfigList 机场代理配置片段
 * @returns 
 */
function getHKProxyGroup(proxyConfigList) {
  let hkProxy = [];
  for (let index = 0; index < proxyConfigList.length; index++) {
    const item = proxyConfigList[index];
    if (item[0].includes("香港")) {
      const proxyName = item[0].split("- name: ")[1].split("  type:")[0];
      hkProxy.push(`  - ${proxyName}`);
    }
  }

  const hkProxyGroup = [
    `- name: HK 香港节点\n`,
    `  type: url-test\n`,
    `  proxies:\n`,
    `  url: http://www.gstatic.com/generate_204\n`,
    `  interval: '300'\n`,
    `  tolerance: '50'\n`,
  ];

  hkProxyGroup.splice(3, 0, ...hkProxy);

  return hkProxyGroup;
}

/**
 * 生成链式代理组
 * @param {Array} proxySerialize 自定义代理序列化数组
 */
function getLinkProxyGroup(proxySerialize) {
  let linkProxyGroup = []
  for (let index = 0; index < proxySerialize.length; index++) {
    const item = proxySerialize[index];
    const linkProxy = [
      `- name: ${item.linkProxy}\n`,
      `  type: relay\n`,
      `  proxies:\n`,
      `    - "HK 香港节点"\n`,
      `    - "${item.proxyState}"\n`
    ]

    linkProxyGroup = linkProxyGroup.concat(linkProxy);

  }

  return linkProxyGroup;
}

module.exports = {
  readAirConfig,
  getRegExpIndex,
  getCustomProxyConfig,
  getCustomRuleConfig,
  getConfigProxySlice,
};
