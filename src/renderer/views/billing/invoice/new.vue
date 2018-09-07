<template>
  <div>
    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/invoices">
          <span class="subheading">Liste des Factures </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="subheading">Nouvelle Facture </span>
          <span class="subheading font-weight-medium"> </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon>
          <v-icon class="grey--text text--darken-2">mdi-redo</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon class="green--text text--lighten-1">mdi-check-all</v-icon>
        </v-btn>
      </div>

    </v-toolbar>

    <!-- ========================= -->

    <template>
      <v-card class="ma-4">
        <v-layout row wrap>
          <v-flex xs12 md4>

            <v-card class="ma-2">
              <v-card-text>
 
                <v-autocomplete v-model="modelClient" :search-input.sync="search" hint="Choisir un client" :items="items" :readonly="false"
                  label="Choisir un client" persistent-hint item-text="name" item-value="name">
                </v-autocomplete>
                   <v-btn  @click="clientDialog=true" color="primary" dark class="mb-2">New Item</v-btn>
              </v-card-text>
            </v-card>

          </v-flex>
          <v-flex xs12 md4>
            <v-card class="ma-2">
              <v-card-text>

                <v-menu ref="invoiceDate" :close-on-content-click="false" v-model="invoiceDate" :nudge-right="40" :return-value.sync="date1"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <v-text-field slot="activator" v-model="date1" label="Invoice Date" append-icon="mdi-calendar" readonly></v-text-field>
                  <v-date-picker v-model="date1" @input="$refs.invoiceDate.save(date1)"></v-date-picker>
                </v-menu>

                <v-menu ref="dueDate" :close-on-content-click="false" v-model="dueDate" :nudge-right="40" :return-value.sync="date2"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <v-text-field slot="activator" v-model="date2" label="Due Date" append-icon="mdi-calendar" readonly></v-text-field>
                  <v-date-picker v-model="date2" @input="$refs.dueDate.save(date2)"></v-date-picker>
                </v-menu>

                <v-flex xs12>
                  <v-text-field v-model="form.first" :rules="rules.name" color="purple darken-2" label="Partial/Deposit"
                    type="number" required></v-text-field>
                </v-flex>

              </v-card-text>

            </v-card>
          </v-flex>
          <v-flex xs12 md4>
            <v-card class="ma-2">
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="form.first" :rules="rules.name" color="purple darken-2" label="Invoice #" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="form.first" :rules="rules.name" color="purple darken-2" label="PO #" required></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field v-model="discountValue" label="Discount" type="number">
                      <v-fade-transition slot="append">
                        <v-icon v-if="discountType=='Percent'" class="mdi-18px" style="margin-top: 6px;">mdi-percent</v-icon>
                        <v-icon v-else class="mdi-18px" style="margin-top: 6px;">mdi-cash-100</v-icon>
                      </v-fade-transition>

                      <v-menu slot="append-outer" style="top: -6px" offset-y>
                        <v-btn slot="activator" flat small>
                          {{discountType}}
                          <v-icon right>mdi-chevron-down</v-icon>
                        </v-btn>

                        <v-list>
                          <v-list-tile v-for="(item, i) in selectDiscount" :key="i" @click="selectDiscountMethod(item)">
                            <v-list-tile-action style="min-width: 24px;">
                              <v-icon v-if="item=='Percent'" class="mdi-18px">mdi-percent</v-icon>
                              <v-icon v-else class="mdi-18px">mdi-cash-100</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>{{ item }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>

                      </v-menu>
                    </v-text-field>
                  </v-flex>

                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </template>
            <v-dialog v-model="clientDialog" max-width="500px">
           
              <v-card>
                <v-card-title>
                  <span class="headline">Nouveau client </span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 >
                        <v-text-field v-model="form.client.name" label="Client Name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6  >
                        <v-text-field v-model="form.client.contact.first_name" label="Fist Name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6  >
                        <v-text-field v-model="form.client.contact.last_name" label="Last Name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 >
                        <v-text-field v-model="form.client.contact.email" label="Email"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6  >
                        <v-text-field v-model="form.client.contact.phone" label="Phone"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="closeClientDialog">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="saveClientDialog">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
  </div>
</template>

<script>
var axios = require("axios");

var path = require('path');
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });

export default {
  components: {

  },
  data() {
    const defaultForm = Object.freeze({
      first: '',
      last: '',
      bio: '',
      favoriteDiscount: '',
      client:{contact:{}},
      age: null,
      terms: false
    })
    return {
      clientDialog:false,
      date1: null,
      date2: null,
      invoiceDate: false,
      dueDate: false,
      isLoading: false,
      items: [],
      modelClient: null,
      search: null,

      form: Object.assign({}, defaultForm),
      rules: {
        age: [
          val => val < 10 || `I don't believe you!`
        ],
        selectDiscount: [val => (val || '').length > 0 || 'This field is required'],
        name: [val => (val || '').length > 0 || 'This field is required']
      },
      discountType: 'Percent',
      discountValue: 0,
      selectDiscount: ['Percent', 'Amount'],
      snackbar: false,
      terms: false,
      defaultForm

    }
  },
  watch: {
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return

      this.isLoading = true

      // Lazily load input items
      axios.get('https://api.coinmarketcap.com/v2/listings/')
        .then(res => {
          this.items = res.data.data
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
        }) 
    }
  },

  beforeCreate(){  
  },
  created() {  
  },
  destroyed() { 
  },
  mounted() {

  
  },


  methods: {
    selectDiscountMethod(item) {
      this.discountType = item
    },
        closeClientDialog() {
      this.clientDialog = false
      
    },

    saveClientDialog() {
      // this.modelClient=this.form.client
      this.search=this.form.client.name
      console.log(this.form.client)
      this.closeClientDialog()
    },
  },
}
</script>