"use strict";
const path = require("path");
const fs = require("fs");

const TOP_LEVEL = 3;
const MID_LEVEL = 2;
const BOTTOM_LEVEL = 1;
const NPM_LEVEL = 0;
const SOURCE_DIR = "src";
const SOURCE_PATH = [process.env.PWD, SOURCE_DIR].join(path.sep);

const query = "Program > ImportDeclaration";

function isFile(location) {
  return fs.existsSync(location) && fs.lstatSync(location).isFile();
}

function getModuleName(location) {
  const dir = isFile(location) ? path.dirname(location) : location;
  const arr = dir.split(path.sep);

  return arr.slice(arr.indexOf(SOURCE_DIR))[1];
}

function getImportAbsPath(node, context) {
  const key = node.source.raw.slice(1, -1);

  if (key.startsWith("~")) {
    return [SOURCE_PATH, key.slice(2)].join(path.sep);
  }

  if (key.startsWith(".")) {
    return path.join(path.dirname(context.getFilename()));
  }

  return null;
}

function getLevelOfModule(location) {
  if (!location) {
    return NPM_LEVEL;
  }

  const moduleName = getModuleName(location);

  switch (moduleName) {
    case "app":
      return TOP_LEVEL;
    case "common":
      return BOTTOM_LEVEL;
    case "shared":
      return BOTTOM_LEVEL;
    default:
      return MID_LEVEL;
  }
}

function checkLevelCorrectness(node, context) {
  const currentModuleLevel = getLevelOfModule(context.getFilename());
  const targetModuleLocation = getImportAbsPath(node, context);
  const targetModuleLevel = getLevelOfModule(targetModuleLocation);

  if (targetModuleLevel > currentModuleLevel) {
    context.report({
      node,
      message:
        "A module can only references items in modules at the same or lower levels"
    });
  }
}

function checkModuleCorrectExpose(node, context) {
  const currentModuleLevel = getLevelOfModule(context.getFilename());
  const targetModuleLocation = getImportAbsPath(node, context);
  const targetModuleLevel = getLevelOfModule(targetModuleLocation);

  if (targetModuleLevel >= 2 && currentModuleLevel !== targetModuleLevel) {
    if (
      targetModuleLocation !==
      path.join(SOURCE_PATH, getModuleName(targetModuleLocation))
    ) {
      context.report({
        node,
        message:
          "All module should expose all it's shared items by explicitly exporting them from it's top level index.js file. Exception: shared."
      });
    }
  }
}

module.exports = {
  meta: {
    docs: {
      description: "Rules of engagement between modules",
      category: "Fill me in",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create: function(context) {
    return {
      [query](node) {
        checkLevelCorrectness(node, context);
        checkModuleCorrectExpose(node, context);
      }
    };
  }
};
