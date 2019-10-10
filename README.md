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
    "welldone/rule-name": 2
  }
}
```

## Supported Rules

- Fill in provided rules here
