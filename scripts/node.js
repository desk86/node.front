console.log("Hello!");
window.onload = function(){

};

var global_parent = 0;

var myApp = angular.module("myApp", []);

myApp.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

var myController = function ($http, $scope) {
  $scope.parent = window.global_parent;
  $scope.locationList = [];
  $scope.openFromLocation = function(index, location){
    $scope.openChild(location);
    var newList = $scope.locationList.slice(0, index);
    $scope.locationList = newList;
  };
  $scope.addSynapse = function(newSynapse){
    $http({
        method : "POST",
        url : "http://localhost:1997/synapse",
        params : {request : "insert", synapse : newSynapse, node : window.global_parent}
      })
    .then(function(response){
      $scope.synapses.push(response.data);
      $scope.newSynapse = {};
    });
  };
  $scope.addNode = function(newNode){
    $http({
      method : "POST",
      url : "http://localhost:1997/node",
      params : {request : "insert", node : newNode, parent : window.global_parent}
    })
    .then(function(response){
      $scope.nodes.push(response.data);
      $scope.newNode = {};
    });
  };
  $scope.openChild = function(nodeId){
    window.global_parent = nodeId;
    $scope.parent = nodeId;
    $scope.locationList.push(window.global_parent);
    if (nodeId == 0)
      $scope.locationList = [];
    $http({
      method : "GET",
      url : "http://localhost:1997/node",
      params : {request : "list", parent : window.global_parent}
    })
    .then(function(response){
      $scope.nodes = response.data;
    });
    $http({
      method : "GET",
      url : "http://localhost:1997/synapse",
      params : {request : "list", node : window.global_parent}
    })
    .then(function(response){
      $scope.synapses = response.data;
    });
  };
  $scope.openChild(window.global_parent);
};

myApp.controller("myController", myController);

//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
