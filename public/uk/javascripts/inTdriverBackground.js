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

  function setDytyCookie(cname, cvalue, exdays) {
    if(cvalue.length > 0){
      $.post('/uk/setCookies',{cname:cname,cvalue:cvalue,expires:exdays*60*1000},function(data){
          console.log(data)
       })
     }else{
      $.post('/uk/clerCookies',{cname:cname},function(data){  console.log(data)})
     }
  }

  


var wachID;
function initMap() { 
    wachLocation();
    function wachLocation(){
        wachID=navigator.geolocation.watchPosition(function (position){
            LocationUpdate(position);
            
        },function error(msg){
            alert('Please enable your GPS position future.');       
        },{maximumAge:600000, timeout:5000, enableHighAccuracy: true});
    } 
    

    function LocationUpdate(position){     
        $.post('/uk/driverLocationUpdate',{lat:position.coords.latitude,lng:position.coords.longitude,accuracy:position.coords.accuracy, DriverType:"Tride" },function(data){
            console.log(data);
         });
         
    }

  
}
/////End InitMap/////



 ///////Handel Socket io  parameter///////
 var socket = io('//'+document.location.hostname+':'+document.location.port);  
 var thotting=0;
 var acceptTimer;
 socket.on('TinCommingCall', function (data) {
 if(data.pilotID==getCookie("pilotID")){
   console.log("call Neeed to be accept");
   console.log("inCommingCall data",data);    
   if(!getCookie("driverBusy")){
     if(thotting==0){
       thotting=1;
       setTimeout(function(){
         thotting=0;
       }, 1000*15);

       acceptTimer=setInterval(function(){
          $.post('/uk/requiestTdriverDisplayAcceptWindow',{
            pilotID:data.pilotID,
            CustID:data.CustID,
            pickuoAddress:data.pickuoAddress                        
          },function(dat){
            console.log("Call Accepted", dat);
            Android.startRingtone();
            Android.openMainActivity();
          });

        socket.on('comfirmAcceptWindowOpen', function (oout) {
          if(oout.pilotID==getCookie("pilotID")){
            clearInterval(acceptTimer);
          }
        });
       },300);
        
       
      
     }      

   }
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
 
 


  

 