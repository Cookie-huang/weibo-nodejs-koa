/**
 * @description 微博 @ 用户关系 service
 */

const { AtRelation, User, Blog } = require("../db/model/index");
const { formatBlog, formatUser } = require("./_format");

/**
 * 创建微博 @ 用户的关系
 * @param {number} blogId 微博id
 * @param {number} userId 用户id
 */
async function createAtRelation(blogId, userId) {
  const result = await AtRelation.create({
    blogId,
    userId
  });
  return result.dataValues;
}

/**
 * 获取 @ 用户的微博数量（未读的）
 * @param {number} userId 用户id
 */
async function getAtRelationCount(userId) {
  const result = await AtRelation.findAndCountAll({
    where: {
      userId,
      isRead: false
    }
  });
  return result.count;
}

/**
 * 获取 @ 用户的微博列表
 * @param {Object} param0
 */
async function getAtUserBlogList({ userId, pageIndex, pageSize = 10 }) {
  const result = await Blog.findAndCountAll({
    limit: pageSize,
    offset: pageSize * pageIndex,
    order: [["id", "desc"]],
    include: [
      {
        model: AtRelation,
        attributes: ["userId", "blogId"],
        where: { userId }
      },
      {
        model: User,
        attributes: ["userName", "nickName", "picture"]
      }
    ]
  });

  // 格式化
  let blogList = result.rows.map(row => row.dataValues);
  blogList = formatBlog(blogList);
  blogList = blogList.map(blogItem => {
    blogItem.user = formatUser(blogItem.user.dataValues);
    return blogItem;
  });

  return {
    count: result.count,
    blogList
  };
}

/**
 * 更新 AtRelation
 * @param {Object} param0 更新内容
 * @param {Object} param1 查询条件
 */
async function updateAtRelation({ newIsRead }, { userId, isRead }) {
  // 拼接更新内容
  const updateData = {};
  if (newIsRead) {
    updateData.isRead = newIsRead;
  }

  // 拼接查询条件
  const whereData = {
    isRead
  };
  if (userId) {
    whereData.userId = userId;
  }

  // 执行更新
  const result = await AtRelation.update(updateData, {
    where: whereData
  });
  return result[0] > 0;
}

module.exports = {
  createAtRelation,
  getAtRelationCount,
  getAtUserBlogList,
  updateAtRelation
};
