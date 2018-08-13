import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');

var da

var Datastore = require('nedb')
var db = {}

// ============== USERS ==============
db.Users = new Datastore({
  filename: path.join(remote.app.getPath('userData'), 'datastore/users.db'),
  autoload: true,
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
db.Desserts = new Datastore({
  filename: path.join(remote.app.getPath('userData'), 'datastore/desserts.db'),
  autoload: true,
  onload: function(error) {
    if (error) alert(error)
  },
});


export default db