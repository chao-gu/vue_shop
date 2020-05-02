<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效模板 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === 'false'"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" if-else style="color: red;"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="rank" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_pid === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_pid === 1">二级</el-tag>
          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt">
          <el-button type="primary" size="mini">
            <i class="el-icon-edit"></i>
            编辑
          </el-button>
          <el-button type="danger" size="mini">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="setCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
           clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNowCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表所有数据
      cateList: [],
      // 商品列表查询条件
      querInfo: {
        type: 3,
        // 当前显示的页码
        pagenum: 1,
        // 当前页显示的数据个数
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前定义为模板列
          type: 'template',
          // 当前模板列名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 当前定义为模板列
          type: 'template',
          // 当前模板列名称
          template: 'rank'
        },
        {
          label: '排序',
          // 当前定义为模板列
          type: 'template',
          // 当前模板列名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示or隐藏
      addCateDialogVisible: false,
      // 添加分类对话框所有数据
      addCateForm: {
        cat_name: '',
        // 父级分类等级
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类对话框表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分级列表数据
      parentCateList: [],
      // 触发级联选择选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // 取消严格的遵守父子节点不互相关联
        checkStrictly: true
      },
      // 触发级联选择器所选父级分类id
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求商品列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 的事件
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加添加分类按钮的点击事件
    addCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 监听添加分类对话框的关闭事件
    setCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = res.data
    },
    // 监听添加分类对话框表单级联选择器change事件
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 获取分类名称的所在分类等级和父级分类等级id
      if (this.selectedKeys.length > 0) {
        // 获取父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 获取当前新添加的分类所在等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 获取父级分类id
        this.addCateForm.cat_pid = 0
        // 获取当前新添加的分类所在等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类对话框提交
    addNowCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scope>
.treeTable {
  margin-top: 15px;
}
// .el-cascader-menu .el-cascader-menu__wrap {
//   height: 204px;
// }
.el-cascader {
  margin-top: 0 !important;
  width: 100% !important;
}
.el-cascader-menu{
  height: 300px;
}
</style>
