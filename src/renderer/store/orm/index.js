
import Trilogy from 'trilogy'


var fs = require('fs');

import path from 'path'
import { remote } from 'electron'


const crypto = require('crypto');


const dsFolder = 'database'
const usersFilename = path.join(remote.app.getPath('userData'), dsFolder + '/users.sqlite')




const db = new Trilogy(usersFilename, { client: 'sql.js', })


var password = "admin"
var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
var adminUser = { username: "admin", password: pass_hash };

async function makeModels() {
  const users = await db.model('users', {
    username: { type: String },
    password: String,                           // type shorthand
    birthday: Date,
    awards: Array,
    id: 'increments'                         // special type, primary key
  })

  var administratorUser = await users.findOne({ username: 'admin' })
  if (!administratorUser) {
    await users.create({
      username: "admin",
      password: pass_hash,
      birthday: new Date('May 11, 1964'),
      awards: [
        'Game of the Year',
        'Best Multiplayer Game',
        'Best ESports Game'
      ]
    })
    administratorUser = await users.findOne({ username: 'admin' })
  }
  console.log(administratorUser.birthday)
  // -> 'Best Multiplayer Game'
  return db
}

makeModels();
// export default async function () {
//   return await makeModels();
// }

export default db


