const koa = require("koa");
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log(process.argv);
// 获取当前运行环境
let ENV;
if (os.type().includes('Windows')) {
  ENV = JSON.parse(fs.readFileSync('./base_config/development.json', 'utf8'));
} else {
  ENV = JSON.parse(fs.readFileSync('./base_config/production.json', 'utf8'));
}

class AIRPORT_CONFIG {
  static app = new koa();
  static HOST = ENV.HOST;
  static PORT = ENV.PORT;
  static notProxyIp = ['192.168.100.1', '192.168.100.2', '192.168.100.3', '192.168.100.4', '192.168.100.200', '192.168.3.1', '192.168.3.252', '192.168.3.251']
  static detection = ENV.DETECTION; // 检测ip质量
  static configFilePath = os.type().includes('Windows') ? path.join(__dirname, ENV.CONFIG_FILE_PATH) : ENV.CONFIG_FILE_PATH; // 未运行时的配置
  static outputConfigPath = os.type().includes('Windows') ? path.join(__dirname, ENV.OUTPUT_CONFIG_PATH) : ENV.OUTPUT_CONFIG_PATH; // 输出到运行时的配置
  static listProxyseller = path.join(__dirname, ENV.LIST_PROXYSELLER); // socks5代理配置路径
  static listRuleseller = path.join(__dirname, ENV.LIST_RULESELLER); // 基础rule配置路径
  static lanipHistoryProxy = path.join(__dirname, ENV.LANIP_HISTORY_PROXY); // lanIp历史代理使用记录存储文件
  static testConfigOutputPath = process.argv.length > 2 ? process.argv[2] : 'product';
  constructor(name = 'proxyIp', host = '127.0.0.1', port = 50101, authuser = 'root', password = '123456') {
    this.proxyConfig = [ //基础socks5代理配置
      `- name: ${name}`,
      "  type: socks5",
      `  server: ${host}`,
      `  port: ${port}`,
      `  username: ${authuser}`,
      `  password: ${password}`,
      "  udp: true",
      "  skip-cert-verify: true",
      "  tls: false",
      "  ip-version: dual",
      "  tfo: true",
      "  smux:",
      "    enabled: false",
    ];
  }
}

module.exports = AIRPORT_CONFIG;
