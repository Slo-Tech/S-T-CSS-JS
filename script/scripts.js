$(document).ready(function(){
  /* turn of AJAX caching so things work sanely IE8 */
  $.ajaxSetup({
      cache: false
  });
  
  /* evil warning za novice */
  $('#threat_text').each(function(){
    var threat_text = $('#threat_text').text();
    $('#threat_text').hide();
    
    if ($('#content_field').val() == ""){
      $('#content_field').val(threat_text);
      $('#content_field').focus(function(){
        $(this).val('');
        $(this).unbind('focus');
      });
    };
  });


  /* code that watches for the form for changes and shows the preview */
  $('#ajaxgumb').each(function(){
    $(this).hide();
    $(this).attr('value', 'predogledajax');
    $('#predogled').show();
  });

  $('#content_field').each(function(){
    if ($('#vnosnovic').length > 0) {
      myForm = $('#vnosnovic');
      url = '/script/vnosi/vnosnovic.php';
    };
    
    if ($('#vnosodgovora').length > 0) {
      myForm = $('#vnosodgovora');
      url = '/script/forum/vnossporocil.php';
    };

    if ($('#vnostem').length > 0) {
      myForm = $('#vnostem');
      url = '/script/forum/vnostem.php';
    };
    
    doAjaxPreview = function(){
        var serialized = myForm.formSerialize();
        $.ajax({
          url: url,
          cache: 'false',
          type: 'POST',
          data: 'akcija=predogledajax&'+serialized,
          success: function(data){
            $('#predogled').html(data);
          }
        });    
    };

  
    window._watch = function(){
      if ($('#content_field').val() != formvalue){    
        doAjaxPreview();
      };    
        formvalue = $('#content_field').val();
        setTimeout('window._watch()', 3000);
    };
    
    if (typeof(myForm) != "undefined") {
      formvalue = $('#content_field').val();
      setTimeout('window._watch()', 3000);
    };
  });
  
  $('span.ajaxcheck').live('click', function(){
      var url = $(this).find('a').get(0).href + '&ajax=1';
      var checkbox = $(this).find('input').get(0);
      var anchor = $(this).find('a').get(0);
      
      $.getJSON(url, function(data){
        var response = eval(data);
        if (response.status == 'off'){
          checkbox.checked = false;
        } else {
          checkbox.checked = true;
        };
        anchor.href = response.link.replace(/&amp;/g, '&') + '&ajax=1';
      });      
      return false;
  });
  
  
  $('a.ajaxlink').live('click', function(event){
      var url = $(this).get(0).href + '&ajax=1';
      var div = $(this).parents('div.post');
      
      $.getJSON(url, function(data){
        var response = eval(data);
        div.fadeOut('slow', function(){ 
             div.html(response.content);
             div.attr('class', 'post '+response.style);
           }).fadeIn('slow', function() {
             attachInlineEdit(div.get(0));
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
	var location = /\/t\d*/.exec(document.location.href);
	if (location == null) {
	  return false;
	} else {
	  return location[0];
	};
};

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
              }) 
              
    }
  });
};

/* hide deleted answers by default, if checkbox equals false */
if ($("input[name='check_showzbrisana']").is(':checked') == true) {
  $('.post.deleted').each(function(index) {
    $(this).hide();
  });
};

/* event to hide/show answers based on the checkbox setting */
$("input[name='check_showzbrisana']").next().click(function() {
  if ($("input[name='check_showzbrisana']").is(':checked') == true ) {
    $('.post.deleted').each(function(index) {
      $(this).show();
    })}
  else {
    $('.post.deleted').each(function(index) {
      $(this).hide();
    })};
});

/* editing of images */
function editableImages(selector) {
    $(selector).find('.image > .data > p.editable').editable({
        cancel:'Prekli\u010Di',
        submit:'Shrani',
        onSubmit: function(content) {
            var imageid = /\d+/.exec($(this).parent().prev().attr('href'))[0];
            var updateurl = '/galerija/' +imageid + '/uredi';
            $.post(updateurl, {'naslovSlike':content.current})
        }
    });
};
editableImages($('#content'));

/* inline edit of posts for moderators */

function attachInlineEdit(postdiv) {
  var ans = $(postdiv);
  var threadid = getThreadID();
  var postid = ans.find('a[name]').attr('name');

  if (postid == 'p0') { // prvi post-zacetek teme
    var rawurl = '/forum' + threadid + '/raw/nocache';
    var urediurl = '/forum' + threadid + '/uredi';    
  } else {
    var rawurl = '/forum' + threadid + '/' + postid + '/raw/nocache';
    var urediurl = '/forum' + threadid + '/' + postid + '/uredi';    
  };
  
  var content = ans.find('.content');

  /* inline-uredi.click */
  ans.find('a:contains("popravi")').click(function() {
    jQuery.get(rawurl, function(data) {
      var savedhtml = $(content).html();
      $(content).html('<textarea style="width:100%;" rows="5">'+data+'</textarea>').append('<div style="text-align: right;"><a href="'+urediurl+'">polni popravi</a> <input type="submit" value="shrani" class="submit send save-inlineedit" accesskey="S" name="akcija"/> <input type="submit" value="prekli&#269;i" class="submit send cancel-inlineedit" accesskey="P" name="akcija"/> </div>');
      $(content).find('textarea').TextAreaResizer();

      $(content).find('.save-inlineedit').click(function() {
        var newcontent = $(content).find('textarea').val();
        if (postid == 'p0') {
          var updateurl = '/forum' + threadid + '/uredi/';
        } else {
          var updateurl = '/forum' + threadid + '/' + postid + '/uredi/';
        };

        console.log(updateurl);
        $.post(updateurl,
                {'vsebina':newcontent},
                function(data){
                  if (data['status'] == 'ok') {
                    var div = $(content).parents('div.post').html(data['postHtmlFull']);
                    attachInlineEdit(div.get(0));
                  } else {
                    $(content).html(savedhtml);
                  };
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
};

$('.post').each(function(index) {
  attachInlineEdit(this);
});

/* live feed FTW */
feedUpdateInterval = 10000;
updatelock = false;

function updatePosts() {
  if (!updatelock) {
    updatelock = true;
    var threadid = getThreadID();
    var updateurl = '/forum' + threadid + '/check/';
    var lastid = $('.post:last > .avatar').attr('name').substring(1);
    $.ajax({
      type: "POST",
      url: updateurl,
      dataType: 'jsonp',
      data: {lastID: lastid},
      async: true,
      success: function(response) {
        if (typeof response.newContent != 'undefined') {        
          var newPosts = $('.post:last').after(response.newContent); //.hide().fadeIn('slow');
          newPosts.nextAll().andSelf().each(function(index) {
            attachInlineEdit(this);
            editableImages(this);
          });

          feedUpdateInterval = 10000;
        } else {
          if (feedUpdateInterval < 30000) {
            feedUpdateInterval = feedUpdateInterval * 1.05;
          };
        };

        $('#livefeed').oneTime(feedUpdateInterval, "lfUpdate", function() {
            updatePosts();
        });
	updatelock = false;
      }
    });
  }
};

$('#livefeed').oneTime(feedUpdateInterval, "lfUpdate", function() {
  updatePosts();
});

/* Show more news */
if ($('.news_item.history').length != 0) {
    $('.news_item.history').html('<input type="submit" value="Prika\u017Ei starej\u0161e novice" class="submit">').click(function() {
        var threadid = /\/t(\d*)/.exec($(this).prev().find('header a:first').attr('href'));

        $.ajax({
          type: "POST",
          url: '/novice/front-more',
          dataType: 'html',
          data: {lastID: threadid[0] },
          async: true,
          cache: true,
          context: this,
          success: function(html) {
                $(this).before(html);
          }
        });
    });
};

/* First post preview */
function appendFirstpostInline(target, content) {
    return $('<tr class="'+$(target).closest('tr').attr('class')+'"><td colspan="5"><div class="post">'+content+'</div></td></tr>').insertAfter($(target).closest('tr'));
}

function clickAppendFirstPost() {
    var threadid = /\/t\d*/.exec($(this).next().find('h3 > a').attr('href'))
    var updateurl = '/forum' + threadid[0] + '/check/';

    $.ajax({
      type: "GET",
      url: updateurl,
      dataType: 'jsonp',
      data: {firstPost: true},
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
};
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
      if (response.go == 'refresh') {
        $('.post:last').remove();
      } else if (response.go != 'ok') {
        window.location = response.go;
      };
      $('#livefeed').stopTime("lfUpdate");
      updatePosts();
    }
  });
  $('#content_field').val('');
  return false;
});

$("div#content").find("p.read_more").each(function(index) {
                var url = (("https:" == document.location.protocol) ? "https://" : "http://") + "slo-tech.com" + $(this).find("a").attr("href") + "/complete";
        var wrapper = $(this).parent().find("div.besediloNovice");
        $(this).find("a").click(function() {
                var a = $(this);
                $.ajax({url:url, cache:true, dataType: 'html', success: function(html) {
                        var from = html.indexOf('<div class="besediloNovice">');
                        var to   = html.indexOf('<p class="comments">');
                        var full = html.substring(from, to);

                        $(wrapper).html(full);
                        $(a).remove();
                }
                });
                return false;
        });

});

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


});