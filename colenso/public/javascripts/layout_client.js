function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

$(document).ready(function(){

  if (getCookie("user") === "") {
    $("#logoutButton").hide();
    $("#loginButton").show();
    $("#username").show();
  } else {
    $("#logoutButton").show();
    $("#loginButton").hide();
    $("#username").hide();
  }

});

$("#loginButton").click(function(){
  var name = $("#username").val()
  document.cookie = "user=" + name + ";path=/";
  $("#loginButton").hide();
  $("#logoutButton").show();
  $("#username").hide();
  $("#username").val("");

});

$("#logoutButton").click(function(){
  document.cookie = "user=;expires=0";
  $("#logoutButton").hide();
  $("#loginButton").show();
  $("#username").show();
});
