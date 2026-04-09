// **main.js - Updated for Safe Qualtrics Redirect**
// -----------------------------------------------

$(function() {

  // -------------------
  // **Parameters**
  // -------------------
  function set_settings() {
    window.settings = [];
    settings.numberofavatars = 21;

    // Default redirect (not used, but kept for legacy)
    settings.defaultredirect = 'https://purchasenss.qualtrics.com/jfe/form/SV_6KBLDG85bXswEhU';

    settings.tasklength = 180000; // 3 minutes

    // Likes configuration
    settings.condition_1_likes = [12000, 9999999];
    settings.condition_3_likes = [10000, 11000, 35000, 100000, 110000, 20000];
    settings.condition_1_adjusted_likes = [12000, 14000,15000,35000,80000,100000,110000,150000,20000];
    settings.condition_3_adjusted_likes = [12000, 9999999];
    settings.likes_by = ['John','AncaD','Sarah','Arjen','Jane','George','Dan','Heather','Ky'];
  }

  // -------------------
  // **Redirect Function**
  // -------------------
  function redirectToEnd() {
    const baseURL = "https://purchasenss.qualtrics.com/jfe/form/SV_6KBLDG85bXswEhU";

    const params = new URLSearchParams({
      p: window.participant,
      c: window.condition,
      u: window.username,
      av: window.avatarexport,
      d: window.description
    });

    location.href = baseURL + "?" + params.toString();
  }

  // -------------------
  // **Slides**
  // -------------------
  function init_intro() {
    $('#intro').show();
    $('#submit_intro').on('click', function() {
      $('#intro').hide();
      init_name();
    });
  }

  function init_name() {
    $('#name').show();
    $('#submit_username').on('click', function() {
      var error = 0;
      var uname = $('#username').val();
      if(uname === "") { error = 1; errormsg='Please enter text'; uname="undefined"; }
      if(not_alphanumeric(uname)) { error = 1; errormsg='Please only letters (and no spaces)'; }

      if(error === 0) {
        $('#name').hide();
        window.username = $('#username').val();
        init_avatar();
      } else {
        alertify.log(errormsg,"error");
      }
    });
  }

  function init_avatar() {
    $('#avatar').show();
    for(var i=0;i<settings.numberofavatars;i++) {
      $('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />');
    }

    $('.avatar').on('click', function() {
      $('.avatar').removeClass('selected');
      $(this).addClass('selected');
    });

    $('#submit_avatar').on('click', function() {
      if($('.selected').length === 1) {
        $('#avatar').hide();
        window.avatar = $('.selected').attr('id');
        window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1];
        init_text();
      } else {
        alertify.log("Please select an avatar","error");
      }
    });
  }

  function init_text() {
    $('#text').show();
    $("#description").keyup(function(){
      $("#count").text("Characters left: " + (400 - $(this).val().length));
    });

    $('#submit_text').on('click', function() {
      var error = 0;
      if($('#description').val() === "") { error = 1; errormsg='Please enter text'; }
      if($('#description').val() !== "" && $('#description').val().length < 100) { error = 1; errormsg='Please write a bit more'; }
      if($('#description').val().length > 401) { error = 1; errormsg='Please enter less text'; }

      if(error === 0) {
        $('#text').hide();
        window.description = $('#description').val();
        init_fb_intro();
      } else {
        alertify.log(errormsg,"error");
      }
    });
  }

  function init_fb_intro() {
    $('#fb_intro').show();
    $('#submit_fb_intro').on('click', function() {
      $('#fb_intro').hide();
      init_fb_login();
    });
  }

  function init_fb_login() {
    $('#fb_login').show();
    setTimeout(function() {
      $('#msg_all_done').show();
      $("#loader").hide();
    }, 8000);

    $('#submit_fb_login').on('click', function() {
      $('#fb_login').hide();
      init_task();
    });
  }

  function init_task() {
    $('#task').show();
    shortcut.add("Backspace", function() {});

    jQuery("#countdown").countDown({
      startNumber: window.settings.tasklength/1000,
      callBack: function() {
        $('#timer').text('00:00');
      }
    });

    // Add final-continue button
    setTimeout(function() {
      $('#final-continue').show();
      $('#timer').text('00:00');
      $('#final-continue').on('click', redirectToEnd);
    }, window.settings.tasklength);
  }

  // -------------------
  // **Error Screen**
  // -------------------
  $('#submit_error').on('click', function() {
    redirectToEnd();
  });

  // -------------------
  // **Helpers**
  // -------------------
  function not_alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    return !letterNumber.test(inputtxt);
  }

  function pad(str,max) { return str.length < max ? pad("0"+str,max) : str; }
  function encode(unencoded) { return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22"); }
  function decode(encoded) { return decodeURIComponent(encoded.replace(/\+/g," ")); }

  jQuery.fn.countDown = function(settings,to) {
    settings = jQuery.extend({
      startFontSize: "12px",
      endFontSize: "12px",
      duration: 1000,
      startNumber: 10,
      endNumber: 0,
      callBack: function() { }
    }, settings);

    return this.each(function() {
      if(!to && to != settings.endNumber) { to = settings.startNumber; }  
      jQuery(this).children('.secs').text(to);
      jQuery(this).animate({ fontSize: settings.endFontSize }, settings.duration, "", function() {
        if(to > settings.endNumber + 1) {
          jQuery(this).children('.secs').text(to-1);
          jQuery(this).countDown(settings,to-1);
          var minutes = Math.floor(to/60);
          var seconds = to - minutes*60;
          jQuery(this).children('.cntr').text(pad(minutes.toString(),2)+':'+pad(seconds.toString(),2));
        } else { settings.callBack(this); }
      });
    });
  };

  shortcut.add("f5",function(){});
  $(window).bind('beforeunload', function() {
    return 'Are you sure you want to quit the experiment completely?';
  });

  // -------------------
  // **Init**
  // -------------------
  set_settings();
  init_intro();

});
