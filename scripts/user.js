function onSignOut(){
  setCookie("node_session", "", 0);
  setCookie("node", "", 0);
  window.location.href = "login.html";
}
