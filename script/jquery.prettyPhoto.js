/* ------------------------------------------------------------------------
 * Class: prettyPhoto
 * Use: Lightbox clone for jQuery
 * Author: Stephane Caron (http://www.no-margin-for-errors.com)
 * Version: 3.0.1
 * ------------------------------------------------------------------------- */

(function(jQuery){jQuery.prettyPhoto={version:'3.0'};jQuery.fn.prettyPhoto=function(pp_settings){pp_settings=jQuery.extend({animation_speed:'fast',slideshow:false,autoplay_slideshow:false,opacity:0.80,show_title:true,allow_resize:true,default_width:500,default_height:344,counter_separator_label:'/',theme:'light_rounded',hideflash:false,wmode:'opaque',autoplay:true,modal:false,overlay_gallery:true,keyboard_shortcuts:true,changepicturecallback:function(){},callback:function(){},markup:'<div class="pp_pic_holder"> \
      <div class="ppt">&nbsp;</div> \
      <div class="pp_top"> \
       <div class="pp_left"></div> \
       <div class="pp_middle"></div> \
       <div class="pp_right"></div> \
      </div> \
      <div class="pp_content_container"> \
       <div class="pp_left"> \
       <div class="pp_right"> \
        <div class="pp_content"> \
         <div class="pp_loaderIcon"></div> \
         <div class="pp_fade"> \
          <a href="#" class="pp_expand" title="Expand the image">Expand</a> \
          <div class="pp_hoverContainer"> \
           <a class="pp_next" href="#">next</a> \
           <a class="pp_previous" href="#">previous</a> \
          </div> \
          <div id="pp_full_res"></div> \
          <div class="pp_details clearfix"> \
           <p class="pp_description"></p> \
           <a class="pp_close" href="#">Close</a> \
           <div class="pp_nav"> \
            <a href="#" class="pp_arrow_previous">Previous</a> \
            <p class="currentTextHolder">0/0</p> \
            <a href="#" class="pp_arrow_next">Next</a> \
           </div> \
          </div> \
         </div> \
        </div> \
       </div> \
       </div> \
      </div> \
      <div class="pp_bottom"> \
       <div class="pp_left"></div> \
       <div class="pp_middle"></div> \
       <div class="pp_right"></div> \
      </div> \
     </div> \
     <div class="pp_overlay"></div>',gallery_markup:'<div class="pp_gallery"> \
        <a href="#" class="pp_arrow_previous">Previous</a> \
        <ul> \
         {gallery} \
        </ul> \
        <a href="#" class="pp_arrow_next">Next</a> \
       </div>',image_markup:'<img id="fullResImage" src="" />',flash_markup:'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',quicktime_markup:'<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',iframe_markup:'<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',inline_markup:'<div class="pp_inline clearfix">{content}</div>',custom_markup:''},pp_settings);var matchedObjects=this,percentBased=false,correctSizes,pp_open,pp_contentHeight,pp_contentWidth,pp_containerHeight,pp_containerWidth,windowHeight=jQuery(window).height(),windowWidth=jQuery(window).width(),pp_slideshow;doresize=true,scroll_pos=_get_scroll();jQuery(window).unbind('resize').resize(function(){_center_overlay();_resize_overlay();});if(pp_settings.keyboard_shortcuts){jQuery(document).unbind('keydown').keydown(function(e){if(typeof jQuerypp_pic_holder!='undefined'){if(jQuerypp_pic_holder.is(':visible')){switch(e.keyCode){case 37:jQuery.prettyPhoto.changePage('previous');break;case 39:jQuery.prettyPhoto.changePage('next');break;case 27:if(!settings.modal)
jQuery.prettyPhoto.close();break;};return false;};};});}
jQuery.prettyPhoto.initialize=function(e){if(e.which===2){return $(e).attr("src");}settings=pp_settings;if(jQuery.browser.msie&&parseInt(jQuery.browser.version)==6)settings.theme="light_square";_buildOverlay(this);if(settings.allow_resize)
jQuery(window).scroll(function(){_center_overlay();});_center_overlay();set_position=jQuery.inArray(jQuery(this).attr('href'),pp_images);jQuery.prettyPhoto.open();return false;}
jQuery.prettyPhoto.open=function(event){if(typeof settings=="undefined"){settings=pp_settings;if(jQuery.browser.msie&&jQuery.browser.version==6)settings.theme="light_square";_buildOverlay(event.target);pp_images=jQuery.makeArray(arguments[0]);pp_titles=(arguments[1])?jQuery.makeArray(arguments[1]):jQuery.makeArray("");pp_descriptions=(arguments[2])?jQuery.makeArray(arguments[2]):jQuery.makeArray("");isSet=(pp_images.length>1)?true:false;set_position=0;}
if(jQuery.browser.msie&&jQuery.browser.version==6)jQuery('select').css('visibility','hidden');if(settings.hideflash)jQuery('object,embed').css('visibility','hidden');_checkPosition(jQuery(pp_images).size());jQuery('.pp_loaderIcon').show();if(jQueryppt.is(':hidden'))jQueryppt.css('opacity',0).show();jQuerypp_overlay.show().fadeTo(settings.animation_speed,settings.opacity);jQuerypp_pic_holder.find('.currentTextHolder').text((set_position+1)+settings.counter_separator_label+jQuery(pp_images).size());jQuerypp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[set_position]));(settings.show_title&&pp_titles[set_position]!=""&&typeof pp_titles[set_position]!="undefined")?jQueryppt.html(unescape(pp_titles[set_position])):jQueryppt.html('&nbsp;');movie_width=(parseFloat(grab_param('width',pp_images[set_position])))?grab_param('width',pp_images[set_position]):settings.default_width.toString();movie_height=(parseFloat(grab_param('height',pp_images[set_position])))?grab_param('height',pp_images[set_position]):settings.default_height.toString();if(movie_width.indexOf('%')!=-1||movie_height.indexOf('%')!=-1){movie_height=parseFloat((jQuery(window).height()*parseFloat(movie_height)/100)-150);movie_width=parseFloat((jQuery(window).width()*parseFloat(movie_width)/100)-150);percentBased=true;}else{percentBased=false;}
jQuerypp_pic_holder.fadeIn(function(){imgPreloader="";switch(_getFileType(pp_images[set_position])){case'image':imgPreloader=new Image();nextImage=new Image();if(isSet&&set_position>jQuery(pp_images).size())nextImage.src=pp_images[set_position+1];prevImage=new Image();if(isSet&&pp_images[set_position-1])prevImage.src=pp_images[set_position-1];jQuerypp_pic_holder.find('#pp_full_res')[0].innerHTML=settings.image_markup;jQuerypp_pic_holder.find('#fullResImage').attr('src',pp_images[set_position]);imgPreloader.onload=function(){correctSizes=_fitToViewport(imgPreloader.width,imgPreloader.height);_showContent();};imgPreloader.onerror=function(){alert('Image cannot be loaded. Make sure the path is correct and image exist.');jQuery.prettyPhoto.close();};imgPreloader.src=pp_images[set_position];break;case'youtube':correctSizes=_fitToViewport(movie_width,movie_height);movie='http://www.youtube.com/v/'+grab_param('v',pp_images[set_position]);if(settings.autoplay)movie+="&autoplay=1";toInject=settings.flash_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);break;case'vimeo':correctSizes=_fitToViewport(movie_width,movie_height);movie_id=pp_images[set_position];var regExp=/http:\/\/(www\.)?vimeo.com\/(\d+)/;var match=movie_id.match(regExp);movie='http://player.vimeo.com/video/'+match[2]+'?title=0&amp;byline=0&amp;portrait=0';if(settings.autoplay)movie+="&autoplay=1;";vimeo_width=correctSizes['width']+'/embed/?moog_width='+correctSizes['width'];toInject=settings.iframe_markup.replace(/{width}/g,vimeo_width).replace(/{height}/g,correctSizes['height']).replace(/{path}/g,movie);break;case'quicktime':correctSizes=_fitToViewport(movie_width,movie_height);correctSizes['height']+=15;correctSizes['contentHeight']+=15;correctSizes['containerHeight']+=15;toInject=settings.quicktime_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,pp_images[set_position]).replace(/{autoplay}/g,settings.autoplay);break;case'flash':correctSizes=_fitToViewport(movie_width,movie_height);flash_vars=pp_images[set_position];flash_vars=flash_vars.substring(pp_images[set_position].indexOf('flashvars')+10,pp_images[set_position].length);filename=pp_images[set_position];filename=filename.substring(0,filename.indexOf('?'));toInject=settings.flash_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,filename+'?'+flash_vars);break;case'iframe':correctSizes=_fitToViewport(movie_width,movie_height);frame_url=pp_images[set_position];frame_url=frame_url.substr(0,frame_url.indexOf('iframe')-1);toInject=settings.iframe_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{path}/g,frame_url);break;case'custom':correctSizes=_fitToViewport(movie_width,movie_height);toInject=settings.custom_markup;break;case'inline':myClone=jQuery(pp_images[set_position]).clone().css({'width':settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline clearfix"></div></div>').appendTo(jQuery('body'));correctSizes=_fitToViewport(jQuery(myClone).width(),jQuery(myClone).height());jQuery(myClone).remove();toInject=settings.inline_markup.replace(/{content}/g,jQuery(pp_images[set_position]).html());break;};if(!imgPreloader){jQuerypp_pic_holder.find('#pp_full_res')[0].innerHTML=toInject;_showContent();};});return false;};jQuery.prettyPhoto.changePage=function(direction){currentGalleryPage=0;if(direction=='previous'){set_position--;if(set_position<0){set_position=0;return;};}else if(direction=='next'){set_position++;if(set_position>jQuery(pp_images).size()-1){set_position=0;}}else{set_position=direction;};if(!doresize)doresize=true;jQuery('.pp_contract').removeClass('pp_contract').addClass('pp_expand');_hideContent(function(){jQuery.prettyPhoto.open();});};jQuery.prettyPhoto.changeGalleryPage=function(direction){if(direction=='next'){currentGalleryPage++;if(currentGalleryPage>totalPage){currentGalleryPage=0;};}else if(direction=='previous'){currentGalleryPage--;if(currentGalleryPage<0){currentGalleryPage=totalPage;};}else{currentGalleryPage=direction;};itemsToSlide=(currentGalleryPage==totalPage)?pp_images.length-((totalPage)*itemsPerPage):itemsPerPage;jQuerypp_pic_holder.find('.pp_gallery li').each(function(i){jQuery(this).animate({'left':(i*itemWidth)-((itemsToSlide*itemWidth)*currentGalleryPage)});});};jQuery.prettyPhoto.startSlideshow=function(){if(typeof pp_slideshow=='undefined'){jQuerypp_pic_holder.find('.pp_play').unbind('click').removeClass('pp_play').addClass('pp_pause').click(function(){jQuery.prettyPhoto.stopSlideshow();return false;});pp_slideshow=setInterval(jQuery.prettyPhoto.startSlideshow,settings.slideshow);}else{jQuery.prettyPhoto.changePage('next');};}
jQuery.prettyPhoto.stopSlideshow=function(){jQuerypp_pic_holder.find('.pp_pause').unbind('click').removeClass('pp_pause').addClass('pp_play').click(function(){jQuery.prettyPhoto.startSlideshow();return false;});clearInterval(pp_slideshow);pp_slideshow=undefined;}
jQuery.prettyPhoto.close=function(){clearInterval(pp_slideshow);jQuerypp_pic_holder.stop().find('object,embed').css('visibility','hidden');jQuery('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animation_speed,function(){jQuery(this).remove();});jQuerypp_overlay.fadeOut(settings.animation_speed,function(){if(jQuery.browser.msie&&jQuery.browser.version==6)jQuery('select').css('visibility','visible');if(settings.hideflash)jQuery('object,embed').css('visibility','visible');jQuery(this).remove();jQuery(window).unbind('scroll');settings.callback();doresize=true;pp_open=false;delete settings;});};_showContent=function(){jQuery('.pp_loaderIcon').hide();jQueryppt.fadeTo(settings.animation_speed,1);projectedTop=scroll_pos['scrollTop']+((windowHeight/2)-(correctSizes['containerHeight']/2));if(projectedTop<0)projectedTop=0;jQuerypp_pic_holder.find('.pp_content').animate({'height':correctSizes['contentHeight']},settings.animation_speed);jQuerypp_pic_holder.animate({'top':projectedTop,'left':(windowWidth/2)-(correctSizes['containerWidth']/2),'width':correctSizes['containerWidth']},settings.animation_speed,function(){jQuerypp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(correctSizes['height']).width(correctSizes['width']);jQuerypp_pic_holder.find('.pp_fade').fadeIn(settings.animation_speed);if(isSet&&_getFileType(pp_images[set_position])=="image"){jQuerypp_pic_holder.find('.pp_hoverContainer').show();}else{jQuerypp_pic_holder.find('.pp_hoverContainer').hide();}
if(correctSizes['resized'])jQuery('a.pp_expand,a.pp_contract').fadeIn(settings.animation_speed);if(settings.autoplay_slideshow&&!pp_slideshow&&!pp_open)jQuery.prettyPhoto.startSlideshow();settings.changepicturecallback();pp_open=true;});_insert_gallery();};function _hideContent(callback){jQuerypp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');jQuerypp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed,function(){jQuery('.pp_loaderIcon').show();callback();});};function _checkPosition(setCount){if(set_position==setCount-1){jQuerypp_pic_holder.find('a.pp_next').css('visibility','hidden');jQuerypp_pic_holder.find('a.pp_next').addClass('disabled').unbind('click');}else{jQuerypp_pic_holder.find('a.pp_next').css('visibility','visible');jQuerypp_pic_holder.find('a.pp_next.disabled').removeClass('disabled').bind('click',function(){jQuery.prettyPhoto.changePage('next');return false;});};if(set_position==0){jQuerypp_pic_holder.find('a.pp_previous').css('visibility','hidden').addClass('disabled').unbind('click');}else{jQuerypp_pic_holder.find('a.pp_previous.disabled').css('visibility','visible').removeClass('disabled').bind('click',function(){jQuery.prettyPhoto.changePage('previous');return false;});};(setCount>1)?jQuery('.pp_nav').show():jQuery('.pp_nav').hide();};function _fitToViewport(width,height){resized=false;_getDimensions(width,height);imageWidth=width,imageHeight=height;if(((pp_containerWidth>windowWidth)||(pp_containerHeight>windowHeight))&&doresize&&settings.allow_resize&&!percentBased){resized=true,fitting=false;while(!fitting){if((pp_containerWidth>windowWidth)){imageWidth=(windowWidth-200);imageHeight=(height/width)*imageWidth;}else if((pp_containerHeight>windowHeight)){imageHeight=(windowHeight-200);imageWidth=(width/height)*imageHeight;}else{fitting=true;};pp_containerHeight=imageHeight,pp_containerWidth=imageWidth;};_getDimensions(imageWidth,imageHeight);};return{width:Math.floor(imageWidth),height:Math.floor(imageHeight),containerHeight:Math.floor(pp_containerHeight),containerWidth:Math.floor(pp_containerWidth)+40,contentHeight:Math.floor(pp_contentHeight),contentWidth:Math.floor(pp_contentWidth),resized:resized};};function _getDimensions(width,height){width=parseFloat(width);height=parseFloat(height);jQuerypp_details=jQuerypp_pic_holder.find('.pp_details');jQuerypp_details.width(width);detailsHeight=parseFloat(jQuerypp_details.css('marginTop'))+parseFloat(jQuerypp_details.css('marginBottom'));jQuerypp_details=jQuerypp_details.clone().appendTo(jQuery('body')).css({'position':'absolute','top':-10000});detailsHeight+=jQuerypp_details.height();detailsHeight=(detailsHeight<=34)?36:detailsHeight;if(jQuery.browser.msie&&jQuery.browser.version==7)detailsHeight+=8;jQuerypp_details.remove();pp_contentHeight=height+detailsHeight;pp_contentWidth=width;pp_containerHeight=pp_contentHeight+jQueryppt.height()+jQuerypp_pic_holder.find('.pp_top').height()+jQuerypp_pic_holder.find('.pp_bottom').height();pp_containerWidth=width;}
function _getFileType(itemSrc){if(itemSrc.match(/youtube\.com\/watch/i)){return'youtube';}else if(itemSrc.match(/vimeo\.com/i)){return'vimeo';}else if(itemSrc.indexOf('.mov')!=-1){return'quicktime';}else if(itemSrc.indexOf('.swf')!=-1){return'flash';}else if(itemSrc.indexOf('iframe')!=-1){return'iframe';}else if(itemSrc.indexOf('custom')!=-1){return'custom';}else if(itemSrc.substr(0,1)=='#'){return'inline';}else{return'image';};};function _center_overlay(){if(doresize&&typeof jQuerypp_pic_holder!='undefined'){scroll_pos=_get_scroll();titleHeight=jQueryppt.height(),contentHeight=jQuerypp_pic_holder.height(),contentwidth=jQuerypp_pic_holder.width();projectedTop=(windowHeight/2)+scroll_pos['scrollTop']-(contentHeight/2);jQuerypp_pic_holder.css({'top':projectedTop,'left':(windowWidth/2)+scroll_pos['scrollLeft']-(contentwidth/2)});};};function _get_scroll(){if(self.pageYOffset){return{scrollTop:self.pageYOffset,scrollLeft:self.pageXOffset};}else if(document.documentElement&&document.documentElement.scrollTop){return{scrollTop:document.documentElement.scrollTop,scrollLeft:document.documentElement.scrollLeft};}else if(document.body){return{scrollTop:document.body.scrollTop,scrollLeft:document.body.scrollLeft};};};function _resize_overlay(){windowHeight=jQuery(window).height(),windowWidth=jQuery(window).width();if(typeof jQuerypp_overlay!="undefined")jQuerypp_overlay.height(jQuery(document).height());};function _insert_gallery(){if(isSet&&settings.overlay_gallery&&_getFileType(pp_images[set_position])=="image"){itemWidth=52+5;navWidth=(settings.theme=="facebook")?58:38;itemsPerPage=Math.floor((correctSizes['containerWidth']-100-navWidth)/itemWidth);itemsPerPage=(itemsPerPage<pp_images.length)?itemsPerPage:pp_images.length;totalPage=Math.ceil(pp_images.length/itemsPerPage)-1;if(totalPage==0){navWidth=0;jQuerypp_pic_holder.find('.pp_gallery .pp_arrow_next,.pp_gallery .pp_arrow_previous').hide();}else{jQuerypp_pic_holder.find('.pp_gallery .pp_arrow_next,.pp_gallery .pp_arrow_previous').show();};galleryWidth=itemsPerPage*itemWidth+navWidth;jQuerypp_pic_holder.find('.pp_gallery').width(galleryWidth).css('margin-left',-(galleryWidth/2));jQuerypp_pic_holder.find('.pp_gallery ul').width(itemsPerPage*itemWidth).find('li.selected').removeClass('selected');goToPage=(Math.floor(set_position/itemsPerPage)<=totalPage)?Math.floor(set_position/itemsPerPage):totalPage;if(itemsPerPage){jQuerypp_pic_holder.find('.pp_gallery').hide().show().removeClass('disabled');}else{jQuerypp_pic_holder.find('.pp_gallery').hide().addClass('disabled');}
jQuery.prettyPhoto.changeGalleryPage(goToPage);jQuerypp_pic_holder.find('.pp_gallery ul li:eq('+set_position+')').addClass('selected');}else{jQuerypp_pic_holder.find('.pp_content').unbind('mouseenter mouseleave');jQuerypp_pic_holder.find('.pp_gallery').hide();}}
function _buildOverlay(caller){theRel=jQuery(caller).attr('rel');galleryRegExp=/\[(?:.*)\]/;isSet=(galleryRegExp.exec(theRel))?true:false;pp_images=(isSet)?jQuery.map(matchedObjects,function(n,i){if(jQuery(n).attr('rel').indexOf(theRel)!=-1)return jQuery(n).attr('href');}):jQuery.makeArray(jQuery(caller).attr('href'));pp_titles=(isSet)?jQuery.map(matchedObjects,function(n,i){if(jQuery(n).attr('rel').indexOf(theRel)!=-1)return(jQuery(n).find('img').attr('alt'))?jQuery(n).find('img').attr('alt'):"";}):jQuery.makeArray(jQuery(caller).find('img').attr('alt'));pp_descriptions=(isSet)?jQuery.map(matchedObjects,function(n,i){if(jQuery(n).attr('rel').indexOf(theRel)!=-1)return(jQuery(n).attr('title'))?jQuery(n).attr('title'):"";}):jQuery.makeArray(jQuery(caller).attr('title'));jQuery('body').append(settings.markup);jQuerypp_pic_holder=jQuery('.pp_pic_holder'),jQueryppt=jQuery('.ppt'),jQuerypp_overlay=jQuery('div.pp_overlay');if(isSet&&settings.overlay_gallery){currentGalleryPage=0;toInject="";for(var i=0;i<pp_images.length;i++){var regex=new RegExp("(.*?)\.(jpg|jpeg|png|gif)jQuery");var results=regex.exec(pp_images[i]);if(!results){classname='default';}else{classname='';}
toInject+="<li class='"+classname+"'><a href='#'><img src='"+pp_images[i]+"' width='50' alt='' /></a></li>";};toInject=settings.gallery_markup.replace(/{gallery}/g,toInject);jQuerypp_pic_holder.find('#pp_full_res').after(toInject);jQuerypp_pic_holder.find('.pp_gallery .pp_arrow_next').click(function(){jQuery.prettyPhoto.changeGalleryPage('next');jQuery.prettyPhoto.stopSlideshow();return false;});jQuerypp_pic_holder.find('.pp_gallery .pp_arrow_previous').click(function(){jQuery.prettyPhoto.changeGalleryPage('previous');jQuery.prettyPhoto.stopSlideshow();return false;});jQuerypp_pic_holder.find('.pp_content').hover(function(){jQuerypp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();},function(){jQuerypp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();});itemWidth=52+5;jQuerypp_pic_holder.find('.pp_gallery ul li').each(function(i){jQuery(this).css({'position':'absolute','left':i*itemWidth});jQuery(this).find('a').unbind('click').click(function(){jQuery.prettyPhoto.changePage(i);jQuery.prettyPhoto.stopSlideshow();return false;});});};if(settings.slideshow){jQuerypp_pic_holder.find('.pp_nav').prepend('<a href="#" class="pp_play">Play</a>')
jQuerypp_pic_holder.find('.pp_nav .pp_play').click(function(){jQuery.prettyPhoto.startSlideshow();return false;});}
jQuerypp_pic_holder.attr('class','pp_pic_holder '+settings.theme);jQuerypp_overlay.css({'opacity':0,'height':jQuery(document).height(),'width':jQuery(document).width()}).bind('click',function(){if(!settings.modal)jQuery.prettyPhoto.close();});jQuery('a.pp_close').bind('click',function(){jQuery.prettyPhoto.close();return false;});jQuery('a.pp_expand').bind('click',function(e){if(jQuery(this).hasClass('pp_expand')){jQuery(this).removeClass('pp_expand').addClass('pp_contract');doresize=false;}else{jQuery(this).removeClass('pp_contract').addClass('pp_expand');doresize=true;};_hideContent(function(){jQuery.prettyPhoto.open();});return false;});jQuerypp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').bind('click',function(){jQuery.prettyPhoto.changePage('previous');jQuery.prettyPhoto.stopSlideshow();return false;});jQuerypp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind('click',function(){jQuery.prettyPhoto.changePage('next');jQuery.prettyPhoto.stopSlideshow();return false;});_center_overlay();};return this.unbind('click').click(jQuery.prettyPhoto.initialize);};function grab_param(name,url){name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(url);return(results==null)?"":results[1];}})(jQuery);

jQuery(document).ready(function(){
			jQuery("a[rel^='lightbox']").prettyPhoto();
});