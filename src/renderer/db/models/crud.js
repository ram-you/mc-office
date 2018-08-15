var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');

var Datastore = require('nedb') 

const version = require('../../../../package').version
const dsFolder = 'database/' + version
const autoIncrementFilename = path.join(remote.app.getPath('userData'), dsFolder + '/autoIncrement.db')

// ==============UniqueID========================

const autoIncrement = new Datastore({ filename: autoIncrementFilename, autoload: true });

function getUniqueId(nameDb, cb) {
  autoIncrement.findOne({ name: nameDb }, function (err, doc) {
    if (err) {
      throw err;
    } else {
      if (doc) {
        const itemID = doc.nextId + 1;
        autoIncrement.update({ name: nameDb }, {
          name: nameDb,
          nextId: itemID
        }, {}, function (err, numReplaced) {
          autoIncrement.persistence.compactDatafile();
          if (err) {
            throw err;
          } else {
            // console.log(numReplaced);
          }
          cb(doc.nextId);
        });
      } else {
        const data = {
          name: nameDb,
          nextId: 2
        };

        autoIncrement.insert(data, function (err, newDoc) {
          if (err) {
            throw err;
          } else {
            // console.log(newDoc);
          }
          cb(1);
        });
      }
    }

  });
}


// ===================
function insertUnique(dbName, data, cb) {
  getUniqueId(dbName, function (uniqueId) {
      data.itemId = uniqueId;

      db[dbName].insert(data, function (err, newDoc) {
          if (err) {
              cb({error: '1', message: 'error#2'});
              throw err;
          }
          cb({error: '0', message: 'Item add'});
      });

  });
 }

  // =======================EXPORT======================
  export default {
    insertUnique,
  }

 