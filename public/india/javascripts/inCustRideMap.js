//////cookie Setting////
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
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

var map;

function initMap() {  
    ///////Map Initiate 
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
         polylineOptions:{strokeColor:"#36301e",strokeWeight:2}, 
         suppressMarkers:true 
        });
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
         // center: {lat: 23.5659115, lng: 87.2727577},
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
          map:map
        });
    directionsDisplay.setMap(map);

        var dropMarker=new google.maps.Marker({        
            // icon:'http://www.robotwoods.com/dev/misc/bluecircle.png',
             icon:new google.maps.MarkerImage('/india/images/drop.png',
                                             new google.maps.Size(50,50),
                                             new google.maps.Point(0,0),
                                             new google.maps.Point(25,50)),
             map:map
           
           });
     var pickupMarker=new google.maps.Marker({        
     // icon:'http://www.robotwoods.com/dev/misc/bluecircle.png',
         icon:new google.maps.MarkerImage('/india/images/pickup.png',
                                         new google.maps.Size(50,50),
                                         new google.maps.Point(0,0),
                                         new google.maps.Point(25,50)),
         map:map
         
     
     });
        
     var pickupwindow = new google.maps.InfoWindow({
         content: "Destination"
       });

     var dropwindow = new google.maps.InfoWindow({
     content: "Driver"
     }); 
     
     var drop = new google.maps.InfoWindow({
        content: "Drop"
      });
     
     ///////Driver picup Stage///////
      var timerR;
     function getDriverposition(reqs){
            timerR=setInterval(function(){
            $.post('/india/getDriverposition',{pilotID:reqs.pilotID},function(resp){
                console.log(resp)
                dropMarker.setPosition({lat:Number(resp[1]), lng:Number(resp[0])});
                dropwindow.open(map, dropMarker);
                map.setCenter({lat:Number(resp[1]), lng:Number(resp[0])})

            });
            ///////stop timer//////
        var CustID=$("#CustID").val();
        if(getCookie("clineLocat")=='YES'){
            setCookie("clineLocat","NO",1);
            clearInterval(timerR)
        }
        },5*1000);

     }

       ///////Driver StartRide Stage///////
       var timerB;
       function getDriverposition2(reqs){
              timerB=setInterval(function(){
              $.post('/india/getDriverposition',{pilotID:reqs.pilotID},function(resp){
                  console.log(resp)
                  dropMarker.setPosition({lat:Number(resp[1]), lng:Number(resp[0])});
                  dropwindow.open(map, dropMarker);
                  map.setCenter({lat:Number(resp[1]), lng:Number(resp[0])})
  
              });
              ///////stop timer//////
          var CustID=getCookie("CustID");
          if(getCookie("StartRide")=='YES'){
              setCookie("StartRide","NO",1);
              clearInterval(timerB)
          }
          },5*1000);
  
       }


    // ///////Driver StartRide Stage///////
    // var timerR;
    // function getDriverposition3(reqs){
    //        timerR=setInterval(function(){
    //        $.post('/india/getFinishBooking',{bookingID:reqs.bookingID},function(resp){
    //            console.log(resp.totalamount);
    //            $("#billAndfeedback").css({"display":"block"});               

    //        });
    //        ///////stop timer//////
    //    var CustID=getCookie("CustID");
    //    if(getCookie("finishRide")=='YES'){
    //        setCookie("finishRide","NO",1);
    //        clearInterval(timerR)
    //    }
    //    },1000);

    // }   

///////////Initiate page Parametter///////
        function pageInit(){         
         var bookingID=$("#bookingID").val();
         //alert(bookingID)
         $.post('/india/rideDriverBookingDetails',{bookingID:bookingID},function(data){
            console.log('rider',data);
            if(data){

          
        /////Add pickup Marker/////          
       console.log("test val",$("#orderStage").val())
         if($("#orderStage").val()=='accept'){
            var latlng ={lat:Number(data.ride.picuklatlng[0]),lng:Number(data.ride.picuklatlng[1])} ;
            pickupMarker.setPosition(latlng)
            dropwindow.open(map, pickupMarker);
            map.setCenter(latlng)
    
            getDriverposition({latlng:latlng,pilotID:data.driver.pilotID});
         }else{
            if($("#orderStage").val()=='startRide'){
                var dlatlng ={lat:Number(data.ride.droplatlng[0]),lng:Number(data.ride.droplatlng[1])} ;
                pickupMarker.setPosition(dlatlng)
                drop.open(map, pickupMarker);
                map.setCenter(dlatlng)

                getDriverposition2({latlng:dlatlng,pilotID:data.driver.pilotID});
            }else{
                if($("#orderStage").val()=='finishRide'){
                    var clatlng ={lat:Number(data.ride.droplatlng[0]),lng:Number(data.ride.droplatlng[1])} ;
                    $.post('/india/getFinishBooking',{bookingID:data.ride.bookingID},function(resp){
                        console.log(resp.totalamount);
                        if(resp.spacelDiscount){
                            var billAmount= Number(resp.totalamount) + Number(resp.timefare) + Number(resp.holdingOverStayCharge) - Number(resp.spacelDiscount);
                        }else{
                            var billAmount= Number(resp.totalamount) + Number(resp.timefare) + Number(resp.holdingOverStayCharge) ;
                        }

                        
                        
                        $("#billAndfeedback").css({"display":"block"});
                        $("#tamt").text(Number(billAmount).toFixed(0));
                        $("#tamt1").text(Number(billAmount).toFixed(2));
                        $("#timeF").text(Number(resp.timefare).toFixed(2));
                        $("#overStay").text(Number(resp.holdingOverStayCharge).toFixed(2));
                        var distf=Number(billAmount) - (Number(resp.holdingOverStayCharge) + Number(resp.timefare));
                        
                        $("#distFare").text(Number(distf).toFixed(2));
                    });
                }else{
                    
                    window.location='/india'
                }

            }
         } 
              
       

            $("#footer").html('<div class="container-fluid">\
            <div class="row">\
                <div class="col-xs-12 col-sm-12 ">\
                    <div id="up-arw" class="text-center" onclick="resizeFooter()" class=""><i class="fa fa-angle-double-up" aria-hidden="true"></i></div>\
                    <div id="down-arw" class="text-center" style="display: none;" onclick="restoreFooter()" class=""><i class="fa fa-angle-double-down" aria-hidden="true"></i></div>\
                </div>\
            </div>\
            <div style="margin-top: 5px;" class="row">\
                <div class="col-xs-3 col-sm-3">\
                    <img class="drive-img img-circle" src="'+data.driver.photo+'"/>\
                    <p class="text-center">'+data.driver.pilotRating+' <i class="fa fa-star" aria-hidden="true"></i></p>\
                </div>\
                <div class="col-xs-9 col-sm-9">\
                    <p>'+data.driver.name+'</p>\
                    <div class="row">\
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">\
                            <p>'+data.driver.rtoRegno+'</p>\
                        </div>\
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">\
                            <p class="text-center">'+data.driver.carModel+'</p>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">\
                            <div class="otp">OTP: '+data.ride.preRideOTP+'</div>\
                        </div>\
                        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">\
                            <a onclick="callinit()" class="btn btn-success"><i class="fa fa-phone" aria-hidden="true"></i></a>\
                            <a  class="btn btn-success"><i class="fa fa-comments" aria-hidden="true"></i></a>\
                            <input  type="hidden" name="callName" id="callName" value="D'+data.driver.pilotID+'"></div>\
                    </div>\
                </div>\
            </div>\
            <div style="margin-top: 5px;" class="row">\
                <div class="col-xs-12 col-sm-12">\
                    <div class="row">\
                        <div class="col-xs-9 col-sm-9 ">\
                            <div class="boxstyle">Pickup From :<br>'+data.ride.picupaddress+'</div> \
                        </div>\
                        <div class="col-xs-3 col-sm-3">\
                            <button type="button" class="btn btn-xs btn-success">Change</button>\
                        </div>\
                        <div style="margin-top: 5px;" class="col-xs-9 col-sm-9 ">\
                            <div class="boxstyle">Going To :<br>'+data.ride.dropaddress+'</div>\
                        </div>\
                        <div class="col-xs-3 col-sm-3">\
                            <button type="button" class="btn btn-xs btn-success">Change</button>\
                        </div>\
                        <div style="margin-top: 5px;" class="col-xs-4 col-sm-4">\
                            <button onclick="cancelOrderByCust('+data.ride.bookingID+')" type="button" class="btn btn-danger">Cancel</button>\
                            <input type="hidden" id="cancelCharge">\
                        </div>\
                        <div style="margin-top: 5px;" class="col-xs-4 col-sm-4">\
                            <div class="col-xs-3 col-sm-3" id="watchTime">5:00</div>\
                        </div>\
                        <div style="margin-top: 5px;" class="col-xs-4 col-sm-4">\
                            <div class="col-xs-12 col-sm-12">\
                            <a href="tel:100" class="btn btn-danger">SOS</a>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>');

       

       
            
            cancelTimer(data.ride.totalamount);

        }else{
            window.location='/india'   
        }
            
         });           
            
        }
        pageInit();


       


  /////continueNextbooking /////////
  document.getElementById("continueNextRide").addEventListener("click", function(){    
    $.post('/india/setAllNormalandFinished',{},function(data){
      if(data){       
        $("#billAndfeedback").css({"display":"none"});
        setCookie("cancelTimer","",1);
        window.location='/india'
      }
      
    });
    
  }); 

  var obj = { Name : getCookie("countryCode"), CustID: getCookie("CustID")};
  var str = JSON.stringify(obj);
  Android.connectForgrount(str);
       
}  //////end InitMap 



/////Other Function/////

function callinit(){
    document.getElementById("dataCall").style.display = "block";
   } 

function resizeFooter(){
$("#footer").css({"height": "100vh","top": "0vh","z-index":"50"});
$("#down-arw").css({"display":"block"});
$("#up-arw").css({"display":"none"});

}

function restoreFooter(){
    $("#footer").css({"height": "25vh","top": "75vh"});
    $("#down-arw").css({"display":"none"});
    $("#up-arw").css({"display":"block"});

   

}

///Check Socket For Driver Accepttance////
var socket = io('//'+document.location.hostname+':'+document.location.port);
socket.on('clinelocated', function (data) {
    var CustID=getCookie("CustID");
    if(CustID==data.CustID){
     $("#massage-notification").css({"display":"block"});
     $("#massage-notification").html('<div class="alert alert-danger">\
     <button onclick="closeclineLocation()" type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
     <strong>PaaCab!</strong> Driver has been arrived, You need to go your Pickup Location\
 </div>');
        setCookie("clineLocat","YES",1);
    }
  }); 
  
  socket.on('StartRide', function (data) {
    var CustID=getCookie("CustID");
    if(CustID==data.CustID){
        $("#massage-notification").css({"display":"block"});
        $("#massage-notification").html('<div class="alert alert-danger">\
        <button onclick="closestartRide()" type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        <strong>PaaCab!</strong> Welcom to your happy jurny leave a feed back after finish this trip \
    </div>');
    setCookie("StartRide","YES",1);
    setCookie("clineLocat","NO",1);

    setTimeout(function(){
        closestartRide();  
    },10000)
       
    }

  });

  socket.on('finishAndFeedback', function (data) {
    var CustID=getCookie("CustID");
    if(CustID==data.CustID){
        console.log("finishRide",data)
        window.location='/india'
    }
});

socket.on('OrderCancelByDriver', function (data) {
    var CustID=getCookie("CustID");
    if(CustID==data.CustID){
        console.log("OrderCancel by Driver",data)
        setCookie("cancelTimer","",1);
        window.location='/india'
        

    }
});

socket.on('OrderCancelByCustomer', function (data) {
    var CustID=getCookie("CustID");
    if(CustID==data.CustID){
        console.log("OrderCancel by Driver",data)
        setCookie("cancelTimer","",1);
        window.location='/india'
        

    }
});

socket.on('stopWebCall', function (data) {
    //alert(JSON.stringify(data));
    if(data.CustID==getCookie("CustID")){
      //////Stop Web call //////
      stop()
  
    }
  });


  function closeclineLocation(){
    $("#massage-notification").css({"display":"none"})
  }

  function closestartRide(){
    $("#massage-notification").css({"display":"none"});
    window.location='/india'
  }

function cancelOrderByCust(bookingID){
    var r = confirm("Cancel Ride Within 3 minutes (form accept Ride) will no chacgr apply, then after Rs. 10.00 charge applicable for cancelation");
  if (r == true){ 
    var cost=$("#cancelCharge").val();
      console.log("yes", cost);
      $.post('/india/CancelRideByCust',{bookingID:bookingID,cancelCost:cost},function(data){
        if(data=="ok"){
            setCookie("cancelTimer","",1);
            window.location='/india'
        }else{
            alert("Booking is not Calcel At this Time")
        }
      });
  } else {
    console.log("not")
  }
} 

function cancelTimer(rideCost){
    if(getCookie("cancelTimer")){
     ///$("#cancelCharge").val(rideCost/2); 
     $("#cancelCharge").val(10);
     $("#watchTime").css({"display":"none"})  
    }else{
        var timer;
        var count = 60*3; 
          
        timer=setInterval(function(){
            count=count-1;
            var min=parseInt(count/60);
            var sec=(count % 60);
            if(sec < 10){
                sec='0'+sec+'';
            }
            
            $("#watchTime").html(''+min+':'+sec+'')
            $("#cancelCharge").val(0);
            if(count < 0){
                $("#watchTime").css({"display":"none"})
                //$("#cancelCharge").val(rideCost/2);
                $("#cancelCharge").val(10);
                setCookie("cancelTimer","ON",1);
                clearInterval(timer);
                
            }
        },1000);
    }
   

}
