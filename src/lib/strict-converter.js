var _ = require('underscore');

/**
 * Given the content and an AST node, convert the return statement
 * to be a module.export
 * @param {String} content The code
 * @param {Object} node The AST node
 * @returns {String} The converted content
 */
module.exports = function convert(content, node){
  var defineFunction = node.body[0].expression.arguments[0].body;
  var nContent = '';
  // If use strict is the first node, leave it be.
  var firstNode = defineFunction.body[0];
  _.each(defineFunction.body, function(n) {
    nContent += content.substring(n.range[0],n.range[1]);
  });
  return nContent;  
};

function isUseStrict(node){
  return node.type === 'ExpressionStatement' && node.expression.value === 'use strict';
}
