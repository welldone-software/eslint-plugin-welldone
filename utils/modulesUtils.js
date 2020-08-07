const path = require('path');
const fs = require('fs');

const firstCharNotLetterRegex = /^\W+/;
const firstSlashAndAfterRegex = /\/.*$/;
const rootAliasRegex = /^~\//; // TODO: make part of config options, after refactoring plugin

const cachedModulesForPkg = {};

module.exports = {
  getModuleNameFromPath(filePath, { modulesMapping }) {
    const moduleEntry = Object.entries(modulesMapping).find(([, modulePath]) =>
      filePath.startsWith(modulePath)
    );
    return moduleEntry && moduleEntry[0];
  },

  getModuleNameFromImportRequest(importRequest) {
    return importRequest
      .replace(rootAliasRegex, '')
      .replace(firstCharNotLetterRegex, '')
      .replace(firstSlashAndAfterRegex, '');
  },

  getModuleImportPathPart(importRequest) {
    const match = importRequest
      .replace(rootAliasRegex, '')
      .match(firstSlashAndAfterRegex);
    return match && match[0];
  },

  getModulesMappingForPkg({ modulesDir }) {
    if (!cachedModulesForPkg[modulesDir]) {
      if (!fs.existsSync(modulesDir)) {
        return;
      }
      cachedModulesForPkg[modulesDir] = fs
        .readdirSync(modulesDir)
        .reduce((result, moduleName) => {
          result[moduleName] = path.join(modulesDir, moduleName);
          return result;
        }, {});
    }
    return cachedModulesForPkg[modulesDir];
  },

  getModuleLevel(
    moduleName,
    { modulesMapping, modulesLevels, middleModulesLevel }
  ) {
    if (modulesLevels[moduleName]) {
      return modulesLevels[moduleName];
    }

    if (modulesMapping[moduleName]) {
      return middleModulesLevel;
    }

    return -1;
  },

  isRelative(rawImportRequest) {
    return rawImportRequest[0] === '.'
  }
};
