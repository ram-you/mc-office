//  
//  KNEX Schema Building
//

module.exports = function accounts(table) {
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



  table.integer('currency_id').unsigned().notNullable();
  table.foreign('currency_id').references('id').inTable('currencies');

  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');
}