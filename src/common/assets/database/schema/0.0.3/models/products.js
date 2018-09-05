//  
//  KNEX Schema Building
//

module.exports = function products(table) {
  table.increments('id').primary();
  table.string('invoiceClient');
  table.string('invoiceNumber');
  table.date('invoiceDate');
  table.string('invoiceLines')
  table.string('invoiceTotal');
  table.timestamps(true, true);
}