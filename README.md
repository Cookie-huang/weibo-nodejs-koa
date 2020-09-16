- # 技术方案

  ![image](http://note.youdao.com/yws/res/398/4EEB8BB9AFF7497F91EC3854F416A166)
  ![](//note.youdao.com/yws/res/1675/WEBRESOURCEfd78f0f5cb46a963b38e05e3bf2b8eaf)

- # 开发

  - ## 页面和路由
    - ### 注册 /register
    - ### 登录 /login
    - ### 首页 /
    - ### 个人主页 /profile/:userName
    - ### at 页 /atMe
    - ### 广场 /square
    - ### 设置 /setting
    - ### 错误页 /error
    - ### 404 /\*
    - ### ejs 组件
      - #### 发布博客输入框
      - #### 博客列表
      - #### 加载更多
      - #### 个人信息
      - #### 粉丝列表
      - #### 关注人列表
    - ### 其他
      - #### 统一的 header 和 footer
  - ## api

    - ### 用户
      - #### 登录
        - ##### 登录 /api/user/login
      - #### 注册
        - ##### 注册 /api/user/register
        - ##### 用户名是否存在 /api/user/isExist
      - #### 设置
        - ##### 修改个人信息 /api/user/changeInfo
        - ##### 图片上传 /api/utils/upload
        - ##### 修改密码 /api/user/changePassword
        - ##### 退出登录 /api/user/logout
    - ### 微博
      - #### 首页
        - ##### 创建微博 /api/blog/create
        - ##### 图片上传 /api/utils/upload
        - ##### 加载更多 /api/blog/loadMore/:pageIndex
      - #### 个人主页
        - ##### 加载更多 /api/profile/loadMore/:userName/:pageIndex
        - ##### 关注 /api/profile/follow
        - ##### 取消关注 /api/profile/unFollow
      - #### 广场页
        - ##### 加载更多 /api/square/loadMore/:pageIndex
      - #### at 页
        - ##### 创建微博 /api/blog/create
        - ##### 图片上传 /api/utils/upload
        - ##### 加载更多 /api/atMe/loadMore/:pageIndex

- # 最佳实践
  - ## 项目结构
    - ### 分层 routes controller cache services db 等
    - ### 抽离中间件
    - ### 抽离 utils（工具） conf（配置） 等
    - ### 区分 app（业务） 和 www（服务）
    - ### 用 NODE_ENV 区分环境 (cross-env)
  - ## 错误处理
    - ### 规范错误数据（错误码 错误信息）
    - ### 统一错误输出 （error 页）
    - ### 对输入数据进行 schema 验证 (ajv)
  - ## 代码风格
    - ### 使用 eslint 并强制 pre-commit
    - ### 使用 jsdoc 注释文件和函数
    - ### 使用 async/await 编写异步逻辑
    - ### 规范 git 分支和 commit 格式
  - ## 质量保证
    - ### 编写单元测试
  - ## 安全
    - ### 处理 XSS (xss)
    - ### 使用 ORM 防止 sql 注入 (sequelize)
    - ### 加密敏感信息 (crypto)
  - ## 线上环境
    - ### 记录日志(nginx pm2)
    - ### 多进程(pm2)
    - ### 进程守护(pm2)
    - ### nginx 代理
    - ### 分服务 （mysql redis 等）
    - ### 系统监控 APM （实时监控）
