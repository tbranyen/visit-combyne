/**
 * Recursively traverses nodes returning those passing the truth function.
 *
 * @param {Array} nodes
 * @param {Function} test
 * @returns {Array} An array of nodes.
 */
function recurse(nodes, test) {
  var memo = [];

  if (!nodes) {
    return memo;
  }

  nodes.forEach(function(node) {
    if (!node) {
      return;
    }

    if (test(node)) {
      memo.push(node);
    }

    if (node.conditions) {
      memo.push.apply(memo, recurse(node.conditions.map(function(node) {
        return node.value;
      }), test, memo));
    }

    if (node.els) {
      memo.push.apply(memo, recurse(node.els.nodes.map(function(node) {
        if (node.type === "PartialExpression") {
          memo = memo.concat(recurse([node], test));
        }
      }).filter(Boolean), test, memo));

      // Recurse over node.els to detect nested conditional expressions
      memo.push.apply(memo, recurse([node.els], test));
    }

    if (node.elsif) {
      memo.push.apply(memo, recurse(node.elsif.nodes.map(function(node) {
        if (node.type === "PartialExpression") {
          memo = memo.concat(recurse([node], test));
        }
      }).filter(Boolean), test, memo));

      // Recurse over node.elsif to detect nested conditional expressions
      memo.push.apply(memo, recurse([node.elsif], test));
    }

    memo.push.apply(memo, recurse(node.nodes, test, memo));
  });

  return memo;
}

// Support AMD and CJS.
if (typeof define === 'function' && typeof define.amd === 'object') {
  define(function() { return recurse; });
}
else if (module && module.exports) {
  module.exports = recurse;
}
