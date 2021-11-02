import $axios from "./request";

// 启用/禁用活动
export function getUserDataList(body) {
  return $axios.post("/counselor/sub_user/page", {
    pageNo: 1,
    pageSize: 10,
    ...body,
  });
}

// 角色列表
function roleList(params) {
  return $axios.get("/admin/role/list", {
    ...params,
  });
}

export function saveAccount(body) {
  return $axios.post("/counselor/sub_user/save", {
    ...body,
  });
}

export function updateAccount(body) {
  return $axios.post("/counselor/sub_user/update", {
    ...body,
  });
}
// 获取单条账号信息
function getRoleData(params) {
  return $axios.get("/counselor/sub_user/get", {
    ...params,
  });
}
// 删除系统管理员
function delRoleData(body) {
  return $axios.post("/counselor/sub_user/del", {
    ...body,
  });
}
// 绑定公司
function bindCompanyList(params) {
  return $axios.get("/counselor/company/binding/page", {
    ...params,
  });
}
// 新增角色
function getRoleDataList(params) {
  return $axios.get("/admin/role/page", {
    ...params,
  });
}

// 交付/咨询师 启用禁用
function conselorEnable(body) {
  return $axios.post("/admin/counselor/enable", {
    ...body,
  });
}
// 新建角色
function addRole(body) {
  return $axios.post("/admin/role/save", {
    ...body,
  });
}
// 修改角色
function updateRole(body) {
  return $axios.post("/admin/role/update", {
    ...body,
  });
}
// 获取权限树的数据
function getTreeRole(params) {
  // /admin/menu/listByUserId
  return $axios.get("/admin/menu/listByUserId", {
    ...params,
  });
}
// 获取角色信息
function getRoleInfo(params) {
  return $axios.get("/admin/role/get", {
    ...params,
  });
}
// 更改角色状态
function getRoleEnable(body) {
  return $axios.post("/admin/role/enable", {
    ...body,
  });
}
// 重置密码
function resetPasswd(body) {
  return $axios.post("/counselor/sub_user/reset_password", {
    ...body,
  });
}
// 绑定的公司
function getBindCompanyList(params) {
  return $axios.get("/counselor/company/admin/page", {
    ...params,
  });
}

// 需要绑定的公司列表
function getAddBindCompanyList(params) {
  return $axios.get("/counselor/company/binding/new/page", {
    ...params,
  });
}
// 保存需要绑定的公司
function bindSaveCompany(body) {
  return $axios.post("/counselor/company/relation/save", {
    ...body,
  });
}
// 解绑公司
function rebindCompany(body){
  return $axios.post("/counselor/company/relation/del", {
    ...body,
  });
}

const userManage = {
  getUserDataList,
  roleList,
  saveAccount,
  updateAccount,
  getRoleData,
  delRoleData,
  bindCompanyList,
  getRoleDataList,
  conselorEnable,
  addRole,
  getTreeRole,
  updateRole,
  getRoleInfo,
  getRoleEnable,
  resetPasswd,
  getBindCompanyList,
  getAddBindCompanyList,
  bindSaveCompany,
  rebindCompany
};

export default userManage;
