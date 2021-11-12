import $axios from "./request";

// 启用/禁用活动
export function datalist(body) {
  return $axios.post("/hr/participant/activity/test/page", {
    pageNo: 1,
    pageSize: 10,
    ...body,
  });
}

// 批量下载报告
export function downLoadReport(id) {
  return $axios.get(`/hr/report/pdf/batch_ids/download?ids=${id}`,{responseType: "blob"});
}

// 批量导出用户信息
export function downLoadManage(params) {
  return $axios.get("/hr/participant/download", {
    ...params,
  });
}
// 详情
export function getDetail(params){
  return $axios.get('/hr/participant/get',{
    ...params
  })
}
// 保存用户详情信息
export function save(params){
  return $axios.post('/hr/participant/update',{
    ...params
  })
}

export function sendReport(params){
  return $axios.post('/hr/activity/report/send',{
    ...params
  })
}
// datalist

const subject = {
  datalist,
  downLoadReport,
  downLoadManage,
  getDetail,
  save,
  sendReport
};

export default subject;
