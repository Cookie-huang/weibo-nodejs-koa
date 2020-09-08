/**
 * @description blog API router
 */

const router = require("koa-router")();
const { create } = require("../../controller/blog-home");
const genValidator = require("../../middlewares/validator");
const blogValidate = require("../../validator/blog");
const { loginCheck } = require("../../middlewares/loginChecks");

router.prefix("/api/blog");

// 创建微博
router.post(
  "/create",
  loginCheck,
  genValidator(blogValidate),
  async (ctx, next) => {
    const { content, image } = ctx.request.body;
    const { id: userId } = ctx.session.userInfo;
    ctx.body = await create({ userId, content, image });
  }
);

module.exports = router;
