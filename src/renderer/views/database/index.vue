<template>
  <div>

    <v-dialog v-model="waitingResponse" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text> {{waitingMessage}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="gotResponse" max-width="300">
      <v-card color="primary" dark>
        <v-card-title class="headline" color="white">Exportation en format Excel</v-card-title>
        <v-card-text color="white">
          <div> Done in : {{serverResponse.timed}} </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="gotResponse = false" light> OK </v-btn>
          <v-btn @click='gotResponse = false;openXlsFile(serverResponse.link)' light> Ouvrir </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/">
          <span class="subheading">{{ $t('main.app.Home') }} </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="subheading">Liste des Factures </span>
          <span class="subheading font-weight-medium"> </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon @click="exportDatabaseToExel">
          <v-icon class="blue--text text--darken-2">mdi-database-export</v-icon>
        </v-btn>

        <upload-btn icon :accept="SheetJSFT" :fileChangedCallback="fileSelectedFunc" flat color='transparent'>
          <template slot="icon">
            <v-icon class="green--text text--darken-2">mdi-database-import</v-icon>
          </template>
        </upload-btn>

      </div>

    </v-toolbar>

    <v-flex xs12 mb-4 mt-4>
      <div class="display-1 px-3">Liste des Factures</div>

      <v-layout row wrap align-center justify-start py-3 :reverse="$vuetify.rtl">

        <v-flex xs12 sm10 offset-sm1>
          <v-card style="text-align: -webkit-auto;">
            <v-card-title>
              Factures
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-data-table :headers="headers" :items="tableData" :search="search" item-key="id">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">

                  <td v-for="(header,index) in headers" :key="index">
                    {{ props.item[header.value] }}
                  </td>
 

                  <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                      <v-icon color="teal" class="mdi-18px">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                      <v-icon color="red" class="mdi-18px">mdi-delete</v-icon>
                    </v-btn>

                    <v-btn icon class="mx-0" @click="goDetail(props.item)">
                      <v-icon color="blue" class="mdi-18px">mdi-link</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template> 
              <template slot="no-data">
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }}
              </template>
              <v-alert slot="no-results" :value="true" color="red" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-layout v-if="isInvoicesDataLoaded" row wrap align-center justify-start py-3 mb-4>
      <v-flex xs12 sm10 offset-sm1>
        <v-card style="text-align: -webkit-auto;" class=" mb-4">
          <template v-for="item in invoicesList">
            <v-card :key="item.id">
              <v-card-title primary-title v-html="item.invoiceNumber +' '+item.invoiceClient">

              </v-card-title>
            </v-card>
          </template>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap align-center justify-start py-3 mb-4>
      <v-flex xs12 sm10 offset-sm1>
        <v-card style="text-align: -webkit-auto;">
          <v-card-title primary-title id="no-data" class="justify-center py-5 mb-4">
            <v-progress-circular :size="70" :width="7" color="red" indeterminate></v-progress-circular>

          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

  </div>
</template>
<script>
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')
const fse = require('fs-extra');

const { ipcRenderer } = require('electron')
import { remote } from 'electron'
const app = remote.app
let dbWorkerWindow = remote.getGlobal('dbWorkerWindow');

function Capitalize(str) {
 str = str.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) { return key });
  return str.toLowerCase().split(' ').map(function (word) { return word[0].toUpperCase() + word.substr(1); }).join(' ');
}

import UploadButton from 'vuetify-upload-button';
export default {
  components: { 'upload-btn': UploadButton },
  name: 'invoicesList',
  data() {
    return {
      waitingResponse: false,
      waitingMessage: '',
      gotResponse: false,
      serverResponse: '',
      SheetJSFT: ["xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "ods", "dbf"].map(function (x) { return "." + x; }).join(","),
      isInvoicesDataLoaded: false,
      // invoicesList: [],
      theme: 'default',
      selectedInvoiceID: null,
      selectedInvoiceNumber: null,
      search: '',
      headers: [],
      tableData: [],
      totalDesserts: 0,

      loading: true,
      pagination: {},
      max25chars: (v) => v.length <= 25 || 'Input too long!',
      desserts2: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        id: 1, number: 'FAC-2018-007', name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        id: 1, number: 'FAC-2018-007', name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },
    formTitle() { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },

    invoicesList() { return this.$store.state.Invoice.invoices },

  },
  watch: {
    pagination: {
      handler() {

      },
      deep: true
    },
    dialog(val) { val || this.close() }
  },
  beforeCreate() {
    dbWorkerWindow.webContents.send("get_tableSchema", 'currencies');
    dbWorkerWindow.webContents.send("get_tableData", 'currencies');
  },
  created() {
    this.initialize();
    this.isInvoicesDataLoaded = true;
  },
  destroyed() {
    ipcRenderer.removeAllListeners("got_tableSchema");
  },
  mounted() {

    var vm = this

    ipcRenderer.on("got_tableSchema", (event, data) => {
      console.log("Done Schema Results=", data);
      var res = data.tableSchema.map(row => {  return { text: Capitalize(row), value: row }      })
      vm.headers = res
    });

    ipcRenderer.on("got_tableData", (event, data) => {
      console.log("Done Data Results=", data)
      vm.tableData = data.data
    });


  },
  methods: {
    refreshInvoicesData() {
      ipcRenderer.send("getInvoices", 'invoices');
    },
    async initInvoicesData() {
      var vm = this
      await this.$store.dispatch('getInvoices')
      vm.isInvoicesDataLoaded = true

    },
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination

        let items = this.getDesserts()

        const total = items.length

        if (this.pagination.sortBy) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]

            if (descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (rowsPerPage > 0) {
          items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

        setTimeout(() => {
          this.loading = false
          resolve({
            items,
            total
          })
        }, 1000)
      })
    },

    initialize() {
      dbWorkerWindow.webContents.send("got_tableSchema", 'currencies');
      dbWorkerWindow.webContents.send("got_tableData", 'currencies');
    },

    goDetail(item) {
      this.$router.push({ name: "invoice", params: { id: item.id }, query: { number: item.number } });
    },
    editItem(item) {
      this.editedIndex = this.desserts2.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const itemIndex = this.desserts2.indexOf(item)

      const { dialog } = require('electron').remote

      const options = {
        type: 'warning',
        title: 'Suppression',
        message: "Êtes-vous sûr de vouloir supprimer " + '"' + item.name + '"' + " ?",
        buttons: ['Oui', 'Non']
      }
      dialog.showMessageBox(options, (index) => {
        if (index == 0) this.desserts2.splice(itemIndex, 1)
      })

    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts2[this.editedIndex], this.editedItem)
      } else {
        this.desserts2.push(this.editedItem)
      }
      this.close()
    },

    exportDatabaseToExel() {
      var vm = this
      this.waitingResponse = true;
      this.waitingMessage = "Exportation en cours, veuillez patienter... "
      ipcRenderer.on('exportToXLS', (event, message) => {
        ipcRenderer.removeAllListeners("exportToXLS");
        vm.waitingResponse = false;
        setTimeout(() => {
          // alert(message);
          vm.gotResponse = true;
          vm.serverResponse = message;
        }, 300);

      });
      dbWorkerWindow.webContents.send('exportToXLS', "Message from Window 1");
    },
    openXlsFile(file) {
      const { shell } = require('electron');
      shell.openItem(file);
    },
    fileSelectedFunc(file) {
      ipcRenderer.once('importFromXLS', (event, message) => { alert(message); });

      dbWorkerWindow.webContents.send('importFromXLS', file);
    },

  },


}
</script>

<style>
.upload-btn {
  display: inline-flex;
  vertical-align: middle;
}
</style>
