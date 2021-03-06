(function( $ ){
$(document).ready(function(){
  /* turn of AJAX caching so things work sanely IE8 */
  $.ajaxSetup({
      cache: false
  });

  /* right menu should be fixed */
  function init_rightmenu_fixed() {
    var viewport_h =$(window).height();
    var aside_h = $('#panels aside').height();
    var fixed_h = 0;

    var asides = $('#panels aside > *').get();
    for (var i = asides.length - 1; i >= 0; i--) {
      var aside = asides[i];
      aside_oh = $(aside).outerHeight(true);
      if (aside_oh < viewport_h) {
        $(aside).addClass('fixed');
        viewport_h = viewport_h - aside_oh;
        fixed_h += aside_oh;
      };
    };
    var trigger_fixed_height = $('.fixed').filter(':first').offset().top - parseInt($('.fixed').filter(':first').css('margin-top').slice(0,-2)) - 10;

    var fixed = false;
    function check_fixed() {
      if ($(window).scrollTop() > trigger_fixed_height && (fixed === false)) {
        fixed = true;
        var height = 10;
        $('.fixed').each(function(){
          $(this).css({'position':'fixed', 'top': height, 'right': '16px'});
          height += $(this).outerHeight(true);
        })

      } else if ($(window).scrollTop() < trigger_fixed_height && (fixed === true)) {
        $('.fixed').css({'position': ''});
        fixed = false;
      }
    }
    $(window).scroll(check_fixed);
    check_fixed();
  }
  init_rightmenu_fixed();
  
  $(window).resize(function(){
    $(window).unbind('scroll');
    init_rightmenu_fixed();
  });
  
  /* evil warning za novice */
  $('#threat_text').each(function(){
    var threat_text = $('#threat_text').text();
    $('#threat_text').hide();
    
    if ($('#content_field').val() === ""){
      $('#content_field').val(threat_text);
      $('#content_field').focus(function(){
        $(this).val('');
        $(this).unbind('focus');
      });
    }
  });


  /* code that watches for the form for changes and shows the preview */
  $('#ajaxgumb').each(function(){
    $(this).hide();
    $(this).attr('value', 'predogledajax');
    $('#predogled').show();
  });

  function news_source_addnew() {
    var newsrc = $(this).attr('newsrc');
    var newform = $('<form><label for="vVirAddName">Ime vira:</label><input type="text" name="vVirAddName" class="text" value="'+newsrc+'"><label for="vVirAddURL">URL:</label><input type="text" name="vVirAddURL" class="text" value="'+newsrc+'"><input type="submit" value="prekli&#269;i" class="submit send cancel" /><input name="vVirAdd" type="submit" value="dodaj" class="submit send add" /></form>').appendTo('.newsSourceList');

    newform.find('.cancel').click(function(){
      newform.remove();
      return false;
    })

    newform.find('.add').click(function(){
      var serialized = newform.formSerialize() + '&vUID='+$('[name=vUID]').attr('value');
      var url = '/script/vnosi/vnosnovic.php';
      $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: serialized + "&akcija=novvir",
        success: function(data) { 
          if (data.viri) {
            $('[name=vVir]').replaceWith(data.viri);
            newform.remove();
          }
        }
      })
      return false;
    });
  }

  function news_sources_buttons(viri) {
    if (viri) {
      $('.newsSourceList').empty();
      $.each(viri, function(news_id, news_name) {
        var re = /\d+/;
        if (re.test(news_id)) {
          $('.newsSourceList').append('<button type="button" newsid="'+news_id+'" class="newsid">'+news_name+'</button>');
        } else {
          $('.newsSourceList').append('<button type="button" newsrc="'+news_id+'" class="newsrc">'+news_name+'</button>');
        }
      });
    }
  }

  $(document).on('click', '.newsSourceList button.newsid', function(){
    $('select[name=vVir]').val($(this).attr('newsid'));
  });

  $(document).on('click', '.newsSourceList button.newsrc', news_source_addnew);

  $('#content_field').each(function(){
    var myForm = null;
    var url = null;

    if ($('#vnosnovic').length > 0) {
      myForm = $('#vnosnovic');
      url = '/script/vnosi/vnosnovic.php';
    }
    
    if ($('#vnosodgovora').length > 0) {
      myForm = $('#vnosodgovora');
      url = '/script/forum/vnossporocil.php';
    }

    if ($('#vnostem').length > 0) {
      myForm = $('#vnostem');
      url = '/script/forum/vnostem.php';
    }

    if (myForm !== null) {
      var doAjaxPreview = function(){
          var serialized = myForm.formSerialize();
          $.ajax({
            url: url,
            cache: 'false',
            type: 'POST',
            dataType: 'json',
            data: 'akcija=predogledajax&'+serialized,
            success: function(data){
              if (data.content) {
                $('#predogled').html(data.content);
                news_sources_buttons(data.viri);
              }
              SyntaxHighlighter.highlight();
            }
          });    
      };

      var formvalue = '';
      window._watch = function(){
        if ($('#content_field').val() !== formvalue){    
          doAjaxPreview();
        }    
          formvalue = $('#content_field').val();
          setTimeout(window._watch, 3000);
      };
      
      formvalue = $('#content_field').val();
      setTimeout(window._watch, 3000);
    };
  });
  
  $(document).on('click', 'span.ajaxcheck', function(){
      var url = $(this).find('a').attr('href');      
      var checkbox = $('a[href="'+url+'"]').closest('span').find('input');
      var anchor = $('a[href="'+url+'"]');
      url = url + '&ajax=1';
      
      $.getJSON(url, function(response){
        if (response.status === 'off'){
          checkbox.attr('checked', false);
        } else {
          checkbox.attr('checked', true);
        }
        anchor.attr('href', response.link.replace(/&amp;/g, '&') + '&ajax=1');
      });      
      return false;
  });
  
  
  $(document).on('click', 'a.ajaxlink', function(event){
      var url = $(this).get(0).href + '&ajax=1';
      var div = $(this).parents('div.post');
      
      $.getJSON(url, function(response){
        div.fadeOut('slow', function(){ 
             div.html(response.content);
             div.attr('class', 'post '+response.style);
           }).fadeIn('slow', function() {
             div.attachInlineEdit();
             SyntaxHighlighter.highlight();
           });
      });      
      return false;
    });

/* Toolbox for special people */
  $('#toolbox_premakni').hide();
  $('#toolbox_dodajmod').hide();
  $('#toolbox_ban').hide();

$('#tool_premakni').click(function() {
  $('#toolbox_premakni').show();
  return false;
});

$('#tool_dodajmod').click(function() {
  $('#toolbox_dodajmod').show();
  return false;
});

$('#tool_ban').click(function() {
  $('#toolbox_ban').show();
  return false;
});

/* helper functions */

function getThreadID() {
  if (document.location.pathname === '/script/forum/stream.php'){
    return true;
  }

  var location = /\/t\d*/.exec(document.location.href);
	if (location === null) {
	  return false;
	} else {
	  return location[0];
	}
}

/* smart editing of titles */
if ($('#naslovTeme')){
  $('#naslovTeme').editable({
    cancel:'Prekli\u010Di',
    submit:'Shrani',
    onSubmit: function(content) {
      var threadid = getThreadID();

      var updateurl = '/forum' +threadid + '/uredi';
      
      $.post(updateurl,
              {'naslovTeme':content.current},
              function(data){
                $('#naslovTeme').html(data);
              }); 
              
    }
  });
}

/* hide deleted answers by default, if checkbox equals false */
if ($("input[name='check_showzbrisana']").is(':checked') === true) {
  $('.post.deleted').each(function(index) {
    $(this).hide();
  });
}

/* event to hide/show answers based on the checkbox setting */
$("input[name='check_showzbrisana']").next().click(function() {
  if ($("input[name='check_showzbrisana']").is(':checked') === true ) {
    $('.post.deleted').each(function(index) {
      $(this).show();
      });
    }
  else {
    $('.post.deleted').each(function(index) {
      $(this).hide();
    });
  }
});

/* editing of images */
$.fn.editableImages = function editableImages() {
    $(this).find('.image > .data > p.editable').editable({
        cancel:'Prekli\u010Di',
        submit:'Shrani',
        onSubmit: function(content) {
            var imageid = /\d+/.exec($(this).parent().prev().attr('href'))[0];
            var updateurl = '/galerija/' +imageid + '/uredi';
            $.post(updateurl, {'naslovSlike':content.current});
        }
    });
};
$('#content').editableImages();

/* inline edit of posts for moderators */

$.fn.attachInlineEdit = function() {
  return this.each(function(){
    var ans = $(this);
    var threadid = getThreadID();
    var postid = ans.find('a[name]').attr('name');

    var rawurl = '';
    var urediurl = '';

    if (postid === 'p0') { // prvi post-zacetek teme
      rawurl = '/forum' + threadid + '/raw/nocache';
      urediurl = '/forum' + threadid + '/uredi';    
    } else {
      rawurl = '/forum' + threadid + '/' + postid + '/raw/nocache';
      urediurl = '/forum' + threadid + '/' + postid + '/uredi';    
    }
    
    var content = ans.find('.content');

    /* inline-uredi.click */
    ans.find('.first a:contains("popravi")').click(function() {
      $.get(rawurl, function(data) {
        var savedhtml = $(content).html();
        $(content).html('<textarea style="width:100%;" rows="5">'+data+'</textarea>').append('<div style="text-align: right;"><a href="'+urediurl+'">polni popravi</a> <input type="submit" value="shrani" class="submit send save-inlineedit" accesskey="S" name="akcija"/> <input type="submit" value="prekli&#269;i" class="submit send cancel-inlineedit" accesskey="P" name="akcija"/> </div>');
        $(content).find('textarea').TextAreaResizer();

        $(content).find('.save-inlineedit').click(function() {
          var newcontent = $(content).find('textarea').val();
          var updateurl = '';
          if (postid === 'p0') {
            updateurl = '/forum' + threadid + '/uredi/';
          } else {
            updateurl = '/forum' + threadid + '/' + postid + '/uredi/';
          }

          $.post(updateurl,
                  {'vsebina':newcontent},
                  function(data){
                    if (data.status === 'ok') {
                      var div = $(content).parents('div.post').html(data.postHtmlFull);
                      div.attachInlineEdit();
                    } else {
                      $(content).html(savedhtml);
                    }
                    return false;
                  },
                  'jsonp');
          return false;
        });
        
        $(content).find('.cancel-inlineedit').click(function() {
          $(content).html(savedhtml);
          return false;
        });
      });
      return false;
    });  
    /* .inline-uredi.click */
  });
};
$('.post').attachInlineEdit();

/* live feed FTW */
function updatePosts(postid, threadid) {
    if (threadid === undefined) {
      threadid = getThreadID();
    }

    var lastid = 0;
    if ($('.post:last > .avatar').length > 0) {
      lastid = $('.post:last > .avatar').attr('name').substring(1);
    }
    var updateurl = '/forum' + threadid + '/check/';

    if (postid !== undefined) {
      if ($('a[name='+postid+']').length > 0 || getThreadID() === true) {
        updateurl = '/forum' + threadid + '/check/?count=1';
        lastid = parseInt(postid.substring(1)) - 1;
      } else {
        return 
      }
    }

    if (getThreadID() === true && postid === undefined){
      var data = {'firstPost': true}
    } else {
      var data = {'lastID': lastid}
    }

    $.ajax({
      type: "POST", 
      url: updateurl,
      dataType: 'jsonp',
      data: data,
      async: true,
      success: function(response) {
        if (typeof response.newContent !== 'undefined') {
          // getThreadID() === true for stream.php
          if (postid !== undefined && getThreadID() !== true) {
            var newPosts = $(response.newContent).replaceAll($('a[name='+postid+']').closest('.post'));
            $(newPosts).attachInlineEdit().editableImages();
            SyntaxHighlighter.highlight();
          } else {
            /* responses are async, so we might already have :last post, so we check if current :last is
               in new response and remove it from page (since we assume new one is always better)  */
            
            var newContent = $(response.newContent);
            /* firstPost doesn't return outer envelope */
            if (data['firstPost'] === true){
              newContent = $('<div class="post">').append(newContent);
            }
            var last_post = $('.avatar:last');

            if (last_post.length === 0) {
              var newPosts = $('#livefeed').before(newContent);
            } else {
               if (newContent.find('.avatar:last').attr('name') === last_post.attr('name')) {
                last_post.closest('.post').remove();
              }
              if ($('.post:last').length === 0) {
                var newPosts = $('#livefeed').before(newContent);
              } else {
                var newPosts = $('.post:last').after(newContent);
              }              
            }

            newPosts.nextAll().andSelf().each(function(index) {
              $(this).attachInlineEdit();
              $(this).editableImages();
              
            });
            SyntaxHighlighter.highlight();

            if (getThreadID() === true) {
              $('html,body').animate({
                  scrollTop: $(newPosts).position().top
              }, 2000);
            }
          }
        }
      }
    });
}

/* Comet */

// http://push.slo-tech.com/
//  /activity?id=novice
//  /activity?id=forum
//  curl http://push.slo-tech.com/publish?id=novice --data-binary 'zivjo vsi 4'


setTimeout(function () {

function catchAll(event, data, type) {
  console.log(event, type, data);
}


if (getThreadID() !== false) {
  var threadid = getThreadID();

  function updateCheck(event, data, type) {
    if (type === 'novOdgovor' || type === 'posodobiOdgovor') {
      if ( (type === 'posodobiOdgovor' && '/'+data.threadid === threadid) || 
           ( threadid === true ) ) {

          if (threadid === true) {
            updatePosts(data.postid, '/'+data.threadid);
          } else {
            updatePosts(data.postid);
          }
          
      } else {
        if (data.hasOwnProperty('postid')) {
          if ($('a[name='+data.postid+']').length === 0 && 
                '/'+data.threadid === threadid) {
            updatePosts();
          }
        };
      }
    }
  }

  $.comet.connect(('https:' == document.location.protocol ? 'https://' : 'http://')+'push.slo-tech.com/activity?id=forum');

  // $(document).on('posodobiOdgovor.comet', catchAll);
  
  $(document).on('novOdgovor.comet', updateCheck);
  $(document).on('posodobiOdgovor.comet', updateCheck);
}
if ($('.news_item').length !== 0) {
  if (!$.comet.fetching){
    $.comet.connect(('https:' == document.location.protocol ? 'https://' : 'http://')+'push.slo-tech.com/activity?id=forum');
  } 
  
  function updateComments(event, data, type) {
    if (type === 'novOdgovor') {
      var lookup = $('a.comments[href*="'+data.threadid+'"]');
      if (lookup.length !== 0 ){
        text = '';
        switch (data.count % 100) {
          case 0: text = data.count+" komentarjev"; break;
          case 1: text = data.count+" komentar"; break;
          case 2: text = data.count+" komentarja"; break;
          case 3: text = data.count+" komentarji"; break;
          case 4: text = data.count+" komentarji"; break;
          default : text = data.count+" komentarjev"; break;
        }
        lookup.text(text);
      }
    }
  }

  function updateNews(event, data, type) {
    if (type === 'popravekNovice') {
      var lookup = $('h3 a[href*="'+data.threadid+'"]').closest('.news_item');
      if (lookup.length !== 0 ){
        var news_type = '/abstract';
        if (lookup.find('p.read_more').length === 0){
          news_type = '/complete'
        }
        if (lookup.get(0) === $('.exposed').filter(':first').get(0)) {
          news_type = '/first'
        }
        var url = (("https:" === document.location.protocol) ? "https://" : "http://") + "slo-tech.com/novice/" + data.threadid + news_type;
        var wrapper = $(lookup).find('article');
  
        $.ajax({url:url, cache:true, dataType: 'html', success: function(html) {
            var from = html.indexOf('<article>');
            var to   = html.indexOf('</article>');
            var full = $(html.substring(from, to)).html();
            
            $(wrapper).html(full).find('div.history').hide();
            $(wrapper).closest(".news_item").editableImages();

            if ($(html).find('.exposed').length > 0) {
              $(wrapper).closest(".news_item").addClass("exposed");
            };
            $(wrapper).find("a[rel^='lightbox']").prettyPhoto();
          }
        });
      }
    }
  }
  // $(document).on('novOdgovor.comet', catchAll);
  $(document).on('popravekNovice.comet', updateNews);
  $(document).on('novOdgovor.comet', updateComments);  
}

}, 50);//end timeout

/* Show more news */
if ($('.news_item.history').length !== 0 && 
    $('.news_item.history').attr('rel') !== undefined &&   
    $('.news_item.history').attr('alt') !== undefined
   ) {
    var text = $('.news_item.history').attr('alt');
    $('.news_item.history').html('<div class="show-m"><input type="submit" value="'+text+'" class="submit"><img src="'+("https:" === document.location.protocol ? "https://" : "http://")+'static.slo-tech.com/stili/img/icons/user.png"></div>').click(function() {
        var threadid = /\/t(\d*)/.exec($(this).prev().find('header a').filter(':first').attr('href'));
        var url = $('.news_item.history').attr('rel');

        $.ajax({
          type: "POST",
          url: url,
          dataType: 'html',
          data: {'lastID': threadid[0] },
          async: true,
          cache: true,
          context: this,
          success: function(html) {
              var content = $(html).insertBefore(this);
              content.find("a[rel^='lightbox']").prettyPhoto();
              content.applyReadMore();

              if ($(this).closest('.news_item.history').hasClass('once') === true) {
                $(this).closest('.news_item.history').remove();
              }
          }
        });
    });
}

/* Fresh news ticker */
$.fn.list_ticker = function(options){
    var defaults = {
      speed:4000,
      isPaused: false
    };
    
    var options = $.extend(defaults, options);
    
    this.each(function(){
      var obj = $(this);
      var list = obj.children();
      list.not(':first').hide();
      
      setInterval(function(){
        list = obj.children();
        list.not(':first').hide();
        
        var first_li = list.eq(0)
        var second_li = list.eq(1)

        if (options.isPaused === false) {
          first_li.fadeOut(function(){
            second_li.fadeIn();
            first_li.remove().appendTo(obj);
          });
        }
      }, options.speed);
    });
    
    $.fn.pause = function(){
      options.isPaused = true;
    }

    $.fn.resume = function(){
      options.isPaused = false;
    }
    return this;
}

/* Fresh news on top */
var freshnews_divall = $('#fresh_news').clone(true).attr('id', 'fresh_news_all');
$('#head').append(freshnews_divall);
var fn_wrapper = $('#fresh_news, #fresh_news_title, #fresh_news_all').wrapAll('<div id="fn_wrapper" />');
freshnews_divall.height(1.8 * freshnews_divall.find('li').length + 'em');

var ticker = $('#fresh_news').list_ticker({'speed':6000});
var fn_open = false;

function freshnews_mouseover() {
  freshnews_divall.show();
}

function freshnews_mouseout(e) {
  if (fn_open === false){
    freshnews_divall.hide();
  }
}

var freshnews_config = { sensitivity: 3, interval: 300, over: freshnews_mouseover, 
                         timeout: 1000, out: freshnews_mouseout };
fn_wrapper.hoverIntent( freshnews_config );

var freshnews_divall_config = { sensitvity: 2, interval: 300,
                                over: function(){fn_open = true;},
                                out: function(){fn_open = false; freshnews_divall.hide();},
                                timeout: 200
}
freshnews_divall.hoverIntent( freshnews_divall_config );

/* First post preview */
function appendFirstpostInline(target, content) {
    return $('<tr class="'+$(target).closest('tr').attr('class')+'"><td colspan="5"><div class="post">'+content+'</div></td></tr>').insertAfter($(target).closest('tr'));
}

function clickAppendFirstPost() {
    var threadid = /\/t\d*/.exec($(this).next().find('h3 > a').attr('href'));
    var updateurl = '/forum' + threadid[0] + '/check/';

    $.ajax({
      type: "GET",
      url: updateurl,
      dataType: 'jsonp',
      data: {'firstPost': true},
      async: true,
      cache: true,
      context: this,
      success: function(data) {
          var newPost = appendFirstpostInline(this, data.newContent);
          $(this).unbind('click');
          $(this).click(function() {
              $(newPost).remove();
              $(this).unbind('click');
              $(this).click(clickAppendFirstPost);
          });
      }
    });
}
$('tr > td.icon').click(clickAppendFirstPost);

/* AJAX quickpost */

$('#form_quick_reply').submit(function() {
  var posturl = $('#form_quick_reply').attr('action');
  $.ajax({
    type: "POST",
    url: posturl+'&ajax=1',
    data: $('#form_quick_reply').serializeArray(),
    dataType: 'json',
    success: function(response) {
      if (response.go === 'refresh') {
        $('.post:last').remove();
      } else if (response.go !== 'ok') {
        window.location = response.go;
      }
      updatePosts();

      // in case of quick-post ensure that 'moje teme' is checked for each user action
      var temeSpan = $('span.ajaxcheck a:contains("Moje teme")').filter(':first').closest('span');
      if (temeSpan.find('input:checked').length === 0){
        temeSpan.find('a').click();
      }
      $('#content_field').val('');
    }
  });
  return false;
});

$.fn.applyReadMore = function(){
    $(this).find("p.read_more").each(function(index) {
            var url = (("https:" === document.location.protocol) ? "https://" : "http://") + "slo-tech.com" + $(this).find("a").attr("href") + "/complete";
            var wrapper = $(this).closest('article'); //.parent().find("div.besediloNovice");
            $(this).find("a").click(function() {
                    var a = $(this);
                    $.ajax({url:url, cache:true, dataType: 'html', success: function(html) {
                            var from = html.indexOf('<article>');
                            var to   = html.indexOf('</article>');
                            var full = $(html.substring(from, to)).html();
                            
                            $(wrapper).html(full).find('div.history').hide();
                            $(wrapper).closest(".news_item").editableImages();

                            if ($(html).find('.exposed').length > 0) {
                              $(wrapper).closest(".news_item").addClass("exposed");
                            };
                            $(wrapper).find("a[rel^='lightbox']").prettyPhoto();
                            $(a).remove();
                    }
                    });
                    return false;
            });

    });
};
$('div#content').applyReadMore();

$('div#menus ul#poll').each(function(index, poll) {
	var form = $(poll).find('form');
	// turn on ajax mode
	$(form).find("fieldset").append('<input type="hidden" name="ajax" value="1"/>');

	var submit = $(form).find('input.submit');
	$(submit).click(function() {
		var action = $(form).attr('action');
	
		if (!$(form).find("input[@name='poll']:checked").val()) {
			// no poll option was selected
			return false;
		}	
	
		// submit the post
		$.post(action, $(form).serialize(), function(results) {
			$(poll).replaceWith(results);
		});

		return false;
	});
});

/* Autocomplete search */

$('input[name=q]').each(function(){
  $(this).autocomplete({
    serviceUrl: '/forum/isci/autocomplete/',
    params: {location: document.location.href },
    minChars: 3,
    cache: true
  })
});

});

}( jQuery ));