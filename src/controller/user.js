/**
 * @description user controller
 */

const { getUserInfo, createUser, updateUser } = require("../services/user");
const { SuccessModel, ErrorModel } = require("../model/ResModel");
const {
  registerUserNameNotExistInfo,
  registerUserNameExistInfo,
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo,
  changeInfoFailInfo,
  changePasswordFailInfo
} = require("../model/ErrorInfo");
const doCrypto = require("../utils/cryp");

async function isExist(userName) {
  const userInfo = await getUserInfo(userName);
  if (userInfo) {
    return new SuccessModel(userInfo);
  } else {
    return new ErrorModel(registerUserNameNotExistInfo);
  }
}

/**
 *
 * @param {string} userName
 * @param {string} password
 * @param {number} gender 性别 (1男,2女,3保密)
 */
async function register({ userName, password, gender }) {
  const userInfo = await getUserInfo(userName);
  if (userInfo) {
    // 用户名已存在
    return new ErrorModel(registerUserNameExistInfo);
  }

  try {
    await createUser({
      userName,
      password: doCrypto(password),
      gender
    });
    return new SuccessModel();
  } catch (error) {
    console.error(error.message, error.stack);
    return new ErrorModel(registerFailInfo);
  }
}

async function login(ctx, userName, password) {
  const userInfo = await getUserInfo(userName, doCrypto(password));
  if (!userInfo) {
    // 登录失败
    return new ErrorModel(loginFailInfo);
  }

  // 登录成功
  if (!ctx.session.userInfo) {
    ctx.session.userInfo = userInfo;
  }
  return new SuccessModel();
}

/**
 * 修改个人信息
 * @param {Object} ctx ctx
 * @param {string} nickName 昵称
 * @param {string} city 城市
 * @param {string} picture 头像
 */
async function changeInfo(ctx, { nickName, city, picture }) {
  const { userName } = ctx.session.userInfo;
  if (!nickName) {
    nickName = userName;
  }

  const result = await updateUser(
    { newNickName: nickName, newCity: city, newPicture: picture },
    { userName }
  );

  if (result) {
    // 执行成功
    Object.assign(ctx.session.userInfo, {
      nickName,
      city,
      picture
    });
    return new SuccessModel();
  }
  return new ErrorModel(changeInfoFailInfo);
}

async function changePassword(userName, password, newPassword) {
  const result = await updateUser(
    { newPassword: doCrypto(newPassword) },
    { userName, password: doCrypto(password) }
  );
  if (result) {
    return new SuccessModel();
  }
  return new ErrorModel(changePasswordFailInfo);
}

async function logout(ctx) {
  delete ctx.session.userInfo;
  return new SuccessModel();
}

module.exports = {
  isExist,
  register,
  login,
  changeInfo,
  changePassword,
  logout
};
