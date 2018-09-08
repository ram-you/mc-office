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

        <v-layout row wrap id="invoice-header" style="overflow-x: auto;">
          <v-flex xs12>
            <v-card class="ma-2 my-4" flat>
              <invoice-header/>
            </v-card>
          </v-flex>
        </v-layout>

<v-divider></v-divider>
        <!-- ~~~~~~~~~~ -->

        <v-layout row wrap id="invoice-items" style="overflow-x: auto;">
          <v-flex xs12>
            <v-card class="ma-2 my-4" flat>
              <invoice-items/>
            </v-card>
          </v-flex>
        </v-layout>

<v-divider></v-divider>
                <!-- ~~~~~~~~~~ -->

        <v-layout row wrap id="invoice-footer" style="overflow-x: auto;">
          <v-flex xs12>
            <v-card class="ma-2 my-4" flat>
              <invoice-footer/>
            </v-card>
          </v-flex>
        </v-layout>

      </v-card>
    </template>

    <template>

      <v-card flat class="ma-4 py-4" style="background: transparent;">
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue-grey" class="white--text" @click="onSaveDraftClick()">
            Sauvegarder le brouillon
            <v-icon right dark>mdi-content-save</v-icon>
          </v-btn>

          <v-btn color="green" class="white--text" @click="onMarkSentClick()">
            Marquer comme envoyé
            <v-icon right dark>mdi-content-save</v-icon>
          </v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

    </template>

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

import invoiceHeader from "./invoiceHeader"
import invoiceItems from "./invoiceItems"
import invoiceFooter from "./invoiceFooter"

export default {
  components: { invoiceHeader, invoiceItems,invoiceFooter },
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