
var path = require('path');
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
const { BrowserWindow } = require('electron').remote;
const ipcRenderer = electron.ipcRenderer;
const isDevelopment = process.env.NODE_ENV !== 'production';
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;

const connect = require('trilogy').connect

var appDatabase, invoicesModel, usersModel
let invoicesSchema = require("./Invoices")
let usersSchema = require("./Users")


async function initDatabase() {
  const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite')
  appDatabase = connect(dbFilename, { client: 'sql.js' })
  invoicesModel = await appDatabase.model('invoices', invoicesSchema)
  usersModel = await appDatabase.model('users', usersSchema)
  const invoicesCount = await invoicesModel.count();
  if (invoicesCount == 0) {
    for (var i = 0; i < 1000; i++) {
      invoicesModel.create({
        invoiceClient: 'John Doe - ' + (i + 1),
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
  const usersCount = await usersModel.count();
  if (usersCount == 0) {
    for (var i = 0; i < 1000; i++) {
      usersModel.create({
        firstName: 'John - ' + (i + 1),
        lastName: 'Doe' + Math.floor((Math.random() * 10) + 1),
        password: Math.floor((Math.random() * 9000) + 1) + ' $',

      })
    }
  }

}
initDatabase()
module.exports = {}