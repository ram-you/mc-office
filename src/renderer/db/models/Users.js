var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');

var Datastore = require('nedb')
var db = {}

const version = require('../../../../package').version
const dsFolder = 'database'
const usersFilename = path.join(remote.app.getPath('userData'), dsFolder + '/users.db')




var model
// ==============   ==============
function init() {
  model = new Datastore({
    filename: usersFilename,
    autoload: true,
    timestampData: true,
    onload: (error) => {
      if (error) { alert(error) } else {
        model.count({}, function(err, count) {
          if (count == 0) {
            var password = "admin"
            var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
            var adminUser = { username: "admin", password: pass_hash };
            model.insert(adminUser, function(err, newDoc) {})
          } else {}
        });
      }
    }

  });
}


init()


export default model