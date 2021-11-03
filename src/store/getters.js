const getters = {
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  username: (state) => state.user.username,
  info: state => state.user.info,
  blacklistInNewReport: (state) => state.user.blacklistInNewReport,
  menus: (state) => state.asyncRouter.routes,
}

export default getters
