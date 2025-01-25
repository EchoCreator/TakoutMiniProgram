import baseUrl from "../../commen/commen"

Page({
  data: {
    order: [],
    totalPrice: 0,
    addressList: [],
    orderAddress: {},
    packagingFee: 0,
    deliveryFee: 0,
    amount: 0,
    remarkModalVisible: false,
    tablewareModalVisible: false,
    payModalVisible: false,
    remark: null,
    remarkInputValue: "",
    tablewareStatus: "",
    needTableware: null,
    tablewareNum: 0,
    payMode: -1,
    choosePayMode: -1,
    deliveryStatus: 1
  },

  navigate() {
    wx.navigateBack({
      delta: 1
    })
  },

  getAddressList() {
    const that = this
    wx.request({
      url: baseUrl + "/user/address/getAddressList",
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            addressList: res.data.data,
            orderAddress: res.data.data[0]
          })
          const orderAddressId = wx.getStorageSync('orderAddressId')
          if (orderAddressId !== undefined && orderAddressId !== null) {
            for (let index in that.data.addressList) {
              if (orderAddressId === that.data.addressList[index].id) {
                that.setData({
                  orderAddress: that.data.addressList[index]
                })
                break
              }
            }
          }
        }
      }
    })
  },

  selectAddress() {
    wx.setStorageSync('orderAddressId', this.data.orderAddress.id)
    wx.navigateTo({
      url: '/pages/selectAddress/selectAddress'
    })
  },

  showModal(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'remark') {
      this.setData({
        remarkModalVisible: true
      })
    }
    if (type === 'tableware') {
      this.setData({
        tablewareModalVisible: true
      })
    }
    if (type === 'pay') {
      this.setData({
        payModalVisible: true
      })
    }
  },

  closeModal() {
    this.setData({
      remarkModalVisible: false,
      tablewareModalVisible: false,
      payModalVisible: false
    })
  },

  remarkBlur(e) {
    this.setData({
      remarkInputValue: e.detail.value
    })
  },

  confirmRemark() {
    this.setData({
      remark: this.data.remarkInputValue,
      remarkModalVisible: false
    })
  },

  chooseTablewareStatus(e) {
    const need = e.currentTarget.dataset.need
    if (need === 'false') {
      this.setData({
        needTableware: false
      })
    } else {
      this.setData({
        needTableware: true
      })
    }
  },

  chooseTablewareNum(e) {
    const num = e.currentTarget.dataset.num
    if (num === 'default') {
      this.setData({
        tablewareNum: 0
      })
    } else {
      if (this.data.tablewareNum === 0) {
        this.setData({
          tablewareNum: 1
        })
      }
    }
  },

  minusTablewareNum() {
    if (this.data.tablewareNum > 1) {
      const tablewareNum = this.data.tablewareNum - 1
      this.setData({
        tablewareNum: tablewareNum
      })
    }
  },

  addTablewareNum() {
    const tablewareNum = this.data.tablewareNum + 1
    this.setData({
      tablewareNum: tablewareNum
    })
  },

  confirmTablewareStatus() {
    if (this.data.needTableware) {
      if (this.data.tablewareNum === 0) {
        this.setData({
          tablewareStatus: "餐具由商家按餐量提供"
        })
      } else {
        this.setData({
          tablewareStatus: "需要" + this.data.tablewareNum + "套餐具"
        })
      }
    } else {
      this.setData({
        tablewareStatus: "不需要餐具"
      })
    }
    this.setData({
      tablewareModalVisible: false
    })
  },

  choosePayMode(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'weixin') {
      this.setData({
        choosePayMode: 1
      })
    } else {
      this.setData({
        choosePayMode: 2
      })
    }
  },

  confirmPayMode() {
    const choosePayMode = this.data.choosePayMode
    this.setData({
      payMode: choosePayMode,
      payModalVisible: false
    })
  },

  chooseDeliveryStatus(e) {
    const status = e.currentTarget.dataset.status
    if (status === '1') {
      this.setData({
        deliveryStatus: 1
      })
    } else {
      this.setData({
        deliveryStatus: 2
      })
    }
  },

  admitOrder() {
    if (this.data.tablewareStatus === '') {
      wx.showModal({
        title: '温馨提示',
        content: '请选择餐具数量！',
        showCancel: false,
        complete: (res) => {
          if (res.confirm) {
            return
          }
        }
      })
    } else if (this.data.payMode === -1) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择支付方式！',
        showCancel: false,
        complete: (res) => {
          if (res.confirm) {
            return
          }
        }
      })
    } else {
      const submitOrder = {
        addressBookId: this.data.orderAddress.id,
        payMode: this.data.payMode,
        remark: this.data.remark,
        tablewareStatus: this.data.tablewareStatus,
        packagingFee: this.data.packagingFee,
        deliveryFee: this.data.deliveryFee,
        amount: this.data.amount,
        deliveryStatus: this.data.deliveryStatus
      }
      wx.request({
        url: baseUrl + '/user/order/admitOrder',
        method: "POST",
        header: wx.getStorageSync('header'),
        data: submitOrder,
        success(res) {
          if (res.data.code === 0) {
            const orderData = JSON.stringify(res.data.data)
            wx.navigateTo({
              url: '/pages/pay/pay?submitOrder=' + orderData,
            })
          }
        }
      })

    }
  },

  getShoppingCart() {
    const that = this
    wx.request({
      url: baseUrl + '/user/shoppingCart/getShoppingCart',
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          let totalPrice = 0
          res.data.data.forEach(function (currentObject) {
            totalPrice += currentObject.amount || 0; // 如果 price 不存在，则默认为 0
          })
          const packagingFee = 2 * res.data.data.length
          const deliveryFee = 5
          that.setData({
            order: res.data.data,
            totalPrice: totalPrice,
            packagingFee: packagingFee,
            deliveryFee: deliveryFee,
            amount: totalPrice + packagingFee + deliveryFee
          })
        }
      }
    })
  },

  onShow() {
    this.getShoppingCart()
    this.getAddressList()
  },
})