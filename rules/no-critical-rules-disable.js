'use strict';

const disableRuleRegex = /^eslint-disable(?:-next-line|-line)?(?<disabledRuleIds>.*)/;
const query = 'Program';
const emptyOptions = {};
const defaultDefaultMessage = 'Are you sure you want to disable the critical rule "{{critical-rule-id}}"?';

const create = context => {
  const {
    rules: criticalRulesOptions,
    defaultMessage = defaultDefaultMessage,
  } = context.options[0] || {};

  const criticalRulesMessages = Object.entries(criticalRulesOptions || {})
    .reduce((result, [criticalRuleId, criticalRuleOptions]) => {
      if (typeof criticalRuleOptions === 'string') {
        result[criticalRuleId] = criticalRuleOptions;
      }

      if (criticalRuleOptions === true) {
        result[criticalRuleId] = defaultMessage.replace(new RegExp('{{critical-rule-id}}', 'g'), criticalRuleId);
      }

      return result;
    }, {});

  return {
    [query](node){
      node.comments.forEach(comment => {
        const value = comment.value.trim();
        const result = disableRuleRegex.exec(value);

        const disabledRuleIds = result && result.groups.disabledRuleIds
          .trim()
          .split(',')
          .map(rule => rule.trim());

        if (!result) {
          return;
        }

        disabledRuleIds.forEach(disabledRuleId => {
          const criticalRuleMessage = criticalRulesMessages[disabledRuleId];
          if (!criticalRuleMessage) {
            return;
          };

          const ruleIdColumnStartInComment = comment.loc.start.column + comment.range.length + comment.value.indexOf(disabledRuleId);

          context.report({
            loc: {
              start: {
                ...comment.loc.start,
                column: ruleIdColumnStartInComment,
              },
              end: {
                ...comment.loc.end,
                column: ruleIdColumnStartInComment + disabledRuleId.length,
              },
            },
            message: criticalRuleMessage,
          });
        });
      });
    },
  }
};

module.exports = {
  create,
  meta: {
    type: 'problem',
    docs: {
      url: 'https://github.com/welldone-software/eslint-plugin-welldone/blob/master/docs/no-critical-rules-disable.md',
      category: 'Disabling of critical rules',
      recommended: false
    },
    fixable: null,
    schema: [
      {
        "type": "object",
        "additionalProperties": false,
        "required": ["rules"],
        "properties": {
          "rules": {
            "type": "object",
            "additionalProperties": {
              "type": ["string", "boolean"]
            }
          },
          "defaultMessage": {
            "type": "string"
          }
        }
      }
    ]
  },
};
