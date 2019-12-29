# eslint-plugin-welldone

Prevent to use anything except import/export

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-welldone`:

```
$ npm install eslint-plugin-welldone --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-welldone` globally.

## Usage

Add `welldone` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["welldone"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "welldone/modules-engagement": "error",
  }
}
```

## Plugins
### Rules of Modules Engagement

([`welldone/modules-engagement`](./rules/modules-engagement))

This rule enforces Welldone's standard file structure.
[More details about the rule](https://welldone-software.gitbook.io/welldone-file-structure/modules/modules#rules-of-engagement)
can be found here.

### config:
These are the possible configs and their defaults for the rule:

```json5
{
  "rules": {
    "welldone/modules-engagement": ["error", {
      // provide a glob to only lint certain paths. F.E:
      //   glob": "/packages/!(common-package)/**/!(*.stories|*.test).js"
      "glob": null, 
      
      // path of modules under package.json's
      "modulesPath": "/src",
      
      // Levels to enforce imports between modules
      "modulesLevels": {'common': 1, 'shared': 1, 'app': 3},
      
      // Default level for other modules
      "middleModulesLevel": 2,
      
      // Allow importing from inner paths in modules. F.E:
      // "moduleInnerPaths": ['/components']
      "moduleInnerPaths": [],
      
      // Array of modules that can be used not only from their root path
      "ignoreInnerPathsForModules": ['common', 'shared']
    }],
  }
}
```

## Supported Rules

- Fill in provided rules here
