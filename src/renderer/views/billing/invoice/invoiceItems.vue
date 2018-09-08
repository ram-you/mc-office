<template>
  <v-layout row wrap class="ma-2 pb-4 elevation-2" style="background: rgba(128, 128, 128, 0.14);">

    <v-layout style="overflow-x: auto; font-weight: 700; min-width: 1200px;">
      <div class="px-2 py-3" style="flex: 1 1 auto; width:15%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Item</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto; width:53%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Description</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto; width:10%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Unit Cost</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto;  width:10%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Quantity</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto;  width:12%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Line Total</div>
      </div>
      <v-icon class="px-2 transparent--text mdi-18px">mdi-minus-circle</v-icon>

    </v-layout>

    <v-layout v-for="item in items" :key='item.id' style="overflow-x: auto;min-width: 1200px;" class="my-2"
      @mouseover="item.overed=true" @mouseleave="item.overed=false">

      <v-text-field label="Item" solo hide-details flat class="px-2" style="width:15%;"></v-text-field>
      <v-text-field label="Description" solo hide-details flat class="px-2" style="width:53%;"></v-text-field>
      <v-text-field label="Unit Cost" solo hide-details flat class="px-2" style="width:10%;"></v-text-field>
      <v-text-field label="Quantity" solo hide-details flat class="px-2" style="width:10%;"></v-text-field>
      <v-text-field label="Line Total" solo hide-details flat class="px-2" style="width:12%;"></v-text-field>

      <v-icon @click="deleteLine(item.id)" :class="item.overed?'red--text':'transparent--text'" class="px-2 mdi-18px">mdi-minus-circle</v-icon>

    </v-layout>

    <v-layout row wrap style="width: 100%">
      <v-btn @click="addNewLine()"> new- {{items.length}}</v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  data() {

    return {
      items: [],
      emptyItem: {
        id: 0,
        item: '',
        description: '',
        unit_cost: 0,
        quantity: 1,
        line_total: 0,
        overed: false
      }

    }
  },
  beforeCreate() {

  },
  created() {
    this.addNewLine()
  },
  destroyed() {
  },
  mounted() {


  },
  methods: {
    addNewLine() {
      var newItem = Object.assign({}, this.emptyItem)
      newItem.id = this.items.length + 1
      this.items.push(newItem)
    },
    deleteLine(id) {
      var vm=this
      this.items = this.items.filter(function (obj) {
        return obj.id !== id;
      });
      setTimeout(() => {
       if (vm.items.length==0) vm.addNewLine() 
      }, 100);
    },
  }
}
</script>