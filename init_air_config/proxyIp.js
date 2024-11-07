const fs = require('fs');

function getProxyResult(file) {
  try {
    const arr = [];
    const proxyText = fs.readFileSync(file, 'utf8');
    const proxyArray = proxyText.split('\n');
    
    proxyArray.forEach(item => {
      let parts = item.split('@'); // 分离状态、认证信息、host和port
      let proxyName = parts[0].split(':'); // 代理名称、链式代理名称
      let authInfo = parts[1].split(':'); // 分离用户名、密码
      let hostInfo = parts[2].split(':'); // 分离host、port
      
      arr.push({
        proxyState: proxyName[0], // 代理名称
        linkProxy: proxyName[1], // 链式代理名称
        auth: authInfo[0], // 用户名
        password: authInfo[1], // 密码
        host: hostInfo[0], // IP地址
        port: parseInt(hostInfo[1]) // 端口
      });
    })
    // console.log(proxyArray);
    return arr
  } catch (error) {
    return error;
  }
}

module.exports = getProxyResult;