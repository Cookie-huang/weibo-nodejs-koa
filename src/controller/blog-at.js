/**
 * @description 微博 @ 关系 controller
 */

const {
  getAtRelationCount,
  getAtUserBlogList,
  updateAtRelation
} = require("../services/at-relation");
const { SuccessModel } = require("../model/ResModel");
const { PAGE_SIZE } = require("../conf/constant");

/**
 * 获取 @ 我的微博数量
 * @param {number} userId 用户id
 */
async function getAtMeCount(userId) {
  const count = await getAtRelationCount(userId);
  return new SuccessModel({
    count
  });
}

/**
 * 获取 @ 用户的微博列表
 * @param {number} userId 用户id
 * @param {number} pageIndex 页
 */
async function getAtMeBlogList(userId, pageIndex = 0) {
  const result = await getAtUserBlogList({
    userId,
    pageIndex,
    pageSize: PAGE_SIZE
  });

  const { count, blogList } = result;

  return new SuccessModel({
    isEmpty: blogList.length === 0,
    blogList,
    pageIndex,
    pageSize: PAGE_SIZE,
    count
  });
}

/**
 * 标记为已读
 * @param {number} userId 用户id
 */
async function markAsRead(userId) {
  try {
    await updateAtRelation(
      {
        newIsRead: true
      },
      {
        userId,
        isRead: false
      }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAtMeCount,
  getAtMeBlogList,
  markAsRead
};