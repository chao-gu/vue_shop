<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="seekOrder" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="90px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="90px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="90px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="150px">
          <template slot-scope="scope">{{scope.row.create_time | dateFromat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRess"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProGressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addRessVisible" width="50%" @close="editRessClose">
      <el-form
        :model="editRessForm"
        :rules="editRessFormRules"
        ref="editRessFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editRessForm.address1"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editRessForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRessVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRessVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 订单列表数据
      orderList: [],
      // 请求参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      seekOrder: '',
      // 订单总数
      total: 0,
      // 控制修改地址对话框的隐藏和关闭
      addRessVisible: false,
      // 修改地址数据
      editRessForm: {
        address1: [],
        address2: ''
      },
      // 修改地址表单验证
      editRessFormRules: {
        address1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 城市信息
      cityData,
      // 控制物流进度对话框的显示或隐藏
      progressDialogVisible: false,
      // 获取物流地址信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听 每页显示信息个数的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页数的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址对话框
    editRess() {
      this.addRessVisible = true
    },
    // 监听修改地址对话框的关闭
    editRessClose() {
      this.$refs.editRessFormRef.resetFields()
    },
    // 点击查看物流进度
    async showProGressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data
      console.log(res.data)
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scope>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>
