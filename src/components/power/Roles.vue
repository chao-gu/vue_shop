<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="setAddRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色信息列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdBottom', i1 === 0 ? 'bdTop' : '', 'vccenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdTop', 'vccenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row.children}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeEditRolesById(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件展示权限信息 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys" ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesFormClose"
    >
      <el-form :model="addRolesForm" :rules="setRolesRules" ref="setRolesRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesDialog" width="50%" @close="aditRolesClose">
      <el-form
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="editRolesRef"
        label-width="80px"
      >
        <el-form-item label="角色 ID">
          <el-input v-model="editRolesForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRolesDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 分配权限对话框打开or关闭
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件嵌套结构的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 属性控件权限已选的权限Id
      defKeys: [],
      // 当前添加角色权限的id
      roleId: '',
      // 添加角色对话框的显示or关闭
      addRolesDialogVisible: false,
      // 添加角色对话框数据对象
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色对话框验证规则对象
      setRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框的显示or关闭
      editRolesDialog: false,
      // 编辑表单数据对象
      editRolesForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 编辑表单验证规则对象
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 删除角色列表三级权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除权限')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    // 分配权限对话框
    async setRightDialog(role) {
      // 在data中间记录当前操作角色的id
      this.roleId = role.id
      this.setRightDialogVisible = true
      // 获取分配权限的权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取管理权限失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      console.log(res.data)
    },
    // 通过递归遍历权限对象，拿到所有的三级节点的Id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = []
    },
    // 点击提交分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色权限失败')
      }
      this.setRightDialogVisible = false
      this.getRolesList()
      this.$message.success('修改角色权限成功')
    },
    // 添加角色点击事件监听
    setAddRoles() {
      this.addRolesDialogVisible = true
    },
    // 监听添加角色对话框的关闭
    addRolesFormClose() {
      this.$refs.setRolesRef.resetFields()
    },
    // 监听添加角色对话框提交
    addRoles() {
      this.$refs.setRolesRef.validate(async vaild => {
        if (!vaild) {
          return false
        }
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色对话框编辑按钮点击事件
    async editRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editRolesForm = res.data
      this.editRolesDialog = true
    },
    // 监听编辑角色对话框的关闭
    aditRolesClose() {
      this.$refs.editRolesRef.resetFields()
    },
    // 监听编辑角色对话框提交
    editRolesDialogConfirm() {
      this.$refs.editRolesRef.validate(async vaild => {
        if (!vaild) return false
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        })
        console.log(res.meta.status)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败！')
        }
        this.editRolesDialog = false
        this.getRolesList()
        this.$message.success('编辑角色信息成功！')
      })
    },
    // 通过Id删除角色权限信息
    async removeEditRolesById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.bdTop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.vccenter {
  display: flex;
  align-items: center;
}
</style>
