'use strict';

var utils = require('../utils/utils');

//------------------------------------------------------------------------------
// General - use get and set
//------------------------------------------------------------------------------

module.exports = function(context) {

  var message = 'Use get/set';

  var report = function(node) {
    context.report(node, message);
  };

  var avoidedProperties = [
    'get',
    'set',
    'getProperties',
    'setProperties',
    'getWithDefault',
  ];

  return {
    MemberExpression: function(node) {
      if (
        utils.isIdentifier(node.property) &&
        avoidedProperties.indexOf(node.property.name) > -1
      ) {
        report(node.property);
      }
    }
  };

};
