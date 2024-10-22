const { spawn } = require('child_process');

function monitorNeighbors() {
  const command = spawn('ip', ['-4', 'neigh', 'show']);

  command.stdout.on('data', (data) => {
    const neighbors = data.toString();
    console.log(`邻居状态: \n${neighbors}`);
    // 你可以在这里根据邻居的状态进一步处理，例如判断是否在线
  });

  command.stderr.on('data', (error) => {
    console.error(`命令执行错误: ${error}`);
  });

  command.on('close', (code) => {
    console.log(`子进程退出，退出码: ${code}`);
  });
}

// 定时执行以持续监听（例如每隔5秒监听一次）
setInterval(monitorNeighbors, 5000);
