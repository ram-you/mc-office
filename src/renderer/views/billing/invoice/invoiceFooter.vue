<template>
  <div>

    <v-layout row wrap>
      <v-flex xs12 lg5>
        <v-card class="mx-2 py-5" flat>
          <template>

            <v-tabs slider-color="orange" grow class="elevation-1 pa-2 pb-4">

              <v-tab key="tab-publicNotes"> Public Notes </v-tab>
              <v-tab key="tab-privateNotes"> Private Notes </v-tab>
              <v-tab key="tab-terms"> Terms </v-tab>
              <v-tab key="tab-footer"> Footer </v-tab>

              <v-tabs-items>

                <v-tab-item key="tab-publicNotes">
                  <v-textarea counter="255" value=""></v-textarea>
                </v-tab-item>

                <v-tab-item key="tab-privateNotes">
                  <v-textarea counter="255" value=""></v-textarea>
                </v-tab-item>

                <v-tab-item key="tab-terms">
                  <v-textarea counter="255" value=""></v-textarea>
                </v-tab-item>

                <v-tab-item key="tab-footer">
                  <v-textarea counter="255" value=""></v-textarea>
                </v-tab-item>

              </v-tabs-items>

            </v-tabs>

          </template>
        </v-card>
      </v-flex>

      <!-- ==== -->
      <v-flex xs12 lg2> </v-flex>
      <!-- ==== -->

      <v-flex xs12 lg5>
        <template>
          <v-container fluid id="invoice-totals">

            <v-layout row>
              <v-flex xs4>
                <v-subheader> Sous-total (Subtotal)</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line :value="childData.totals.subtotal"
                  suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Remise (Discount)</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line :value="childData.totals.discount"
                  suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <!-- <v-layout row>
              <v-flex xs4>
                <v-subheader>Payé à ce jour (Paid to Date)</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line :value="childData.totals.paid_to_date"
                  suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider> -->
            <v-layout row>
              <v-flex xs4>
                <v-subheader class="font-weight-bold ">Montant dû (Balance Due)</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line :value="childData.totals.total"
                  suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider> 
          </v-container>
        </template>
      </v-flex>

    </v-layout>

  </div>

</template>


<script>
export default {
  props: {
    form: { type: Object, required: false, default: {} }
  },
  data() {
    return {
      childData: {},
      active: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  computed: {
    // childData() {return this.form}
  },
  watch: {

  },
  beforeCreate() {
  },
  created() {
  },
  destroyed() {
  },
  beforeMount() {
    this.childData = Object.assign({}, this.form)
  },
  mounted() {
    var vm = this;
    this.$root.$on("updateChilds", function (data) { vm.childData = Object.assign({}, data); });

  },
  methods: {

  }
}
</script>

<style >
#invoice-totals input {
  text-align: right;
  margin: 0 8px;
}
</style>


            