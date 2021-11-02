const getters = {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    username: state => state.user.username,
    menus: state => state.asyncRouter.routes,
}

export default getters