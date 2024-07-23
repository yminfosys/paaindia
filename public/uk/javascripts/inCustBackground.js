/////cookie Setting////
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
  }

  
  

  function setCookie(cname, cvalue, exdays) {
    if(cvalue.length > 0){
      $.post('/uk/setCookies',{cname:cname,cvalue:cvalue,expires:exdays*24*60*60*1000},function(data){
          console.log(data)
       })
     }else{
      $.post('/uk/clerCookies',{cname:cname},function(data){  console.log(data)})
     }
  }

var socket = io('//'+document.location.hostname+':'+document.location.port);

socket.on('finishRide', function (data) {
  var CustID=getCookie("CustID");
  if(CustID==data.CustID){
    $.post('/uk/finishAndFeedback',{CustID:data.CustID},function(data){ 
       console.log(data)
      })
      Android.disconnectForground(); 
  }
});


socket.on('RingWakup', function (data) {
    if(data.userID==getCookie("CustID")){
      Android.incomingCall();
      
  console.log("incoming Ring Tone")
  //alert(data.userID)
  
    }
  });