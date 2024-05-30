const { defineConfig } = require("cypress");
const {
  addMatchImageSnapshotPlugin,
} = require("cypress-image-snapshot/plugin");

module.exports = defineConfig({
  projectId: '24nmiw',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      addMatchImageSnapshotPlugin(on, config);
    },
  },
});
