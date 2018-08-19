
var fs = require('fs');

import path from 'path'
import { remote } from 'electron'


import { connect } from 'trilogy'
  

const dsFolder = 'database'
const dbFilename = path.join(remote.app.getPath('userData'), dsFolder + '/invoices.sqlite')

var db = null//= create(dbFilename, {  client: 'sql.js'})
var invoicesModel = null

async function initModel() {
  invoicesModel = await db.model('invoices', {
    invoiceClient: String,
    invoiceNumber: String,
    invoiceDate: Date,
    invoiceLines: Array,
    invoiceTotal: String,
    id: 'increments',  // special type, primary key

  })
  await invoicesModel.create({
    invoiceClient: 'John Doe',
    invoiceNumber: '23444',
    invoiceDate: new Date('May 23, 2016'),
    invoiceTotal: '500 $',
    invoiceLines: [
      'Game of the Year',
      'Best Multiplayer Game',
      'Best ESports Game'
    ]
  })

  // const invoiceData = await invoicesModel.findOne({ invoiceNumber: '23444' })

  return invoicesModel
}




// =======================STATE======================
const state = {
  db: null,
  invoiceModel: null,
  invoices: []
}

// =======================GETTERS======================
const getters = {}

// =======================MUTATIONS======================
const mutations = {

  setInvoices(state, data) {
    state.invoices = data;
  },
}

// =======================ACTIONS======================
const actions = {

  async initDB({ commit, state }) {

    if (!db) db = await connect(dbFilename, { client: 'sql.js' })
    await initModel()
    return true

    // return new Promise((resolve, reject) => {
    //   if (!db) db = create(dbFilename, { client: 'sql.js' })
    //   initModel().then((model) => {
    //     resolve(true)
    //   });
    // })


  },

  async getInvoices({ commit, state, dispatch }) {
    await dispatch("initDB")
    const query = db.knex('invoices').select('*')
    var data = await db.raw(query, true)
    commit("setInvoices", data)
    return true


    // return new Promise((resolve, reject) => {
    //   dispatch("initDB").then(() => {
    //     const query = db.knex('invoices').select('*')
    //     db.raw(query, true).then(data => {
    //       commit("setInvoices", data)
    //       resolve(true)
    //     })
    //   })
    // })


  },
}



// =======================EXPORT======================
export default {
  state,
  getters,
  mutations,
  actions
}