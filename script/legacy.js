	function onLoad(func)
	{
		if(window.addEventListener)
		{
			window.addEventListener('load', func, false);
		}
		else if (window.attachEvent)
		{
			window.attachEvent('onload', func);
		}
	}


/* some all-round useful functions */
	/**
	 * adds a function to the onload event handler
	 *
	 * @param func			function to add
	 */
	
	/**
	 * document.getElementById() shortcut
	 * 
	 * @param id		element id
	 */
	function _(id)
	{
		return document.getElementById(id);
	}
	
	/**
	 * trim a string
	 */
	String.prototype.trim = function()
	{
		return this.replace(/^\s*|\s*$/g,"");
	};
	
	/**
	 * execute a function on every element with a specific tag in the container
	 *
	 * @param container		container element
	 * @param tag			tag to match
	 * @rapam func			function to execute
	 */
	forAll = function(container, tag, func)
	{
		var elArray = container.getElementsByTagName(tag);
		var elArrayLength = elArray.length;
		var i;
		
		for(i = 0; i < elArrayLength; i++)
		{
			elArray[i].exec = func;
			elArray[i].exec();
		}
	};


/**
 * some function to help with the dom
 */
var dom =
{
	/**
	 * checks if an element is the other element's parent
	 *
	 * @param el		reference element
	 * @param parent	element maybe a parent of el
	 */
	hasParent : function(el, parent)
	{
		var parentEl = el.parentNode;
		while(parentEl !==document.body)
		{
			if(parentEl === parent)
			{
				return true;
			}
			else
			{
				parentEl = parentEl.parentNode;
			}
		}
		return false;
	},
	
	tabIndexes : [null]
};


/* fresh news */
var freshNews =
{
	wait : 6000,			// time to wait before scrolling to the next item
	step : 0,				// step of the scrolling process
	curItem : 0,			// item currently shown
	
	mouseover : function()
	{
		window.clearTimeout(freshNews.to);
		if(freshNews.step !==0)
		{
			if(freshNews.step >= freshNews.height / 2)
			{
				if(freshNews.curItem < freshNews.count - 1)
				{
					freshNews.curItem++;
				}
				else
				{
					freshNews.curItem = 0;
				}
			}
			freshNews.step = 0;
			freshNews.div.scrollTop = ( freshNews.curItem * freshNews.height );
		}
		
		freshNews.showAll();
	},
	
	mouseout : function(e)
	{
	  var mouseX = e.pageX;
	  var mouseY = e.pageY;
		
		var topX = freshNews.divAll.offsetTop;
		var topY = freshNews.divAll.offsetLeft;
		if ( !(mouseX >= topX && (mouseX <= topX+freshNews.divAll.clientWidth)) && !(mouseY >= topY && mouseY <= (topY + freshNews.divAll.clientHeight) )) {
		  freshNews.hideAll();
		}
	},
	
	scroll : function()
	{
		freshNews.step += 1;
		
		var offset = ( freshNews.curItem * freshNews.height + freshNews.step );
		
		freshNews.div.scrollTop = offset;
			
		if(freshNews.step < freshNews.height)
		{
			freshNews.to = window.setTimeout("freshNews.scroll()", 30);
		}
		else
		{
			freshNews.step = 0;
			if(freshNews.curItem < freshNews.count - 1)
			{
				freshNews.curItem++;
			}
			else
			{
				freshNews.curItem = 0;
				freshNews.div.scrollTop = 0;
			}
			freshNews.to = window.setTimeout("freshNews.scroll()", freshNews.wait);
		}
	},
	
	/**
	 * shows all news
	 */
	showAll : function()
	{
		window.clearTimeout(freshNews.to);
		freshNews.divAll.style.display = 'block';
	},
	
	/**
	 * hides all news
	 */
	hideAll : function()
	{
		window.clearTimeout(freshNews.to);
		
		if(freshNews.divAll.style.display === 'none')
		{
			freshNews.to = window.setTimeout("freshNews.scroll()", freshNews.wait);
		}
		else
		{
			freshNews.to = window.setTimeout
							(
								function()
								{
									_('fresh_news_all').style.display = 'none';
									freshNews.to = window.setTimeout("freshNews.scroll()", freshNews.wait);
								},
								400
							);
		}
	},
	
	prepare : function()
	{		
		freshNews.div = _('fresh_news');
		var li = freshNews.div.getElementsByTagName('LI');
		freshNews.count = li.length;
	
		if(freshNews.count > 1)
		{
			freshNews.divAll = _('fresh_news').cloneNode(true);
			freshNews.divAll.id = 'fresh_news_all';
			_('head').appendChild(freshNews.divAll);
		
			freshNews.div.scrollTop = 0;
			
			var i;
			var liLength = li.length;
			
			freshNews.height = li[0].offsetHeight;
			freshNews.divAll.style.height = li.length * freshNews.height + 'px';
		
			for(i = 0; i < liLength; i++)
			{
				li[i].style.height = freshNews.height + 'px';
			}
				
			var clone = li[0].cloneNode(true);
			freshNews.div.appendChild(clone);
			freshNews.to = window.setTimeout("freshNews.scroll()", freshNews.wait);
			
			var config = {    
			 sensitivity: 3, // number = sensitivity threshold (must be 1 or higher)    
			 interval: 300, // number = milliseconds for onMouseOver polling interval    
			 over: freshNews.mouseover, // function = onMouseOver callback (REQUIRED)    
			 timeout: 500, // number = milliseconds delay before onMouseOut    
			 out: freshNews.mouseout // function = onMouseOut callback (REQUIRED)    
			};

			jQuery("#fresh_news").hoverIntent( config );
			jQuery("#fresh_news_title").hoverIntent( config );
			$('#fresh_news_all').mouseout(freshNews.mouseout);
		}
	}
};
onLoad(freshNews.prepare);

/* controls (spremeni, brisi, ...) */
var controls =
{
	prepare : function()
	{
		var divClass;
		var textareaDiv = null;
		
		var editField = _('content_field');
		if(editField)
		{
			var controlsDiv = edit.toolbar();
			edit.field = editField;
			editField.parentNode.parentNode.insertBefore(controlsDiv, editField.parentNode);
			
			
			jQuery('#content_field:not(.processed)').each(function(){
				var form_height = $.cookie('form_height');
				if (form_height){
					$(this).height(parseInt(form_height, 10));
				}
			});
			jQuery('#content_field:not(.processed)').TextAreaResizer();
		}
	},
	
	to : null,
	curEl : null,
	menuShown : false,
	
	menu :
	{
		mouseover : function()
		{
			if (!controls.curEl)
			{
				controls.curEl = this.parentNode.parentNode;
				controls.to = window.setTimeout("controls.menu.show()", 100);
			}
			else if(controls.menuShown && (controls.curEl === this || controls.curEl === this.parentNode.parentNode))
			{
				window.clearTimeout(controls.to);
			}
			else if(controls.curEl)
			{
				window.clearTimeout(controls.to);
				controls.menu.hide();
				controls.curEl = this.parentNode.parentNode;
				controls.menu.show();
			}
		},
		
		mouseout : function()
		{
			if (controls.curEl && !controls.menuShown)
			{
				window.clearTimeout(controls.to);
				controls.curEl = null;
			}
			else if(controls.menuShown)
			{
				window.clearTimeout(controls.to);
				controls.to = window.setTimeout("controls.menu.hide()", 100);
			}
		},
		
		show : function()
		{
			if(controls.curEl)
			{
				controls.curEl.onmouseout = controls.menu.mouseout;
				controls.curEl.onmouseover = controls.menu.mouseover;
				controls.curEl.className = 'opened';
				controls.menuShown = true;
			}
		},
		
		hide : function()
		{
			if(controls.curEl)
			{
				controls.curEl.onmouseout = null;
				controls.curEl.onmouseover = null;
				
				controls.curEl.className = 'closed';
				controls.curEl = null;
				controls.menuShown = false;
			}
			window.clearTimeout(controls.to);
		}
	}
};
onLoad(controls.prepare);
