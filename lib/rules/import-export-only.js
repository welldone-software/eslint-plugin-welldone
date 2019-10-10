"use strict";
const path = require("path");

const query =
  "Program > :not(ImportDeclaration, ImportDeclaration *, ExportDefaultDeclaration, ExportDefaultDeclaration *, ExportNamedDeclaration, ExportNamedDeclaration *)";
const fileName = "index.js";
const message = "Only import/export statements is allowed in this file";

module.exports = {
  meta: {
    docs: {
      description: "Prevent to use anything except import/export statements",
      category: "Fill me in",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create: function(context) {
    return {
      [query](node) {
        if (path.basename(context.getFilename()) === fileName) {
          context.report({ node, message });
        }
      }
    };
  }
};
