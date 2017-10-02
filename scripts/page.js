
function onPageStart(){
  console.log("Loadind Page...");
  document.getElementById("defaultOpen").click();
  //loadDoc("parts/editor.htm","id_div_editor");
}

function loadDoc(url, divId){
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      onPostResponse(this, divId);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function onPostResponse(xttp, divId){
  console.log(xttp);
  document.getElementById(divId).innerHTML = xttp.response;
}
