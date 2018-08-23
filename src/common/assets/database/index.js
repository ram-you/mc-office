var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));

const connect = require("trilogy").connect

// const path = require('path')
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
const { BrowserWindow } = require('electron').remote
const windowID = BrowserWindow.getFocusedWindow().id
const fromWindow = BrowserWindow.fromId(windowID)
const ipcRenderer = electron.ipcRenderer;
const isDevelopment = process.env.NODE_ENV !== 'production';
const userDataPath = app.getPath('userData') + path.sep;
var dbInvoices


async function initDatabase() {
  const dsFolder = 'database'
  const dbFilename = path.join(userDataPath, dsFolder + '/invoices.sqlite')
  dbInvoices = connect(dbFilename, { client: 'sql.js' })
  const invoicesModel = await dbInvoices.model('invoices', {
    invoiceClient: String,
    invoiceNumber: String,
    invoiceDate: Date,
    invoiceLines: Array,
    invoiceTotal: String,
    id: 'increments', // special type, primary key

  })
  const invoicesCount = await invoicesModel.count();
  if (invoicesCount == 0) {
    for (var i = 0; i < 1000; i++) {

      invoicesModel.create({
        invoiceClient: 'John Doe' + i + 1,
        invoiceNumber: 'Invoice #' + Math.floor((Math.random() * 9000) + 1),
        invoiceDate: new Date(),
        invoiceTotal: Math.floor((Math.random() * 9000) + 1) + ' $',
        invoiceLines: [
          'Game of the Year',
          'Best Multiplayer Game',
          'Best ESports Game'
        ]
      })
    }
  }


}

// ===
 

initDatabase()

if(typeof XLSX == 'undefined') var XLSX = require('xlsx');

ipcRenderer.on("getInvoices", (event, model) => {
  const query = dbInvoices.knex('invoices').select('*').limit(10)
  dbInvoices.raw(query, true).then(data => {
    // ipcRenderer.send("gotInvoicesData", data);
    fromWindow.webContents.send("invoicesResults", data);
  
    /* make the worksheet */
var ws = XLSX.utils.json_to_sheet(data);

/* add to workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    fromWindow.webContents.send("xlsResults", wb);
  })

});