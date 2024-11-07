const { spawnSync } = require("child_process");
const AIRPORT_CONFIG = require("../base_config/base_config");

function getArpScanResults() {
  const command = "arp-scan";
  const args = ["--interface=br-lan", "192.168.3.0/24"];

  // 执行同步命令
  const result = spawnSync(command, args, { encoding: "utf-8" });

  if (result.error) {
    console.error(`执行出错: ${result.error.message}`);

    // >>
    let lll = [
      { ip: "192.168.3.1", mac: "b0:df:c1:7b:a3:e8" },
      { ip: "192.168.3.51", mac: "72:a3:af:76:8f:d3" },
      { ip: "192.168.3.101", mac: "d4:93:90:19:ec:28" },
      { ip: "192.168.3.106", mac: "a0:59:50:c9:7e:f8" },
      { ip: "192.168.3.102", mac: "6c:1f:f7:01:dc:90" },
      { ip: "192.168.3.97", mac: "0a:d4:d0:c0:f5:ea" },
      { ip: "192.168.3.77", mac: "de:e2:7f:d9:07:3a" },
      { ip: "192.168.3.168", mac: "f6:58:e4:b0:60:31" },
      { ip: "192.168.3.205", mac: "e2:55:07:93:14:49" },
      { ip: "192.168.3.252", mac: "00:0c:29:22:37:38" },
      { ip: "192.168.3.206", mac: "6a:35:1a:a1:d5:87" },
      { ip: "192.168.3.106", mac: "a0:59:50:c9:7e:f8" },
      { ip: "192.168.3.102", mac: "6c:1f:f7:01:dc:90" },
      { ip: "192.168.3.97", mac: "0a:d4:d0:c0:f5:ea" },
      { ip: "192.168.3.77", mac: "de:e2:7f:d9:07:3a" },
      { ip: "192.168.3.168", mac: "f6:58:e4:b0:60:31" },
      { ip: "192.168.3.205", mac: "e2:55:07:93:14:49" },
      { ip: "192.168.3.252", mac: "00:0c:29:22:37:38" },
      { ip: "192.168.3.206", mac: "6a:35:1a:a1:d5:87" },
    ];
    const filterResult = lll.filter(
      (item) => !AIRPORT_CONFIG.notProxyIp.includes(item.ip)
    );
    return filterResult;
    //<<
    return [];
  }

  // 解析输出数据
  const outputData = result.stdout;
  const lines = outputData.split("\n");
  const results = lines
    .map((line) =>
      line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F:]{17}|[0-9a-fA-F:]{14})/)
    )
    .filter((match) => match)
    .map((match) => ({ ip: match[1], mac: match[2] }));

  const filterResult = results.filter(
    (item) => !AIRPORT_CONFIG.notProxyIp.includes(item.ip)
  );
  return filterResult;
}

// 导出结果
module.exports = getArpScanResults;
