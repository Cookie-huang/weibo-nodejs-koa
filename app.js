const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const koaStatic = require("koa-static");

const { REDIS_CONF } = require("./src/conf/db");
const { isProd } = require("./src/utils/env");
const { SESSION_SECRET_KEY } = require("./src/conf/secretKeys");

const atAPIRouter = require("./src/routes/api/blog-at");
const squareAPIRouter = require("./src/routes/api/blog-square");
const profileAPIRouter = require("./src/routes/api/blog-profile");
const homeAPIRouter = require("./src/routes/api/blog-home");
const blogViewRouter = require("./src/routes/view/blog");
const utilsAPIRouter = require("./src/routes/api/utils");
const userAPIRouter = require("./src/routes/api/user");
const userViewRouter = require("./src/routes/view/user");
const errorViewRouter = require("./src/routes/view/error");

// error handler
let onerrorConf = {};
if (isProd) {
  onerrorConf = {
    redirect: "/error"
  };
}
onerror(app, onerrorConf);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(koaStatic(__dirname + "/public"));
app.use(koaStatic(__dirname + "/uploadFiles"));

app.use(views(__dirname + "/src/views", { extension: "ejs" }));

// session
app.keys = [SESSION_SECRET_KEY];
app.use(
  session({
    key: "weibo.sid", //cookie name 默认是 `koa.sid`
    prefix: "weibo:sess:", // redis key 的前缀，默认是 `koa:sess:`
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
  })
);

// routes
app.use(atAPIRouter.routes(), atAPIRouter.allowedMethods());
app.use(squareAPIRouter.routes(), squareAPIRouter.allowedMethods());
app.use(profileAPIRouter.routes(), profileAPIRouter.allowedMethods());
app.use(homeAPIRouter.routes(), homeAPIRouter.allowedMethods());
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods());
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods());
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods());
app.use(userViewRouter.routes(), userViewRouter.allowedMethods());
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()); // 404 路由注册到最后面

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
