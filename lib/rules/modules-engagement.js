const path = require('path');
const fs = require('fs');
const findUp = require('find-up');

const {isRelative} = require('../utils');
const {
  getModulesMappingForPkg,
  getModuleNameFromPath,
  getModuleNameFromImportRequest,
  getModuleImportPathPart,
  getModuleLevel
} = require('../modulesHelpers');

function isRelativeModuleImport(sourceFilePath, importRequest, {modulesMapping}) {
  const relativeBackImport = importRequest.startsWith('..');
  if (!relativeBackImport) {
    return;
  }

  const importedPath = path.resolve(sourceFilePath, importRequest);
  const targetModuleName = getModuleNameFromPath(sourceFilePath, {modulesMapping});

  return !!targetModuleName;
}

function isCorrectModuleLevelImport(sourceFilePath, importRequest, {modulesMapping, modulesLevels, middleModulesLevel}) {
  const sourceModuleName = getModuleNameFromPath(sourceFilePath, {modulesMapping});
  const sourceModuleLevel = getModuleLevel(sourceModuleName, {modulesMapping, modulesLevels, middleModulesLevel});

  const targetModuleName = getModuleNameFromImportRequest(importRequest);
  const targetModuleLevel = getModuleLevel(targetModuleName, {modulesMapping, modulesLevels, middleModulesLevel});

  const isCorrectImportLevel = sourceModuleLevel >= targetModuleLevel;
  return isCorrectImportLevel;
}

function isCorrectModuleImportPath(importRequest, {modulesMapping, moduleInnerPaths}) {
  const targetModuleName = getModuleNameFromImportRequest(importRequest);
  if (!modulesMapping[targetModuleName]) {
    return true;
  }

  const importPath = getModuleImportPathPart(importRequest);
  return !importPath || moduleInnerPaths.includes(importPath);
}

const defaultOptions = {};
const defaultModulesLevels = {
  'app': 3,
  'common': 1,
  'shared': 1,
};
const defaultMiddleModulesLevel = 2;
const defaultModuleInnerPaths = [];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: 'https://github.com/welldone-software/eslint-plugin-welldone',
      category: 'Rules of engagement between modules',
      recommended: false
    },
    fixable: null,
    schema: [
      {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "modulesLevels": {
            "type": "object",
            "additionalProperties": true
          },
          "middleModulesLevel": {
            "type": "number"
          },
          "moduleInnerPaths": {
            "type": "array",
            "items": [],
            "additionalItems": {
              "type": "string"
            }
          }
        }
      }
    ]
  },

  create: function(context) {
    const sourceFilePath = context.getFilename();

    const closestPkgToSource = findUp.sync('package.json', {cwd: sourceFilePath, type: 'file'});
    const modulesMapping = getModulesMappingForPkg(closestPkgToSource);

    const {
      modulesLevels = defaultModulesLevels,
      middleModulesLevel = defaultMiddleModulesLevel,
      moduleInnerPaths = defaultModuleInnerPaths
    } = context.options[0] || defaultOptions;

    return {
      'Program > ImportDeclaration'(node) {
        const importRequest = node.source.value;

        if (isRelative(importRequest)) {
          if (isRelativeModuleImport(sourceFilePath, importRequest, {modulesMapping})) {
            context.report({node, message: 'Import between modules should be absolute. expected: `import {x} from \'module\'`'});
          }
          return;
        }

        if (!isCorrectModuleLevelImport(sourceFilePath, importRequest, {modulesMapping, modulesLevels, middleModulesLevel})) {
          context.report({node, message: 'A module can only references items in modules at the same or lower levels.'});
        }

        if (!isCorrectModuleImportPath(importRequest, {modulesMapping, moduleInnerPaths})) {
          context.report({
            node,
            message: [
              'A module should be accessed only through it\'s index.js or configured "moduleInnerPaths".',
              'Expected: `import {x} from \'module\'` or `import {x} from \'module/allowed/path\'`'
            ].join(' ')
          });
        }
      }
    };
  }
};
