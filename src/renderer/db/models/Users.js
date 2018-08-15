// Import modli and the NeDB adapter
import { model, adapter, use } from 'modli';
import nedb from 'modli-nedb';

var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');

var Datastore = require('nedb')
var db = {}

const version = require('../../../../package').version
const dsFolder='database/'+version 
const usersFilename = path.join(remote.app.getPath('userData'), dsFolder+'/users.db') 

// Add an adapter instance
adapter.add({
  name: 'modliNeDB',
  source: nedb,
  config: {
    filename: usersFilename,
    autoload: true,
    timestampData: true,
    onload: function(error) {
      
    },
  }
});

// Add a data model
model.add({
  name: 'modliTest',
  tableName:'users',
  version: version,
  schema: {
    id: { type: 'number' },
    username:{ type: 'string', required: true },
    password: { type: 'string', required: true },
    email: { type: 'string', required: false },
  }
});
 

// Create an instance of the datasource object with the Model and Adapter
const myDataSource = use('modliTest', 'modliNeDB');

var password = "admin"
var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
var adminUser = {  id: 1,username: "admin", password: pass_hash };
myDataSource.create(adminUser)
.then((result) => {
  console.log('Success:', result);
})
.catch((err) => {
  console.log('Error:', err);
});

export default myDataSource