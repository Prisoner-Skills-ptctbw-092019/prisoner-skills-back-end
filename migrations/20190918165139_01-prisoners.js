exports.up = function(knex) {
    return knex.schema.createTable('Prisoners', prisoner => {
      prisoner.increments();
  
      prisoner.string('name', 128).notNullable();
      prisoner.string('skills').notNullable();
      prisoner.string('prisonID', 128).notNullable();
      prisoner.string('biography', 128).notNullable();
      prisoner.string('DOB', 128).notNullable();
      prisoner.string('releaseDate', 128).notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  };