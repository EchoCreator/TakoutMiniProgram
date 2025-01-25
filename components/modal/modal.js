import {
  stringToArray
} from "../../commen/utils"

Component({
  properties: {
    dish: {
      type: Object,
      value: {}
    },
    visible: {
      type: Boolean,
      value: null
    }
  },

  data: {
    activeFlavorIndex: [],
    activeBundleIndex: [],
    selectedFlavor: [],
    selectedBundle: [],
    selectedAvoidFlavor: []
  },

  methods: {
    close() {
      this.setData({
        visible: false
      })
    },
    chooseTag(e) {
      const tagsIndex = e.currentTarget.dataset.tagsindex
      const tagIndex = e.currentTarget.dataset.tagindex
      const tagValue = e.currentTarget.dataset.tagvalue
      const bundle = e.currentTarget.dataset.bundle
      if (bundle === 'true') {
        let activeBundleIndex = this.data.activeBundleIndex
        let selectedBundle = this.data.selectedBundle
        activeBundleIndex.splice(tagsIndex, 1, tagIndex)
        selectedBundle.splice(tagsIndex, 1, tagValue)
        this.setData({
          activeBundleIndex: activeBundleIndex,
          selectedBundle: selectedBundle
        })
      } else {
        const avoid = e.currentTarget.dataset.avoid
        const tagsValue = e.currentTarget.dataset.tagsvalue
        let activeFlavorIndex = this.data.activeFlavorIndex
        let selectedFlavor = this.data.selectedFlavor
        let selectedAvoidFlavor = this.data.selectedAvoidFlavor
        let avoidFlavorValue = ""
        if (avoid === 'true') {
          selectedAvoidFlavor.splice(tagIndex, 1, !selectedAvoidFlavor[tagIndex])
          for (let index in selectedAvoidFlavor) {
            if (selectedAvoidFlavor[index] === true) {
              avoidFlavorValue += tagsValue[index] + "、"
            }
          }
          avoidFlavorValue = avoidFlavorValue.replace(/^、+/, "").replace(/、+$/, "")
          selectedFlavor.splice(tagsIndex, 1, avoidFlavorValue)
          this.setData({
            selectedAvoidFlavor: selectedAvoidFlavor,
            selectedFlavor: selectedFlavor
          })
        } else {
          activeFlavorIndex.splice(tagsIndex, 1, tagIndex)
          selectedFlavor.splice(tagsIndex, 1, tagValue)
          this.setData({
            activeFlavorIndex: activeFlavorIndex,
            selectedFlavor: selectedFlavor
          })
        }
      }
    },
    addDish2Order() {
      const value = {
        dishId: this.data.dish.id,
        flavor: this.data.selectedFlavor.join('、'),
        bundle: this.data.selectedBundle.join('、')
      }
      this.triggerEvent("addDish2Order", value)
    }
  },

  observers: {
    "visible": function () {
      let activeFlavorIndex = []
      let activeBundleIndex = []
      let selectedFlavor = []
      let selectedBundle = []
      let selectedAvoidFlavor = []
      for (let index in this.properties.dish.flavorList) {
        if (this.properties.dish.flavorList[index].name === '忌口') {
          for (let j in this.properties.dish.flavorList[index].value) {
            selectedAvoidFlavor = selectedAvoidFlavor.concat(false)
          }
          selectedFlavor = selectedFlavor.concat("无忌口")
          activeFlavorIndex = activeFlavorIndex.concat(0)
        } else {
          activeFlavorIndex = activeFlavorIndex.concat(0)
          selectedFlavor = selectedFlavor.concat(this.properties.dish.flavorList[index].value[0])
        }
      }
      this.setData({
        activeFlavorIndex: activeFlavorIndex,
        selectedFlavor: selectedFlavor,
        selectedAvoidFlavor: selectedAvoidFlavor
      })
      for (let index in this.properties.dish.bundleDishList) {
        activeBundleIndex = activeBundleIndex.concat(0)
        selectedBundle = selectedBundle.concat(this.properties.dish.bundleDishList[index].value[0])
      }
      this.setData({
        activeBundleIndex: activeBundleIndex,
        selectedBundle: selectedBundle
      })
    }
  },

  ready() {

  }
})