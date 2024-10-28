const koa = require("koa");

class AIRPORT_CONFIG {
  static app = new koa();
  PORT = 5024;
  detection = "http://www.gstatic.com/generate_204";
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
