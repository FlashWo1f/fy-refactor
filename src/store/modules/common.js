const common = {
  state: {
    isSendModal: false,
    selectedArr: [],
    sendTitle: "",
  },
  mutations: {
    SET_SEND_MODAL: (state, flag) => {
      state.isSendModal = flag
    },
    SET_SEND_TITLE: (state, flag) => {
      state.sendTitle = flag
    },
    SET_SELECTED_ARR: (state, arr) => {
      state.selectedArr = arr
    },
  },
}

export default common
