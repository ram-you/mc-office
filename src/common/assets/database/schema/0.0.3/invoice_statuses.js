
//  module.exports = {
//   id: 'increments', // special type, primary key
//   invoiceClient: String,
//   invoiceNumber: String,
//   invoiceDate: Date,
//   invoiceLines: Array,
//   invoiceTotal: String,

  
//  };

 
 

module.exports = function invoice_statuses(table) {
  table.increments('id').primary();
  table.string('name'); 
}