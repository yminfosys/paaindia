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
      $.post('/india/setCookies',{cname:cname,cvalue:cvalue,expires:exdays*24*60*60*1000},function(data){
          console.log(data)
       })
     }else{
      $.post('/india/clerCookies',{cname:cname},function(data){  console.log(data)})
     }
  }

  function setDytyCookie(cname, cvalue, exdays) {
    if(cvalue.length > 0){
      $.post('/india/setCookies',{cname:cname,cvalue:cvalue,expires:exdays*60*1000},function(data){
          console.log(data)
       })
     }else{
      $.post('/india/clerCookies',{cname:cname},function(data){  console.log(data)})
     }
  }


$( document ).ready(function() {
///////Internet Connection and Data /////
setInterval(function(){ 
      if(navigator.onLine){
        //alert('online');
        $.post('/india/checkInternetData',{ },function(data){
          console.log(data);
          
      }).fail(function(response) {
        //alert('Error: ' + response.responseText);
        console.log("InternetError",response);
      Android.playInternetError();
      //Android.startRingtone();
      });
      } else {
        //alert('offline');
          console.log("Offline");
        Android.playInternetError();
        //Android.startRingtone();
      }
    },1000*15);
  });


 ///////Handel Socket io  parameter/////// 
 var socket = io('//'+document.location.hostname+':'+document.location.port);
 var thotting=0;
  socket.on('preRideinCommingCall', function (data) {
  if(data.pilotID==getCookie("pilotID")){
    console.log("call Neeed to be accept");
    console.log("inCommingCall data",data);
    if(thotting==0){
      thotting=1;
      setTimeout(function(){
        thotting=0;
      }, 1000*15);
    $.post('/india/preRideAutoAccepeCall',{
        pilotID:data.pilotID,
        CustID:data.CustID,                        
      },function(dat){
        console.log("Call Accepted", dat);
         Android.startRingtone(); 
        
      });
    }

  }
  });
 /////Order Cancel by Customer/////
 socket.on('OrderCancelByCustomer', function (data) {
  if(data.pilotID==getCookie("pilotID")){
    //////Update Driver Location //////
    Android.startCanceltone();

  }
});


/////Order Cancel by Customer/////
socket.on('preRideTrackingPcktSend', function (data) {
  if(data.pilotID==getCookie("pilotID")){
    $.post('/india/preRideDriverTrackingdataPackErplay', {pilotID:data.pilotID}, function(data){
      console.log(data);
    })
  }
});

socket.on('bookingFromSubAdmin', function (data) {
  if(data.pilotID==getCookie("pilotID")){
    //////Update Driver Location //////
    Android.startRingtone();

  }
});


 


  
socket.on('RingWakup', function (data) {
  
  var userID='D'+getCookie("pilotID")+'';
  if(data.userID==userID){
    Android.incomingCall();
    
console.log("incoming Ring Tone")
//alert(data.userID)

  }
});




 