var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');

var Datastore = require('nedb') 

const version = require('../../../../package').version
const dsFolder='database/'+version 
const invoicesFilename = path.join(remote.app.getPath('userData'),dsFolder+ '/invoices.db')
 



var model


// ============== USERS ==============
function init(){
  model  = new Datastore({
    filename: invoicesFilename,
    autoload: true,
    timestampData: true,
    onload: function(error) {
      if (error) { alert(error) } else {
        model.count({}, function(err, count) {
          if (count == 0) {
            model.insert(JSON.parse(JSON.stringify(require('../invoices-sample.json'))), function(err, newDoc) {})
          }
        });
      }
    },
  
  });
}

init()

 

export default model