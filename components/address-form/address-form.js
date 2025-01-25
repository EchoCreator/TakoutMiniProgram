Component({
  properties: {
    formVisible: {
      type: Boolean,
      value: false
    },
    selectedAddress: {
      type: Object,
      value: {}
    }
  },

  methods: {
    close() {
      this.setData({
        formVisible: false
      })
    },
    formSubmit(e) {
      const value = e.detail.value
      if (value.detail === '' || value.consignee === '' || value.phoneNumber === '' || value.gender === '') {
        wx.showModal({
          title: '温馨提示',
          content: '必填项不能为空！',
          confirmText: "知道啦",
          showCancel: false
        })
      } else {
        if (this.data.selectedAddress.id !== undefined) {
          this.triggerEvent("editAddress", value)
        } else {
          console.log("hhh");
          this.triggerEvent("addAddress", value)
        }
      }
    },
  }
})