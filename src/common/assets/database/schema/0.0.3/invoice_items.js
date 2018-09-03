//  module.exports = {
//   id: 'increments', // special type, primary key
//   invoiceClient: String,
//   invoiceNumber: String,
//   invoiceDate: Date,
//   invoiceLines: Array,
//   invoiceTotal: String,


//  };




module.exports = function invoice_items(table) {
  table.increments('id').primary();
  table.string('notes');
  table.decimal('cost', 15, 4);
  table.decimal('qty', 15, 4).defaultTo('0.0000');

  table.decimal('discount', 13, 2);

  table.string('product_key');


  table.timestamps(true, true);


  table.integer('invoice_id').unsigned().notNullable();
  table.foreign('invoice_id').references('id').inTable('invoices');

  table.integer('product_id').unsigned().notNullable();
  table.foreign('product_id').references('id').inTable('products');

  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');
}