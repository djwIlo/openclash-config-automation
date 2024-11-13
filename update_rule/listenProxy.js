const fs = require('fs');
const os = require('os');
const utils = require("./utils");
const { exec } = require('child_process');
const AIRPORT_CONFIG = require("../base_config/base_config");

async function listenProxy() {
  const proxies = utils.getCustomProxySerialize(AIRPORT_CONFIG);
  const storageRunConfig = utils.getRunConfig(AIRPORT_CONFIG.outputConfigPath);

  try {
    // 代理可用性检测结果
    const results = await utils.testProxies(proxies);
    // console.log("代理测试结果:", results);
    // const results = [
    //   {
    //     proxyState: '美国-01',
    //     linkProxy: '链式代理-01',
    //     host: '179.60.183.51',
    //     port: '50101',
    //     available: true,
    //     responseTime: 461
    //   },
    //   {
    //     proxyState: '美国-02',
    //     linkProxy: '链式代理-02',
    //     host: '179.60.183.156',
    //     port: '50101',
    //     available: true,
    //     responseTime: 467
    //   },
    //   {
    //     proxyState: '美国-03',
    //     linkProxy: '链式代理-03',
    //     host: '94.131.48.54',
    //     port: '50101',
    //     available: false,
    //     responseTime: null
    //   },
    //   {
    //     proxyState: '美国-04',
    //     linkProxy: '链式代理-04',
    //     host: '94.131.48.15',
    //     port: '50101',
    //     available: false,
    //     responseTime: null
    //   },
    //   {
    //     proxyState: '美国-05',
    //     linkProxy: '链式代理-05',
    //     host: '63.223.67.151',
    //     port: '50101',
    //     available: true,
    //     responseTime: 761
    //   },
    //   {
    //     proxyState: '美国-06',
    //     linkProxy: '链式代理-06',
    //     host: '23.27.3.214',
    //     port: '50101',
    //     available: true,
    //     responseTime: 751
    //   },
    //   {
    //     proxyState: '美国-07',
    //     linkProxy: '链式代理-07',
    //     host: '200.10.34.12',
    //     port: '50101',
    //     available: true,
    //     responseTime: 470
    //   },
    //   {
    //     proxyState: '美国-08',
    //     linkProxy: '链式代理-08',
    //     host: '200.10.35.184',
    //     port: '50101',
    //     available: true,
    //     responseTime: 490
    //   },
    //   {
    //     proxyState: '美国-09',
    //     linkProxy: '链式代理-09',
    //     host: '138.36.93.84',
    //     port: '50101',
    //     available: true,
    //     responseTime: 464
    //   },
    //   {
    //     proxyState: '美国-10',
    //     linkProxy: '链式代理-10',
    //     host: '138.36.93.165',
    //     port: '50101',
    //     available: true,
    //     responseTime: 463
    //   }
    // ]

    // 开始替换坏掉的代理
    const { newRunConfigText, proxyCollection} = await utils.updateRunConfig(AIRPORT_CONFIG.outputConfigPath, AIRPORT_CONFIG.lanipHistoryProxy, results);
    // console.log(newRunConfigText);

    console.log('开始更新运行时配置');
    if (AIRPORT_CONFIG.testConfigOutputPath == 'test') {
      console.log('测试');
      fs.writeFileSync('./test.yaml', newRunConfigText);
    } else {
      console.log('正式');
      if (proxyCollection.length == 0) {
        console.log('此次配置文件未作更改，不用更新');
      } else {
        try {
          fs.writeFileSync(AIRPORT_CONFIG.outputConfigPath, newRunConfigText);
          console.log('运行时配置更新成功');
          if (!os.type().includes('Windows')) {
            console.log('重启openclash服务');
            exec('/etc/init.d/openclash restart', (error, stdout, stderr) => {
              if (error) {
                console.error(`执行出错: ${error.message}`);
                return;
              }
              if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
              }
              console.log(`命令输出: ${stdout}`);
              console.log('openclash服务重启完毕');
            });
          }
        } catch (error) {
          console.error(`执行出错: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.log(console.error("代理测试过程中出现错误:", error));
  }
}
module.exports = listenProxy;
