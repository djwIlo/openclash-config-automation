const koa = require("koa");

class AIRPORT_CONFIG {
  app = new koa();
  PORT = 5024;
  detection = "http://www.gstatic.com/generate_204";
  domestic = [
    "- name: 美国-01",
    "  type: socks5",
    "  server: 179.60.183.51",
    "  port: 50101",
    "  username: ilodjw",
    "  password: QHW2DvrBxC",
    "  udp: true",
    "  skip-cert-verify: true",
    "  tls: false",
    "  ip-version: dual",
    "  tfo: true",
    "  smux:",
    "    enabled: false",
  ];
}

module.exports = new AIRPORT_CONFIG();
