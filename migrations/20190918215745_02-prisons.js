exports.up = function(knex) {
    return knex.schema.createTable('Prisons', prisons => {
      prisons.increments('prisonID');
  
      prisons
        .string('Prison_Name', 128)
        .notNullable()
        .unique();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  };