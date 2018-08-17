var lib = require('./patch.js');
var Sequelize = require('sequelize');


var fs = require('fs');

import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');  
 
const dsFolder = 'database/' 
const dbFilename = path.join(remote.app.getPath('userData'), dsFolder + '/database.sqlite')


var SQL = require('sql.js');
var filebuffer = fs.readFileSync(dbFilename);
 

console.log('sqlite:'+dbFilename)
 



var sequelize = new Sequelize('sqlite://'+dbFilename, {
  dialectModulePath: 'sql.js',
  
  storage: dbFilename
});

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync({force: true}).then(function() {
  return User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  }) 
}).then(function(jane) {
 
  console.log(jane.get({
    plain: true
  }));
});