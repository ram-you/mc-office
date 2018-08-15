var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');

var Datastore = require('nedb')
var db = {}

const version = require('../../../package').version
const dsFolder='datastore/'+version
const usersFilename = path.join(remote.app.getPath('userData'), dsFolder+'/users.db')
const invoicesFilename = path.join(remote.app.getPath('userData'),dsFolder+ '/invoices.db')
 


// ============== USERS ==============
db.Users = new Datastore({
  filename: usersFilename,
  autoload: true,
  timestampData: true,
  onload: function(error) {
    if (error) { alert(error) } else {
      db.Users.count({}, function(err, count) {
        if (count == 0) {
          var password = "admin"
          var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
          var user = { username: "admin", password: pass_hash };
          db.Users.insert(user, function(err, newDoc) {})
        }
      });
    }
  },

});


// ============== DESSERTS ==============
db.Invoices = new Datastore({
  filename: invoicesFilename,
  autoload: true,
  timestampData: true,
  onload: function(error) {
    if (error) { alert(error) } else {
      db.Invoices.count({}, function(err, count) {
        if (count == 0) {
          db.Invoices.insert(JSON.parse(JSON.stringify(require('./invoices-sample.json'))), function(err, newDoc) {})
        }
      });
    }
  },
});


export default db