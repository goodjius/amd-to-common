var _ = require('underscore');

/**
 *
 * @param node
 * @constructor
 */
var AMDNode = function(node){
  this.node = node;
};

/**
 * Determine whether a node represents a requireJS 'define' call.
 * @param {Object} node AST node
 * @returns {Boolean} true if define call, false otherwise
 */
AMDNode.prototype.isDefine = function(){
  var node = this.node;
  if(!node || !node.type || node.type !== 'ExpressionStatement'){
    return false;
  }
  if(node.expression.type !== 'CallExpression'){
    return false;
  }
  return Boolean(node.expression.callee.name === 'define');
};

/**
 * Determine whether a node is an AMD style define call
 * This detects code in the format:
 *    define(['req1', 'req2'], function(Req1, Req1) {})
 * and 
 *    define(function(require, exports, module){})
 * if isWrapper is true, it will true only if it's format: define(function(require, exports, module){})
 * @param {Object} node AST Node
 * @returns {boolean} true if AMD style, false otherwise
 */
AMDNode.prototype.isAMDStyle = function(isWrapper){
  if(!this.isDefine()){
    return false;
  }
  var defineArguments = this.node.expression.arguments;
  if(!isWrapper && defineArguments[0].type === 'ArrayExpression' &&  defineArguments[1].type === 'FunctionExpression'){
    return true;
  } else if (defineArguments[0].type === 'FunctionExpression') {
    return true;
  } else {
    return false;
  }
};

/**
 * Given an AMD style define, get a map of dependencies
 * For example,
 *    define(['req1', 'req2'], function(Req1, Req1) {})
 * Produces:
 *    {'req1': Req1, 'req2': Req2}
 * @param {Object} node AST Node
 * @returns {Object} An object map of dependencies
 */
AMDNode.prototype.getDependencyMap = function(){
  var arrayDependencies = this.getArrayDependencies();
  var dependencyIdentifiers = this.getDependencyIdentifiers();
  return _.object(_.zip(arrayDependencies, dependencyIdentifiers));
};

/**
 * Get the dependencies from the array
 * @param {Object} node AST Node
 * @returns {String[]} A list of dependency strings
 */
AMDNode.prototype.getArrayDependencies = function(){
  return _.map(this.node.expression.arguments[0].elements, function(element){
    return element.value;
  });
};

AMDNode.prototype.getArrayNode = function(){
  return this.node.expression.arguments[0];
};

AMDNode.prototype.getFunctionNode = function(){
  return this.node.expression.arguments[1];
};

/**
 * Get the dependencies identifiers from the array
 * @param {Object} node AST Node
 * @returns {String[]} A list of dependency strings
 */
AMDNode.prototype.getDependencyIdentifiers = function(){
  return _.map(this.node.expression.arguments[1].params, function(param){
    return param.name;
  });
};

module.exports = AMDNode;
