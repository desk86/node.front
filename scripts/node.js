console.log("Hello!");
window.onload = function(){
  var session = getCookie("node_session");
  if (!session) window.location.href = "login.html";
  onPageStart();
};

var global_parent = 0;
var defaultNode = {
  id : window.global_parent,
  content : {
    title : "léMIPS Academy",
    des : "Open Education For Everyone"
  }
};
var currentNode = defaultNode;
var defaultProfile = {
  id : "1011",
  name : "Abu Sufian",
  image : "451eaf4e5fevb.png"
}

var myApp = angular.module("myApp", []);

myApp.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

var myController = function ($http, $scope) {
  $scope.defaultNode = window.defaultNode;
  $scope.parent = window.global_parent;
  $scope.locationList = [];
  $scope.openFromLocation = function(node){
    $scope.locationList = $scope.locationList.splice(0,
        $scope.locationList.indexOf(node));
      $scope.openChild(node);
    //var newList = $scope.locationList.slice(0, index);
    //$scope.locationList = newList;
  };
  $scope.addSynapse = function(newSynapse, synapseType){
    newSynapse.content.type = synapseType;
    $http({
        method : "POST",
        url : "http://192.168.50.113:1997/synapse",
        params : {
          session : getCookie("node_session"),
          request : "insert",
          synapse : newSynapse,
          node : window.global_parent}
      })
    .then(function(response){
      var synapse = response.data;
      synapse.htm = renderSynapse(synapse)
      $scope.synapses.push(synapse);
      $scope.newSynapse = {};
    });
  };
  $scope.addNode = function(newNode){
    $http({
      method : "POST",
      url : "http://192.168.50.113:1997/node",
      params : {
        session : getCookie("node_session"),
        request : "insert",
        node : newNode,
        parent : window.global_parent}
    })
    .then(function(response){
      $scope.nodes.push(response.data);
      $scope.newNode = {};
    });
  };
  $scope.openChild = function(nodeToOpen){
    window.global_parent = nodeToOpen.id;
    $scope.parent = nodeToOpen.id;
    $scope.locationList.push(nodeToOpen);
    $scope.currentNode = nodeToOpen;
    if (nodeToOpen.id == 0)
      $scope.locationList = [];
    $http({
      method : "GET",
      url : "http://192.168.50.113:1997/node",
      params : {
        session : getCookie("node_session"),
        request : "list",
        parent : window.global_parent}
    })
    .then(function(response){
      console.log(response);
      if (response.data == "error"){
        console.log("error response");
        resetToLogin();
      }
      $scope.nodes = response.data;
    });
    $http({
      method : "GET",
      url : "http://192.168.50.113:1997/synapse",
      params : {
        session : getCookie("node_session"),
        request : "list",
        node : window.global_parent}
    })
    .then(function(response){
      var tmp = response.data;
      var synapse;
      for (var i=0; i<tmp.length; i++){
        synapse = tmp[i];
        synapse.htm = renderSynapse(synapse);
      }
      $scope.synapses = tmp;
    });
  };
  $scope.onPreUpdateAction = function(){
    //Show Button
  }
  $scope.onActionUpdate = function(){
    //Hide Button
  }
  $scope.openChild(window.currentNode);
};

myApp.controller("myController", myController);

function resetToLogin(){
  setCookie("node_session", "",0);
  window.location.href = "login.html";
}

function renderSynapse(synapse){
  var view = "";
  switch (synapse.content.type) {
    case "message":
      view = "<h4>" + synapse.admin.name + "</h4>"
        + "<p>" + synapse.content.des + "</p>"
        + "<p class='stamp'>12 minutes ago</p>";
      return view;
    case "post":
      view = "<h4>" + synapse.content.title + "</h4>"
        + "<p>" + synapse.content.des + "</p>";
      return view;
    default:
    view = "<h4>" + synapse.admin.name + "</h4>"
      + "<p>" + synapse.content.des + "</p>"
      + "<p class='stamp'>12 minutes ago</p>";
    return view;
      break;
  }
  return view;
}

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
