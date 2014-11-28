(function(){
  var app = angular.module('webapp', [ ] );

  app.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
  });

  app.controller('RotationController', function(){
    this.rotations = [null];

    this.isAxis = function(index, whichOne) {
      return this.rotations[index] === whichOne;
    };

    this.setAxis = function(index, whatAxis) {
      this.rotations[index] = whatAxis;
      this.results = calculateDirections(this.rotations);
    };

    this.addRot = function() {
      this.rotations.length++;
    };

    this.removeRot = function(index) {
      if(this.rotations.length > 1) {
        this.rotations.splice(index, 1);
        this.results = calculateDirections(this.rotations);
      } else {
        this.rotations[index] = null;
        this.results = [[],[],[]];
      };
    };

    function calculateMatrix(axis, rotNu) {
      if(axis === 1) {
        return [[nerdamer('1'), nerdamer('0'), nerdamer('0') ],
                 [nerdamer('0'), nerdamer('cos('+'q'+(rotNu + 1).toString()+')'), nerdamer('-sin('+'q'+(rotNu + 1).toString()+')')],
                 [nerdamer('0'), nerdamer('sin('+'q'+(rotNu + 1).toString()+')'), nerdamer('cos('+'q'+(rotNu + 1).toString()+')')]];
      } else if(axis === 2) {
        return [[nerdamer('cos('+'q'+(rotNu + 1).toString()+')'), nerdamer('0'), nerdamer('sin('+'q'+(rotNu + 1).toString()+')')],
                 [nerdamer('0'), nerdamer('1'), nerdamer('0')],
                 [nerdamer('-sin('+'q'+(rotNu + 1).toString()+')'), nerdamer('0'), nerdamer('cos('+'q'+(rotNu + 1).toString()+')')]];
      } else {
        return [[nerdamer('cos('+'q'+(rotNu + 1).toString()+')'), nerdamer('-sin('+'q'+(rotNu + 1).toString()+')'), nerdamer('0')],
                 [nerdamer('sin('+'q'+(rotNu + 1).toString()+')'), nerdamer('cos('+'q'+(rotNu + 1).toString()+')'), nerdamer('0')],
                 [nerdamer('0'), nerdamer('0'), nerdamer('1')]];
      };
    };

    this.results = [[],[],[]];

    function calculateDirections(rotations) {
      var m1 = calculateMatrix(rotations[0],0);
      for(var a = 1; a < rotations.length; a++) {
        var m2 = calculateMatrix(rotations[a], a);

        var n = m1[0].length;
        var m = m1.length;
        var p = m2[0].length;

        var intermediate = [];
        for (var i = 0; i < m; i++) {
          intermediate[i] = [];
          for (var j = 0; j < p; j++) {
            var sum = nerdamer('0');
            for (var k = 0; k < n; k++) {
              sum = nerdamer('(' + sum.text() + ')+(' + m1[i][k].text() + ')*(' + m2[k][j].text() + ')');
            }
            intermediate[i][j] = sum;
          };
        };
        m1 = intermediate;
      };

      var results =  [[],[],[]];
      for(var i = 0; i < 3; i++) {
        for(var q = 0; q < 3; q++) {
          results[i][q] = m1[i][q].latex();
        };
      };

      return results;
    };
  });
})();
