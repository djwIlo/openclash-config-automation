const fs = require("fs");
const axios = require("axios");

/**
 * 读取代理文件并将数据序列化
 * @param {*} AIRPORT_CONFIG 基础配置常量
 * @returns 
 */
function getCustomProxySerialize(AIRPORT_CONFIG) {
  let proxy = [];
  try {
    const proxyText = fs.readFileSync(AIRPORT_CONFIG.listProxyseller, "utf8");
    const proxyArray = proxyText.split("\n");

    proxyArray.forEach((element) => {
      const itemArr = element.split("@");
      const proxyName = itemArr[0].split(":");
      const proxyAuth = itemArr[1].split(":");
      const proxyNetwork = itemArr[2].split(":");

      const proxyObj = {
        proxyState: proxyName[0], // 代理名称
        linkProxy: proxyName[1], // 链式代理名称
        auth: proxyAuth[0], // 用户名
        password: proxyAuth[1], // 密码
        host: proxyNetwork[0], // IP地址
        port: parseInt(proxyNetwork[1]), // 端口
      };

      proxy.push(proxyObj);
    });

    return proxy;
  } catch (error) {
    console.log("读取配置文件失败", error);
  }
}

/**
 * 测试单个代理的可用性，多次尝试
 * @param {Object} proxy - 代理对象 { host: '代理地址', port: 端口, username: '用户名', password: '密码' }
 * @param {number} retries - 尝试次数
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<Object>} - 返回测试结果对象 { proxy, available, responseTime }
 */
async function testSingleProxy(proxy, retries = 3, timeout = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const startTime = Date.now();
    try {
      await axios.get("http://www.gstatic.com/generate_204", {
        proxy: {
          host: proxy.host,
          port: proxy.port,
          auth: {
            username: proxy.auth,
            password: proxy.password,
          },
        },
        timeout: timeout,
      });
      const responseTime = Date.now() - startTime; // 成功时返回响应时间
      return {
        proxyState: proxy.proxyState,
        linkProxy: proxy.linkProxy,
        host: `${proxy.host}`,
        port: `${proxy.port}`,
        available: true,
        responseTime: responseTime,
      };
    } catch (error) {
      // 如果最后一次尝试仍然失败，则返回不可用状态
      if (attempt === retries) {
        return {
          proxyState: proxy.proxyState,
          linkProxy: proxy.linkProxy,
          host: `${proxy.host}`,
          port: `${proxy.port}`,
          available: false,
          responseTime: null,
        };
      }
    }
  }
}

/**
 * 并发测试多个代理的可用性
 * @param {Array} proxies - 代理数组，每个代理是对象 { host, port, username, password }
 * @param {number} retries - 每个代理的尝试次数
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<Array>} - 包含测试结果的数组
 */
async function testProxies(proxies, retries = 3, timeout = 5000) {
  const testPromises = proxies.map((proxy) =>
    testSingleProxy(proxy, retries, timeout)
  );
  return await Promise.all(testPromises);
}

/**
 * 更新非运行时配置文件
 * @param {*} filePath 运行时配置路径
 * @param {*} proxies 代理检测结果列表
 */
async function updateRunConfig(filePath, historyProxyPath, proxies) {
  try {
    const proxyCollection = [];
    const runConfigText = await fs.readFileSync(filePath, 'utf8');
    let result = runConfigText.split('\n');
    console.log(result.length);
    
    // 获取可用和不可用代理
    const ableProxy = proxies.filter(item => item.available === true);
    const unableProxy = proxies.filter(item => item.available === false);

    // 逐个处理不可用代理
    for (let item of unableProxy) {
      for (let i = 0; i < result.length; i++) {
        let el = result[i];

        // 查找并替换匹配的不可用代理
        if (el.includes(',' + item.proxyState) || el.includes(',' + item.linkProxy)) {
          // 获取设备mac
          const mac = el.split('设备mac: ')[1];

          // 获取当前设备的历史代理并收集
          const { newProxyConfig, isupdate } = await getDeviceHistoryProxy(historyProxyPath, mac, ableProxy);
          console.log('获取到的新的可用代理IP', newProxyConfig);
          proxyCollection.push(newProxyConfig)
          
          // 进行代理替换
          console.log('原来的:', el);
          console.log(item.proxyState, newProxyConfig.proxyState);
          console.log(item.host, newProxyConfig.host);
          
          result[i] = el.replace(item.proxyState, newProxyConfig.proxyState).replace(item.host, newProxyConfig.host);
          console.log('替换后的:', result[i]);

          if (isupdate) {
            // 读取并更新历史记录
            const historyProxyText = await fs.readFileSync(historyProxyPath, 'utf8');
            const historyProxy = JSON.parse(historyProxyText);

            // 确保mac记录存在，防止push错误
            if (!historyProxy[mac]) {
              historyProxy[mac] = [];
            }

            // 添加新代理到历史记录
            historyProxy[mac].push(newProxyConfig.host);
            console.log('更新的历史记录:', historyProxy);

            // 写回历史记录文件
            const newHistoryProxyText = JSON.stringify(historyProxy, null, 2);
            await fs.writeFileSync(historyProxyPath, newHistoryProxyText);
          }
        }
      }
    }

    // 返回跟新后的配置问价跟更改的代理数量
    const newRunConfigText = result.join('\n');
    return { newRunConfigText, proxyCollection };
  } catch (error) {
    console.log('读取机场运行时配置出错:', error);
  }
}

async function getDeviceHistoryProxy(historyProxyPath, mac, ableProxy) {
  try {
    const historyProxyText = await fs.readFileSync(historyProxyPath, 'utf8');
    const historyProxy = JSON.parse(historyProxyText);
    // console.log(mac, historyProxy[mac]);
    const result = findAvailableProxy(historyProxy[mac], ableProxy);
    if (result) {
      return { newProxyConfig: result, isupdate: false };
    } else {
      console.log(mac, '没有可用代理，重新分配一个使用次数最少的可用代理');
      const {count, result} = getLeastHistoryProxy(historyProxy, ableProxy);
      // console.log({count, proxy});
      return { newProxyConfig: result, isupdate: true };
    } 
  } catch (error) {
    console.log('读取历史代理出错', error);
  }
}

/**
 * 查找历史代理中可用的代理
 * @param {*} arr1 历史代理
 * @param {*} arr2 可用代理列表
 * @returns 
 */
function findAvailableProxy(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j].host && arr2[j].available) {
        return arr2[j];
      }
    }
  }
  return false;
}

/**
 * 获取使用次数最少的代理
 * @param {*} historyProxy 历史代理 
 * @param {*} proxyList 可用代理
 * @returns 
 */
function getLeastHistoryProxy(historyProxy, proxyList) {
  // 统计每个代理的使用次数
  const usageCount = {};
  for (const mac in historyProxy) {
    for (const ip of historyProxy[mac]) {
      usageCount[ip] = (usageCount[ip] || 0) + 1;
    }
  }

  // 找到使用次数最少的代理
  let minUsageCount = Infinity;
  let leastUsedProxy = null;

  for (const proxy of proxyList) {
    const count = usageCount[proxy.host] || 0;
    if (count < minUsageCount) {
      minUsageCount = count;
      leastUsedProxy = proxy;
    }
  }

  // 返回最少使用次数和对应的代理
  return { count: minUsageCount, result: leastUsedProxy };
}

/**
 * 读取运行时配置文件
 * @param {*} filePath 运行时配置文件路径
 * @returns 
 */
async function getRunConfig(filePath) {
  try {
    const runConfigText = fs.readFileSync(filePath, 'utf8');
    return runConfigText;
  } catch (error) {
    console.log('读取运行时配置文件失败');
    return '出问题了！'
  }
}

module.exports = {
  getCustomProxySerialize,
  testProxies,
  updateRunConfig,
  getRunConfig
};
