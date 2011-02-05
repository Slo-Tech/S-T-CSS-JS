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
