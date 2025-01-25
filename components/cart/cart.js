Component({
  properties: {
    totalPrice: {
      type: Number,
      value: 0
    },
    order: {
      type: Array,
      value: []
    }
  },
  data: {
    detailVisible: false
  },
  methods: {
    showDetail() {
      if (this.data.order.length > 0) {
        this.setData({
          detailVisible: true
        })
      }
    },
    close() {
      this.setData({
        detailVisible: false
      })
    },
    clearCart() {
      this.setData({
        detailVisible: false
      })
      this.triggerEvent("clearCart")
    },
    reduceOrderNum(e) {
      const id = e.currentTarget.dataset.id
      const num = e.currentTarget.dataset.num
      this.triggerEvent("reduceOrderNum", {
        id: id,
        num: num
      })
    },
    addOrderNum(e) {
      const id = e.currentTarget.dataset.id
      const num = e.currentTarget.dataset.num
      this.triggerEvent("addOrderNum", {
        id: id,
        num: num
      })
    },
    goToPay() {
      if (this.data.order.length > 0) {
        wx.navigateTo({
          url: '/pages/order/order'
        })
      }
    },
  }
})