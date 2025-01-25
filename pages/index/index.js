// index.js
import baseUrl from "../../commen/commen"

Page({
  data: {
    activeTab: 1,
    tabsBarPosition: 20,
    contentPosition: 0,
    category: [],
    activeMenuId: -1,
    activeMenuIndex: 0,
    dishes: [],
    selectedDish: {},
    selectedDishIndex: 0,
    shopStatus: 0,
    modalVisible: false,
    order: [],
    totalPrice: 0,
    ballY: 0,
    ballVisible: false
  },

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    })
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: 'getUserInfo',
      success: (res) => {
        this.setData({
          nickName: res.userInfo.nickName
        })
      }
    })
  },

  tabChange(e) {
    const id = e.currentTarget.dataset.tabid;
    this.setData({
      activeTab: id,
      tabsBarPosition: 20 + 85 * (id - 1),
      contentPosition: 100 * (id - 1)
    })
  },

  getCategory() {
    const that = this
    wx.request({
      url: baseUrl + "/user/category/getCategoryList",
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            category: res.data.data,
            activeMenuId: res.data.data[0].id
          })
          that.getDishes();
        }
      }
    })
  },

  getDishes() {
    const that = this
    wx.request({
      url: baseUrl + "/user/dishes/getDishes?category=" + that.data.activeMenuId,
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            dishes: res.data.data,
          })
        }
      }
    })
  },

  menuChange(e) {
    const id = e.currentTarget.dataset.menuid
    const index = e.currentTarget.dataset.menuindex;
    this.setData({
      activeMenuId: id,
      activeMenuIndex: index
    })
    this.getDishes()
  },

  getShopStatus() {
    const that = this;
    wx.request({
      url: baseUrl + "/user/shop/status",
      method: "GET",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            shopStatus: res.data.data,
          })
        }
      }
    })
  },

  getButtonTop() {
    this.createSelectorQuery().in(this).selectAll('.price-button').boundingClientRect(rect => {
      this.setData({
        ballY: rect[this.data.selectedDishIndex].top
      })
    }).exec();
  },

  orderDish(e) {
    const that = this;
    const choose = e.currentTarget.dataset.choose
    const selectedDish = e.currentTarget.dataset.dish
    const selectedDishIndex = e.currentTarget.dataset.dishindex
    this.setData({
      selectedDishIndex: selectedDishIndex,
      ballVisible: false
    })
    for (let index in selectedDish.flavorList) {
      selectedDish.flavorList[index].value = selectedDish.flavorList[index].value.replace(/^,+/, "").replace(/,+$/, "").split(",")
    }
    for (let index in selectedDish.bundleDishList) {
      selectedDish.bundleDishList[index].value = selectedDish.bundleDishList[index].value.replace(/^,+/, "").replace(/,+$/, "").split(",")
    }
    if (this.data.shopStatus !== 1) {
      wx.showModal({
        title: '温馨提示',
        content: '商家已打烊，现在无法点餐哦',
        confirmText: "知道了",
        showCancel: false,
      })
    } else {
      that.getButtonTop()
      if (choose === 'true') {
        that.setData({
          modalVisible: true,
          selectedDish: selectedDish
        })
      } else {
        const orderDish = {
          dishId: selectedDish.id,
        }
        that.addShoppingCart(orderDish)
        that.setData({
          ballVisible: true
        })
      }
    }
  },

  addDish2Order(e) {
    const value = e.detail
    this.addShoppingCart(value)
    this.setData({
      modalVisible: false,
      ballVisible: true
    })
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
          that.setData({
            order: res.data.data,
            totalPrice: totalPrice
          })
        }
      }
    })
  },

  addShoppingCart(shoppingCart) {
    const that = this
    wx.request({
      url: baseUrl + '/user/shoppingCart/addShoppingCart',
      method: "POST",
      header: wx.getStorageSync('header'),
      data: shoppingCart,
      success(res) {
        if (res.data.code === 0) {
          that.getShoppingCart()
        }
      }
    })
  },

  clearCart() {
    const that = this
    wx.request({
      url: baseUrl + '/user/shoppingCart/deleteAllOrder',
      method: "DELETE",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.setData({
            order: [],
            totalPrice: 0,
          })
        }
      }
    })
  },

  reduceOrderNum(e) {
    const id = e.detail.id
    const num = e.detail.num
    const that = this
    wx.request({
      url: baseUrl + '/user/shoppingCart/reduceOrderNum?id=' + id + "&num=" + num,
      method: "PUT",
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code === 0) {
          that.getShoppingCart()
        }
      }
    })
  },

  addOrderNum(e) {
    const id = e.detail.id
    const num = e.detail.num
    const that = this
    if (num === 3) {
      wx.showModal({
        title: '温馨提示',
        content: '每个菜品下单数量不能超过3个',
        confirmText: "知道啦",
        showCancel: false,
      })
    } else {
      wx.request({
        url: baseUrl + '/user/shoppingCart/addOrderNum?id=' + id,
        method: "PUT",
        header: wx.getStorageSync('header'),
        success(res) {
          if (res.data.code === 0) {
            that.getShoppingCart()
          }
        }
      })
    }
  },

  login() {
    const that = this
    wx.showModal({
      title: '温馨提示',
      content: '微信授权登录后才能点餐！',
      confirmText: "点击登录",
      showCancel: false,
      complete: (res) => {
        if (res.confirm) {
          wx.login({
            success(res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: baseUrl + '/user/user/login',
                  method: "POST",
                  header: {
                    'content-type': 'application/json'
                  },
                  data: {
                    code: res.code
                  },
                  success(res) {
                    if (res.data.code === 0) {
                      const header = {
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'authentication': res.data.data.token
                      };
                      wx.setStorageSync('header', header);
                      that.getCategory()
                      that.getShoppingCart()
                    }
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      }
    })
  },

  onShow(){
    this.getShoppingCart()
  },

  onLoad() {
    this.login()
    this.getShopStatus()
  },
})