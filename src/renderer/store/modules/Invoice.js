 

import db from "../models";
var Invoices = db.Invoices.model



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
  initDB(state, data) {
    state.db = data;
  },
  initModel(state, data) {
    state.invoiceModel = data;
  },
  setInvoices(state, data) {
    state.invoices = data;
  },
}

// =======================ACTIONS======================
const actions = {
 
  getInvoices({ commit, state }) {
    return new Promise((resolve, reject) => {
      Invoices.find({}, function (err, docs) {
        commit("setInvoices", docs)
        return Promise.resolve();
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