Page({
  addressManage() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  showHistoryOrder(){
    wx.navigateTo({
      url: '/pages/historyOrder/historyOrder',
    })
  },
  navigate() {
    wx.navigateBack({
      delta: 1
    })
  },
})