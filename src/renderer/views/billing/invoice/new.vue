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
  </div>
</template>

<script>  

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var axios = require("axios");
const Store = require('electron-store');
const _store = new Store();

var format = require('date-fns/format')

var path = require('path');
const { ipcRenderer } = require('electron')
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

import InvoiceDetail from "./itemDetails"

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
      clientDialog: false,
      logoImg: require("../../../../common/assets/img/logo/256x256.png"),

      pdfString: '',
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
    searchClient(val) {
      if (this.clientsItems.length > 0) return
      this.isLoading = true
      axios.get('https://api.coinmarketcap.com/v2/listings/').then(res => {
        this.clientsItems = res.data.data
        this.isLoading = false
      }).catch(err => { console.log(err) });

    }
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

    // setTimeout(() => {
    //   var content = document.getElementById("billing-container").parentNode.innerHTML
    //   ipcRenderer.send("printPDF", vm.form.invoice_number, content, vm.theme, true);
    // }, 100);


    ipcRenderer.on("data-pdf", (event, data) => {
      vm.isRenderingPdf = false;
      console.log(" PDF DATA regenerated.....");

      vm.pdfString = 'data:application/pdf;base64, ' + (Uint8ToBase64(data))
    });

    const PDFWindow = require('electron-pdf-window')

    this.webview = document.querySelector('webview')
    this.webview.webContents = this.webview.getWebContents()
    PDFWindow.addSupport(this.webview)

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

      var docDefinition = {
        content: [
          {
            text: 'This is a header, using header style',
            style: 'header'
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n',
          {
            text: 'Subheader 1 - using subheader style',
            style: 'subheader'
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
          {
            text: 'Subheader 2 - using subheader style',
            style: 'subheader'
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
          {
            text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
            style: ['quote', 'small']
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          quote: {
            italics: true
          },
          small: {
            fontSize: 8
          }
        }

      }



      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBase64((pdfData) => {
        // vm.pdfString = 'data:application/pdf;base64, ' + pdfData;

        const fs = require('fs')
        var os = require('os');

        var tempPdfFile = os.tmpdir() + '/tmp_invoice.pdf'

        fs.writeFileSync(tempPdfFile, pdfData, 'base64');
        this.webview.loadURL(tempPdfFile);


      });
    },







    _toPDF() {
      var vm = this
      this.isRenderingPdf = true;
      this.pdfString = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
      setTimeout(() => {
        var content = document.getElementById("billing-container").parentNode.innerHTML
        ipcRenderer.send("printPDF", vm.form.invoice_number, content, vm.theme, true);
      }, 1000);

    },



    toPrinter() {
      // var content = document.getElementById("billing-container").parentNode.innerHTML;
      // var printer = this.getUserDefaultPrinter() || { name: '' }
      // ipcRenderer.send("print", this.form.invoice_number, content, this.theme, printer.name);




      let code = `var button = document.getElementById("print");
            button.click()`;
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
 
