var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'app.asar', 'node_modules'));


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
let invoicesSchema = require("./Invoices")
let usersSchema = require("./Users")


async function initDatabase() {
  const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite')
  // appDatabase = connect(dbFilename, { client: 'sqlite3' })
  // invoicesModel = await appDatabase.model('invoices', invoicesSchema)
  // usersModel = await appDatabase.model('users', usersSchema)
  // const invoicesCount = await invoicesModel.count();
  var invoicesCount;
  if (invoicesCount == 0) {

    var j = 0
    // initInvoices(j)

    function initInvoices(j) {
      var sql = "INSERT INTO invoices ( invoiceClient,invoiceNumber,invoiceDate,invoiceTotal,invoiceLines) values ";
      for (var i = j * 100; i < (j * 100) + 100; i++) {
        var values = "";
        values += "'" + 'John Doe - ' + (i + 1) + "'" + ','
        values += "'" + 'Invoice #' + Math.floor((Math.random() * 9000) + 1) + "'" + ','
        values += "'" + new Date() + "'" + ','
        values += "'" + Math.floor((Math.random() * 9000) + 1) + ' $' + "'" + ','
        values += "'" + ['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game'].toString() + "'"
        sql += "(" + values + "),";
      }
      sql = sql.substr(0, sql.length - 1);
      appDatabase.raw(sql, true).then(result => {
        console.log(result)
        j += 1
        if (j < 3650) {
          // setTimeout(() => {
          console.log("j=", j);
          initInvoices(j);
          // }, j+100);
        }
      })
    }

  }



  function makeTests() {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(dbFilename);
    var knex = require('knex')({
      client: 'sqlite3',
      connection: {
        filename: dbFilename
      }
    });

    db.serialize(function() {
      // db.run("CREATE TABLE user (id INT, dt TEXT)");
      var stmt = db.prepare("INSERT INTO invoices ( invoiceClient,invoiceNumber,invoiceDate,invoiceTotal,invoiceLines) VALUES (?,?,?,?,?) ");
      // var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
      for (var i = 0; i < 10000; i++) {

        var d = new Date();
        var invoiceClient = 'John Doe - ' + (i + 1)
        var invoiceNumber = 'Invoice #' + Math.floor((Math.random() * 9000) + 1)
        var invoiceDate = d.toLocaleTimeString();
        var invoiceTotal = Math.floor((Math.random() * 9000) + 1) + ' $'
        var invoiceLines = ['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game'].toString()


        stmt.run(invoiceClient, invoiceNumber, invoiceDate, invoiceTotal, invoiceLines);
      }
      stmt.finalize();

      // db.each("SELECT id, dt FROM user", function(err, row) {
      //     console.log("User id : "+row.id, row.dt);
      // });
    });

    db.close();

  }
  // if (invoicesCount == 0) { makeTests() }


  var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });
  knex.schema.hasTable('invoices').then(function(exists) {
    if (!exists) {
      knex.schema
        .createTable('invoices', invoicesSchema)
        .then(() => {
          console.log("Table 'invoices' created");
          startKnex()
        })
    }else{
      startKnex()
    }
  })
  
  function startKnex(){
    knex('invoices').count('* as count').then(c=>{
      invoicesCount =c[0].count;
      console.log("invoicesCount",invoicesCount)
      if (invoicesCount == 0) { makeTestKnex() }
    })
  }

  // ******************
  function makeTestKnex() {

    var j = 0
    initInvoices(j)

    function initInvoices(j) {
      var datas = []
      for (var i = j * 100; i < (j * 100) + 100; i++) {

        var d = new Date();
        var data = {
          invoiceClient: 'John Doe - ' + (i + 1),
          invoiceNumber: 'Invoice #' + Math.floor((Math.random() * 9000) + 1),
          invoiceDate: d.toLocaleTimeString(),
          invoiceTotal: Math.floor((Math.random() * 9000) + 1) + ' $',
          invoiceLines:  JSON.stringify(['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game']),
        }

        datas.push(data)
      }

      knex('invoices').insert(datas).then(result => {
        j += 1
        if (j < 3650) {
          console.log("j=", j, result);
          initInvoices(j);

        }
      })
    }

  }



 





  // ==================================================================USERS=======================
  var usersCount;// = await usersModel.count();
  if (usersCount == 0) {

    // for (var i = 0; i < 100; i++) {
    //   usersModel.create({
    //     firstName: 'John - ' + (i + 1),
    //     lastName: 'Doe' + Math.floor((Math.random() * 10) + 1),
    //     password: Math.floor((Math.random() * 9000) + 1)  ,
    //   })
    // }

    var crypto = require("crypto");
    var j = 0
    // initUsers(j)
    function initUsers(j) {
      var sql = "INSERT INTO users ( first_name,last_name,password) values ";
      for (var i = j * 100; i < (j * 100) + 100; i++) {
        var values = "";
        values += "'" + 'John  - ' + (i + 1) + "'" + ','
        values += "'" + 'Doe - ' + Math.floor((Math.random() * 10) + 1) + "'" + ','
        values += "'" + crypto.randomBytes(20).toString('hex') + "'"
        sql += "(" + values + "),";
      }
      sql = sql.substr(0, sql.length - 1);
      appDatabase.raw(sql, true).then(result => {
        j += 1
        if (j < 100) {
          setTimeout(() => {
            console.log("j=", j);
            initUsers(j);
          }, j + 100);
        }
      })
    }




  }


}
initDatabase()
module.exports = {}