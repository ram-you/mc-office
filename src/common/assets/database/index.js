var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));

const connect =require( 'trilogy').connect

const fs = require('fs')
const fse = require('fs-extra');

var XLSX = require('xlsx');

var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
const { BrowserWindow } = require('electron').remote;
const ipcRenderer = electron.ipcRenderer;
const isDevelopment = process.env.NODE_ENV !== 'production';
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
var appDatabase
let mainWindow = remote.getGlobal('mainWindow');

let DB_VERSION = remote.getGlobal('DB_VERSION')

let invoicesSchema = require("./schema/" + DB_VERSION + "/Invoices")
let usersSchema = require("./schema/" + DB_VERSION + "/Users")

var versionFile = path.join(userDataPath, 'database/version.json')

var obj = { current: DB_VERSION, latest: DB_VERSION }
fs.exists(versionFile, function (exists) {
  if (exists) {
    fs.readFile(versionFile, function readFileCallback(err, data) {
      if (err) { console.log(err); } else {
        obj = JSON.parse(data);
        obj.latest = DB_VERSION
        var json = JSON.stringify(obj);
        fs.writeFile(versionFile, json, () => { migrateDB(obj) });
      }
    });
  } else {
    var json = JSON.stringify(obj);
    fs.writeFile(versionFile, json, () => { migrateDB(obj) });
  }
});



async function migrateDB(version) {


  if (version.current == version.latest) {
    var initData = require("./schema/" + version.current + "/initData.js");
  //     const invoicesModel = await appDatabase.model('invoices', invoicesSchema);
  // const usersModel = await appDatabase.model('users', usersSchema);

  } else {
    var migrate = require("./schema/migrate/" + version.current + ".js");
      migrate.renameTables(appDatabase).then(async ()=>{
        // const invoicesModel = await appDatabase.model('invoices', invoicesSchema);
        // const usersModel = await appDatabase.model('users', usersSchema);
        //   migrate.importData(appDatabase);
      });
  

  }

}

async function initModels() {
  // const invoicesModel = await appDatabase.model('invoices', invoicesSchema);
  // const usersModel = await appDatabase.model('users', usersSchema);
 
     await appDatabase.model('invoices', invoicesSchema);
   await appDatabase.model('users', usersSchema);
  
}

async function initDatabase() {


}




// ------------
ipcRenderer.on('exportToXLS', async (event, message) => {
  const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
  appDatabase = await connect(dbFilename, { client: 'sql.js' });
  const invoicesModel = await appDatabase.model('invoices', invoicesSchema);
  const usersModel = await appDatabase.model('users', usersSchema);

  var models = appDatabase.models;
  console.log(models)
  var wb = XLSX.utils.book_new();
  var promises = models.map(model => {
    console.log(model)
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
    mainWindow.webContents.send("exportToXLS", "Export To XLS\n" + ".......Done.");
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

      mainWindow.webContents.send("importFromXLS", "Import From XLS\n" + ".......Done.");
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
ipcRenderer.on("getInvoices",async (event, model) => {
  const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
  appDatabase = await connect(dbFilename, { client: 'sql.js' });
  const invoicesModel = await appDatabase.model('invoices', invoicesSchema);
  const usersModel = await appDatabase.model('users', usersSchema);
  const query = appDatabase.knex('invoices').select('*').limit(10)
  appDatabase.raw(query, true).then(data => {

    mainWindow.webContents.send("invoicesResults", data);
  })
});

