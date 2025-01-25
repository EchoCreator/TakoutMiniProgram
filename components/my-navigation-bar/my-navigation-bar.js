Component({
  properties: {
    title: {
      type: String,
      value: ""
    },
    avatarUrl: {
      type: String,
      value: ""
    },
    username: {
      type: String,
      value: ""
    },
    showAvatar: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    navigate() {
      this.triggerEvent("navigate")
    }
  }
})