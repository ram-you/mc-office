<template>
  <div :class="url2pdf?'':'view pb-4'" style="text-align: -webkit-auto;">

    <v-card v-if="!url2pdf" flat class="elevation-1 py-3 px-4  ma-0">
      <div class="toolbar__content">

        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item to="/invoices">
            <span class="subheading">Liste des Factures </span>
          </v-breadcrumbs-item>
          <v-breadcrumbs-item disabled>
            <span class="pr-1 subheading">Facture: </span>
            <span class="subheading font-weight-medium"> {{invoice.number}}</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>

        <div class="mx-1">
          <v-btn round color="blue" dark @click="toPDF()">
            <v-icon :right="$vuetify.rtl" :left="!$vuetify.rtl" dark>mdi-file-pdf</v-icon> To PDF</v-btn>
          <v-btn :disabled="systemPrinters.length==0" round color="green" dark @click="toPrinter()">
            <v-icon :right="$vuetify.rtl" :left="!$vuetify.rtl" dark>mdi-printer</v-icon>Imprimer</v-btn>
        </div>
      </div>
    </v-card>
 
    <div>
      <invoice-detail :id="invoiceID" :number="invoiceNumber"></invoice-detail>
    </div>

  </div>
</template>
<script>
import map from "lodash/map";
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')
const { shell, ipcRenderer, ipcMain } = require('electron')
const remote = require("electron").remote

import InvoiceDetail from "./detail.vue"
import { setTimeout } from 'timers';

export default {
  components: { InvoiceDetail },
  data() {
    return { 
      url2pdf: false,
      theme: 'default',
      invoice: {},
      invoiceID: this.$route.params.id,
      invoiceNumber: this.$route.query.number,
      systemPrinters: [],
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },
  },
  watch: {
    '$route': function () {
      this.invoiceID = this.$route.params.id;
      this.invoiceNumber = this.$route.query.number;
      this.invoice.id = this.invoiceID;
      this.invoice.number = this.invoiceNumber;
    },

  },
  mounted() {
    var vm = this
    this.invoice = {
      id: this.invoiceID,
      number: this.invoiceNumber,
      date: "2018.07.20",
      due: "2018.07.21",
    }
    var connectedUserName = this.connectedUserName;
    var userTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = userTheme

    ipcRenderer.on("wrote-pdf", (event, data) => {
      console.log("Done", data)

    
 

    });
    this.systemPrinters = this.getSystemPrinters()
    
  },
  methods: {
    getSystemPrinters(event) {
      const win = remote.getCurrentWindow()
      return map(win.webContents.getPrinters().slice(0), (p) => {
        var p2 = Object.assign({}, p);
        delete p2.options
        return p2
      });
    },

    getSystemDefaultPrinter(event) {
      const printers = this.getSystemPrinters()
      return Object.assign({}, printers.find(obj => { return obj.isDefault }));
    },

    getUserDefaultPrinter() {
      var connectedUserName = this.connectedUserName
      var defaultPrinter = _store.get('users.' + connectedUserName + '.settings.defaults.printer') || _store.get('global.settings.defaults.printer')
      return defaultPrinter || this.getSystemDefaultPrinter()
    },

    toPDF() {
      var content = document.getElementById("billing-container").parentNode.innerHTML
      ipcRenderer.send("printPDF", this.invoice.number, content, this.theme);

    },
    toPrinter() {
      var content = document.getElementById("billing-container").parentNode.innerHTML;
      var printer = this.getUserDefaultPrinter() || { name: '' }
      ipcRenderer.send("print", this.invoice.number, content, this.theme, printer.name);
    },


  },
}
</script>
<style >
@font-face {
  font-family: "SourceSansPro";
  src: url("../../common/assets/billing/theme/default/SourceSansPro-Regular.ttf");
}
/* @import "../common/assets/billing/index.css"; */

 
</style>

