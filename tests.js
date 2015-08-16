'use strict';

var assert = require('assert');
var combyne = require('combyne');
var visitCombyne = require('./index');

describe('visit-combyne', function() {
  var template;

  describe('if-elseif conditionals', function() {
    beforeEach(function() {
      template = combyne('{%if case1%}1{%elsif case2%}2{%else%}3{%endif%}');
    });

    it('correctly recurses over all nodes in conditional chains', function() {
      var visitedNodes = {};

      // Count how many nodes of each type are visited
      visitCombyne(template.tree.nodes, function(node) {
        if ( ! visitedNodes[node.type] ) { visitedNodes[node.type] = 0; }
        visitedNodes[node.type]++;
      });

      assert.equal(visitedNodes.ConditionalExpression, 3,
        'finds three conditional nodes ("if", "elsif", "else")');
      assert.equal(visitedNodes.Property, 2,
        'finds two property nodes, "case1" and "case2"');
      assert.equal(visitedNodes.Text, 3,
        'finds three text nodes, "1", "2", "3"');
    });
  });
});
