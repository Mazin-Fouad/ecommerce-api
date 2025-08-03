"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hier kommt die Logik, um die Änderung durchzuführen.
    await queryInterface.addColumn("Users", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: true, // Wir erlauben, dass das Feld leer ist, da alte User noch keine Nummer haben.
    });
  },

  async down(queryInterface, Sequelize) {
    // Hier kommt die Logik, um die Änderung rückgängig zu machen.
    await queryInterface.removeColumn("Users", "phoneNumber");
  },
};
