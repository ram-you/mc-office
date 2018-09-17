<template>
  <div class="heightAuto">

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

    <v-card class="pa-4" style="zoom:85%">

      <v-layout row wrap id="invoice-header" style="overflow-x: auto;">
        <v-flex xs12>
          <v-card class="ma-2 my-4" flat>
            <invoice-header :form="form" @interface="handleFcAfterDataBack" />
          </v-card>
        </v-flex>
      </v-layout>
      <!-- ~~~~~~~~~~ -->

      <v-layout row wrap id="invoice-items" style="overflow-x: auto;">
        <v-flex xs12>
          <v-card class="ma-2 my-4" flat style="display: inline-table;">
            <invoice-items :form="form" @interface="handleFcAfterDataBack" />
          </v-card>
        </v-flex>
      </v-layout>

      <!-- ~~~~~~~~~~ -->

      <v-layout row wrap id="invoice-footer" style="overflow-x: auto;">
        <v-flex xs12>
          <v-card class="ma-2 my-4" flat>
            <invoice-footer :form="form" @interface="handleFcAfterDataBack" />
          </v-card>
        </v-flex>
      </v-layout>

    </v-card>

    <v-card flat class="ma-4 py-4" style="background: transparent;">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red" class="white--text" @click="onGenerateTenItemsClick(9)">
          Générer des exemples (9)
          <v-icon right dark>mdi-plus</v-icon>
        </v-btn>

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
    <!-- ========================================= -->
    <div class="hidden-div">
      <invoice-detail :invoiceData="form"></invoice-detail>
    </div>
    <v-card class="ma-4 pb-2">

      <v-toolbar flat dense style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
        <span class="subheading">Aperçu (Preview) </span>
        <v-spacer></v-spacer>
        <div class="mx-1">
          <v-btn icon :disabled="isRenderingPdf">
            <v-icon class="grey--text text--darken-2" @click="toPDF()">mdi-reload</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon class="grey--text text--darken-2" @click="toPrinter()">mdi-printer</v-icon>
          </v-btn>
        </div>

      </v-toolbar>
      <webview id="pdf-viewer" :src="pdfString" style="display:flex; width:100%; height:100vh" autosize></webview>

    </v-card>

    <v-dialog v-model="isRenderingPdf" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text> {{waitingMessage}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>  


const fs = require('fs');
const os = require('os');
const PDFWindow = require('electron-pdf-window');
const { PDFDocumentFactory, PDFDocumentWriter, drawText, drawLinesOfText, drawImage, drawRectangle, } = require('pdf-lib');

const Store = require('electron-store');
const _store = new Store();

var format = require('date-fns/format')

var path = require('path');
const { ipcRenderer } = require('electron')
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let sep = path.sep
// const userDataPath = app.getPath('userData') + sep;
// const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
// var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });
let ASSETS = remote.getGlobal('ASSETS_GLOBAL')



import invoiceHeader from "./invoiceHeader"
import invoiceItems from "./invoiceItems"
import invoiceFooter from "./invoiceFooter"

import InvoiceDetail from "./itemDetails"
import { setTimeout } from 'timers';

function Uint8ToBase64(u8Arr) {
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

export default {
  components: { invoiceHeader, invoiceItems, invoiceFooter, InvoiceDetail },
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
      invoice_items: [],
      totals: {},
      client: { contact: {} },
      age: null,
      terms: false
    })
    return {
      waitingMessage: 'Mise à jour de la Facture',
      showInvoiceData: false,
      clientDialog: false,
      pdfString: 'about:blank',
      isRenderingPdf: false,
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
      defaultForm,
      theme: 'default',
      webview: ""
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },


  },
  watch: {

  },

  beforeCreate() {
  },
  created() {
  },
  destroyed() {
  },
  mounted() {
    var vm = this
    var connectedUserName = this.connectedUserName;
    var userTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = userTheme;

    const invoiceFontBytes = fs.readFileSync(ASSETS + '/billing/theme/default/SourceSansPro-Regular.ttf');
    const PURPLE = [119 / 255, 41 / 255, 83 / 255];
    const ORANGE = [224 / 255, 90 / 255, 43 / 255];
    const GREY = [117 / 255, 117 / 255, 117 / 255];
    const INVOICE_FONT = 'InvoiceFont';

    function ready() {
      setTimeout(() => {
        vm.webview = document.querySelector('webview')
        vm.webview.webContents = vm.webview.getWebContents()
        PDFWindow.addSupport(vm.webview);
      }, 100);
      setTimeout(() => { vm.toPDF() }, 300);
    }

    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        ready()
      }
    }, 100);

    ipcRenderer.on("data-pdf", (event, pdfData) => {
      console.log(" PDF DATA regenerated.....");
      // vm.pdfString = 'data:application/pdf;base64, ' + (Uint8ToBase64(pdfData))

      const pdfDoc = PDFDocumentFactory.load(pdfData);

      const [invoiceFontRef] = pdfDoc.embedFont(invoiceFontBytes);
      const pages = pdfDoc.getPages();

      for (var i = 0; i < pages.length; i++) {
        const currentPage = pages[i].addFontDictionary(INVOICE_FONT, invoiceFontRef);
        const PAGE_WIDTH = (currentPage.get('MediaBox').array[2]).number;
        const PAGE_HEIGHT = (currentPage.get('MediaBox').array[3]).number;
        var contentStream1 = pdfDoc.createContentStream(
          drawLinesOfText(
            ['Page: ' + (i + 1).toString() + '/' + (pages.length).toString()],
            { x: 34, y: 31, size: 8, font: INVOICE_FONT, colorRgb: GREY, },
          ),
        );
        currentPage.addContentStreams(pdfDoc.register(contentStream1));
      }

      const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);

      var tempPdfFile = os.tmpdir() + '/tmp_invoice.pdf'
      fs.writeFileSync(tempPdfFile, pdfBytes);
      vm.isRenderingPdf = false;
      vm.webview.loadURL(tempPdfFile);

    });





  },


  methods: {
    handleFcAfterDataBack(data) {
      var vm = this;
      this.form = Object.assign({}, data);
      console.log(" this.form", this.form);
      this.$root.$emit("updateChilds", data);

      vm.toPDF()
    },



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
      var vm = this
      this.isRenderingPdf = true;
      // this.pdfString = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
      // this.webview.loadURL("file://" + ASSETS + "/billing/blank.pdf");
        console.log(" PDF DATA requested.....");
      setTimeout(() => {
        var content = document.getElementById("billing-container").parentNode.innerHTML
        ipcRenderer.send("printPDF", vm.form.invoice_number, content, vm.theme, true);
      }, 100);

    },



    toPrinter() {
      // var content = document.getElementById("billing-container").parentNode.innerHTML;
      // var printer = this.getUserDefaultPrinter() || { name: '' }
      // ipcRenderer.send("print", this.form.invoice_number, content, this.theme, printer.name);




      let code = `var button = document.getElementById("print");button.click()`;
      this.webview.getWebContents().executeJavaScript(code);


    },
    onGenerateTenItemsClick(n) {
      for (var i = 0; i < n; i++) {
        var unit_cost = parseFloat((Math.random() * 100).toFixed(3).replace(",", "."));
        var quantity = Math.floor(Math.random() * 100) + 1;
        var line_total = quantity * unit_cost;
        var emptyItem = {
          id: this.form.invoice_items.length + 1,
          item: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          description: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          unit_cost: unit_cost,
          quantity: quantity,
          line_total: parseFloat(line_total.toFixed(3).replace(",", ".")),
          overed: false
        }
        var newItem = Object.assign({}, emptyItem);
        this.form.invoice_items.push(newItem)

      }

    },



  },
}
</script>
 
