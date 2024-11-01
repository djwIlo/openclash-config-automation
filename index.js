const koa = require("koa");
const dotenv = require('dotenv');
const app = new koa();

// 根据NODE_ENV的值加载相应的配置文件
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

console.log(`Running on port: ${process.env.PORT}`);

const PORT = 5024;
console.log(app);

app.use(ctx => {
  console.log(ctx);
  ctx.body = 'Hello Wrold!'
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`自动化代理服务已启动！`);
});
