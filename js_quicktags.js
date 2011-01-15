// JS QuickTags version 1.2
//
// Copyright (c) 2002-2005 Alex King
// http://www.alexking.org/
//
// Licensed under the LGPL license
// http://www.gnu.org/copyleft/lesser.html
//
// **********************************************************************
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
// **********************************************************************
//
// This JavaScript will insert the tags below at the cursor position in IE and 
// Gecko-based browsers (Mozilla, Camino, Firefox, Netscape). For browsers that 
// do not support inserting at the cursor position (Safari, OmniWeb) it appends
// the tags to the end of the content.
//
// The variable 'edCanvas' must be defined as the <textarea> element you want 
// to be editing in. See the accompanying 'index.html' page for an example.

// This script has been heavily modified to fit Slo-Tech

var edit =
{
	openTags : [],
	field : null,
	popup : null,
	
	buttons: [],
	smiles : [],
	symbols : [],
	
	smilePath : (location.protocol=='https:' ? 'https://static.slo-tech.com/stili/img/smiles/' : 'http://static.slo-tech.com/stili/img/smiles/'),
	imagePath : (location.protocol=='https:' ? 'https://static.slo-tech.com/stili/img/toolbar/' : 'http://static.slo-tech.com/stili/img/toolbar/'),

	button : function(id, imageSrc, title, tagStart, tagEnd, access, open)
	{
		this.id = id;				// used to name the toolbar button
		this.imageSrc = imageSrc;	// image on button
		this.title = title;			// title tag
		this.tagStart = tagStart; 	// open tag
		this.tagEnd = tagEnd;		// close tag
		this.access = access;		// access key
		this.open = open;			// set to -1 if tag does not need to be closed
	},
	
	symbol : function(entity, name)
	{
		this.entity = entity;
		this.name = name;
	},
	
	smile : function(src, name)
	{
		this.src = src;
		this.name = name;
	},

	drawButton : function(button, i) // returns html for a button
	{
		if(button == 'separator')
		{
			return '<div class="separator"></div>';
		}
		else
		{
			if (button.access)
			{
				var accesskey = ' accesskey = "' + button.access + '"'
			}
			else
			{
				var accesskey = '';
			}
			switch (button.id)
			{
				case 'ed_img':
					return '<a href="#" id="' + button.id + '" ' + accesskey + ' onclick="edit.insertImage(edit.field);return false;" title="' + button.title + '"><img src="' + edit.imagePath + button.imageSrc + '" alt="' + button.title + '" /></a>';
					break;
					
				case 'ed_link':
					return '<a href="#" id="' + button.id + '" ' + accesskey + ' onclick="edit.insertLink(edit.field, ' + i + ');return false;" title="' + button.title + '"><img src="' + edit.imagePath + button.imageSrc + '" alt="' + button.title + '" /></a>';
					break;
					
				case 'ed_smile':
					var retVal = '<div class="container">' +
								'<a href="#" id="' + button.id + '" ' + accesskey + ' onclick="edit.openPopup(edit.field, ' + i + ');return false;" title="' + button.title + '"><img src="' + edit.imagePath + button.imageSrc + '" alt="' + button.title + '" /></a>' +
									'<ul id="' + button.id + '_popup" class="popup" style="width:100px;">';
									
					var symbolsLength = edit.smiles.length;
					var j;
					
					for(j = 0; j < symbolsLength; j++)
					{
						retVal += '<li><a href="#" onclick="edit.insertSmile(edit.field, edit.smiles[' + j + ']);edit.closePopup(edit.field, ' + i + ');return false;" title="' + edit.smiles[j].name + '"><img src="' + edit.smilePath + edit.smiles[j].src + '" alt="' + edit.smiles[j].name + '" /></a></li>';
					}
					retVal +=		'</ul>' +
								'</a>' +
							'</div>';
							
					return retVal;
					break;
					
				case 'ed_symbol':
					var retVal = '<div class="container">' +
								'<a href="#" id="' + button.id + '" ' + accesskey + ' onclick="edit.openPopup(edit.field, ' + i + ');return false;" title="' + button.title + '"><img src="' + edit.imagePath + button.imageSrc + '" alt="' + button.title + '" /></a>' +
									'<ul id="' + button.id + '_popup" class="popup" style="width:60px;">';
									
					var symbolsLength = edit.symbols.length;
					var j;
					
					for(j = 0; j < symbolsLength; j++)
					{
						retVal += '<li><a href="#" onclick="edit.insertSymbol(edit.field, edit.symbols[' + j + ']);edit.closePopup(edit.field, ' + i + ');return false;" title="' + edit.symbols[j].name + '">' + edit.symbols[j].entity + '</a></li>';
					}
					retVal +=		'</ul>' +
								'</a>' +
							'</div>';
							
					return retVal;
					break;
					
				default:
					return '<a href="#" id="' + button.id + '" ' + accesskey + ' onclick="edit.insertTag(edit.field, ' + i + ');return false;" title="' + button.title + '"><img src="' + edit.imagePath + button.imageSrc + '" alt="' + button.title + '" /></a>';
					break;
			}
		}
	},

	addTag : function(button) // inserts start tag
	{
		if (edit.buttons[button].tagEnd != '')
		{
			edit.openTags[edit.openTags.length] = button;
			//document.getElementById(edit.buttons[button].id).innerHTML = '/' + document.getElementById(edit.buttons[button].id).innerHTML;
			document.getElementById(edit.buttons[button].id).className = 'open';
		}
	},

	removeTag : function(button) // inserts end tag
	{
		for (i = 0; i < edit.openTags.length; i++)
		{
			if (edit.openTags[i] == button)
			{
				edit.openTags.splice(i, 1);
				//document.getElementById(edit.buttons[button].id).innerHTML = document.getElementById(edit.buttons[button].id).innerHTML.replace('/', '');
				document.getElementById(edit.buttons[button].id).className = '';
			}
		}
	},

	checkOpenTags : function(button) // check open tags
	{
		var tag = 0;
		for (i = 0; i < edit.openTags.length; i++)
		{
			if (edit.openTags[i] == button)
			{
				tag++;
			}
		}
		if (tag > 0)
		{
			return true; // tag found
		}
		else
		{
			return false; // tag not found
		}
	},

	closeAllTags : function() // closes all open tags
	{ 
		var count = edit.openTags.length;
		for (o = 0; o < count; o++)
		{
			edit.insertTag(edit.field, edit.openTags[edit.openTags.length - 1]);
		}
		
		edit.field.focus();
	},

	toolbar : function() // returns html for toolbar
	{
		var div = document.createElement('div');
		div.className = 'buttons';
		
		var html = '';
		var i;
		var buttonsLength = edit.buttons.length;
		
		for (i = 0; i < buttonsLength; i++)
		{
			html += edit.drawButton(edit.buttons[i], i);
		}
	
		html +=
			'<a href="#" id="ed_close" onclick="edit.closeAllTags();return false;" title="Zaključi vse stile"><img src="' + edit.imagePath + 'cross.png" alt="Zaključi vse stile" /></a><div class="clear"></div>';
	
		div.innerHTML = html;
		
		return div;
	},

	insertTag : function(myField, i) // insertion code
	{
		//IE support
		if (document.selection)
		{
			myField.focus();
			sel = document.selection.createRange();
			if (sel.text.length > 0)
			{
				sel.text = edit.buttons[i].tagStart + sel.text + edit.buttons[i].tagEnd;
			}
			else
			{
				if (!edit.checkOpenTags(i) || edit.buttons[i].tagEnd == '')
				{
					sel.text = edit.buttons[i].tagStart;
					edit.addTag(i);
				}
				else {
					sel.text = edit.buttons[i].tagEnd;
					edit.removeTag(i);
				}
			}
			myField.focus();
		}
		//MOZILLA/NETSCAPE support
		else if (myField.selectionStart || myField.selectionStart == '0')
		{
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			var cursorPos = endPos;
			var scrollTop = myField.scrollTop;
			if (startPos != endPos)
			{
				myField.value = myField.value.substring(0, startPos)
							  + edit.buttons[i].tagStart
							  + myField.value.substring(startPos, endPos) 
							  + edit.buttons[i].tagEnd
							  + myField.value.substring(endPos, myField.value.length);
				cursorPos += edit.buttons[i].tagStart.length + edit.buttons[i].tagEnd.length;
			}
			else
			{
				if (!edit.checkOpenTags(i) || edit.buttons[i].tagEnd == '')
				{
					myField.value = myField.value.substring(0, startPos) 
								  + edit.buttons[i].tagStart
								  + myField.value.substring(endPos, myField.value.length);
					edit.addTag(i);
					cursorPos = startPos + edit.buttons[i].tagStart.length;
				}
				else
				{
					myField.value = myField.value.substring(0, startPos) 
								  + edit.buttons[i].tagEnd
								  + myField.value.substring(endPos, myField.value.length);
					edit.removeTag(i);
					cursorPos = startPos + edit.buttons[i].tagEnd.length;
				}
			}
			myField.focus();
			myField.selectionStart = cursorPos;
			myField.selectionEnd = cursorPos;
			myField.scrollTop = scrollTop;
		}
		else
		{
			if (!edit.checkOpenTags(i) || edit.buttons[i].tagEnd == '')
			{
				myField.value += edit.buttons[i].tagStart;
				edAddTag(i);
			}
			else
			{
				myField.value += edit.buttons[i].tagEnd;
				edRemoveTag(i);
			}
			myField.focus();
		}
	},

	insertContent : function(myField, myValue) // insert content
	{
		//IE support
		if (document.selection)
		{
			myField.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			myField.focus();
		}
		//MOZILLA/NETSCAPE support
		else if (myField.selectionStart || myField.selectionStart == '0')
		{
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			var scrollTop = myField.scrollTop;
			myField.value = myField.value.substring(0, startPos)
						  + myValue 
						  + myField.value.substring(endPos, myField.value.length);
			myField.focus();
			myField.selectionStart = startPos + myValue.length;
			myField.selectionEnd = startPos + myValue.length;
			myField.scrollTop = scrollTop;
		}
		else
		{
			myField.value += myValue;
			myField.focus();
		}
	},

	insertLink : function(myField, i, defaultValue) // insert a link
	{
		if (!defaultValue)
		{
			defaultValue = 'http://';
		}
		if (!edit.checkOpenTags(i))
		{
			var URL = prompt('Enter the URL', defaultValue);
			if (URL)
			{
				edit.buttons[i].tagStart = '<a href="' + URL + '">';
				edit.insertTag(myField, i);
			}
		}
		else
		{
			edit.insertTag(myField, i);
		}
	},
	
	insertImage : function(myField) { // insert an image
		var myValue = prompt('Vpiši URL naslov slike', 'http://');
		if (myValue)
		{
			myValue = '[st.slika ' 
					+ myValue 
					+ ' ' + prompt('Vnesi opis', '') 
					+ ']';
					
			edit.insertContent(myField, myValue);
		}
	},
	
	insertSmile : function(myField, smile) // inserts a symbol
	{
		edit.insertContent(myField, '[' + smile.name + ']');
	},
	
	insertSymbol : function(myField, symbol) // inserts a symbol
	{
		edit.insertContent(myField, symbol.entity);
	},
	
	openPopup : function(myField, i) { // insert an image
		edit.closePopup();
		
		edit.popup = document.getElementById(edit.buttons[i].id + '_popup');
		edit.popup.style.display = 'block';
		
		/*document.onclick = function(e)
		{
			var target = key.target(e);
			if(edit.popup.id.indexOf(target.className) == -1 && !dom.hasParent(target, edit.popup))
			{
				edit.closePopup();
			}
		}*/
		
		//edit.buttons[i].focus();
		document.onclick = function(e)
		{
			var target = key.target(e);
			
			if(target.parentNode == document.getElementById(edit.popup.id.replace('_popup', '')) || target == edit.popup || dom.hasParent(target, edit.popup))
			{
				// do nothing
			}
			else
			{
				edit.closePopup();
			}
		}
	},
	
	closePopup : function(myField, i) { // insert an image
		if(edit.popup)
		{
			edit.popup.style.display = 'none';
			document.onclick = null;
		}
	}
};

edit.buttons = [
	new edit.button(
		'ed_bold',
		'bold.png',
		'Odebeljeno',
		'<strong>',
		'</strong>',
		'b'
	),

	new edit.button(
		'ed_italic',
		'italic.png',
		'Kurzivno',
		'<em>',
		'</em>',
		'i'
	),
	
	new edit.button(
		'ed_under',
		'underline.png',
		'Podčrtano',
		'<u>',
		'</u>',
		'u'
	),

	'separator',

	new edit.button( // special case
		'ed_link',
		'link.png',
		'Vstavi povezavo',
		'',
		'</a>',
		'a'
	),

	new edit.button( // special case
		'ed_img',
		'picture.png',
		'Vstavi sliko',
		'',
		'',
		'm',
		-1
	),
	
	'separator',

	new edit.button(
		'ed_block',
		'quote.png',
		'Vstavi citat',
		'<blockquote>',
		'</blockquote>',
		'q'
	),

	new edit.button(
		'ed_code',
		'tag.png',
		'Vstavi kodo',
		'[st.koda]',
		'[/st.koda]',
		'c'
	),
	
	'separator',

	new edit.button(
		'ed_sup',
		'superscript.png',
		'Nadpisano',
		'<sup>',
		'</sup>'
	),

	new edit.button(
		'ed_sub',
		'subscript.png',
		'Podpisano',
		'<sub>',
		'</sub>'
	),

	new edit.button(
		'ed_ul',
		'bullets.png',
		'Seznam',
		'<ul>\n',
		'</ul>\n\n'
	),

	new edit.button(
		'ed_ol',
		'numbers.png',
		'Oštevilčen seznam',
		'<ol>\n',
		'</ol>\n\n'
	),

	/*new edit.button(
		'ed_li'
		,'LI'
		,'\t<li>'
		,'</li>\n'
		,'l'
	),*/
	
	'separator',
	
	new edit.button( // special case
		'ed_symbol',
		'symbol.png',
		'Vstavi simbol',
		'',
		'',
		null
		-1
	),

	new edit.button( // special case
		'ed_smile',
		'smile.png',
		'Vstavi smajl',
		'',
		'',
		null
		-1
	),
	
	'separator'
];

edit.symbols =
[
	new edit.symbol('&Alpha;', 'Alfa'),
	new edit.symbol('&Beta;', 'Beta'),
	new edit.symbol('&Gamma;', 'Gama'),
	new edit.symbol('&Delta;', 'Delta'),
	new edit.symbol('&Epsilon;', 'Epsilon'),
	new edit.symbol('&Zeta;', 'Zeta'),
	new edit.symbol('&Eta;', 'Eta'),
	new edit.symbol('&Theta;', 'Theta'),
	new edit.symbol('&Iota;', 'Iota')
];

edit.smiles =
[
	new edit.smile('icon_smile.gif', ':)'),
	new edit.smile('icon_biggrin.gif', ':D'),
	new edit.smile('icon_lol.gif', ':))'),
	new edit.smile('icon_confused.gif', ':|'),
	new edit.smile('icon_cool.gif', '8-)'),
	new edit.smile('icon_sad.gif', ':('),
	new edit.smile('icon_twisted.gif', '>:D'),
	new edit.smile('icon_redface.gif', ':8'),
	new edit.smile('icon_mad.gif', ';(('),
	new edit.smile('icon_eek.gif', '8-O'),
	new edit.smile('icon_surprised.gif', ':O'),
	new edit.smile('icon_cry.gif', ':\'('),
	new edit.smile('icon_evil.gif', ';('),
	new edit.smile('icon_razz.gif', ':P'),
	new edit.smile('icon_wink.gif', ';)')
];


function $m(theVar){
	return document.getElementById(theVar)
}
function remove(theVar){
	var theParent = theVar.parentNode;
	theParent.removeChild(theVar);
}
function addEvent(obj, evType, fn){
	if(obj.addEventListener)
	    obj.addEventListener(evType, fn, true)
	if(obj.attachEvent)
	    obj.attachEvent("on"+evType, fn)
}
function removeEvent(obj, type, fn){
	if(obj.detachEvent){
		obj.detachEvent('on'+type, fn);
	}else{
		obj.removeEventListener(type, fn, false);
	}
}
function isWebKit(){
	return RegExp(" AppleWebKit/").test(navigator.userAgent);
}
function ajaxUpload(form,url_action,id_element,html_show_loading,html_error_http){
	var detectWebKit = isWebKit();
	form = typeof(form)=="string"?$m(form):form;
	var erro="";
	if(form==null || typeof(form)=="undefined"){
		erro += "The form of 1st parameter does not exists.\n";
	}else if(form.nodeName.toLowerCase()!="form"){
		erro += "The form of 1st parameter its not a form.\n";
	}
	if($m(id_element)==null){
		erro += "The element of 3rd parameter does not exists.\n";
	}
	if(erro.length>0){
		alert("Error in call ajaxUpload:\n" + erro);
		return;
	}
	var iframe = document.createElement("iframe");
	iframe.setAttribute("id","ajax-temp");
	iframe.setAttribute("name","ajax-temp");
	iframe.setAttribute("width","0");
	iframe.setAttribute("height","0");
	iframe.setAttribute("border","0");
	iframe.setAttribute("style","width: 0; height: 0; border: none;");
	form.parentNode.appendChild(iframe);
	window.frames['ajax-temp'].name="ajax-temp";
	var doUpload = function(){
		removeEvent($m('ajax-temp'),"load", doUpload);
		var cross = "javascript: ";
		cross += "window.parent.$m('"+id_element+"').innerHTML = document.body.innerHTML; void(0);";
		$m(id_element).innerHTML = html_error_http;
		$m('ajax-temp').src = cross;
		if(detectWebKit){
        	remove($m('ajax-temp'));
        }else{
        	setTimeout(function(){ remove($m('ajax-temp'))}, 250);
        }
    }
	addEvent($m('ajax-temp'),"load", doUpload);
	form.setAttribute("target","ajax-temp");
	form.setAttribute("action",url_action);
	form.setAttribute("method","post");
	form.setAttribute("enctype","multipart/form-data");
	form.setAttribute("encoding","multipart/form-data");
	if(html_show_loading.length > 0){
		$m(id_element).innerHTML = html_show_loading;
	}
	form.submit();
}
