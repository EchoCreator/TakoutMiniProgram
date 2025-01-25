import baseUrl from "../../commen/commen"

Page({
  data: {
    addressList: [],
    formVisible: false,
    selectedAddress: {}
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
            addressList: res.data.data
          })
        }
      }
    })
  },

  setDefault(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.request({
      url: baseUrl + "/user/address/setDefault?id=" + id,
      method: "PUT",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.getAddressList();
        }
      }
    })
  },

  showForm(e) {
    const address = e.currentTarget.dataset.address
    if (address != null && address != undefined) {
      this.setData({
        selectedAddress: address
      })
    } else {
      this.setData({
        selectedAddress: {}
      })
    }
    this.setData({
      formVisible: true
    })
  },

  addAddress(e) {
    const that = this
    wx.request({
      url: baseUrl + '/user/address/addAddress',
      method: "POST",
      header: wx.getStorageSync('header'),
      data: e.detail,
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            formVisible: false
          })
          wx.showToast({
            title: '添加地址成功！',
            icon: 'none',
            duration: 1500
          })
          that.getAddressList()
        }
      }
    })
  },

  editAddress(e) {
    const that = this
    let data = e.detail
    data.id = this.data.selectedAddress.id
    data.isDefault = this.data.selectedAddress.isDefault
    wx.request({
      url: baseUrl + '/user/address/updateAddress',
      method: "PUT",
      header: wx.getStorageSync('header'),
      data: data,
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            formVisible: false
          })
          wx.showToast({
            title: '修改地址成功！',
            icon: 'none',
            duration: 1500
          })
          that.getAddressList()
        }
      }
    })
  },

  deleteAddress(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '温馨提示',
      content: '你确定要删除该地址吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.request({
            url: baseUrl + '/user/address/deleteAddress?id=' + id,
            method: "DELETE",
            header: wx.getStorageSync('header'),
            success(res) {
              if (res.data.code === 0) {
                wx.showToast({
                  title: '删除地址成功！',
                  icon: 'none',
                  duration: 1500
                })
                that.getAddressList()
              }
            }
          })
        }
      }
    })
  },

  onLoad() {
    this.getAddressList();
  }
})