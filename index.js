const koa = require("koa");
const app = new koa();

const PORT = 5024;
console.log(app);

app.use(ctx => {
  console.log(ctx);
  ctx.body = 'Hello Wrold!'
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`自动化代理服务已启动！`);
});
