<template>
  <div>

    <v-layout row wrap>
      <v-flex xs12 md4>
        <v-card class="ma-4 px-4 pb-5" flat>
          <template>

            <v-tabs slider-color="orange">

              <v-tab href="#tab-publicNotes"> Public Notes </v-tab>
              <v-tab href="#tab-privateNotes"> Private Notes </v-tab>
              <v-tab href="#tab-terms"> Terms </v-tab>
              <v-tab href="#tab-footer"> Footer </v-tab>

              <v-tabs-items>

                <v-tab-item id="tab-publicNotes">
                 <v-textarea   counter="255"       value=""></v-textarea>
                </v-tab-item>

                <v-tab-item id="tab-privateNotes">
                  <v-textarea   counter="255"   value=""></v-textarea>
                </v-tab-item>

                <v-tab-item id="tab-terms">
                 <v-textarea   counter="255"   value=""></v-textarea>
                </v-tab-item>

                <v-tab-item id="tab-footer">
                  <v-textarea   counter="255"   value=""></v-textarea>
                </v-tab-item>

              </v-tabs-items>

            </v-tabs>

          </template>
        </v-card>
      </v-flex>

      <v-flex xs12 md4>

      </v-flex>
      <v-flex xs12 md4>
        <template>
          <v-container fluid id="invoice-totals">

            <v-layout row>
              <v-flex xs4>
                <v-subheader> Sous-total</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line value="2855.00" suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Remise</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line value="2855.00" suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Payé à ce jour</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line value="2855.00" suffix="TND"></v-text-field>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row>
              <v-flex xs4>
                <v-subheader class="font-weight-bold ">Montant dû</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field solo flat readonly hide-details color="red" single-line value="2855.00" suffix="TND"></v-text-field>
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
  data() {
    return {
      active: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  methods: {
    next() {
      const active = parseInt(this.active)
      this.active = (active < 2 ? active + 1 : 0)
    }
  }
}
</script>

<style >
#invoice-totals input {
  text-align: right;
  margin: 0 8px;
}
</style>


            