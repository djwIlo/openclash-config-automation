const fs = require('fs');
const axios = require('axios');
const AIRPORT_CONFIG = require('../base_config/base_config');

console.log(AIRPORT_CONFIG);
// console.log(axios);

// 设置代理
const proxyConfig = {
  host: '23.27.3.214',
  port: 50101,
  auth: {
    username: 'ilodjw', // 如果代理需要认证
    password: 'QHW2DvrBxC'
  }
};

// 检测代理可用性
const testProxy = async () => {
  try {
    const start = Date.now();
    const response = await axios.get(AIRPORT_CONFIG.detection, {
      proxy: proxyConfig,
      timeout: 5000 // 设置超时为5秒
    });
    const end = Date.now();
    if (response.status === 204) {
      console.log('代理可用，延迟：', end - start, 'ms');
    } else {
      console.log('代理返回了非204响应:', response.status);
      // 更新配置文件，替换可用代理
    }
  } catch (error) {
    console.log('代理不可用或请求失败', error.message);
    // 更新配置文件，替换可用代理
  }
};

testProxy();