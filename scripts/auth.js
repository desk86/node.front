function onActionLogin(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var xhttp;
    console.log("logging in...");
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if (this.readyState ==4 && this.status == 200){
        onPostResponse(this);
      }
    }
    xhttp.open("POST", "http://localhost:1997/auth", true);
    xhttp.send("email="+email+"&password="+password);
    return true;
};
function onPostResponse(xhttp){
  var data = JSON.parse(xhttp.response);
  console.log(data);
  if (data === "null"){
      document.getElementById("msg").innerHTML = "Login Error";
  }
  else {
    setCookie("node_session", data.session, 7);
    setCookie("node", data.node, 7);
    window.location.href = "index.html";
  }
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
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var cooked = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log(cooked);
    document.cookie = cooked;
};
window.onload = function(){
    var session = getCookie("node_session");
    console.log(session);
    if (session){
      window.location.href = "index.html";
    }
};
