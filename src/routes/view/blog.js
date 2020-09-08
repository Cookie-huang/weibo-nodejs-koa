/**
 * @description blog view route
 * @author Cooky
 */

const router = require("koa-router")();
const { loginRedirect } = require("../../middlewares/loginChecks");

router.get("/", loginRedirect, async (ctx, next) => {
  const userInfo = ctx.session.userInfo;
  
  await ctx.render("index", {
    userData: {
      userInfo,
      fansData: {
        count: null,
        list: null
      },
      followersData: {
        count: null,
        list: null
      },
      atCount: null
    },
    blogData: {
      isEmpty: false,
      blogList: [],
      pageSize: 10,
      pageIndex: 0,
      count: 10
    }
  });
});

module.exports = router;
