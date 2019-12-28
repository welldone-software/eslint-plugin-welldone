const path = require('path');
const fs = require('fs');

const firstCharNotLetterRegex = /^\W+/;
const firstSlashAndAfterRegex = /\/.*$/;

const cachedModulesForPkg = {};

module.exports = {
  getModuleNameFromPath(filePath, {modulesMapping}) {
    const moduleEntry = Object.entries(modulesMapping)
      .find(([, modulePath]) => filePath.startsWith(modulePath));
    return moduleEntry && moduleEntry[0];
  },

  getModuleNameFromImportRequest(importRequest) {
    return importRequest
      .replace(firstCharNotLetterRegex, '')
      .replace(firstSlashAndAfterRegex, '')
  },

  getModuleImportPathPart(importRequest) {
    const match = importRequest.match(firstSlashAndAfterRegex);
    return match && match[0]
  },

  getModulesMappingForPkg(pkg) {
    if (!cachedModulesForPkg[pkg]) {
      const pkgDirName = path.dirname(pkg)
      const pathWithSrc = path.join(pkgDirName, 'src');
      const modulesPath = fs.existsSync(pathWithSrc) ? pathWithSrc : pkgDirName;
      cachedModulesForPkg[pkg] = fs.readdirSync(modulesPath).reduce((result, moduleName) => {
        result[moduleName] = path.join(modulesPath, moduleName);
        return result;
      }, {});
    }
    return cachedModulesForPkg[pkg];
  },

  getModuleLevel(moduleName, {modulesMapping, modulesLevels, middleModulesLevel}) {
    if (modulesLevels[moduleName]) {
      return modulesLevels[moduleName];
    }

    if (modulesMapping[moduleName]) {
      return middleModulesLevel;
    }

    return -1;
  }
}
