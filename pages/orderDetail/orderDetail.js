import baseUrl from "../../commen/commen"

let interval

Page({
  data: {
    order: {},
    orderDetail: [],
    remainingMinutes: 0,
    remainingSeconds: 0,
    fromPayPage: undefined
  },

  navigate() {
    clearInterval(interval)
    if (this.data.fromPayPage == 1) {
      wx.navigateBack({
        delta: 999
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  payOrder() {
    const orderId = this.data.order.id
    const status = 2 // 待接单
    const that = this
    wx.request({
      url: baseUrl + '/user/order/updateOrderStatus?orderId=' + orderId + "&status=" + status,
      method: "PUT",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          clearInterval(interval)
          wx.showToast({
            title: '支付成功！',
            icon: 'none',
            duration: 1500
          })
          that.getOrder(orderId)
        }
      }
    })
  },

  cancelOrder() {
    const orderId = this.data.order.id
    const status = 6 // 取消
    const that = this
    wx.request({
      url: baseUrl + '/user/order/updateOrderStatus?orderId=' + orderId + "&status=" + status,
      method: "PUT",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          clearInterval(interval)
          wx.showToast({
            title: '订单已取消！',
            icon: 'none',
            duration: 1500
          })
          that.getOrder(orderId)
        }
      }
    })
  },

  urgeOrder() {
    const orderId = this.data.order.id
    wx.request({
      url: baseUrl + '/user/order/urgeOrder?orderId=' + orderId,
      method: "PUT",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          wx.showToast({
            title: '催单成功！',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },


  computeRemainingTime(that) {
    let orderTime = new Date(that.data.order.orderTime);
    let currentTime = new Date()
    orderTime = Date.parse(orderTime) // 转换成毫秒数
    currentTime = Date.parse(currentTime)
    let orderLastTime = 15 * 60 * 1000
    let remainingTime = orderTime + orderLastTime - currentTime
    let minutes = Math.floor(remainingTime / (60 * 1000));
    let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000); //将剩余的毫秒数转化成秒数
    if (seconds < 0) {
      that.setData({
        remainingMinutes: 0,
        remainingSeconds: 0
      })
      wx.showModal({
        title: '温馨提示',
        content: '该订单已过支付时间！',
        showCancel: false,
        confirmText: "重新下单",
        complete: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      that.setData({
        remainingMinutes: minutes,
        remainingSeconds: seconds
      })
      interval = setInterval(() => {
        let remainingMinutes = that.data.remainingMinutes
        let remainingSeconds = that.data.remainingSeconds
        if (remainingSeconds - 1 >= 0) {
          remainingSeconds -= 1
          that.setData({
            remainingSeconds: remainingSeconds
          })
        } else {
          if (remainingMinutes - 1 >= 0) {
            remainingSeconds = 59
            remainingMinutes -= 1
            that.setData({
              remainingMinutes: remainingMinutes,
              remainingSeconds: remainingSeconds
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '该订单已过支付时间！',
              showCancel: false,
              confirmText: "重新下单",
              complete: (res) => {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
            clearInterval(interval)
          }
        }
      }, 1000)
    }
  },

  getOrder(orderId) {
    const that = this
    wx.request({
      url: baseUrl + '/user/order/getOrder?orderId=' + orderId,
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            order: res.data.data
          })
          if (that.data.order.status === 1) {
            that.computeRemainingTime(that)
          }
        }
      }
    })
  },

  getOrderDetail(orderId) {
    const that = this
    wx.request({
      url: baseUrl + '/user/order/getOrderDetail?orderId=' + orderId,
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            orderDetail: res.data.data
          })
        }
      }
    })
  },

  onLoad(options) {
    const orderId = options.orderId;
    const fromPayPage = options.fromPayPage
    this.setData({
      fromPayPage: fromPayPage
    })
    this.getOrder(orderId)
    this.getOrderDetail(orderId)
  },

  onShow() {

  }
})