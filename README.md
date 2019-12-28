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

these are the possible options for the `welldone/modules-engagement` rule:

```json
{
  "rules": {
    "welldone/modules-engagement": ["error", {
      // provide a glob to only lint certain paths. F.E:
      //   glob": "/packages/!(common-package)/**/!(*.stories|*.test).js"
      "glob": null, 
      
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
