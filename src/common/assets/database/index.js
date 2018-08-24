var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));

const connect = require("trilogy").connect

const fs = require('fs')
const fse = require('fs-extra');

var XLSX = require('xlsx');

var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
const { BrowserWindow } = require('electron').remote
const windowID = BrowserWindow.getFocusedWindow().id
const fromWindow = BrowserWindow.fromId(windowID)
const ipcRenderer = electron.ipcRenderer;
const isDevelopment = process.env.NODE_ENV !== 'production';
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
var appDatabase


async function initDatabase() { 
  const dbFilename = path.join(userDataPath,   'database/mc-office.sqlite')
  appDatabase = connect(dbFilename, { client: 'sql.js' })
  const invoicesModel = await appDatabase.model('invoices', {
    invoiceClient: String,
    invoiceNumber: String,
    invoiceDate: Date,
    invoiceLines: Array,
    invoiceTotal: String,
    id: 'increments', // special type, primary key

  })
  const usersModel = await appDatabase.model('users', {
    firstName: String,
    lastName: String,
    password: String,
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
  const usersCount = await usersModel.count();
  if (usersCount == 0) {
    for (var i = 0; i < 1000; i++) {
      usersModel.create({
        firstName: 'John' + i + 1,
        lastName: 'Doe' + Math.floor((Math.random() * 10) + 1),
        password: Math.floor((Math.random() * 9000) + 1) + ' $',

      })
    }
  }

}

// ===


initDatabase()


// ------------
ipcRenderer.on('exportToXLS', (event, message) => {
  var models = appDatabase.models
  var wb = XLSX.utils.book_new();
  var promises = models.map(model => {
    return new Promise((resolve, reject) => {
      var query = appDatabase.knex(model).select('*');
      appDatabase.raw(query, true).then(data => {
        resolve({ data: data, model: model })
      })
    });
  });

  Promise.all(promises).then(function (values) {
    for (var i = 0; i < values.length; i++) {
      var value = values[i]
      var ws = XLSX.utils.json_to_sheet(value.data);
      XLSX.utils.book_append_sheet(wb, ws, value.model);
    }
    saveAndExit()
  });

  function saveAndExit() {
    let xslPathFolder = userDataPath + 'database' + sep + 'excel' + sep + 'export' + sep
    fse.ensureDirSync(xslPathFolder)
    const xslPath = xslPathFolder + 'mc-office.xls';
    XLSX.writeFile(wb, xslPath);
    fromWindow.webContents.send("exportToXLS", "Export To XLS\n" + ".......Done.");
  }

});

// ------------
ipcRenderer.on('importFromXLS', (event, file) => {
  var utils = require("./utils")
  var fileName = file.name.split('.')[file.name.split('.').length - 2]
  let xslPathFolder = userDataPath + 'database' + sep + 'excel' + sep + 'import' + sep
  fse.ensureDirSync(xslPathFolder)
  const xslFilePath = xslPathFolder + file.name;
  try {
    fs.readFile(file.path, function read(err, data) {
      if (err) { throw err; }
      fse.outputFile(xslFilePath, data)
      processFile(data);
    });
    function processFile(data) {
      // pre-process data
      var binary = "";
      var bytes = new Uint8Array(data);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      var wb = XLSX.read(binary, { type: 'binary' });
      var jsonArray = utils.to_json(wb)
      Object.keys(jsonArray).forEach(key => {
        writeJson(fileName + " (" + key + ")", jsonArray[key])
      });

      fromWindow.webContents.send("importFromXLS", "Import From XLS\n" + ".......Done.");
    }
    async function writeJson(jsonFile, jsonData) {
      try {
        await fse.writeJson(xslPathFolder + jsonFile + '.json', jsonData)

      } catch (err) {
        console.error(err)
      }
    }
  } catch (e) {
    console.log(e)
  }
});

// ------------
ipcRenderer.on("getInvoices", (event, model) => {
  const query = appDatabase.knex('invoices').select('*').limit(10)
  appDatabase.raw(query, true).then(data => { 
    fromWindow.webContents.send("invoicesResults", data);
  })
});

