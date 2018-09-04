//  module.exports = {
//   id: 'increments', // special type, primary key
//   invoiceClient: String,
//   invoiceNumber: String,
//   invoiceDate: Date,
//   invoiceLines: Array,
//   invoiceTotal: String,


//  };




module.exports = function invoices(table) {
  table.increments('id').primary();
  table.string('invoice_number').notNullable();

  table.string('po_number').comment('This is the Purchase Order Number');
  table.date('invoice_date');
  table.date('due_date');

  table.integer('is_amount_discount');
  table.text('invoice_footer');

  table.decimal('amount', 13, 2);


  

  table.timestamps(true, true);


  


  table.integer('client_id').unsigned().notNullable();
  table.foreign('client_id').references('id').inTable('clients');


  table.integer('account_id').unsigned().notNullable();
  table.foreign('account_id').references('id').inTable('accounts');

  table.integer('invoice_status_id').unsigned().notNullable();
  table.foreign('invoice_status_id').references('id').inTable('invoice_statuses');

  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');
}