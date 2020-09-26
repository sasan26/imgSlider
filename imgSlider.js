
$(document).ready(function(){

  //  ----------------------------------------------------------------------------------------------
  //  ----                         [   Number of Slides to show   ]                             ----
  //  ----------------------------------------------------------------------------------------------  
  
  var slides = [];
  var leftArr = "disabled";  
  var sliderTime = 4000;
  let sliderStop = 1e7;
  var currentActivatedDot = [0];
  var arrDirection = 'left';
  var slideUpPos = [];
  var stopAnim = false;

  if (typeof(Storage) == "undefined") { // number of slide to show at the first time
    localStorage.setItem("quantity", 5);
  }
  
  var q = localStorage.getItem("quantity");   // Get number of slides
  if( q ){
    $(".c1 input").attr('value', q);  // Text input - number of slides attribute 
  }

  // slides num input
  $('#q-total').change(function(){
    localStorage.setItem("quantity", $('#q-total').val());
    location.reload();    
  });

  var numDotInput = $('#q-total').val();  // text input - number of slides
  var numDot = Math.ceil( $('.container > img').length / numDotInput );  // Number of dots to show
  var imgNum = numDot * numDotInput - $('.container > img').length; // number of images to add to show area

  var lCon = [];
  lCon.push($('.container > img').length);
  if( lCon[0] > $('#q-total').val() ){ 

    if( $('.container > img').length <= $('#q-total').val()*3){ 
      for ( var i = 1; i <= $('#q-total').val()*3 - lCon[0]; i++){
        if( i <= lCon[0] ){
          $('.container').append('<img class="img-slide" src="'+i+'.jpg">');
        }
        else{
          var j = i - 7;
          $('.container').append('<img class="img-slide" src="'+j+'.jpg">'); 
        }
      }
    }
    else{
      for ( var i = 1; i <= imgNum; i++){
          $('.container').append('<img class="img-slide" src="'+i+'.jpg">');
      }
    }  
  }

  var imgWidth = ( $('.container').width() - $('#q-total').val()*10 - $('#q-total').val()*2*2 ) / $('#q-total').val();
  $('.img-slide').css('width', imgWidth);
  var imgHeight = 40+'em'; 
  if( $('#q-total').val() == 1 ){
    $('.img-slide').css('height', imgHeight);
  }
  
  //  ----------------------------------------------------------------------------------------------
  //  ----                                    [   Autoplay   ]                                  ----
  //  ---------------------------------------------------------------------------------------------- 

  $('#autoplay').prop("checked", true); // Autoplay checkbox --> ON
  $('#regular').prop("checked", true);  // Regular radio btn --> ON

  $('.c3 input').change(function(){
    if( $('#autoplay').prop("checked") == false){  // stop
      clearint(sliderStop);
    }
    else { // restart
      clearint(sliderTime);
    }
  });

  //  ----------------------------------------------------------------------------------------------
  //  ----                                   [   Slider   ]                                     ----
  //  ----------------------------------------------------------------------------------------------   

  var conImages =  $('.container > img'); // images container  
  var dots = [];
  
  // slides
  for(var i = 1; i <= conImages.length; i++){
    var newSlide = {};
    newSlide.dot = i;
    newSlide.slideNum = $(".container > img:nth-child("+i+")");
    newSlide.slideNumOffset = $(".container > img:nth-child("+i+")").offset().left;
    slides.push(newSlide);    
  } 

  var sos = slides[1].slideNumOffset - slides[0].slideNumOffset ;
  
  // hide dots when number of slides are equal or less than 2
  if ( numDotInput <= 2 ){ $('.dots').css('display', 'none'); }

  // dots ( create dots )
  for ( var i = 1; i <= numDot; i++){
    if ( i == 1 ){
      $('.dots').append('<span class="dot dotActive">&#8226;</span> ');
    } else {
      $('.dots').append('<span class="dot">&#8226;</span> ');
    }
  }

  var conDots =  $('.dots > span');  // dots container

  // dots
  for(var i = 1; i <= conDots.length; i++){
    var newDots = {};
    newDots.dotNum = $(".dots > span:nth-child("+i+")");
    newDots.num = i;
    newDots.dotClickPos = (i-1)*(numDotInput)+1;
    dots.push(newDots);
  } 
  
  $("#left-arr").attr('disabled', 'disabled');  // make the left arrow disabled when slider loaded.

  // Left direction slide
  leftDirection = function(s){ 
    leftArr = "enabled";
    $("#left-arr").removeAttr('disabled');
    s.offset(function(n, c){ 
      newPos = new Object(); 
      if (c.left  > (slides[0].slideNumOffset - 1/2*sos ) ){ 
        newPos.left = c.left - $('#q-total').val()*sos; 
        s.animate({left: '-=' + $('#q-total').val()*sos}, 800);                  
      }
       else {  
        newPos.left = c.left + (conImages.length-$('#q-total').val())*sos;           
      } 
      s.promise().done(function(){
        stopAnim = false;
      });  
      return newPos;   
    });  
  };

  // Right direction slide
  rightDirection = function(s){
    s.offset(function(n, c){
      newPos = new Object();
      if (c.left < (slides[$('#q-total').val()].slideNumOffset-1/2*sos)  ){  
        newPos.left = c.left + $('#q-total').val()*sos;         
        s.animate({left: '+=' + $('#q-total').val()*sos}, 800);          
      }
      else {  
          if( numDot <= 4 ){
            if( $('.container > img').length <= $('#q-total').val()*3 ){
              newPos.left = c.left - ($('#q-total').val()*2)*sos;
            }
            else{
              newPos.left = c.left - ($('#q-total').val()*3)*sos;
            }
          }
          else{
            if( $('.container > img').length <= $('#q-total').val()*(numDot-1) ){
              newPos.left = c.left - ($('#q-total').val()*2)*sos;
            }
            else{
              newPos.left = c.left - ($('#q-total').val()*(numDot-1))*sos;
            }
          }
      } 
      s.promise().done(function(){
        stopAnim = false;
      }); 
      return newPos;    
    });
  };

  // reset the animation time
  var clearint = function(time){
    clearInterval(sliderSas);  resetTimer(time);
  };

  // reset interval time after user click on left or right arrows
  resetTimer = function(time){
    if( parseInt($('#q-total').val()) != $('.container > img').length ){
      sliderSas =  setInterval(function() {   
        for ( var l = 0; l < conImages.length; l++ ){
          leftDirection(slides[l].slideNum);
          clearint(sliderTime); 
        }   
        arrDirection = 'left';
        updatePos();     
      },  time);
    }
  };

  sliderSas =  setInterval(function() {   
    for ( var l = 0; l < conImages.length; l++ ){
        leftDirection(slides[l].slideNum); 
    } 
    arrDirection = 'left'; 
    updatePos();
    
  },  sliderTime);

  //  ----------------------------------------------------------------------------------------------
  //  ----                                      [   Dots   ]                                    ----
  //  ----------------------------------------------------------------------------------------------  

  removeClassDot = function(){ // remove active dot calss 
    for (var i = 0; i< conDots.length; i++){
      dots[i].dotNum.removeClass('dotActive');
    }
  };

  createActiveDot = function(i){ // create active dot
    currentActivatedDot.pop();
    if(i != 0){ currentActivatedDot.push(i); }
    else { currentActivatedDot.push(0); }
  }
  
  updatePos = function(){  // update slides and dots position in the queue
    for(var i = 1; i <= conImages.length; i++){
      var newSlide = {};
      newSlide.dot = i;
      newSlide.slideNum = $(".container > img:nth-child("+i+")");
      newSlide.slideNumOffset = $(".container > img:nth-child("+i+")").offset().left;
      slideUpPos.push(newSlide);    
    } 

    var sL = Math.floor(slides[0].slideNumOffset );
    var sL2 = Math.ceil(slides[0].slideNumOffset );

    for ( var i = 0; i < conImages.length; i++){
      if ( Math.ceil(slideUpPos[i].slideNumOffset == sL || Math.floor(slideUpPos[i].slideNumOffset) == sL) || Math.ceil(slideUpPos[i].slideNumOffset == sL2 || Math.floor(slideUpPos[i].slideNumOffset) == sL2) ){ // dot #1
        var j = parseInt(i+1);  
        $.each( dots, function(i, n){
          var cName = dots[i].dotNum[0].className;
          if ( cName == "dot dotActive" ){
            removeClassDot();
            if ( arrDirection == 'left' ){  // if right arrow clicked
              if ( i != dots.length-1){
                dots[i+1].dotNum.addClass('dotActive');
                createActiveDot(i+1);
                return false;
              }
              else{
                dots[0].dotNum.addClass('dotActive');
                createActiveDot(0);
                return false;
              }  
            }              
            else if ( arrDirection == 'right' ){ // if left arrow clicked
              if ( i != 0){
                dots[i-1].dotNum.addClass('dotActive');
                createActiveDot(i-1);
                return false;
              }
              else{
                dots[dots.length-1].dotNum.addClass('dotActive');
                createActiveDot(dots.length-1);
                return false;
              }  
            } 
          }          
        });        
      } 
    }
    slideUpPos = [];
  };

  //  ----------------------------------------------------------------------------------------------
  //  ----                                   [   Dot Click   ]                                  ----
  //  ---------------------------------------------------------------------------------------------- 

  var dotDirection;

  // Dot Click Slider Right Direction ( when the clicked dot is at the left side of current active dot )
  rightDirectionDot = function(s){  
    s.offset(function(n, c){
      newPos = new Object();
        newPos.left = c.left + $('#q-total').val()*sos;         
        s.animate({left: '+=' + $('#q-total').val()*sos}, 200);          
      return newPos;    
    });
  };

  // Dot Click Slider Left Direction ( when the clicked dot is at the right side of current active dot )
  leftDirectionDot = function(s){ 
    s.offset(function(n, c){ 
      newPos = new Object(); 
        newPos.left = c.left - $('#q-total').val()*sos; 
        s.animate({left: '-=' + $('#q-total').val()*sos}, 200); 
      return newPos;   
    });  
  };

  var dotSlide = function(){
    for ( var i = 0; i < conImages.length; i++ ){
      if(dotDirection == "right"){
        rightDirectionDot(slides[i].slideNum);
      }
       else if(dotDirection == "left"){
        leftDirectionDot(slides[i].slideNum);
       }
       clearint(sliderTime); 
    } 
  }

  clickSlideDots = function(n){
    for(var i=1; i<=n; i++){
      dotSlide();
    }
  }

  conDots.click(function(){ // click on dots
    leftArr = "enabled"; 
    $("#left-arr").removeAttr('disabled'); 
    for (var i = 0; i < conDots.length; i++){  
      if (dots[i].dotNum[0] == this){ // Current dot [ clicked ]
        removeClassDot();
        dots[i].dotNum.addClass('dotActive');
        // console.log("dot # "+dots[i].num);
        console.log("Current Position: "+currentActivatedDot[0]);
        var dotsSlider = currentActivatedDot[0] - dots[i].num +1;
        var dotsSliderR = dots[i].num - currentActivatedDot[0] -1;

          for( var n=1; n <= dots.length; n++ ){
            if( dots[i].num <= currentActivatedDot[0] ){
              if( dotsSlider == n ){
                dotDirection = "right";
                clickSlideDots(n)
              }
            }
            else{
              if( dotsSliderR == n ){
                dotDirection = "left";
                clickSlideDots(n)
              }
            }
          }   
        createActiveDot(i);                      
      } 
    }
  });

  //  ----------------------------------------------------------------------------------------------
  //  ----                                     [   ARROWS   ]                                   ----
  //  ----------------------------------------------------------------------------------------------

  // Right Arrow
  $("#right-arr").click(function(){ 
    if(stopAnim == false){      
      for ( var l = 0; l < conImages.length; l++ ){
        leftDirection(slides[l].slideNum);     
        clearint(sliderTime); 
      } 
      $('#autoplay').prop("checked", true);
      arrDirection = 'left';
      updatePos();
      stopAnim = true;
    }
  });
  
  // Left Arrow
  $("#left-arr").click(function(){
    if(leftArr != "disabled" && stopAnim == false){
      for ( var r = 0; r < conImages.length; r++ ){
        rightDirection(slides[r].slideNum);
        clearint(sliderTime); 
      }
      $('#autoplay').prop("checked", true);
      arrDirection = 'right';
      updatePos();
      stopAnim = true;
    }
  });

//  ----------------------------------------------------------------------------------------------
//  ----                                   [   toch - drag   ]                                ----
//  ----------------------------------------------------------------------------------------------

  var tochStatus = [];
  var newTochStatus = [];
  var status = [];

  mouseClickDown = function(pos){      
    var mouseX = pos.pageX;
    tochStatus.push(mouseX);
    status.pop();
    status.push("yes");
  };

  mouseClickUp = function(){
    tochStatus = [];
    newTochStatus = [];
    status.pop();
    status.push("no");
  };

  mouseClickMove = function(pos){ 
    if( parseInt($('#q-total').val()) < $('.container > img').length ){ 
      newTochStatus.pop();
      if ( status[0] == "yes" ){ 
        $('#autoplay').prop("checked", true);
        var newMouseX = pos.pageX;      
        newTochStatus.push(newMouseX);

        if( newTochStatus[0] > tochStatus[0] && leftArr != "disabled"){
          for ( var r = 0; r < conImages.length; r++ ){  // dragging to the right
            rightDirection(slides[r].slideNum);          
            clearint(sliderTime);                         
          }
          arrDirection = 'right';
          updatePos();
          mouseClickUp();
        }
        else if( newTochStatus[0] < tochStatus[0] ){
          for ( var l = 0; l < conImages.length; l++ ){  // dragging to the left
            leftDirection(slides[l].slideNum); 
            clearint(sliderTime);                         
          } 
          arrDirection = 'left';
          updatePos();
          mouseClickUp();
        } 
      } 
    }   
  };

  conImages.on('mousedown touchstart', mouseClickDown); 
  conImages.on('mouseup touchend', mouseClickUp); 
  conImages.on('mousemove touchmove', mouseClickMove); 
  conImages.attr('draggable', false); // disable ghost img drag 

  //  ----------------------------------------------------------------------------------------------
  //  ----                          [   Play / Stop  slider Animation  ]                        ----
  //  ----------------------------------------------------------------------------------------------
  
  var autoplayRun = function(time, b){
    clearint(time);
    $('#autoplay').prop("checked", b);
  };

  conImages.mouseenter(function(){ autoplayRun(sliderStop, false); });
  conImages.mouseleave(function(){ autoplayRun(sliderTime, true); });
  $(window).on('blur', function(){ autoplayRun(sliderStop, false); });
  $(window).on('focus', function(){ autoplayRun(sliderTime, true); });

  if( parseInt($('#q-total').val()) >= $('.container > img').length ){
    clearint(sliderStop);
    $('.dots-arrows').css('display', 'none');
  }

});