import $axios from "./request";

export function getActivityTable(body) {
  return $axios.post("/hr/activity/page", {
    pageNo: 1,
    pageSize: 10,
    ...body
  });
}

// 历史活动
export function getOverdueActivity(body) {
  return $axios.post("/hr/activity/historical/page", {
    pageNo: 1,
    pageSize: 10,
    ...body
  })
}

// 正在进行活动
export function getCurrentActivity(body) {
  return $axios.post("/hr/activity/in/progress/page", {
    pageNo: 1,
    pageSize: 10,
    ...body
  })
}

// 改变是否公开的状态
export function triggerSwitchById(body) {
  return $axios.post("/hr/activity/public/flag/update", {
    ...body
  });
}

// 拿到所有的模型
export function fetchAllModels(params) {
  return $axios.get("/hr/user/tool/select", {
    ...params
  });
}

// 新建活动
export function newActivity(body) {
  return $axios.post("/hr/activity/add", {
    ...body
  });
}

// 根据ID查询详情
export function fetchDetailById(id) {
  return $axios.get(`/hr/activity/${id}/detail`);
}

// 启用/禁用活动
export function activitySwitch(body) {
  return $axios.post("/hr/activity/status/update", {
    ...body
  });
}

// 编辑活动
export function editActivity(body) {
  return $axios.post("/hr/activity/update", {
    ...body
  });
}

// 活动用户
export function fetchActivityUser(body) {
  return $axios.post("/hr/participant/activity/user/page", {
    pageNo: 1,
    pageSize: 10,
    ...body
  });
}

// 标星 用户
export function EditStar(params) {
  return $axios.post("/hr/participant/star/update", {
    ...params
  });
}

// 上传文件(excel) 导入用户
export function uploadExcel(params) {
  return $axios.post("/hr/participant/good/future/upload", {
    ...params
  });
}

// 批量下载pdf 返回压缩包
export function batchDownloadPdf(params) {
  return $axios.get("/hr/report/pdf/batch/download", {
    ...params
  });
}

// 受测者信息下载
export function batchDownloadInfo(params) {
  return $axios.get("/hr/participant/good/future/download", {
    ...params
  });
}

// excel报告导出
export function batchDownloadScoreExcel(params) {
  return $axios.get("/hr/report/export", {
    ...params
  });
}

// 活动维度
export function dimensionality(id) {
  return $axios.get(`/hr/activity/${id}/dimensionality`);
}

// tab2 分数管理
export function fetchScoreTable(body) {
  return $axios.post("/hr/participant/activity/user/score/page", {
    pageNo: 1,
    pageSize: 10,
    ...body
  })
}

// 管理员数组
export function fetchAllAdmin() {
  return $axios.get("/hr/user/list")
}
// 场景列表
export function fetchScene(){
  return $axios.get('/hr/activity/useCase/list')
}

export function fetchUserDetailInAct(params) {
  return $axios.get("/hr/participant/get", {
    ...params
  })
}
// 上传图片
export function uploadImage(params){
  return $axios.post('/admin/file/upload',{
    ...params
  })
}
// 新建活动选择模型列表 no params
export function fetchModelsInNewAct() {
  return $axios.get("/hr/industry/model/select")
}

// 根据 activityId & userId 拿到数据进行交叉对比
export function getCompareByUserId(body) {
  return $axios.post("/hr/participant/activity/user/score/compare", {
    ...body
  })
}

// activityId => Is activity binding model 
export function isBindingModal(activityId) {
  return $axios.get(`/hr/activity/${activityId}/have/model`)
}

export function sendSmsToTester(body) {
  return $axios.post('/hr/activity/sms/send', {
    ...body
  })
}

// 判定显示什么报告
export function verifyType(activityId) {
  return $axios.get(`/hr/activity/useCase?activityId=${activityId}`)
}
