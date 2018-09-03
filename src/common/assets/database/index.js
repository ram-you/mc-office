var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));

 

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
var appDatabase;
let mainWindow = remote.getGlobal('mainWindow');

let DB_VERSION = remote.getGlobal('DB_VERSION')
let ASSETS = remote.getGlobal('ASSETS_GLOBAL')

let invoicesSchema = require("./schema/" + DB_VERSION + "/Invoices")
let usersSchema = require("./schema/" + DB_VERSION + "/Users")

const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });

var versionFile = path.join(userDataPath, 'database/version.json')



var obj = { current: DB_VERSION, latest: DB_VERSION }
fs.exists(versionFile, function(exists) {
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
    fse.ensureDirSync(path.join(userDataPath, 'database'))
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
    var migrationFile = path.join(ASSETS, "database/schema/" + version.latest + "/migrate/" + version.current + ".js");
    fs.exists(migrationFile, function(exists) {
      if (exists) {
        mainWindow.webContents.send("migrateApplicationData", {status:'start', current:version.current, latest:version.latest}); 
        var migrate = require(migrationFile);
        migrate.migrateDatabase().then((result) => {
          // const invoicesModel = await appDatabase.model('invoices', invoicesSchema);
          // const usersModel = await appDatabase.model('users', usersSchema);
          //   migrate.importData(appDatabase);
          obj = { current: DB_VERSION, latest: DB_VERSION }
          var json = JSON.stringify(obj);
          fs.writeFile(versionFile, json, () => { 
            // alert("Migration de La base de données efféctuée avec succes.\nAncienne Version: " + version.current + "\nNouvelle Version: " + version.latest) 

           
         
              console.log("done Users+Invoices")
              mainWindow.webContents.send("migrateApplicationData",  {status:'finish', current:version.current, latest:version.latest});
              
            
          
          });
        });
      } else {
        alert("NO NO \n" + path.join(migrationFile, "") + "\n" + migrationFile)
      }
    })




  }

}
 
 




// ------------
ipcRenderer.on('exportToXLS', async (event, message) => {

  var query = "SELECT name FROM sqlite_master" +
    " WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'" +
    " UNION ALL" +
    " SELECT name FROM sqlite_temp_master" +
    " WHERE type IN ('table','view')" +
    " ORDER BY 1";
  var startTime = new Date()
  knex.raw(query).then(function(resp) {
    var models = resp.map(a => a.name);
    console.log(models);

    var wb = XLSX.utils.book_new();
    var promises = models.map(model => {
      console.log(model)
      return new Promise((resolve, reject) => {
        knex(model).select('*').then(data => {
          // console.log(data) 
          resolve({ data: data, model: model })
        })
      });
    });

    Promise.all(promises).then(function(values) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        // console.log("value",value)
        var ws = XLSX.utils.json_to_sheet(value.data);
        XLSX.utils.book_append_sheet(wb, ws, value.model);
      }
      saveAndExit()
    });

    function saveAndExit() {
      let xslPathFolder = userDataPath + 'database' + sep + 'excel' + sep + 'export' + sep
      fse.ensureDirSync(xslPathFolder)
      const xslPath = xslPathFolder + 'mc-office.xls';
      // XLSX.writeFile(wb, xslPath);
      const content = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', bookSST: false });
      fs.writeFileSync(xslPath, content);
      var endTime = new Date()
      var response = {
        timed: msToTime(endTime - startTime),
        link: xslPath
      }
      mainWindow.webContents.send("exportToXLS", response);
    }

    function msToTime(s) {
      function pad(n, z) { z = z || 2; return ('00' + n).slice(-z); }
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
      return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
    }
  });



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
ipcRenderer.on("getInvoices", async (event, model) => {
  knex('invoices').select('*').limit(10).then(data => {
    mainWindow.webContents.send("invoicesResults", data);
  })

});