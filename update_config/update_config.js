const fs = require('fs');
const path = require('path');

// 获取配置文件路径
const configFilePath = path.join(__dirname, '../airport_config/overseas/config.yaml');

const configContext = fs.readFileSync(configFilePath, 'utf8');

const configList = configContext.split('\n');

// 代理开始行正则
const proxiesStartRegExp = /^proxies:$/;

// 代理结束行正则
const proxiesEndRegExp = /^proxy-groups:$/;

const arrayIndex = {};

for (let index = 0; index < configList.length; index++) {
  const element = configList[index];
  if (element.includes('proxies:') && proxiesStartRegExp.test(element)) {
    console.log(index, element);
    arrayIndex.startIndex = index + 1
  }

  if (element.includes('proxy-groups:') && proxiesEndRegExp.test(element)) {
    console.log(index, element);
    arrayIndex.endIndex = index
  }
}

const proxiesList = configList.slice(arrayIndex.startIndex, arrayIndex.endIndex);

// console.log(proxiesList);

// 每个块的大小为13行
let chunkSize = 13;

// 定义空数组来保存生成的对象
let resultArray = [];

// 遍历数组，并每次取出13行元素，解析为对象
for (let i = 0; i < proxiesList.length; i += chunkSize) {
  let chunk = proxiesList.slice(i, i + chunkSize); // 每次取出13个元素

  // 创建对象并赋值
  let obj = {
    name: chunk[0].split(': ')[1].trim(),
    type: chunk[1].split(': ')[1].trim(),
    server: chunk[2].split(': ')[1].trim(),
    port: parseInt(chunk[3].split(': ')[1].trim()),
    username: chunk[4].split(': ')[1].trim(),
    password: chunk[5].split(': ')[1].trim(),
    udp: chunk[6].split(': ')[1].trim() === "true",
    "skip-cert-verify": chunk[7].split(': ')[1].trim() === "true",
    tls: chunk[8].split(': ')[1].trim() === "false" ? false : true,
    "ip-version": chunk[9].split(': ')[1].trim(),
    tfo: chunk[10].split(': ')[1].trim() === "true",
    smux: {
      enabled: chunk[12].split(': ')[1].trim() === "false" ? false : true
    }
  };

  // 将对象推入结果数组
  resultArray.push(obj);
}

// 输出最终结果数组
console.log(resultArray);