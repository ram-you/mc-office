var fs = require('fs');

import path from 'path'
import { remote } from 'electron'


import { connect } from 'trilogy' 

const dsFolder = 'database'
const dbFilename = path.join(remote.app.getPath('userData'), dsFolder + '/invoices.sqlite')

 var db=null
var invoicesModel = null

 async function initInvoicesModel() {
   
  invoicesModel =  await   db.model('invoices', {
    invoiceClient: String,
    invoiceNumber: String,
    invoiceDate: Date,
    invoiceLines: Array,
    invoiceTotal: String,
    id: 'increments', // special type, primary key

  })
  return invoicesModel
  
}

  function iniInvoicesData() {
 
    invoicesModel.create({
    invoiceClient: 'John Doe'+ Math.floor((Math.random() * 100) + 1),
    invoiceNumber: 'Invoice #' + Math.floor((Math.random() * 9000) + 1),
    invoiceDate: new Date(),
    invoiceTotal:   Math.floor((Math.random() * 9000) + 1)+' $',
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
  invoiceDB: null,
  invoicesModel: null,
  invoices: []
}

// =======================GETTERS======================
const getters = {}

// =======================MUTATIONS======================
const mutations = {
  
  setInvoicesModel(state, data) {
    state.invoicesModel = true;
  },
  setInvoices(state, data) {
    state.invoices = data;
  },
}

// =======================ACTIONS======================
const actions = {

async  initInvoicesDB({ commit, state }) {



    return new Promise(async (resolve, reject) => {

      if (!db) { 
      db= await  connect(dbFilename)
        
       }
      resolve(true)

    })


  },

  initInvoicesModels({ commit, state ,dispatch}) {


    return new Promise((resolve, reject) => {
      dispatch("initInvoicesDB").then(() => {
       
         
        initInvoicesModel().then(() => {
          commit("setInvoicesModel")
          resolve(true)
        });
      });
    })


  },

  getInvoices({ commit, state, dispatch }) {


    return new Promise((resolve, reject) => {

      dispatch("initInvoicesModels").then(() => { 
        const query = db.knex('invoices').select('*')
        db.raw(query, true).then(data => {
          commit("setInvoices", data)
          resolve(true)
        })
      })
    })


  },
}



// =======================EXPORT======================
export default {
  state,
  getters,
  mutations,
  actions
}