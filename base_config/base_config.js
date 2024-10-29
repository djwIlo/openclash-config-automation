const koa = require("koa");
const path = require('path');

class AIRPORT_CONFIG {
  static app = new koa();
  static PORT = 5024;
  static detection = "http://www.gstatic.com/generate_204"; // 检测ip质量
  static outputConfigPath = `/etc/openclash/config.yaml` // 输出到运行时的配置
  static listProxyseller = path.join(__dirname, '../base_config/list_proxyseller.txt'); // socks5代理配置路径
  static configFilePath = `/etc/openclash/config/config.yaml`; // 未运行时的配置
  static listRuleseller = path.join(__dirname, '../base_config/list_ruleseller.txt'); // 基础rule配置路径
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
