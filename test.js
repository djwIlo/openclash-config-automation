const { exec } = require('child_process');

// 定义要执行的命令
const command = 'arp-scan 192.168.3.0/24';

// 执行命令
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`执行错误: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`标准错误: ${stderr}`);
        return;
    }
    // 打印命令输出
    console.log(`输出:\n${stdout}`);
});
