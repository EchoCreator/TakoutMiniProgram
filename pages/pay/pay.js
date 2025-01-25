import baseUrl from "../../commen/commen"

let interval

Page({
  data: {
    submitOrder: {},
    remainingMinutes: 0,
    remainingSeconds: 0
  },
  navigate() {
    wx.showModal({
      title: '温馨提示',
      content: '你确定要取消支付吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.navigateBack({
            delta: 999
          })
          clearInterval(interval)
        }
      }
    })
  },

  payOrder() {
    const orderId = this.data.submitOrder.id
    const status = 2 // 待接单
    wx.request({
      url: baseUrl + '/user/order/updateOrderStatus?orderId=' + orderId + "&status=" + status,
      method: "PUT",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          clearInterval(interval)
          const fromPayPage = 1
          wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?orderId=' + orderId + "&fromPayPage=" + fromPayPage,
          })
          wx.showToast({
            title: '支付成功！',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

  onLoad(options) {
    this.setData({
      submitOrder: JSON.parse(options.submitOrder)
    })
  },

  onShow() {
    let orderTime = new Date(this.data.submitOrder.orderTime);
    let currentTime = new Date()
    orderTime = Date.parse(orderTime) // 转换成毫秒数
    currentTime = Date.parse(currentTime)
    let orderLastTime = 15 * 60 * 1000
    let remainingTime = orderTime + orderLastTime - currentTime
    let minutes = Math.floor(remainingTime / (60 * 1000));
    let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000); //将剩余的毫秒数转化成秒数
    if (seconds < 0) {
      this.setData({
        remainingMinutes: 0,
        remainingSeconds: 0
      })
      wx.showModal({
        title: '温馨提示',
        content: '您的订单已过支付时间！',
        showCancel: false,
        confirmText: "重新下单",
        complete: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 999
            })
          }
        }
      })
    } else {
      this.setData({
        remainingMinutes: minutes,
        remainingSeconds: seconds
      })
      interval = setInterval(() => {
        let remainingMinutes = this.data.remainingMinutes
        let remainingSeconds = this.data.remainingSeconds
        if (remainingSeconds - 1 >= 0) {
          remainingSeconds -= 1
          this.setData({
            remainingSeconds: remainingSeconds
          })
        } else {
          if (remainingMinutes - 1 >= 0) {
            remainingSeconds = 59
            remainingMinutes -= 1
            this.setData({
              remainingMinutes: remainingMinutes,
              remainingSeconds: remainingSeconds
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '您的订单已过支付时间！',
              showCancel: false,
              confirmText: "重新下单",
              complete: (res) => {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 999
                  })
                }
              }
            })
            clearInterval(interval)
          }
        }
      }, 1000)
    }
  }
})