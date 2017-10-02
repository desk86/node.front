window.onload = function(){
  var session = getCookie("node_session");
  if (!session) window.location.href = "login.html";
  onPageStart();
  //bindDefaults();
};

var node_globals = {
  host_name : "localhost:1997/"
};

var global_parent = 0;
var defaultNode = {
  id : window.global_parent,
  content : {
    title : "desk86 Academy",
    des : "Open Education For Everyone"
  }
};
var currentNode = defaultNode;
var defaultProfile = {
  id : "1011",
  name : "Abu Sufian",
  image : "451eaf4e5fevb.png"
}

function bindDefaults(){
  var xhttp;
  console.log("Connecting...");
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if (this.readyState ==4 && this.status == 200){
      onNodeReceive(this);
    }
  }
  xhttp.open("POST", "http://"+window.node_globals.host_name+"node", true);
  xhttp.send("request=detail&session="+getCookie("node_session")
  +"&node="+getCookie("node"));
}

function onNodeReceive(xhttp){
  var data = JSON.parse(xhttp.response);
  window.defaultNode.content = data.content;
}

var myApp = angular.module("myApp", []);

myApp.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

var myController = function ($http, $scope) {
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
        url : "http://"+window.node_globals.host_name+"synapse",
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
      url : "http://"+window.node_globals.host_name+"node",
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
    //window.global_parent = nodeToOpen.id;
    $scope.parent = nodeToOpen.id;
    $scope.locationList.push(nodeToOpen);
    $scope.currentNode = nodeToOpen;
    if (nodeToOpen.id == window.global_parent)
      $scope.locationList = [];
    $http({
      method : "GET",
      url : "http://"+window.node_globals.host_name+"node",
      params : {
        session : getCookie("node_session"),
        request : "list",
        parent : nodeToOpen.id}
    })
    .then(function(response){
      //console.log(response);
      if (response.data == "error"){
        console.log("error response");
        resetToLogin();
      }
      $scope.nodes = response.data;
    });
    $http({
      method : "GET",
      url : "http://"+window.node_globals.host_name+"synapse",
      params : {
        session : getCookie("node_session"),
        request : "list",
        node : nodeToOpen.id}
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
  $scope.onInit = function(){
    window.global_parent = getCookie("node");
    window.defaultNode.id = window.global_parent;
    $scope.defaultNode = window.defaultNode;
    $scope.parent = window.global_parent;
    $scope.locationList = [];
    $http({
      method : "GET",
      url : "http://"+window.node_globals.host_name+"node",
      params : {
        session : getCookie("node_session"),
        request : "detail",
        node : window.global_parent}
    })
    .then(function(response){
      window.defaultNode = response.data;
      window.currentNode = response.data;
      $scope.currentNode = response.data;
      $scope.defaultNode = response.data;
      $scope.openChild(window.currentNode);
    });
  }
  $scope.onInit();
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
