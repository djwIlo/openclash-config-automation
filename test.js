const { spawn } = require('child_process');

// 使用 br-lan 接口进行 arp-scan
const command = 'arp-scan';
const args = ['--interface=br-lan', '192.168.3.0/24'];

const arpScanProcess = spawn(command, args);

let outputData = ''; // 用于存储输出数据

// 处理标准输出
arpScanProcess.stdout.on('data', (data) => {
    outputData += data.toString(); // 累加输出数据
});

// 处理标准错误
arpScanProcess.stderr.on('data', (data) => {
  if (!data.includes('WARNING')) {
    console.error(`标准错误:\n${data}`);
  }
});

// 处理进程退出
arpScanProcess.on('close', (code) => {
    console.log(`进程退出，代码: ${code}`);
    
    // 解析输出数据
    const lines = outputData.split('\n');
    const results = [];

    lines.forEach(line => {
        // 使用正则表达式匹配 IP 和 MAC 地址
        const match = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F:]{17}|[0-9a-fA-F:]{14})/);
        if (match) {
            const ip = match[1]; // 提取 IP 地址
            const mac = match[2]; // 提取 MAC 地址
            results.push({ ip, mac }); // 将 IP 和 MAC 放入对象数组
        }
    });

    // 打印提取的结果
    console.log('提取的 IP 和 MAC 地址:');
    console.log(results);
});