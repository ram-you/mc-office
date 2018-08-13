
import Trilogy from 'trilogy'
import path from 'path'
import { remote } from 'electron'

const crypto = require('crypto');




var database = path.join(remote.app.getPath('userData'), 'datastore/database.sqlite')

const db = new Trilogy('database.sqlite', {
  client: 'sql.js',
  dir: path.resolve(remote.app.getPath('userData') + '/datastore'),

  // pass a function that receives all queries run
  // verbose: console.log.bind(console)
})

async function initDB() {
  const people = await db.model('people', {
    uid: { type: Number, primary: true },
    username: { type: String },
    password: { type: String },
  })

  const users = await db.model('users', {
    uid: { type: Number, primary: true },
    firstname: { type: String },
    lastname: { type: String },
  })

  var peopleCount = await people.count()
  if (peopleCount == 0) {
    var password = "admin"
    var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
    var user = { uid: 1, username: "admin", password: pass_hash };
    people.create(user).then(data => {
      console.log(data)
    })
    await Promise.all([
      people.create(user),
    ])
  }


  var usersCount = await users.count()

  if (usersCount == 0) {
    var usersList = [{ uid: 1, firstname: "Ramzi", lastname: "Youssef" }, { uid: 2, firstname: "Youssef", lastname: "ElKafsi" }];
    await Promise.all([
      users.create(usersList[0]),
      users.create(usersList[1]),
    ])

  }
  
}

 

export default db

initDB()