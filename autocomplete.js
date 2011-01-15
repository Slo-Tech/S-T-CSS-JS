var autoComplete =
{
	urls :
	{
		users : 'users.txt'
	},
	
	/**
	 * establishes a new auto-complete input
	 *
	 * @param el		input element
	 * @param file		file to call 
	 * @param array		array to search
	 * @param multiple	multiple options possible
	 */
	item : function(el, file, array, multiple)
	{	
		this.input = el;
		this.value = el.value;
		
		if(file)
		{
			this.url = autoComplete.urls[file];
		}
		if(array)
		{
			this.array = array;
		}
		
		this.multiple = ((multiple) ? true : false);
		
		this.resultSelected = -1;
		this.resultsLength = 0;
		
		var placeholder = document.createElement('SPAN');
		placeholder.className = 'autocomplete_placeholder';
			
		this.resultsList = document.createElement('UL');
		this.resultsList.className = 'autocomplete_list';
		
		this.height = this.input.offsetHeight;
		
		this.resultsList.style.lineHeight = this.height + 'px';
		this.resultsList.style.width = this.input.offsetWidth - 3 + 'px';
		this.resultsList.style.top = this.height + 1 + 'px';
		
		placeholder.appendChild(this.resultsList);
		
		if(el.nextSibling)
		{
			el.parentNode.insertBefore(placeholder, el.nextSibling);
		}
		else
		{
			el.parentNode.appendChild(placeholder);
		}
		
		this.input.onkeypress = autoComplete.keypress;
		this.input.onkeyup = autoComplete.keyup;
		this.input.onblur = autoComplete.blur;
		this.input.item = this;
	},
	
	keypress : function(e)
	{
		switch(key.which(e))
		{
			case key.KEYDN:
			case key.KEYUP:
			case key.ENTER:
				return false;
				break;
				
			default:
				break;
		}
	},
	
	keyup : function(e)
	{
		var item = this.item;
		
		switch(key.which(e))
		{
			case key.KEYDN:
				if(item.resultSelected < item.resultsLength - 1)
				{
					if(item.resultSelected >= 0)
					{
						item.resultsList.childNodes[item.resultSelected].className = '';
					}
					
					item.resultSelected++;
					
					autoComplete.scrollList(item);
					
					item.resultsList.childNodes[item.resultSelected].className = 'selected';
				}
				return false;
				break;
				
			case key.KEYUP:
				if(item.resultSelected > 0)
				{
					item.resultsList.childNodes[item.resultSelected].className = '';
					item.resultSelected--;
					
					autoComplete.scrollList(item);
					
					item.resultsList.childNodes[item.resultSelected].className = 'selected';
				}
				return false;
				break;
				
			case key.ENTER:
				if(item.resultSelected >= 0)
				{
					autoComplete.setValue(item, item.resultsList.childNodes[item.resultSelected].innerHTML);
				}
				else
				{
					dom.nextInput(item.input)
				}
				autoComplete.removeResults(item);
				return false;
				break;
				
			case key.ESC:
				autoComplete.removeResults(item);
				return false;
				break;
			
			default:
				if(item.value != item.input.value)
				{
					item.value = item.input.value;
					
					if(item.url)
					{
						request
						(
							item.url,
							function(response)
							{
								autoComplete.showFilteredResults(item, eval(response));
							}
						);
					}
					else if(item.array)
					{
						var array = [];
						
						if(item.multiple)
						{
							var words = item.input.value.split(',');
							var word = words[words.length - 1].trim().toLowerCase()
						}
						else
						{
							var word = item.input.value.toLowerCase();
						}
						
						if(word != '')
						{
							for(var i = 0; i < item.array.length; i++)
							{
								if(item.array[i].toLowerCase().indexOf(word) == 0)
								{
									array[array.length] = item.array[i];
								}
							}
							autoComplete.showFilteredResults(item, array);
						}
						else
						{
							autoComplete.removeResults(item);
						}
					}
				}
				break;
		}
	},
	
	blur : function()
	{
		autoComplete.removeResults(this.item);
	},
	
	scrollList : function(item)
	{
		if(item.resultsList.scrollTop / item.height + 4 < item.resultSelected)
		{							
			item.scrolled = item.resultSelected - 4;
				
			item.resultsList.scrollTop = item.height * item.scrolled;
		}
		else if(item.resultsList.scrollTop / item.height > item.resultSelected)
		{							
			item.scrolled = item.resultSelected;
				
			item.resultsList.scrollTop = item.height * item.scrolled;
		}
	},
	
	/**
	 * shows filtered results in the right ul
	 *
	 * @param item			which item
	 * @param array			array to work with
	 */
	showFilteredResults : function(item, array)
	{	
		if(item.value == '')
		{
			autoComplete.removeResults(item);
		}
		else
		{
			var newHtml = '';
			
			item.resultSelected = -1;
			item.resultsLength = 0;
			item.resultsList.scrollTop = 0;
			item.resultsList.innerHTML = '';
			
			for(var i = 0; i < array.length; i++)
			{
				var newLi = document.createElement('LI');
				newLi.id = 'ac' + item.arrayName + i;
				newLi.innerHTML = array[i];
				
				newLi.item = item;
				newLi.onmouseover = autoComplete.mouseoverLi;
				newLi.onmousedown = autoComplete.mousedownLi;
				
				item.resultsList.appendChild(newLi);
				item.resultsLength++;
			}
			
			if(item.resultsLength == 0)
			{
				autoComplete.removeResults(item);
			}
			else
			{
				if(item.resultsLength > 5)
				{
					item.resultsList.style.height = 5 * item.height + 'px';
				}
				else
				{
					item.resultsList.style.height = item.resultsLength * item.height + 'px'; 
				}
				
				item.resultsList.style.display = 'block';
			}
		}
	},
	
	mouseoverLi : function()
	{
		if(this.item.resultSelected >= 0)
		{
			this.item.resultsList.childNodes[this.item.resultSelected].className = '';
		}
		this.className = 'selected';
		this.item.resultSelected = this.id.replace('ac' + this.item.arrayName, '');
	},
	
	mousedownLi : function()
	{
		autoComplete.setValue(this.item, this.innerHTML);
		removeResults(this.item);
	},
	
	/**
	 * removes the results ul in auto-complete
	 *
	 * @param item		item we are working in
	 */
	removeResults : function(item)
	{
		item.resultsList.style.display = 'none';
		item.resultSelected = -1;
		item.resultsLength = 0;
		item.resultsList.scrollTop = 0;
		item.resultsList.innerHTML = '';
	},
	
	/**
	 * sets the value of an autocomplete item
	 *
	 * @param item			the item
	 * @param value			new value
	 */
	setValue : function(item, value)
	{
		var newValue = value.replace('&lt;', '<').replace('&gt;', '>');
						
		if(item.multiple)
		{
			var words = item.input.value.split(',');
			var tempValue = '';
			
			for(var i = 0; i < words.length - 1; i++)
			{
				tempValue += words[i].trim() + ', ';
			}
			
			item.input.value = tempValue + newValue + ', ';
		}
		else
		{
			item.input.value = newValue;
		}
		
		item.value = item.input.value;
		
		
		/* send caret to end of input */
		if(item.input.setSelectionRange)
		{
			item.input.setSelectionRange(item.value.length, item.value.length);
		}
		else if(item.input.createRange)
		{
			var range = item.input.createRange();
			range.collapse(true);
			range.moveEnd('character', item.value.length - 1);
			range.moveStart('character', item.value.length - 1);
			range.select();
		}
	},
	
	prepare : function()
	{
		forAll
		(
			_('content'),
			'input',
			function()
			{			
				var elClass = this.className;
				if(this.type == 'text' && elClass.indexOf('autocomplete') != -1)
				{
					classSplit = elClass.split(' ');
					for(var j = 0; j < classSplit.length; j++)
					{
						if(classSplit[j].indexOf('autocomplete') != -1)
						{
							new autoComplete.item(this, classSplit[j].split('_')[1]);
							break;
						}
					}
				}
			}
		)
	}
}
onLoad(autoComplete.prepare);
