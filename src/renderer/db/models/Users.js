var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

import crud from './crud'

const crypto = require('crypto');

var Datastore = require('nedb')
var db = {}

const version = require('../../../../package').version
const dsFolder = 'database'
const usersFilename = path.join(remote.app.getPath('userData'), dsFolder + '/users.db')

var table = {}
table.name = "Users"

// ==============   ==============
function init() {
  table.model = new Datastore({
    filename: usersFilename,
    autoload: true,
    timestampData: true,
    onload: (error) => {
      if (error) { alert(error) } else {
        table.model.count({}, function (err, count) {
          console.log("count Users=", count)
          if (count == 0) {
            var password = "admin"
            var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
            var adminUser = { username: "admin", password: pass_hash };
            // table.model.insert(adminUser, function (err, newDoc) { })
            crud.insertUnique(table,adminUser, function (err, newDoc) { })
          } else { }
        });
      }
    }

  });
}


init()

var methods = {
  async  addOne(data) {
    await crud.insertUnique(table, data, (err, message) => {
      if (err) {
        return ({ error: true, message: 'error#2' });
        throw err;
      }
      return ({ error: true, message: 'error#2' });
    })
  }
}

table.methods = methods
export default table