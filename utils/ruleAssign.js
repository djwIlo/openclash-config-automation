// 代理IP池
let availableProxies = ['43.129.96.250', '43.155.25.63', '47.254.89.146'];

// 保存局域网设备的代理IP使用历史
let lanToProxyMap = {};

// 保存代理IP的网络可用状态
let proxyStatus = {
  '43.129.96.250': true,
  '43.155.25.63': true,
  '47.254.89.146': true,
  '47.88.21.38': true,
};

// 代理轮询索引，用于轮流分配代理IP
let proxyIndex = 0;

// 分配代理IP的函数，保证负载均衡
function assignProxy(lanIP) {
  // 如果该局域网设备没有历史使用代理IP，则为其分配新的代理
  if (!lanToProxyMap[lanIP]) {
    let newProxyIP = getNextProxy(); // 获取下一个代理IP
    lanToProxyMap[lanIP] = [newProxyIP]; // 创建该设备的历史代理IP列表
    return newProxyIP;
  } else {
    // 如果该设备已有历史，则获取可用代理IP
    return getAvailableProxy(lanIP);
  }
}

// 获取下一个代理IP，实现轮询
function getNextProxy() {
  let startIndex = proxyIndex;
  while (true) {
    let proxyIP = availableProxies[proxyIndex];
    proxyIndex = (proxyIndex + 1) % availableProxies.length; // 更新轮询索引
    console.log(proxyStatus);
    
    if (proxyStatus[proxyIP]) {
      return proxyIP; // 返回可用的代理IP
    }
    // 如果所有代理都不可用，则返回null（这需要处理代理池为空的情况）
    if (proxyIndex === startIndex) {
      return null;
    }
  }
}

// 根据历史顺序获取可用的代理IP
function getAvailableProxy(lanIP) {
  let proxyHistory = lanToProxyMap[lanIP];

  // 遍历历史代理IP，找到下一个可用的
  for (let i = 0; i < proxyHistory.length; i++) {
    let proxyIP = proxyHistory[i];
    if (proxyStatus[proxyIP]) {
      return proxyIP; // 返回可用的历史代理IP
    }
  }

  // 如果没有可用的历史代理IP，返回一个新的代理IP
  let newProxyIP = getNextProxy();
  if (newProxyIP) {
    proxyHistory.push(newProxyIP); // 将新的代理IP加入历史记录
  }
  return newProxyIP;
}

/**
 * 为所有局域网ip分配代理
 * @param {Array} lanIPs 
 */
function assignProxiesForAllLanIPs(lanIPs) {
  lanIPs.forEach(lanIP => {
    // console.log(lanIP);
    
    let assignedProxy = assignProxy(lanIP.ip);
    console.log(`为 ${lanIP.ip} 分配的代理IP是: ${assignedProxy}`);
  });
}




module.exports = {
  assignProxiesForAllLanIPs,
  lanToProxyMap,
}