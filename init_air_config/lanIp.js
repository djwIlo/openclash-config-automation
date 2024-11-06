const { spawnSync } = require('child_process');

function getArpScanResults() {
    const command = 'arp-scan';
    const args = ['--interface=br-lan', '192.168.3.0/24'];
    
    // 执行同步命令
    const result = spawnSync(command, args, { encoding: 'utf-8' });

    if (result.error) {
        console.error(`执行出错: ${result.error.message}`);
        return [];
    }

    // 解析输出数据
    const outputData = result.stdout;
    const lines = outputData.split('\n');
    const results = lines
        .map(line => line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F:]{17}|[0-9a-fA-F:]{14})/))
        .filter(match => match)
        .map(match => ({ ip: match[1], mac: match[2] }));
    
    return results;
}

// 导出结果
module.exports = getArpScanResults;
