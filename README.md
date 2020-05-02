# vue_shop

## 后端API接口源码 [下载](https://github.com/chao-gu/vue_shop_api_server) · [接口API](https://github.com/chao-gu/vue_shop_api_server/blob/master/%E7%94%B5%E5%95%86%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0%20API%20%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.md)

## 1、项目概述

### 1.1 电商项目基本业务概述

- 根据不同的应用场景，电商系统一般都提供了 PC 端、移动 APP、移动 Web、微信小程序等多种终端访问方式。

### 1.2 电商后台管理系统的功能

- 电商后台管理系统用于管理用户账号、商品分类、商品信息、订单、数据统计等业务功能。

![mall_desc01](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_desc01.png)

### 1.3 电商后台管理系统的开发模式（前后端分离）

- 电商后台管理系统整体采用前后端分离的开发模式，其中前端项目是基于 Vue 技术栈的 SPA 项目。

![mall_DevMode](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_DevMode.png)

### 1.4 电商后台管理系统的技术选型

#### 1. 前端项目技术栈

+ Vue
+ Vue-router
+ Element-UI
+ Axios
+ Echarts

#### 2. 后端项目技术栈

+ Node.js
+ Express
+ Jwt
+ Mysql
+ Sequelize

## 2、项目初始化

### 2.1 前端项目初始化步骤

1. 安装 Vue 脚手架
2. 通过 Vue-Cli 创建项目
3. 配置 Vue-router
4. 配置 Element-UI 组件库
5. 配置 Axios 库
6. 初始化 git 远程仓库

### 2.2 后台项目的环境安装配置
1. 安装MySQL数据库
2. 安装Node.js环境
3. 配置项目相关信息
4. 启动项目
    1. 使用phpstudy导入数据库并运行
    2. npm init 后端项目
    3. node ./app.js
5. 使用Postman测试后台项目接口是否正常

### 2.3 项目所需插件和依赖

#### 插件

![mall_plugin](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_plugin.png)

### 依赖

#### 运行依赖

![mall_depend1](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_depend1.png)

#### 开发依赖

![mall_depend2](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_depend2.png)

![mall_depend3](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_depend3.png)

## 3、登录/退出功能

### 3.1 登录概述

#### 1. 登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后，根据后台的响应状态跳转到项目主页

#### 2. 登录业务的相关技术点

+ http 是无状态的
+ 通过 cookie 在客户端记录状态
+ 通过 session 在服务器端记录状态
+ 通过 token 方式维持状态

### 3.2 登录 — token 原理分析

![mall_token](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_token.png)

### 3.3 登录功能实现

#### 1. 登录页面的布局

**通过 Element-UI 组件实现布局**

+ el-form
+ el-form-item
+ el-input
+ el-button
+ 字体图标

#### 2. 实现登录

- ① 通过 axios 调用登录验证接口
- ② 登录成功之后保持用户 token 信息
- ③ 跳转到项目主页

```
  const {data: res } = await this.$http.post('login', this.loginForm)
  if (res.meta.status !== 200)return this.$message.error('登录失败！')
  // 提示登录成功
  this.$message.success('登录成功！')
  // 把登录成功的token保存到sessionStorage
  window.sessionStorage.setItem('token', res.data.token)
  // 使用编程式导航，跳转到后台主页
  this.$router.push('/home')
```
#### 3. 路由导航守卫控制访问权限

```
  // 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数表‘放行’，next('/'):强制跳转路径
  const tokenStr = sessionStorage.getItem('token')
  const path = to.path
  if (path === '/login') {
    next()
    return
  }
  if (tokenStr) {
    if (path === '/') {
      next({
        path: './login'
      })
    } else {
      next()
    }
  } else {
    next({
      path: '/login'
    })
  }
})
```
#### 4. Vue 直接操作 DOM

**通过 ref 标注 DOM 元素**
```
  // 在 DOM 元素上通过 ref 属性标注，属性名称自定义
  <div ref="info">hello</div>
```
**通过 $refs 获取 DOM 元素**

```
  // 通过 Vue 实例的 $refs 获取标记 ref 属性的元素
  let info = this.$refs.info.innerHTML
  console.log(info) // hello
```
#### 5. 基于 Element-UI 进行表单验证

**Element-UI表单验证规则**

```
  loginFormRules: {
    // 登录名称的验证规则
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
  }
```

```
  // 进行表单提交预验证
  this.$refs.loginFormRef.validate(async valid => {
    // 如果验证失败，直接退出后续代码的执行
    if (!valid) return
  // 验证通过后这里完成登录成功后的相关操作（保存token、跳转到主页）
  })
```
### 3.4 退出

#### 退出功能实现原理

- 基于 token 的方式实现退出比较简单，只需要销毁本地的 token 即可。这样，后续的请求就不会携带token ，必须重新登录生成一个新的 token 之后才可以访问页面。

```
  // 清空token
  window.sessionStorage.clear()
  // 跳转到登录页
  this.$router.push('/login')
```

## 4、主页布局

### 4.1 整体布局

- 整体布局：先上下划分，再左右划分。

```
  <el-container>
    <!-- 头部区域 -->
    <el-header></el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside></el-aside>
      <!-- 右侧主体区域 -->
      <el-main></el-main>
    </el-container>
  </el-container>
```

### 4.2 左侧菜单布局

- 菜单分为二级，并且可以折叠。

```
  <el-menu>
    <el-submenu>
      <!-- 这个 template 是一级菜单的内容模板 -->
      <i class="el-icon-menu"></i>
      <span>一级菜单</span>
      <!-- 在一级菜单中，可以嵌套二级菜单 -->
      <el-menu-item>
        <i class="el-icon-menu"></i>
        <span slot="title">二级菜单</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
```

### 4.3 通过接口获取菜单数据

- 通过axios请求拦截器添加token，保证拥有获取数据的权限

```
  // axios请求拦截
  axios.interceptors.request.use(config => {
    // 为请求头对象，添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
```

### 4.4 动态渲染菜单数据并进行路由控制

+ 通过 v-for 双层循环分别进行一级菜单和二级菜单的渲染
+ 通过路由相关属性启用菜单的路由功能

```
  <el-menu router>
    <el-submenu :index="item.id + ''" v-for=“item in menus" :key="item.id">
      <template slot="title">
        <span>{{item.authName}}</span>
      </template>
      <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
      :key="subItem.id" >
        <span slot="title">{{subItem.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
```

## 5、用户管理模块

### 5.1 用户管理概述

- 通过后台管理用户的账号信息，具体包括用户信息的展示、添加、修改、删除、角色分配、账号启用/注销等功能。

+ 用户信息列表展示
+ 添加用户
+ 修改用户
+ 删除用户
+ 启用或禁用用户
+ 用户角色分配

### 5.2 用户管理-列表展示

#### 1. 用户列表布局

![mall_user](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_user.png)

+ 面包屑导航 el-breadcrumb
+ Element-UI 栅格系统基本使用 el-row
+ 表格布局 el-table、el-pagination

#### 2. 用户状态列和操作列处理

+ 作用域插槽
+ 接口调用

```
  <template slot-scope="scope">
    <!-- 开关 -->
    <el-switch v-model="scope.row.mg_state" 
    @change="stateChanged(scope.row.id, scope.row.mg_state)">
    </el-switch>
 </template>
```

#### 3. 表格数据填充

+ 调用后台接口
+ 表格数据初填充

```
  const { data: res } = await this.$http.get('users', { params: this.queryInfo })
  if (res.meta.status !== 200) {
    return this.$message.error('查询用户列表失败！')
  }
  this.total = res.data.total
  this.userlist = res.data.users
```

#### 4. 表格数据分页

- 分页组件用法：
1. 当前页码：pagenum
2. 每页条数：pagesize
3. 记录总数：total
4. 页码变化事件
5. 每页条数变化事件
6. 分页条菜单控制

```
  <el-pagination 
  @size-change="handleSizeChange" 
  @current-change="handleCurrentChange" 
  :current-page="queryInfo.pagenum" 
  :page-sizes="[2, 3, 5, 10]" 
  :page-size="queryInfo.pagesize" 
  layout="total, sizes, prev, pager, next :total="total"> </el-pagination>
```

#### 5. 搜索功能

- 将搜索关键字，作为参数添加到列表查询的参数中。

```
  <el-input 
  placeholder="请输入搜索的内容" 
  v-model="queryInfo.query" 
  clearable 
  @clear="getUserList">
    <el-button slot="append" 
    icon="el-icon-search" 
    @click="getUserList"></el-button>
 </el-input>
```

### 5.3 用户管理-用户状态控制

- 1、开关组件的用法
- 2、接口调用更改用户的状态

```
  <el-switch 
  v-model="scope.row.mg_state" 
  @change="stateChanged(scope.row.id, scope.row.mg_state)">
  </el-switch>
```

```
  async stateChanged(id, newState) {
    const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
    if (res.meta.status !== 200) {
      return this.$message.error('修改状态失败！')
    }
  }
```

### 5.4 用户管理-添加用户

#### 1. 添加用户表单弹窗布局

- 弹窗组件用法
- 控制弹窗显示和隐藏

```
  <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
    <el-form :model="addForm" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
    <!-- 更多表单项 -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetAddForm">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
```

#### 2. 表单验证

- 内置表单验证规则

```
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" >
  <!-- 表单 -->
  </el-form>
```

```
  addFormRules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }
```

```
  this.$refs.addFormRef.validate(async valid => {
    if (!valid) return
  })
```

#### 3. 表单提交

- 将用户信息作为参数，调用后台接口添加用户

```
  this.$refs.addFormRef.validate(async valid => {
    if (!valid) return
    const { data: res } = await this.$http.post('users', this.addForm)
    if (res.meta.status !== 201) {
      return this.$message.error('添加用户失败！')
    }
    this.$message.success('添加用户成功！')
    this.addDialogVisible = false
    this.getUserList()
  })
```

### 5.5 用户管理-编辑用户

#### 1. 根据 ID 查询用户信息

```
  <el-button type="primary" size="mini" icon="el-icon-edit" 
  @click="showEditDialog(scope.row.id)"></el-button>
```

```
  async showEditDialog(id) {
    const { data: res } = await this.$http.get('users/' + id)
    if (res.meta.status !== 200) {
      return this.$message.error('查询用户信息失败！')
    }
    // 把获取到的用户信息对象，保存到 编辑表单数据对象中
    this.editForm = res.data
    this.editDialogVisible = true
  }
```

#### 2. 编辑提交表单

```
  this.$refs.editFormRef.validate(async valid => {
    if (!valid) return
    // 发起修改的请求
    const { data: res } = await this.$http.put('users/' + this.editForm.id, {
      email: this.editForm.email,
      mobile: this.editForm.mobile
    })
    if (res.meta.status !== 200) {
      return this.$message.error('编辑用户信息失败！')
    }
    this.$message.success('编辑用户信息成功！')
    this.getUserList()
    this.editDialogVisible = false
  })
```

### 5.6 用户管理-删除用户

```
  <el-button type="danger" size="mini" icon="el-icon-delete" 
  @click="remove(scope.row.id)"></el-button>
```

```
  async remove(id) {
    // 询问是否要删除
    const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)
    const { data: res } = await this.$http.delete('users/' + id)
    if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
    this.$message.success('删除用户成功！')
    this.getUserList()
 }
```

## 6、权限管理模块

### 6.1 角色列表

![mall_roles](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_roles.png)

## 7、数据统计模块

### 7.1 数据统计概述

- 数据统计模块主要用于统计电商平台运营过程的中的各种统计数据，并通过直观的可视化方式展示出来，方便相关运营和管理人员查看。

![mall_reports](https://github.com/chao-gu/vue_shop/blob/master/src/assets/mall_reports.png)

### 7.2 用户来源数据统计报表

#### 1. Echarts 第三方可视化库的基本使用

```
  // 安装echarts库
  npm install echarts -S
```

```
  // 导入echarts接口
  import echarts from 'echarts
```

#### 2. 实现用户来源数据统计报表

- 调用接口获取后台接口数据
- 通过echarts的api实现报表效果

```
   // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(this.$refs.main)
  const { data: res } = await this.$http.get('reports/type/1')
  if (res.meta.status !== 200) return this.$message.error('初始化折线图失败！')
  const data = _.merge(res.data, this.options)
  // 绘制图表
  myChart.setOption(data)
```

## 8、项目优化策略

### 1. 生成打包报告
- 通过命令行参数形式生成报告=>vue-cli-service build --report
- 通过可视化ui面板直接查看报告(通过控制台和分析面板)
### 2. 通过vue.config.js修改webpack的默认配置
- 通过vue-cli 3.0工具生成的项目,默认隐藏了所有webpack的配置项,目的是为了屏蔽项目的配置过程,让开发人员把工作的 重心,放在具体功能和业务逻辑的实现上
### 3. 为开发模式与发布模式指定不同的打包入口
- 默认情况下,vue项目的开发与发布模式,共用同一个打包的入口文件(即src/main.js),为了将项目的开发过程与发布过程分离,可以为两种模式,各自指定打包的入口文件,即:
- 1、开发模式入口文件 src/main-dev.js/ 
- 2、发布模式入口文件 src/main-prod.js
- 方案：configureWebpack(通过链式编程形式)和chainWebpack(通过操作对象形式)
- 在vue.config.js导出的配置文件中,新增configureWebpack或chainWebpack节点,来自定义webpack的打包配置

```
  // 代码示例
  module.exports = {
    chainWebpack: config => {
      // 发布模式
      config.when(process.env.NODE_ENV === 'production', config => {
        config.entry('app').clear().add('./src/main-prod.js')
      })
      // 开发模式
      config.when(process.env.NODE_ENV === 'development', config => {
        config.entry('app').clear().add('./src/main-dev.js')
      })
    }
  }
```

### 4. 第三方库启用CDN

#### 1. 通过externals加载外部cdn资源
- 通过externals加载外部cdn资源
- 默认情况下,通过import语法导入的第三方依赖包,最终会打包合并到同一个文件中,从而导致打包成功后,单文件体积过大的问题 => chunk-vendors体积过大
- 为了解决上述问题,可以通过webpack的externals节点,来配置加载外部的cdn资源,凡是声明在externals中的第三方依赖包,都不会被打包
1.  步骤1

```
module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      // 在vue.config.js如下配置
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nporgress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
```
2. 步骤2
- 在public/index.html文件头部,将main-prod中的已经进行配置的import(样式表)删除替换为cdn引入

```
  <link href="https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.css" rel="stylesheet">
  <link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.bubble.min.css" rel="stylesheet">
  ​<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.core.min.css" rel="stylesheet">
  <link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.snow.min.css" rel="stylesheet">
  <link href="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css" rel="stylesheet">
  <link href="https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css" rel="stylesheet">
``` 

3. 步骤3
- 在public/index.html文件头部,将main-prod中的已经进行配置的import(js文件)删除替换为cdn引入

```
  <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
  <script src="https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js"></script>
  <script src="https://cdn.bootcss.com/axios/0.19.0/axios.min.js"></script>
  <script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js"></script>
  <script src="https://cdn.bootcss.com/echarts/4.4.0-rc.1/echarts.min.js"></script>
  <script src="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js"></script>
  <script src="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>
  <script src="https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.js"></script>
  <script src="https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js"></script>
```

4. cdn加速前后对比( chunk-vendors打包文件)

#### 2. 使用cdn优化elementui打包

- 具体操作流程

1. 在main-prod.js中,注释掉element-ui按需加载的代码
2. 在index.html头部区域中,通过cdn加载element-ui的js和css样式

`<link href="https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css" rel="stylesheet">`
`<script src="https://cdn.bootcss.com/element-ui/2.12.0/index.js"></script>`

#### 3. 首页内容定制

- 不同打包环境下,首页内容可能会有所不同,通过插件方式定制

- vue.config.js配置
```
  config.plugin('html').tap(args => {
    args[0].isProd = true或false
    return args
})
```

- index.html修改
```
  <!-- 开发模式:使用import,发布模式:使用cdn -->
  <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev-' %>vue-mall</title>
  <% if(htmlWebpackPlugin.options.isProd) { %>
    css | js放在这儿
  <% } %>
```

#### 4. Element-UI组件按需加载

#### 5. 路由懒加载

- 在打包构建项目时,javascript包会变得特别大,影响页面加载,如果我们能把不同路由对应的组件分隔成不同的代码块,然后当路由被访问的时候才加载对应组件,这样更加高效

+ 安装@babel/plugin-syntax-dynamic-import包
+ 在babel.config.js配置文件声明该插件
+ 将路由改为按需加载形式

```
  // 示例:
  const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
  const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
  const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')

  // import Login from '../components/Login.vue'
  const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
  // import Home from '../components/Home.vue'
  const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
  // import Welcome from '../components/Welcome.vue'
  const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
  ...
```


