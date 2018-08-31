var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..','..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..','..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..','..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..','..', 'app.asar', 'node_modules'));
 
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
let DB_VERSION = remote.getGlobal('DB_VERSION')

let invoicesSchema = require("../Invoices")
let usersSchema = require("../Users")
var renameTables = function(appDatabase) {
  return new Promise(
    function(resolve, reject) {
      const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite')
      appDatabase = connect(dbFilename)
      // if (!appDatabase.hasModel('users_old')) {
      var query = 'alter table users rename to users_old;'
      appDatabase.raw(query, true).then(async () => {
        // invoicesModel = await appDatabase.model('invoices', invoicesSchema);
        // usersModel = await appDatabase.model('users', usersSchema);
        query = 'insert into users(id, first_name, last_name, password) select id, firstName, lastName,password from users_old; drop table users_old;'
        appDatabase.raw(query, true).then(result => {
          appDatabase.raw("VACUUM", true).then(result => {
            return resolve("done");
          })
        })
      })
      // } else {
      //   resolve(true)
      // }

    }
  );
};



var importData = function(appDatabase) {
  return new Promise(
    function(resolve, reject) {
      query = 'insert into users(id, first_name, last_name, password) select id, firstName, lastName,password from users_old; drop table users_old;'
      appDatabase.raw(query, true).then(() => {
        resolve(true);
      })

    }
  );
};

module.exports = { renameTables, importData }