var socket = io('//'+document.location.hostname+':'+document.location.port);
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

////Randanm OTP/////////
function randamNumber(){
    var tex="";
    for(var i=0; i < 4; i++){
        tex+=''+Math.floor(Math.random() * 10)+'';    
    }
    return tex;

}
////////////Login and Register/////
var timerr;
function mkeydown(){
clearTimeout(timerr);
}

function mkeyup(){
    clearTimeout(timerr);
    timerr=setTimeout(veryfyMobileNumber,1000) ; 
}

function veryfyMobileNumber(){
   //////call otp API////
   var mobile=$("#mobile").val()
    if(mobile.length===10){        ;
        var otp=randamNumber();
        $("#otp1").val(otp);
       // alert(otp)
        $("#mobile").css({"color":"green"});
        ////////Check Mobile No Exist in our System/////
        $.post('/india/checkMobileExist',{mobile:mobile},function(data){
            if(data=='exist'){              
                ///////Login Function////
                $("#password-content").css({"display": "block"});
                $("#login-content").css({"display": "block"});
                $("#password").focus();
                $("#submit-content").css({"display": "none"});
                $("#name-content").css({"display": "none"})
                $("#otp-content").css({"display": "none"});
                $("#email-content").css({"display": "none"})
                $("#ref-content").css({"display": "none"});
                
                

            }else{
                //////Send OTP////
                
               $.post('/india/otpSend',{mobile:mobile,otp:otp},function(data){                  
                    if(data.Status=='Success'){
                        $("#mobile").css({"background-color": "Green","color":"#FFF"});
                        $("#otp-content").css({"display": "block"});   
                        $("#otp").val('');
                        $("#otp").focus();
                        
                        $("#name-content").css({"display": "none"})
                        $("#password-content").css({"display": "none"})
                        $("#submit-content").css({"display": "none"})
                        $("#email-content").css({"display": "none"})
                        $("#login-content").css({"display": "none"});
                        $("#login-content").css({"display": "none"});
                        $("#ref-content").css({"display": "none"});
                      
                    }else{
                        $("#mobile").css({"background-color": "#c44630","color":"#FFF"});
                    }
                   }); 
            }
        })

       
    }else{
        $("#mobile").css({"color":"red"});  
    }
 
}

function verifyOTP(){
    var otp1=$("#otp1").val();
    var otp=$("#otp").val();
    if(otp.length==4 && otp==otp1){
        $("#otpnotmatch").css({"display": "none"})
        //alert('match')
        $("#name-content").css({"display": "block"})
        $("#password-content").css({"display": "block"})
        $("#submit-content").css({"display": "block"})
        $("#email-content").css({"display": "block"})
        $("#ref-content").css({"display": "block"});
        // $("#ref-by-content").css({"display": "block"})
        $("#otp-content").css({"display": "none"})
        $("#login-content").css({"display": "none"});
        $("#submit-btn").val('Register');
        $("#name").focus();
        
    }else{
        $("#otpnotmatch").css({"display": "block"})
    }

}

function resendOTP(){
    $("#resendOTP").hide()
}

function registerprocess(){
  var mobile=$("#mobile").val().trim();
  var name=$("#name").val().trim();
  var email=$("#email").val().trim();
  var password=$("#password").val().trim();
  var reffrom=$("#reffrom").val()
  var refBy=$("#refby").val();
  

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(name.length < 2){
          alert('Enter Valid Name');
          $("#name").focus()
          return
        }
        if(password.length < 6){
          alert('Password must be 6 to 18 character');
          $("#password").focus()
          return
        }
        if (reg.test(email) == false) 
        {
            alert('Invalid Email Address');
            $("#email").focus();
            return 
        }
        

  console.log("reg",name , "email", email,"password",password);
  $.post('/india/newcustreg',{name:name,email:email,password:password,mobile:mobile,reffrom:reffrom,refBy:refBy},function(data){
    if(data){
      console.log("test", data);
     
      window.location.href='/india/'
    }
  })
}

function loginprocess(){
    var password=$("#password").val();
    var mobile=$("#mobile").val();
    $.post('/india/login',{password:password,mobile:mobile},function(data){
        if(data=='success'){
            window.location='/india/servecemode'
        }else{
            $("#password").css({"background-color": "#c44630","color":"#FFF"});
            alert('Password dose not match');
            $("#forgetPsw").css({"display":"block"});
        }
    });

}

function refferenceCall(){  
  var ref=$("#reffrom").val();
  if(ref=="News" || ref=="1"){
    $("#ref-by-content").css({"display": "none"})
  }else{
    $("#ref-by-content").css({"display": "block"})
  }
}


 ///////End Login and Register///////
 
 
 ///////////////////////////////////////////////////
 ///////////////Main Customer Page/////////////////
 //////////////////////////////////////////////////
 function CloseAll(div){  
    $("#"+div+"").css({"display":"none"})
    CenterChange='Enable';
    }
////////CAll pickup placesearch content//////
      var arrayDistinc=[];
    function pickupsearch(a){
      arrayDistinc=[]; 
      var out='<a onclick="CloseAll(\'placesearch\')" class="list-group-item active"><i class="fa fa-map-marker" aria-hidden="true"></i></span> &nbsp; Select From Map</a>';
        $.post('/india/previousplacesearch',{type:a,CustID:$("#CustID").val()},function(data){
          console.log("pickup drop ref",data)
          if(data.length > 0){
            data.forEach(function(val, indx, ary){
              var b=arrayDistinc.indexOf(val.formated_address);
                if(b < 0){
                  arrayDistinc.push(val.formated_address);
                  //var details=JSON.stringify({ads:val.formated_address, lat:val.latlong[0], lng:val.latlong[1]});
                  var details=[""+val.formated_address+"", ""+val.location.coordinates[1]+"", ""+val.location.coordinates[0]+""];
                 console.log(details)
                  out+='<a id="abc" class="list-group-item saveGeocode"> '+val.formated_address+' <input id="type" type="hidden" value="'+a+'"/> <input id="ads" type="hidden" value="'+val.formated_address+'"/> <input id="lat" type="hidden" value="'+val.location.coordinates[1]+'"/> <input id="lng" type="hidden" value="'+val.location.coordinates[0]+'"/> </a>';
                }
                
                if(indx===ary.length -1){
                  $("#placesearch").css({"display":"Block"});        
                  $("#searchPlace").focus()
                  $("#searchPlace").val("")
                  $("#placeList").html(out);
                  $(".searchGif").css({"display":"none"});
                }
              });
          }else{
            $("#placesearch").css({"display":"Block"});        
            $("#searchPlace").focus()
            $("#searchPlace").val("")
            $("#placeList").html(out);
            $(".searchGif").css({"display":"none"});
          }
         
        }) 
        
        
        }

   

        function searchdown(){
            clearTimeout(timerr)
            $(".searchGif").css({"display":"none"});
            
          }
          var out;
          function searchup(){
            $(".searchGif").css({"display":"none"});
            clearTimeout(timerr)
            $(".searchGif").css({"display":"block"});
            timerr=setTimeout(function(){
              var quary=$("#searchPlace").val();
              var pickuplat=$("#pickuplat").val();
              var pickuplng=$("#pickuplng").val();
              var origin={lat:Number(pickuplat),lng:Number(pickuplng)};
              var location=''+origin.lat+' ,'+origin.lng+'';
              out='<a onclick="CloseAll(\'placesearch\')" class="list-group-item active"><i class="fa fa-map-marker" aria-hidden="true"></i></span> &nbsp; Select From Map</a>'
              $.post('/india/placesearch',{quary:quary,location:location},function(data){ 
                if(data.status=='OK'){
                data.predictions.forEach(function(val,indx){ 
                 out+='<a id="abc" class="list-group-item searchItem"> '+val.description+' <input type="hidden" value="'+val.place_id+'"/> </a>    '
                ///{lat:'+val.geometry.location.lat+', lng:'+val.geometry.location.lng+'}
                })
                $("#placeList").html(out);
                $(".searchGif").css({"display":"none"});
                
              }else{
                
                out+='<a  class="list-group-item"> <img class="imgIcon"  src="/images/not-found.png"></span> Address not Found</a>      '
                $("#placeList").html(out);
                $(".searchGif").css({"display":"none"});
              }
              });
            },1000)
          } 
 
          
    // ////////// Travelmode time calculation///////
    // function AlldrivingModeNearestTime(){ 
    //     var j=0;
    //     var travelmod=$("#ModeofTravel").val();
    //     var pickuplat=$("#pickuplat").val();
    //     var pickuplng=$("#pickuplng").val();
    //     var pickup={lat:Number(pickuplat),lng:Number(pickuplng)};
    //     $.each($(".modeImg"),function(i){
    //         j=i+1;
    //         if(travelmod!=j){
    //           $.post('/india/nearbytime',{
    //             lat:pickup.lat,
    //             lng:pickup.lng,
    //             travelmod:j
    //            },function(resul){
                
    //            if(resul.data.length>0){
                
    //             $.post('/india/customertimeforother',{
    //               origlat:Number(pickuplat),
    //               origlng: Number(pickuplng),
    //               distelat:Number(resul.data[0].location.coordinates[1]),
    //               distelng:Number(resul.data[0].location.coordinates[0]),
    //               travelmod:resul.count
    //             },function(outp){ 
    //               $("#timee"+outp.tmode+"").css({"display":"block"}); 
    //               $("#timee"+outp.tmode+"").text(outp.time)   
    //               $("#gif"+outp.tmode+"").css({"display":"none"});
    //             });     
    //            }else{
    //            ////////
    //            //alert(resul.count)
    //            $("#timee"+resul.count+"").css({"display":"none"});
    //            $("#gif"+resul.count+"").css({"display":"block"});
               
    //            }
    //           }); 
    
    //         }
            
    //     });
          
          
    //   }

          
  //////////Change Travel Mode//////
  function changeModeofTravel(tm){
    $("#ModeofTravel").val(tm);
    $("#modeImg"+tm+"").css({"border": "4px solid rgb(42, 204, 36)"});
    //AlldrivingModeNearestTime(); 
    if($("#tmPrice"+tm+"").val()){
      //alert($("#tmPrice"+tm+"").val());
      //$("#totalAmt").text($("#tmPrice"+tm+"").val());
     // $("#booimg").html('<img class="tm-img" src="/india/images/tm'+tm+'.png">')
        var totalprice=Number($("#tmPrice"+tm+"").val())+Number($("#tmTimecost"+tm+"").val());
        $("#confrmBtn").html('Ride Now &#8377;  '+Number(totalprice).toFixed(2)+'');
        var tmPreRidePrice=Number($("#tmPreRidePrice"+tm+"").val()) + Number($("#tmPreRideTimecost"+tm+"").val()) ;
        var distance=$("#totalDistance").val();
        if(Number(tmPreRidePrice)>0){
          //$("#promoMsg").css({"display":"block"});
          $("#preRideBtn").css({"display":"block"});
          $("#confrmBtn").css({"width":"50%"})
          //$("#promoMsg").html('<marquee>Reduce price @ &#8377; '+Number(tmPreRidePrice).toFixed(2)+'/km Tab on Pre-Ride button</marquee>')
          $("#preRideBtn").html('Pre-Ride &#8377;  '+ Number(tmPreRidePrice).toFixed(2)+'')
        }else{
          $("#promoMsg").css({"display":"none"});
          $("#preRideBtn").css({"display":"none"});
          $("#confrmBtn").css({"width":"100%"});
          
        }

        var tmShareRide= $("#tmShareRide"+tm+"").val();
                  if(Number(tmShareRide)>0){
                    $("#shareRideBtn").css({"display":"block"});
                    $("#shareRideBtn").html('Share-Ride &#8377;  '+ Number(tmShareRide).toFixed(2)+'')
                    
                  }else{
                    $("#shareRideBtn").css({"display":"none"});
                    $("#shareRideBtn").html('Share-Ride')
                  }
    } 

    for(var i=0; i<10; i++){
      if(i!=tm){
        $("#modeImg"+i+"").css({"border": "1px solid #000"});
        
      }
    }
    };

    ///////Wallet Payment//////
    function walletReg(){
      $("#waletPayment").css({"display":"block"}); 
      sidebartoggle();  
      
    }

    //////Ride Details//////////
    function rideDetails(){
      CustID=$("#CustID").val();
  //alert(CustID);
      $("#allresult").css({"display": "block"});
      var tMode="";
      var paymentBy="";
      var orderStatus="Cancel"
      $.post('/india/rideDetails',{CustID:CustID},function(data){
        console.log(data)
        if(data.length > 0){
          var out='<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
            <ul style="height: 91vh; overflow-y: auto; margin-top:50px; " class="list-group">\
                <li style="position: fixed; width: 92%; margin-top:-47px;" class="list-group-item active ">\
                  My Ride Details\
                  <button type="button" class="btn btn-danger btn-xs" onclick="closeAllresult()">Close</button>\
                </li>';
                data.forEach(function(val,key,ary){
                  if(val.travelmod=="1"){
                    tMode="Bike Taxi"
                  }else{
                    if(val.travelmod=="2"){
                      tMode="Auto 3 Wh"
                    }else{
                      if(val.travelmod=="3"){
                        tMode="Cab Taxi 4 Seat"
                      }else{
                        if(val.travelmod=="4"){
                          tMode="cab Taxi 6 Seat"
                        }

                      }

                    }
                  }
                  if(val.paymentBy=="1"){
                    paymentBy="Cash"
                  }else{
                    if(val.paymentBy=="2"){
                      paymentBy="Wallet"
                    }else{
                      if(val.paymentBy=="3"){
                        paymentBy="Free / BuyKm"
                      }

                    }
                  }
                  if(val.callbookingStatus == "complete"){
                    orderStatus="Finish"
                    var totalAmt=Number(val.totalamount) + Number(val.timefare);
                  }else{
                    orderStatus="Cancel"
                    var totalAmt=Number(val.totalamount);
                  }
                  
                  out+='<li class=" list-group-item list-group-item-info ">\
                          <span class="badge">&#8377;  '+totalAmt+'<br>'+paymentBy+'</span>\
                          <strong>'+tMode+'</strong><br>'+orderStatus+' - [Inv No:'+val.bookingID+']<br>'+new Date(val.date)+'\
                          <br><br>Picup: '+val.picupaddress+' <br><br>Drop: '+val.dropaddress+'<br><br>Distance: '+val.kmtravels+' km &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Time: '+Number(val.travalTime).toFixed(2)+' Min</li>\
                   '
                  if(key===ary.length -1){
                    
                      $("#allresult").html(''+out+'\
                          </ul>\
                       </div>');
                      sidebartoggle();
                  } 
              })
        }else{

        }
      })
    }


    function ScheduleJourney(){
      var tMode="";
      var paymentBy="";
     
      CustID=$("#CustID").val();
          $("#allresult").css({"display": "block"});
          $("#allresult").html('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
          <ul style="height: 91vh; overflow-y: auto; margin-top:50px; " class="list-group">\
              <li style="position: fixed; width: 92%; margin-top:-47px;" class="list-group-item active ">\
              Schedule Journey\
                <button type="button" class="btn btn-danger btn-xs" onclick="closeAllresult()">Close</button>\
              </li></ul></div>');
          $.post('/india/getScheduleJourney',{CustID:CustID},function(data){
            console.log(data);
            if(data.length > 0){
              var out='<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
            <ul style="height: 91vh; overflow-y: auto; margin-top:50px; " class="list-group">\
                <li style="position: fixed; width: 92%; margin-top:-47px;" class="list-group-item active ">\
                Schedule Journey\
                  <button type="button" class="btn btn-danger btn-xs" onclick="closeAllresult()">Close</button>\
                </li>';
                data.forEach(function(val,key,ary){
                  if(val.travelmod=="1"){
                    tMode="Bike Taxi"
                  }else{
                    if(val.travelmod=="2"){
                      tMode="Auto 3 Wh"
                    }else{
                      if(val.travelmod=="3"){
                        tMode="Cab Taxi 4 Seat"
                      }else{
                        if(val.travelmod=="4"){
                          tMode="cab Taxi 6 Seat"
                        }

                      }

                    }
                  }
                  if(val.payMode=="1"){
                    paymentBy="Cash"
                  }else{
                    if(val.payMode=="2"){
                      paymentBy="Wallet"
                    }else{
                      if(val.payMode=="3"){
                        paymentBy="Free / BuyKm"
                      }

                    }
                  }


                  var totalAmt=Number(val.totalAmt) + Number(val.timeFare);
                  out+='<li class=" list-group-item list-group-item-info ">\
                  <span class="badge">&#8377;  '+totalAmt+'<br>'+paymentBy+'</span>\
                  <strong>'+tMode+'</strong><br>Order Int ID : '+val.bookingID+'<strong> [OTP : '+val.preRideOTP+' ]</strong><br>Pickup Date : '+ dateConcetination(val.pickupDate).date+' Time : '+val.pickupTime+'\
                  <br>Initiate Date : '+ dateConcetination(val.date).date+' Time : '+ dateConcetination(val.date).time+'\
                  <br><br>Picup: '+val.originAds+' <br><br>Drop: '+val.distAds+'<br><br>Distance: '+val.totalDistance+' km &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Time: '+Number(val.travalTime).toFixed(2)+' Min <button onclick="deleteSchdule('+val.bookingID+')" type="button" class="btn btn-danger btn-xs">Delete</button> </li>'

                  if(key===ary.length -1){
                    
                      $("#allresult").html(''+out+'\
                          </ul>\
                       </div>');
                      sidebartoggle();
                  } 
                })

                
            }

          });

    }

    function dateConcetination(dat,res){
      var sysDateTime=new Date(dat);
      var time = (sysDateTime.getHours() < 10 ? '0' : '') + sysDateTime.getHours() + ':' + 
      (sysDateTime.getMinutes() < 10 ? '0' : '') + sysDateTime.getMinutes();//// + ':' +
      ///(sysDateTime.getSeconds() < 10 ? '0' : '') + sysDateTime.getSeconds();
      var month=Number(sysDateTime.getMonth())+1;
      var date = sysDateTime.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' + 
      (sysDateTime.getDate() < 10 ? '0' : '') + sysDateTime.getDate();
      return {date:date,time:time}

      
    }


    function deleteSchdule(bookingID){
      $.post('/india/deleteSchdule',{bookingID:bookingID},function(data){
        if(data=="OK"){
          ScheduleJourney();
          sidebartoggle();
        }
      })

    }

    function closeAllresult(){
      $("#allresult").css({"display": "none"});
    }

    function supportinit(){
      CustID=$("#CustID").val();
      //alert(CustID);
          $("#allresult").css({"display": "block"});
          
          
          $("#allresult").html('<div class="container">\
          <div style="background-color: #facb3d;" class="row">\
              <div style="margin-top: 5px;"  class="col-xs-4 col-sm-4 col-xs-offset-4 col-sm-offset-4">\
                <img style="width: 100%;" src="/india/images/logo/paalogo.png">\
              </div>\
          </div>\
          <div class="row">\
            <div  class="col-xs-12 col-sm-12">\
              <div style="margin-top: 5px;" class="panel panel-primary">\
                    <div class="panel-heading">\
                          <h3 class="panel-title">FAQ</h3>\
                    </div>\
                    <div style="height: 40vh; overflow-y: auto;" class="panel-body">\
                          <ul class="list-group list-active">\
                              <li class="list-group-item" data-toggle="collapse" href="#faq1" aria-expanded="false" aria-controls="faq1"><i class="fa fa-star" aria-hidden="true"></i> How to Use Paa App</li>\
                              <div class="collapse" id="faq1">\
                                <div class="well">\
                                    Paa is an easy, fast, convenient and smart way to get around. Paa is an on demand shared ride service that picks up multiple passenger heading in the same direction, keeping rides affordable and little more than the cost of public transit.\
                                </div>\
                              </div>\
                              <li class="list-group-item" data-toggle="collapse" href="#faq1" aria-expanded="false" aria-controls="faq1"><i class="fa fa-star" aria-hidden="true"></i> How to Use Paa App</li>\
                              <div class="collapse" id="faq1">\
                                <div class="well">\
                                    Paa is an easy, fast, convenient and smart way to get around. Paa is an on demand shared ride service that picks up multiple passenger heading in the same direction, keeping rides affordable and little more than the cost of public transit.\
                                </div>\
                              </div>\
                              <li class="list-group-item" data-toggle="collapse" href="#faq1" aria-expanded="false" aria-controls="faq2"><i class="fa fa-star" aria-hidden="true"></i> How to Use Paa App</li>\
                              <div class="collapse" id="faq2">\
                                <div class="well">\
                                    Paa is an easy, fast, convenient and smart way to get around. Paa is an on demand shared ride service that picks up multiple passenger heading in the same direction, keeping rides affordable and little more than the cost of public transit.\
                                </div>\
                              </div>\
                          </ul>\
                    </div>\
              </div>\
            </div>\
            <div class="col-xs-12 col-sm-12">\
                <div class="panel panel-success">\
                    <div class="panel-heading">\
                            <h3 class="panel-title">How Can We Help You Today</h3>\
                    </div>\
                    <div class="panel-body">\
                            <div class="col-xs-12 col-sm-12">\
                                <button onclick="chatWithUs()" type="button" class="btn btn-success col-xs-6 col-sm-6 col-xs-offset-3 col-sm-offset-3"> <i class="fa fa-comments-o" aria-hidden="true"></i> Chat With Us</button>\
                            </div>\
                            <div style="margin-top: 8px;" class="col-xs-12 col-sm-12">\
                                <textarea style="width: 100%;" id="" rows="2" placeholder="Drescribe Details issue"></textarea>\
                                <input type="text"  id="inputIssue" class="form-control"  placeholder="Contact Nunber">\
                                <button style="margin-top: 5px;" type="button" class="btn btn-success col-xs-6 col-sm-6 col-xs-offset-3 col-sm-offset-3"> <i class="fa fa-phone-square" aria-hidden="true"></i> Get Call Back</button>\
                            </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
      </div>');
          sidebartoggle();
    }

    var chatTimer;
    var chatTimeout;
    function chatWithUs(){
      
     
      CustID=$("#CustID").val();
      
      $("#allresult").html('<div class="container">\
      <div style="background-color: #facb3d;" class="row">\
          <div style="margin-top: 5px;"  class="col-xs-4 col-sm-4 col-xs-offset-4 col-sm-offset-4">\
            <img style="width: 100%;" src="/india/images/logo/paalogo.png">\
          </div>\
      </div>\
      <div class="row">\
        <div class="col-xs-12 col-sm-12">\
          <div style="margin-top: 5px;" class="panel panel-primary">\
              <div class="panel-heading">\
                    <h3  class="panel-title"><i class="fa fa-comments-o" aria-hidden="true"></i> New Chat\
                        <div id="time" style="float: right; display: none;">00:00</div>\
                    </h3>\
              </div>\
              <div style="height: 60vh; overflow-y: auto;" class="panel-body">\
                  <div  style="float: left; width: 90%; border-radius: 5px;  background-color: rgb(238, 230, 221); ">\
                    <a style="float: left; padding: 3px; color: #000;"><img width="20px" src="/india/images/gif/progress.gif"> Chat is Connecting ...  </a>\
                </div>\
              </div>\
          </div>\
                <div id="fPanel" class="panel-footer">\
                    <div class="input-group">\
                      <textarea style="height: 40px;" id="input" class="form-control"  required="required"></textarea>\
                        <span class="input-group-btn">\
                            <button style="font-size: 20px; height: 40px; color: rgb(12, 122, 67);" type="button" class="btn btn-default"><i class="fa fa-telegram" aria-hidden="true"></i></button>\
                        </span>\
                    </div>\
                </div>\
        </div>\
    </div>\
  </div>');
  countingWatch('time',1);
      chatTimer=setInterval(function(){
        chatisConnectingRequest(CustID);

      },5000)

      chatTimeout=setTimeout(function(){
        clearInterval(chatTimer);
        forReject();
      },60*1000)
     
      socket.on('chatReject', function (data) {
        
        if(data.CustID==CustID){
          clearInterval(chatTimer);
          clearTimeout(chatTimeout)
          forReject();
        }
        
      })

      socket.on('chatisConnectingSuccess', function (data) {
        if(data.CustID==CustID){
          clearInterval(chatTimer);
          console.log("Connection Success Pendin to Accept")
          
        }
        
      })

      socket.on('chatisConnectingAccept', function (data) {
        if(data.CustID==CustID){
          clearTimeout(chatTimeout)
          
          $("#allresult").html('<div class="container">\
          <div style="background-color: #facb3d;" class="row">\
              <div style="margin-top: 5px;"  class="col-xs-4 col-sm-4 col-xs-offset-4 col-sm-offset-4">\
                <img style="width: 100%;" src="/india/images/logo/paalogo.png">\
              </div>\
          </div>\
          <div class="row">\
            <div class="col-xs-12 col-sm-12">\
              <div style="margin-top: 5px;" class="panel panel-primary">\
                    <div class="panel-heading">\
                          <h3  class="panel-title"><img width="30px" src="/india/images/custLogo.png"> Paa Admin\
                              <span style="float: right; margin-top: -6px;">\
                              <button onclick="chatSessionDisconnect('+data.ACCEPT_SESSION+')"  type="button" class="btn btn-sm btn-danger">X</button>\
                              </span>\
                          </h3>\
                          <input id="chatSession" type="hidden" value="'+data.ACCEPT_SESSION+'">\
                    </div>\
                    <div id="chatBody" style="height: 60vh; overflow-y: auto;" class="panel-body">\
                      <div style="float: left; width: 80%; border-radius: 5px;  background-color: rgb(238, 230, 221); ">\
                          <a style="float: left; padding: 3px; color: #000;">Hi, <br>How May I Help You Today?</a>\
                      </div>\
                  </div>\
                    <div  class="panel panel-default">\
                          <div class="panel-body">\
                                Valuable Customer \
                          </div>\
                          <div class="panel-footer">\
                                <div class="input-group">\
                                  <textarea id="chatContent" style="height: 40px;" id="input" class="form-control"  required="required"></textarea>\
                                    <span class="input-group-btn">\
                                        <button onclick="sendChatContent('+data.ACCEPT_SESSION+')"  style="font-size: 20px; height: 40px; color: rgb(12, 122, 67);" type="button" class="btn btn-default"><i class="fa fa-telegram" aria-hidden="true"></i></button>\
                                    </span>\
                                </div>\
                            </div>\
                    </div>\
              </div>\
            </div>\
        </div>\
      </div>')
        }
        
      })


    }

    function sendChatContent(chatSession){
      var CustID=$("#CustID").val();
      var chatContent=$("#chatContent").val();
      $.post('/india/sendChatContent',{chatSession:chatSession,chatContent:chatContent,userID:CustID},function(data){
        if(data){
        $("#chatBody").append('<div style="float: right; width: 80%;     margin-top: 10px; ">\
            <div style="float: right; background-color: rgb(137, 231, 141); border-radius: 5px;">\
                <a style="float: left; padding: 3px; color: #000;">'+chatContent+'</a>\
            </div>\
        </div>')
        $("#chatBody").animate({ scrollTop: $("#chatBody").height() }, 1000);
        $("#chatContent").val('');
        $("#chatContent").focus();

        }
      })
    }

    socket.on('receiveChetContentAdmin', function (data) {
      var chatSession=$("#chatSession").val();
      if(chatSession==data.chatSession){
          $("#chatBody").append('<div style="float: left; width: 80%;     margin-top: 10px; ">\
          <div style="float: left; background-color: rgb(238, 230, 221); border-radius: 5px;">\
              <a style="float: left; padding: 3px; color: #000;">'+data.chatContent+'</a>\
          </div>\
        </div>');
        $("#chatBody").animate({ scrollTop: $("#chatBody").height() }, 1000);
        $("#chatContent").val('');
        $("#chatContent").focus();
      }
      
    })

    function chatisConnectingRequest(CustID){
      $.post('/india/chatisConnecting',{CustID:CustID},function(data){
        if(data){
         console.log("Chat Req")

        }
        
      })
    }

    function forReject(){
      $("#allresult").html('<div class="container">\
      <div style="background-color: #facb3d;" class="row">\
          <div style="margin-top: 5px;"  class="col-xs-4 col-sm-4 col-xs-offset-4 col-sm-offset-4">\
            <img style="width: 100%;" src="/india/images/logo/paalogo.png">\
          </div>\
      </div>\
      <div class="row">\
        <div class="col-xs-12 col-sm-12">\
          <div style="margin-top: 5px;" class="panel panel-primary">\
              <div class="panel-heading">\
              <h3  class="panel-title">All Chat Box are Busy\
                  <span style="float: right; margin-top: -6px;">\
                  <button type="button" class="btn btn-sm btn-danger">X</button>\
                  </span>\
              </h3>\
              </div>\
              <div style="height: 84vh; overflow-y: auto;" class="panel-body">\
                    <textarea style="height: 65vh;" id="input" class="form-control" placeholder="Type your Massage here"></textarea>\
                    <button style="margin-top: 10px;"  type="button" class="btn btn-success col-xs-4 col-sm-4 col-xs-offset-4 col-sm-offset-4 ">Submit</button>\
              </div>\
          </div>\
        </div>\
    </div>\
  </div>');
    }

    function chatSessionDisconnect(sessionID){
      $.post('/india/chatSessionDisconnect',{sessionID:sessionID},function(data){
        if(data){
          $("#allresult").html('');
          $("#allresult").css({"display": "none"});
        }
      })
    }

    socket.on('chatSessionDisconnect', function (data) {
      var chatSession=$("#chatSession").val();
        if(chatSession==data.sessionID){
          $("#allresult").html('');
          $("#allresult").css({"display": "none"});
        }
      
     })

    function countingWatch(div,tim){
      $("#"+div+"").css({"display":"block"})
          var timer;
          var count = 60*tim; 
          timer=setInterval(function(){
              count=count-1;
              var min=parseInt(count/60);
              var sec=(count % 60);
              if(sec < 10){
                  sec='0'+sec+'';
              }
              $("#"+div+"").html(''+min+':'+sec+'')
              
              if(count < 0){
                  clearInterval(timer);
                  $("#"+div+"").html('0:00')
              }
          },1000);
      }

    function icicipay(){
      $("#waletpay").html('<img style="width: 40px;" src="/india/images/gif/progress.gif"><br><label>** Do not Refresh or back during paymet process ** </label>')
     var payAmount=$("#payAmount").val();
     var CustID=$("#CustID").val();
     var typeOfReqest=$("#typeOfReqest").val();
     var mobileNumber=$("#mobileNumber").val();
     var email=$("#email").val();
     $.post('/india/icici/tokengen',{
       payAmount:payAmount,
       CustID:CustID,
       typeOfReqest:typeOfReqest,
       mobileNumber:mobileNumber,
       email:email
      },function(data){
      payCheckout(data); 
      })
     
    }
    

    function payCheckout(req){
      Layer.checkout({
        token: req.tokenID,
        accesskey: req.ACCESS_KEY,
        return_url: req.return_url,
        redirect: true
        },
        function(response) {
          console.log("response.status",response)
          if (response.status == "cancelled") {
            alert("Transection Calcel By User")            
            window.location.href="../india"
          }
            
          $.post('/india/icici/paydetails',{payment_token_id:response.payment_token_id,status:response.status},function(data){
            console.log("Payment Details", data) 
            if(data){
              window.location.href='../india?wallet="success"';
              // $("#preRideAmt").html('Wallet Balance &#8377;  '+data.balance+'');
              // $("#walletBalance").val(data.balance);
              // $("#walletBalance-text").html('Wallet &#8377; ('+data.balance+')');
              
              // $("#waletpay").html('<input onclick="finishwallet()"  type="button" value="Finish" class="btn btn-primary col-xs-12 col-sm-12 "></input>')
             }else{
              // $("#waletpay").html('<input onclick="finishwallet()"  type="button" value="Finish" class="btn btn-primary col-xs-12 col-sm-12 "></input>')
             } 

            });

            if (response.status == "created") {
              window.location.href='../india';    
              } else if (response.status == "pending") {
                window.location.href='../india';      
              } else if (response.status == "failed") {      
                window.location.href='../india';
              }
        
            // if (response.status == "captured") {                            
            //    // response.payment_token_id
            //    // response.payment_id
                  
            // } else if (response.status == "created") {
    
    
            // } else if (response.status == "pending") {
    
    
            // } else if (response.status == "failed") {
    
    
            // } else if (response.status == "cancelled") {
    
            // }
        },
        function(err) {
            //integration errors
            console.log("integration Error", err)
        }
    );
    } 
    
   function finishwallet(){
    $("#waletPayment").css({"display":"none"});
    $("#waletpay").html('<input onclick="icicipay()"  type="button" value="Recharge" class="btn btn-primary col-xs-12 col-sm-12 "></input>')
    
   }
   
   

  //  ///////Confrim Booking/////
  //  function confirmBooking(){
  //   $('#confrmBtn').prop('disabled', true);
  //     //////check Wallet and BuyKM and Cash//////
  //     if($("#payBycash").prop("checked") == true){        
  //       continueBooking(1);      
  //       }else{
  //         var totalAmt= $("#totalAmt").text();
  //         var totalDistance= $("#totalDistance").val();
  //         var walletBalance= $("#walletBalance").val();
  //         var buyKM= $("#buyKM").val();
          
  //         if(Number(walletBalance)> 0){
  //           //alert("wellet accept")
            
  //           continueBooking(2);
  //         }else{
  //           //alert("wellet not accept");
  //           if(Number(buyKM)>Number(totalDistance) ){
              
  //             continueBooking(3);
  //           }else{
  //             alert("You Don't have available balance cover your jurny please Recharge your Wallet or BuyKM");
  //           }
  //         }
          
  //       }
  //  }

  //  function continueBooking(payMode){
  //   var pickuplat=$("#pickuplat").val();
  //   var pickuplng=$("#pickuplng").val();
  //   var droplat=$("#droplat").val();
  //   var droplng=$("#droplng").val();


  //   var originAds=$("#picuplocation").val();
  //   var distAds=$("#droplocation").val() ;

  //   var origin={lat:Number(pickuplat),lng:Number(pickuplng)};
  //   var dist={lat:Number(droplat),lng:Number(droplng)} ;

  //   var travelmod=$("#ModeofTravel").val();
  //   var CustID=$("#CustID").val();
  //   var totalAmt= $("#tmPrice"+travelmod+"").val();
  //   var totalDistance= $("#totalDistance").val();
  //   var travalTime=$("#travelTime").val();
  //   var timere; 
  //   /////Search Driver list/////
  //   $.post('/india/nearbyRideBooking',{
  //     lat:origin.lat,
  //     lng:origin.lng,
  //     travelmod:travelmod,
  //     DriverType:"General"
  //    },function(data){
  //     console.log(data);
  //     $("#booking-process").css({"display":"block"});
  //     $("#footer-prebooking").css({"display":"none"});
  //     $("#traval-mod").css({"display":"none"});
  //     if(data.drivers.length > 0){
  //        ////////////////////
  //        console.log(data.drivers) 
  //        /////Call to Driver///
  //        var count=0; 
  //        $.post('/india/CallDriver',{pilotID:data.drivers[count].pilotID,CustID:CustID,pickuoAddress:originAds},function(result){
  //           console.log(result);
  //         }); 
  //        count++;
  //        timere=setInterval(function(){ 
  //          if(count<data.drivers.length ){
  //           $.post('/india/CallDriver',{pilotID:data.drivers[count].pilotID,CustID:CustID,pickuoAddress:originAds},function(result){
  //             console.log(result);
  //           }); 
  //          count++;
  //        }else{
  //          clearInterval(timere);
  //          ////////feedbace to customer/////
  //          console.log("Driver Busy")
  //          alert("All Drivers Are Busy with other Cline Please try again");        

  //         window.location.href='/india/?geocode=1'

  //        }

  //        },15000);

  //        ///Handle Socket/////
  //        var tttt;
  //        socket.on('DriverAccepeCall', function (incomdata) {
  //         if(CustID==incomdata.CustID){
  //           console.log("Order Gen")
  //           clearTimeout(tttt);

  //           tttt=setTimeout(function(){
  //             ///////Grnerate Order/////
  //             $.post('/india/saveDriverCallAndBooking',{
  //               originAds:originAds,
  //               distAds:distAds,
  //               originLat:origin.lat,
  //               originLng:origin.lng,
  //               distLat:dist.lat,
  //               distLng:dist.lng,
  //               travelmod:travelmod,
  //               CustID:CustID,
  //               pilotID:incomdata.pilotID,
  //               DriverType:"General",
  //               totalAmt:Number(totalAmt) ,
  //               totalDistance:totalDistance,
  //               travalTime:travalTime,
  //               payMode:payMode,
  //             },function(result){
  //             console.log(result);
  //             if(result){
  //               //alert(resp)
  //               window.location='../india/ride'
  //             }
  //           }); 
  //           },500)
  //         }
  //        })


  //     }else{

  //       alert("Driver Not Avaible");
  //       window.location.href='../india/?geocode=1'
  //       ///////Search Pre Ride Driver //////
  //     }

  //    });
  //  } 

  function trideBooking(){
    var travelmod=$("#ModeofTravel").val();
    var totalAmt= $("#tmPrice"+travelmod+"").val();  
    var totalTimeCost=$("#tmTimecost"+travelmod+"").val(); 
    var totalApproxCost=(Number(totalAmt) + Number(totalTimeCost)).toFixed(2)
    var PerRidePerMinuteCost=$("#tmPreRidePreMinuteCost"+travelmod+"").val(); 
    var totalDistance= $("#totalDistance").val();    
    $("#footer-preRide").css({"display":"block"});
    $("#preRideAmount").html('<p>Total Distance Fare: &#8377;  '+totalAmt+'</p>\
    <p>Total Time Fare: &#8377;  '+totalTimeCost+'</p>\
    <p>Approx Total Amount: &#8377;  '+totalApproxCost+'</p>');
    $("#preRideAmount").css({"display":"block"});
    $("#prerideCnfBtn").css({"display":"block"});
    $("#conframTreridebtn").css({"display":"block"});
    $("#conframPreridebtn").css({"display":"none"});
    $("#preridesBackbtn").css({"display":"block"});
    $("#prebooking-process").css({"display":"none"});
    $("#preRideType").css({"display":"none"});
    $("#setpickuptime").css({"display":"none"});
    $("#scheduleTrip").css({"display":"none"});
   }


  ///////Confrim Booking for Tdriver/////
  function confirmBooking(type){
    //alert("confrim")
    
    $('#conframTreridebtn').prop('disabled', true);
    $("#footer-preRide").css({"display":"none"});
      //////check Wallet and BuyKM and Cash//////
      if($("#payBycash").prop("checked") == true){        
        continueBooking(1,type);      
        }else{
          var totalAmt= $("#totalAmt").text();
          var totalDistance= $("#totalDistance").val();
          var walletBalance= $("#walletBalance").val();
          var buyKM= $("#buyKM").val();
          
          if(Number(walletBalance)> 0){
            //alert("wellet accept")
            
            continueBooking(2,type);
          }else{
            //alert("wellet not accept");
            if(Number(buyKM)>Number(totalDistance) ){
              
              continueBooking(3,type);
            }else{
              alert("You Don't have available balance cover your jurny please Recharge your Wallet or BuyKM");
            }
          }
          
        }
   }

   function continueBooking(payMode,type){
    var pickuplat=$("#pickuplat").val();
    var pickuplng=$("#pickuplng").val();
    var droplat=$("#droplat").val();
    var droplng=$("#droplng").val();


    var originAds=$("#picuplocation").val();
    var distAds=$("#droplocation").val() ;

    var origin={lat:Number(pickuplat),lng:Number(pickuplng)};
    var dist={lat:Number(droplat),lng:Number(droplng)} ;

    var travelmod=$("#ModeofTravel").val();
    var CustID=$("#CustID").val();
    var totalAmt= $("#tmPrice"+travelmod+"").val();
    var totalTomeCost=$("#tmTimecost"+travelmod+"").val();
    var perMinuteCost=$("#tmPreMinuteCost"+travelmod+"").val();
    var totalDistance= $("#totalDistance").val();

    var totalDistance= $("#totalDistance").val();
    var travalTime=$("#travelTime").val();
    var timere;

    ///////Call Bridge Condition///////

    if(type=="preRide"){
      if (confirm(' Pre-Ride Drivers are not available in your area \r\n You can Contunue with Right-Now Driver by OK button \r\n Your kilometer charge will increse, New Km Cost is Rs. '+totalAmt+' \r\n And time charge will apply accordingly ')) {
        // Save it!
        //console.log('Thing was saved to the database.');
      } else {
        // Do nothing!
        window.location.href='/india/?geocode=1'
      }
      
    }

    /////Search Driver list/////
    $.post('/india/nearbyTrideBooking',{
      lat:origin.lat,
      lng:origin.lng,
      travelmod:travelmod,
      DriverType:"Tride"
     },function(data){
      console.log(data);
      $("#booking-process").css({"display":"block"});
      $("#footer-prebooking").css({"display":"none"});
      $("#traval-mod").css({"display":"none"});
      if(data.drivers.length > 0){
         ////////////////////
         console.log(data.drivers) 
         /////Call to Driver///
         var count=0; 
         $.post('/india/CallTdriver',{pilotID:data.drivers[count].pilotID,CustID:CustID,pickuoAddress:originAds},function(result){
            console.log(result);
          }); 
         count++;
         timere=setInterval(function(){ 
           if(count<data.drivers.length ){
            $.post('/india/CallTdriver',{pilotID:data.drivers[count].pilotID,CustID:CustID,pickuoAddress:originAds},function(result){
              console.log(result);
            }); 
           count++;
         }else{
           clearInterval(timere);
           ////////feedbace to customer/////
           //console.log("Driver Busy")
           //alert("All Drivers Are Busy with other Cline Please try again");  
           
           driverNotFound({
            originAds:originAds,
            distAds:distAds,
            originLat:pickuplat,
            originLng:pickuplng,
            distLat:droplat,
            distLng:droplng,
            travelmod:travelmod,
            CustID:CustID,
            DriverType:type,
            totalAmt:Number(totalAmt),
            totalDistance:totalDistance,
            travalTime:travalTime,
            payMode:payMode,
          });

          //window.location.href='/india/?geocode=1'

         }

         },15000);

         ///Handle Socket/////
         var tttt;
         socket.on('TdriverAccepeCall', function (incomdata) {
          if(CustID==incomdata.CustID){
            console.log("Order Gen")
            clearTimeout(tttt);

            tttt=setTimeout(function(){
              ///////Grnerate Order/////
              $.post('/india/savetdriverCallAndBooking',{
                originAds:originAds,
                distAds:distAds,
                originLat:origin.lat,
                originLng:origin.lng,
                distLat:dist.lat,
                distLng:dist.lng,
                travelmod:travelmod,
                CustID:CustID,
                pilotID:incomdata.pilotID,
                DriverType:"Tride",
                totalAmt:Number(totalAmt) ,
                timeFare:Number(totalTomeCost),
                perMinuteTimeCost:Number(perMinuteCost),
                totalDistance:totalDistance,
                travalTime:travalTime,
                payMode:payMode,
              },function(result){
              console.log(result);
              if(result){
                //alert(resp)
                window.location='../india/ride'
              }
            }); 
            },500)
          }
         })


      }else{

        //alert("Driver Not Avaible");
        driverNotFound({
          originAds:originAds,
          distAds:distAds,
          originLat:pickuplat,
          originLng:pickuplng,
          distLat:droplat,
          distLng:droplng,
          travelmod:travelmod,
          CustID:CustID,
          DriverType:type,
          totalAmt:Number(totalAmt),
          totalDistance:totalDistance,
          travalTime:travalTime,
          payMode:payMode,
        });
        //window.location.href='../india/?geocode=1'
        ///////Search Pre Ride Driver //////
      }

     });
   } 


 

   /////////scheduleTrip//////////////
   function scheduleTripInit(){
     var sysDateTime=new Date();
    var time = (sysDateTime.getHours() < 10 ? '0' : '') + sysDateTime.getHours() + ':' + 
    (sysDateTime.getMinutes() < 10 ? '0' : '') + sysDateTime.getMinutes();//// + ':' +
    ///(sysDateTime.getSeconds() < 10 ? '0' : '') + sysDateTime.getSeconds();
    var month=Number(sysDateTime.getMonth())+1;
    var date = sysDateTime.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' + 
    (sysDateTime.getDate() < 10 ? '0' : '') + sysDateTime.getDate();

    $("#conframTreridebtn").css({"display":"none"});
    $("#prerideCnfBtn").css({"display":"none"});
    $("#prebooking-process").css({"display":"none"});
    $("#preRideAmount").css({"display":"none"});
    $("#preRideType").css({"display":"none"});
    $("#setpickuptime").css({"display":"block"});
    $('#btnSetpicTime').prop('disabled', false);
    $("#setpickuptime").html(' <div class="form-group">\
    <label for="inputtime" class="col-sm-2 control-label">Set Date:</label>\
    <div class="col-sm-10">\
        <input type="date" id="pickdate" class="form-control" value="'+date+'" required="required" pattern="" title="">\
    </div>\
</div>\
<div class="form-group">\
    <label for="inputtime" class="col-sm-2 control-label">Set Time:</label>\
    <div class="col-sm-10">\
        <input type="time"  id="picktime" class="form-control" value="'+time+'" required="required" pattern="" title="">\
    </div>\
</div>\
<div class="form-group">\
    <button style="margin-top: 15px;" id="btnSetpicTime"  onclick="setpickuptime()" type="button" class="btn btn-warning col-xs-12 col-sm-12 ">Set Pick-up Time</button>\
</div>')
  }
  function diff_minutes(dt2, dt1) {
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
    }

  function setpickuptime(){
    var pickupTime=$("#picktime").val();
    var pickupDate=$("#pickdate").val();
    if(pickupTime && pickupDate){
      // var tt=''+pickupDate+'T'+pickupTime+'';
      // var oo=new Date(''+pickupDate+'T'+pickupTime+'')
      // console.log(tt);
      // console.log(oo);

      $('#btnSetpicTime').prop('disabled', true);
     //////check Wallet and BuyKM and Cash//////
     if($("#payBycash").prop("checked") == true){        
      continuesetpickuptime(1);      
      }else{
        var travelmod=$("#ModeofTravel").val();
        var totalAmt= $("#tmPreRidePrice"+travelmod+"").val();  
        var totalTimeCost=$("#tmPreRideTimecost"+travelmod+"").val(); 
        var totalApproxCost=(Number(totalAmt) + Number(totalTimeCost));
        var totalDistance= $("#totalDistance").val();
        var walletBalance= $("#walletBalance").val();
        var buyKM= $("#buyKM").val();
        //alert(totalDistance)
        if(Number(walletBalance) > Number(totalApproxCost)){
          //alert("wellet accept")
          continuesetpickuptime(2);
        }else{
          //alert("wellet not accept");
          if(Number(buyKM) > Number(totalDistance) ){
            continuesetpickuptime(3);
          }else{
            alert("You Don't have available balance cover your jurny please Recharge your Wallet or BuyKM");
          }
        }
        
      }

    }else{
      alert("Select Date and Time to Continue");
    }
  }

  

  function continuesetpickuptime(payMode){
    var pickuplat=$("#pickuplat").val();
        var pickuplng=$("#pickuplng").val();
        var droplat=$("#droplat").val();
        var droplng=$("#droplng").val();
        
        var originAds=$("#picuplocation").val();
        var distAds=$("#droplocation").val() ;
        var origin={lat:Number(pickuplat),lng:Number(pickuplng)} ;
        var dist={lat:Number(droplat),lng:Number(droplng)};

        var CustID=$("#CustID").val();
        var travalTime=$("#travelTime").val();

        var travelmod=$("#ModeofTravel").val();
        var totalAmt= $("#tmPreRidePrice"+travelmod+"").val();
        var totalTomeCost=$("#tmPreRideTimecost"+travelmod+"").val();
        var perMinuteCost=$("#tmPreRidePreMinuteCost"+travelmod+"").val();
        var totalDistance= $("#totalDistance").val();
        var pickupTime=$("#picktime").val();
        var pickupDate=$("#pickdate").val();
       
        $.post('/india/setpickuptimesetup',{
          originAds:originAds,
          distAds:distAds,
          originLat:origin.lat,
          originLng:origin.lng,
          distLat:dist.lat,
          distLng:dist.lng,
          travelmod:travelmod,
          CustID:CustID,
          DriverType:"preRide",
          totalAmt:Number(totalAmt),
          timeFare:Number(totalTomeCost),
          perMinuteTimeCost:Number(perMinuteCost),
          totalDistance:totalDistance,
          travalTime:travalTime,
          payMode:payMode,
          pickupTime:pickupTime,
          pickupDate:new Date(''+pickupDate+'T'+pickupTime+''),
          callbookingStatus:"InitByCust"
        },function(res){
          $("#preridesBackbtn").css({"display":"none"});
          $("#setpickuptime").html('<div class="row">\
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
              <p style="text-align: center; font-size: larger; margin-top: 50px; font-size: 22px;color: red;"><strong>Confirm</strong></p>\
              <p style="text-align: center; font-size: larger;">Schedule Order ID : '+res.bookingID+'</p>\
              <p style="text-align: justify; font-size: larger;"><strong style="color: red;">OTP : '+res.otp+' </strong>[ Share with Driver to Start Journey ]</p>\
              <p><img style="width: 100%; height: 100px;" src="/india/images/thank.png"></p>\
          </div>\
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
              <p style="text-align:justify; font-size: larger; margin-top: 50px;">Thanks to Choose Paa Cabs as your Ride</p>\
              <p style="text-align: justify; color: red;">Our Driver Will Contact You <strong>10 Minutes before</strong> of your Schedule Journey Please Be Ready  on time for Better Service</p>\
              <button style="margin-top: 15px;" onclick="gotoMain()" type="button" class="btn btn-warning col-xs-12 col-sm-12 ">Go to Main</button>\
          </div>\
      </div>')

        });

        

  }

  function gotoMain(){
    $("#footer-preRide").css({"display":"none"});
    $("#footer-content").css({"display":"block"});
    $("#footer-prebooking").css({"display":"none"});
  }



  function checkAnyOrderExist(){
    var CustID=$("#CustID").val();
    $.post('/india/checkAnyOrderExist',{
      CustID:CustID
    },function(data){
      if(data=="NOT_ORDER"){
        console.log(data);
      }else{
        window.location='../india/'
      }
    })
   }
    
   /////Pre-Ride Booking///////
   function preRideBooking(){
    checkAnyOrderExist();
    var travelmod=$("#ModeofTravel").val();
    var totalAmt= $("#tmPreRidePrice"+travelmod+"").val();  
    var totalTimeCost=$("#tmPreRideTimecost"+travelmod+"").val(); 
    var totalApproxCost=(Number(totalAmt) + Number(totalTimeCost)).toFixed(2)
    var PerRidePerMinuteCost=$("#tmPreRidePreMinuteCost"+travelmod+"").val(); 
    var totalDistance= $("#totalDistance").val();    
    $("#footer-preRide").css({"display":"block"});
    $("#preRideAmount").html('<p>Total Distance Fare: &#8377;  '+totalAmt+'</p>\
    <p>Total Time Fare: &#8377;  '+totalTimeCost+'</p>\
    <p>Approx Total Amount: &#8377;  '+totalApproxCost+'</p>');
    $("#prerideCnfBtn").css({"display":"block"});
    $("#conframTreridebtn").css({"display":"none"});
    $("#conframPreridebtn").css({"display":"block"});
    $("#scheduleTrip").css({"display":"block"});
    $("#preridesBackbtn").css({"display":"block"});
    $("#prebooking-process").css({"display":"none"});
    $("#preRideType").css({"display":"block"});
    $("#preRideAmount").css({"display":"block"});
    $("#setpickuptime").css({"display":"none"});
   }


  


    //////////Confram Pre-Ride//////
   function conframPreride(){
    $('#conframPreridebtn').prop('disabled', true);
    //////Check Is there Any Booking///////////
      
    //////check Wallet and BuyKM and Cash//////
    if($("#payBycash").prop("checked") == true){        
      continuePreBooking(1);      
      }else{
        var travelmod=$("#ModeofTravel").val();
        var totalAmt= $("#tmPreRidePrice"+travelmod+"").val();  
        var totalTimeCost=$("#tmPreRideTimecost"+travelmod+"").val(); 
        var totalApproxCost=(Number(totalAmt) + Number(totalTimeCost));
        var totalDistance= $("#totalDistance").val();
        var walletBalance= $("#walletBalance").val();
        var buyKM= $("#buyKM").val();
        //alert(totalDistance)
        if(Number(walletBalance) > Number(totalApproxCost)){
          //alert("wellet accept")
          continuePreBooking(2);
        }else{
          //alert("wellet not accept");
          if(Number(buyKM) > Number(totalDistance) ){
          continuePreBooking(3);
          }else{
            alert("You Don't have available balance cover your jurny please Recharge your Wallet or BuyKM");
          }
        }
        
      }

   }

 
   
   function continuePreBooking(payMode){ 
     
        var pickuplat=$("#pickuplat").val();
        var pickuplng=$("#pickuplng").val();
        var droplat=$("#droplat").val();
        var droplng=$("#droplng").val();
        
        var originAds=$("#picuplocation").val();
        var distAds=$("#droplocation").val() ;
        var origin={lat:Number(pickuplat),lng:Number(pickuplng)} ;
        var dist={lat:Number(droplat),lng:Number(droplng)};

        var CustID=$("#CustID").val();
        var travalTime=$("#travelTime").val();

        var travelmod=$("#ModeofTravel").val();
        var totalAmt= $("#tmPreRidePrice"+travelmod+"").val();
        var totalTomeCost=$("#tmPreRideTimecost"+travelmod+"").val();
        var perMinuteCost=$("#tmPreRidePreMinuteCost"+travelmod+"").val();
        var totalDistance= $("#totalDistance").val();
        var timere;
        $("#prebooking-process").css({"display":"block"});
        $("#prerideCnfBtn").css({"display":"none"});
        $("#preridesBackbtn").css({"display":"none"});
        console.log(dist);
        var preRideTimer;
      /////Search Pre-ride list/////
        $.post('/india/nearbyPrerideDriver',{
          lat:origin.lat,
          lng:origin.lng,
          travelmod:travelmod,
          DriverType:"preRide"
        },function(data){
          console.log("Filter Driver",data);
          if(data.drivers.length > 0){
           /////Call to Driver///
           var count=0; 
           $.post('/india/CallPreRideDriver',{pilotID:data.drivers[count].pilotID,CustID:CustID},function(result){
              console.log(result);
            }); 
           count++;
           timere=setInterval(function(){ 
             if(count<data.drivers.length ){
              $.post('/india/CallPreRideDriver',{pilotID:data.drivers[count].pilotID,CustID:CustID},function(result){
                console.log(result);
              }); 
             count++;
           }else{
             clearInterval(timere);
             ////////feedbace to customer/////
            //  console.log("Driver Busy")
            //  alert("All Drivers Are Busy with other Cline Please try again");
            //  window.location.href='/india/?geocode=1'
            // //////Call TDriver/////
            confirmBooking('preRide');

            // driverNotFound({
            //   originAds:originAds,
            //   distAds:distAds,
            //   originLat:origin.lat,
            //   originLng:origin.lng,
            //   distLat:dist.lat,
            //   distLng:dist.lng,
            //   travelmod:travelmod,
            //   CustID:CustID,
            //   DriverType:"preRide",
            //   totalAmt:Number(totalAmt) * Number(totalDistance),
            //   totalDistance:totalDistance,
            //   travalTime:travalTime,
            //   payMode:payMode,
            // });

           }
           },10000);
   
             ///Check Socket For Driver Accepttance////
            // var socket = io('//'+document.location.hostname+':'+document.location.port);
            var tt;
             socket.on('PreRideDriverAccepeCall', function (incomdata) {
               if(CustID==incomdata.CustID){
                 clearInterval(timere);

                 clearTimeout(tt);
                 tt=setTimeout(function(){
                 console.log("PreRideDriverAccepeCall",incomdata)
                 //////Save and Generate Booking////
                 $.post('/india/savePreRideCallAndBooking',{
                  pilotID:incomdata.pilotID,
                  CustID:incomdata.CustID,
                  /////For create booking////                   
                  originAds:originAds,
                  distAds:distAds,
                  originLat:origin.lat,
                  originLng:origin.lng,
                  distLat:dist.lat,
                  distLng:dist.lng,
                  travelmod:travelmod,
                  CustID:CustID,
                  DriverType:"preRide",
                  totalAmt:Number(totalAmt),
                  timeFare:Number(totalTomeCost),
                  perMinuteTimeCost:Number(perMinuteCost),
                  totalDistance:totalDistance,
                  travalTime:travalTime,
                  payMode:payMode,
                  
                 },function(resp){
                  if(resp){
                    //alert(resp)
                    window.location='../india/ride'
                  }
                 });

                },500);
                
                
               }
             });


          }else{
            ///////Driver ot Found
            
            ///////Call Tdriver/////////
            //////Call Driver Not Found//////////
            confirmBooking('preRide');
            // driverNotFound({
            //   originAds:originAds,
            //   distAds:distAds,
            //   originLat:origin.lat,
            //   originLng:origin.lng,
            //   distLat:dist.lat,
            //   distLng:dist.lng,
            //   travelmod:travelmod,
            //   CustID:CustID,
            //   DriverType:"preRide",
            //   totalAmt:Number(totalAmt) * Number(totalDistance),
            //   totalDistance:totalDistance,
            //   travalTime:travalTime,
            //   payMode:payMode,
            // })
            

            
           
          }
        });
  }


 function  driverNotFound(req){
  $.post('/india/cust/drivernotfound',{
    originAds:req.originAds,
    distAds:req.distAds,
    originLat:req.originLat,
    originLng:req.originLng,
    distLat:req.distLat,
    distLng:req.distLng,
    travelmod:req.travelmod,
    CustID:req.CustID,
    DriverType:req.DriverType,
    totalAmt:req.totalAmt,
    totalDistance:req.totalDistance,
    travalTime:req.travalTime,
    payMode:req.payMode,
  },function(data){
    console.log(data);
    alert("Driver Not Found Try Again");
    $("#footer-preRide").css({"display":"none"});
    window.location.href='/india/?geocode=1'
    console.log(data);
  })
 }
  


  ////// await for loop testing//////
// var ary=[1,2,3,4,5,6,7,8,9]
//   const forLoop = async _ => {
//     console.log('Start') 
//     Loop:                   
//     for (let index = 0; index < ary.length; index++) {
     
//       const numFruit =  driverBookingsAndTime( ary[index]);

//       await numFruit
     
//     }
  
//     console.log('End')
//   }
//   forLoop();


//  async function driverBookingsAndTime (pilotID){
//    await $.post('/india/trstloop',{pilotID:pilotID}, function(data){
//      console.log(data)
//       if(data.bookings =="2"){
//         forLoop.close();        
//      }
//     });
    
//   }


    function backPreride(){
    $("#footer-preRide").css({"display":"none"});
    $('#conframPreridebtn').prop('disabled', false); 
   }


/////// shareRideBooking/////////////
function shareRideBooking(){
  var pickuplat=$("#pickuplat").val();
  var pickuplng=$("#pickuplng").val();
  var droplat=$("#droplat").val();
  var droplng=$("#droplng").val();
  var originAds=$("#picuplocation").val();
  var distAds=$("#droplocation").val() ;
  var origin={lat:Number(pickuplat),lng:Number(pickuplng)} ;
  var dist={lat:Number(droplat),lng:Number(droplng)} ;

  var travelmod=$("#ModeofTravel").val();
  var CustID=$("#CustID").val();
  var totalAmt= $("#tmShareRide"+travelmod+"").val();
  var totalDistance= $("#totalDistance").val();
  $.post('/india/share/booking',{
    originAds:originAds,
    distAds:distAds,
    origin:origin,
    dist:dist,
    travelmod:travelmod,
    CustID:CustID,
    totalAmt:totalAmt,
    totalDistance:totalDistance
  },function(data){
    if(data=="Success"){
      $("#footer-shareRide").css({"display":"block"});
    }else{
      if(data=="driver Busy"){
        alert("Driver Not Avaible Please Try Again");
      }
    }
  })

}

var socket = io('//'+document.location.hostname+':'+document.location.port); 
socket.on('bookingFromSubAdmin', function (data) {
  var CustID=$("#CustID").val();
  if(CustID==data.CustID){
    window.location='/india'
  }
  
})

        
var socket = io('//'+document.location.hostname+':'+document.location.port); 
socket.on('testgps', function (test) {
 // alert("uu")
console.log("test GPS",test)
})  


        
  ///////////////////////////////////////////////////
 ///////////////End Main Customer Page/////////////////
 //////////////////////////////////////////////////

