import baseUrl from "../../commen/commen"

Page({
  data: {
    orderList: []
  },
  navigate() {
    wx.navigateBack({
      delta: 1
    })
  },
  getOrderList() {
    const that = this
    wx.request({
      url: baseUrl + '/user/order/getOrderList',
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            orderList: res.data.data
          })
        }
      }
    })
  },
  showOrderDetail(e) {
    const orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + orderId,
    })
  },
  onShow() {
    this.getOrderList()
  }
})