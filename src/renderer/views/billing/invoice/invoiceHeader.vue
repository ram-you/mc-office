<template>
  <div>
   
        <v-layout row wrap >
          <v-flex xs12 md4>

            <v-card class="ma-2">
              <v-card-text>

                <v-autocomplete v-model="modelClient" :search-input.sync="searchClient" hint="Choisir un client" :items="clientsItems"
                  :readonly="false" label="Choisir un client" persistent-hint item-text="name" item-value="name"
                  clearable @click="clientDialog=searchClient?clientDialog:true">
                </v-autocomplete>
                <v-btn v-if="!searchClient" @click="clientDialog=true" flat color="primary" dark class="mb-2">Create new client</v-btn>
                <v-btn v-else @click="clientDialog=true" flat color="primary" dark class="mb-2">Edit client</v-btn>
              </v-card-text>
            </v-card>

          </v-flex>
          <v-flex xs12 md4>
            <v-card class="ma-2">
              <v-card-text>

                <v-menu ref="invoiceDate" :close-on-content-click="false" v-model="invoiceDate" :nudge-right="40" :return-value.sync="form.invoice_date"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <v-text-field slot="activator" v-model="form.invoice_date" label="Invoice Date" append-icon="mdi-calendar"
                    readonly></v-text-field>
                  <v-date-picker v-model="form.invoice_date" @input="$refs.invoiceDate.save(form.invoice_date)" :first-day-of-week="1"
                    locale="fr-fr"></v-date-picker>
                </v-menu>

                <v-menu ref="dueDate" :close-on-content-click="false" v-model="dueDate" :nudge-right="40" :return-value.sync="form.due_date"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <v-text-field slot="activator" v-model="form.due_date" label="Due Date" append-icon="mdi-calendar" readonly></v-text-field>
                  <v-date-picker v-model="form.due_date" @input="$refs.dueDate.save(form.due_date)"></v-date-picker>
                </v-menu>

                <v-flex xs12>
                  <v-text-field v-model="form.partial" label="Partial/Deposit" type="number" required></v-text-field>
                </v-flex>

              </v-card-text>

            </v-card>
          </v-flex>
          <v-flex xs12 md4>
            <v-card class="ma-2">
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="form.invoice_number" :rules="rules.name" label="Invoice #" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="form.po_number" :rules="rules.name" label="PO #" required></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field v-model="form.discount" label="Discount" type="number">
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

      
      

 

    <v-dialog v-model="clientDialog" max-width="500px">

      <v-card>
        <v-card-title>
          <span class="headline">Nouveau client </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="form.client.name" label="Client Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="form.client.contact.first_name" label="Fist Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="form.client.contact.last_name" label="Last Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="form.client.contact.email" label="Email"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="form.client.contact.phone" label="Phone"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeClientDialog">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click.native="saveClientDialog">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
var axios = require("axios");

var format = require('date-fns/format')

var path = require('path');
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });

import invoiceItems from "./invoiceItems"

export default {
  components: {
    invoiceItems
  },
  data() {
    const defaultForm = Object.freeze({
      invoice_number: '',
      po_number: '',
      invoice_date: format(new Date(), 'YYYY-MM-DD'),
      due_date: format(new Date(), 'YYYY-MM-DD'),
      partial: 0,
      discount: 0,
      is_amount_discount: 0,
      last: '',
      bio: '',
      favoriteDiscount: '',

      client: { contact: {} },
      age: null,
      terms: false
    })
    return {
      clientDialog: false,



      invoiceDate: false,
      dueDate: false,
      isLoading: false,
      clientsItems: [],
      modelClient: null,
      searchClient: null,

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
    searchClient(val) {
      // Items have already been loaded
      if (this.clientsItems.length > 0) return

      this.isLoading = true

      // Lazily load input items
      axios.get('https://api.coinmarketcap.com/v2/listings/')
        .then(res => {
          this.clientsItems = res.data.data
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  beforeCreate() {
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
      this.form.is_amount_discount = (item == 'Percent') ? 0 : 1
    },
    closeClientDialog() {
      this.clientDialog = false

    },

    saveClientDialog() {
      var vm = this
      if (this.clientsItems.length == 0) this.clientsItems.push(this.form.client);
      setTimeout(() => {
        vm.searchClient = vm.form.client.name
      }, 100);

      this.closeClientDialog()
    },
    onSaveDraftClick() {

    },
    onMarkSentClick() {

    },
  },
}
</script>