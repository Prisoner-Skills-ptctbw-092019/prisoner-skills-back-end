exports.up = function(knex) {
    return knex.schema.createTable('Prisons', prisons => {
      prisons.increments();
  
      prisons
        .string('Prison_Name', 128)
        .notNullable()
        .unique();
      prisons
        .string('prisonID').unique().notNullable();
      prisons
        .string('description').notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('Prisons');
  };