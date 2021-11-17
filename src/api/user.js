import instance, { get, post } from "./request"

export const Login = (res) => {
  return instance({
    url: "/login",
    method: "POST",
    data: res,
  })
}

export const UserInfo = (res) => {
  return instance({
    url: "/getInfo",
    method: "POST",
    data: res,
  })
}

// hr管理员分页
export function fetchAdmin(params) {
  return get("/hr/user/page", {
    pageNo: 1,
    pageSize: 10,
    userType: 2,
    ...params
  });
}

// 启用/禁用
export function triggerSwitch(body) {
  return post("/hr/user/enable", {
    userType: 2,
    ...body
  });
}
