import path from 'path'
import {
  remote
} from 'electron'
const crypto = require('crypto');
var fileName = path.join(remote.app.getPath('userData'), 'datastore/mc-office.db')

const loki = require('lokijs');
const lfsa = require('lokijs/src/loki-fs-structured-adapter.js');
const structeredAdapter = new lfsa()
const cryptedFileAdapter = require('lokijs/src/loki-crypted-file-adapter.js')

var password = 'la vie est belle';
let password_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
cryptedFileAdapter.setSecret(password_hash);

var db = new loki(fileName, {
  adapter: structeredAdapter, //cryptedFileAdapter,
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000
});

process.on('SIGINT', function() {
  console.log("flushing database");
  db.close();
});


function databaseInitialize() {
  var entries = db.getCollection("entries");
  var messages = db.getCollection("messages");
  var users = db.getCollection("users");
  if (entries === null) {
    entries = db.addCollection("entries", {
      indices: ['x'],
      clone: true
    });
  }
  if (messages === null) {
    messages = db.addCollection("messages");
    messages.insert({
      txt: "i will only insert into this collection during databaseInitialize"
    });
  }
  if (users === null) {
    users = db.addCollection("users");
    users.insert({
      username: "admin",
      password: "admin"
    });
  }
}



export default db