var calendar =
{
	curEl : null,		// element currently being fake-focused
	popup : null,		// element holding the calendar
	
	curDate : null,		// current date
	
	oldClass : null,
	
	/**
	 * establishes a new calendar item
	 */
	item : function(el)
	{
		var cal_placeholder = document.createElement("span");
		cal_placeholder.className = 'cal_placeholder';
		//cal_placeholder.innerHTML = '&nbsp;';
		
		//calendar.inputs[calendar.inputs.length] = el;
		
		var date = document.createElement("a");
		date.className = 'date_icon';
		date.href = '#';
		date.title = 'odpri koledar';
		date.input = el;
		date.onclick = calendar.show; //new Function("calendar.show();this.blur();return false;");
		
		var theHeight = el.offsetHeight;
		date.style.height = ((theHeight > 14) ? theHeight : 14) + 'px';
		
		cal_placeholder.appendChild(date);
		el.parentNode.appendChild(cal_placeholder);
	},
	
	/**
	 * fakes a focus on an element (adds focus to the className)
	 *
	 * @param el		the element
	 */
	focus : function(el)
	{
		calendar.rmFocus();
		calendar.curEl = el;
		calendar.oldClass = el.className.toString();
		el.className = el.className + ' focus';
	},
	
	/**
	 * removes a fake focus from the "focused" element
	 */
	rmFocus : function()
	{
		if(calendar.curEl)
		{
			calendar.curEl.className = calendar.oldClass;
		}
	},
	
	/**
	 * shows calendar popup
	 */
	show : function()
	{
		calendar.close();
		calendar.focus(this.input);
		
		calendar.popup = document.createElement("div");
		calendar.popup.id = 'calendar';
		
		calendar.popup.innerHTML =
			'<div class="controls">' +
				'<a href="#" id="cal_prev" title="prejsnji mesec">&laquo;</a>' +
				'<a href="#" id="cal_cur" title="trenutni mesec">#</a>' +
				'<a href="#" id="cal_next" title="naslednji mesec">&raquo;</a>' +
			'</div>' +
			'<h5>&nbsp;</h5>' +
			'<hr />' +
			'<div id="cal_table">' +
			'</div>';
			
		this.parentNode.appendChild(calendar.popup);
			
		calendar.month		= calendar.popup.getElementsByTagName('H5')[0];
		calendar.table		= document.getElementById('cal_table');
		
		document.onclick = function(e)
		{
			var el = e.target;
			
			if(el.id == 'cal_prev')
			{
				calendar.setMonth('prev');
				el.blur();
			}
			else if(el.id == 'cal_cur')
			{
				calendar.setMonth('current');
				el.blur();
			}
			else if(el.id == 'cal_next')
			{
				calendar.setMonth('next');
				el.blur();
			}
			else if(el.className == 'cal_click_day')
			{
				var day = el.innerHTML;
				var month = calendar.curDate.getMonth();
				var year = calendar.curDate.getFullYear();
			
				calendar.curEl.value = day + '. ' + calendar.shortMonthNames[month] + ' ' + year ;
				calendar.close();
				
			}
			else if(
				el.className == 'date_icon' ||
				el == calendar.curEl ||
				el == calendar.popup ||
				dom.hasParent(el, calendar.popup)
			)
			{
				// do nothing
			}
			else
			{
				calendar.close();
				return true;
			}
			
			return false;
		}
		
		var checkDate = calendar.curEl.value.split('.');
		if(checkDate[1] && checkDate[2])
		{
			var month = checkDate[1] * 1;
			var year = checkDate[2] * 1;
			
			if(month > 0 && month < 13 && (year > 0 || year < 0))
			{
				calendar.curDate = new Date();
				calendar.curDate.setMonth(month - 1);
				calendar.curDate.setFullYear(year);
				calendar.setMonth();
			}
			else
			{
				calendar.setMonth('current');
			}
			
			
		}
		else if(checkDate[1])
		{
			var foundDay = false;
			checkDate = checkDate[1].trim().split(' ');
			if(checkDate[1] && (checkDate[1] * 1 > 0 || checkDate[1] * 1 < 0))
			{
				var monthStr = checkDate[0].toLowerCase();
				var year = checkDate[1] * 1;
				for(var i = 0; i < 12; i++)
				{
					if(monthStr == calendar.shortMonthNames[i] || monthStr == calendar.monthNames[i])
					{
						foundDay = true;
						
						calendar.curDate = new Date();
						calendar.curDate.setMonth(i);
						calendar.curDate.setFullYear(year);
						calendar.setMonth();
						
						break;
					}
				}
			}
			if(!foundDay)
			{
				calendar.setMonth('current');
			}
		}
		else
		{
			calendar.setMonth('current');
		}
		
		this.blur();
		return false;
	},
	
	/**
	 * closes the calendar popup
	 */
	close : function()
	{
		if(calendar.curEl)
		{
			calendar.rmFocus();
			calendar.popup.parentNode.removeChild(calendar.popup);
			calendar.popup = null;
			calendar.curEl = null;
		}
	},
	
	/**
	 * outputs a new month
	 *
	 * @param month			which month
	 */
	setMonth : function(month)
	{
		switch(month)
		{
			case 'current':
				calendar.curDate = new Date();
				break;
			
			case 'prev':
				var month = calendar.curDate.getMonth();
				if(month > 0)
				{
					calendar.curDate.setMonth(month - 1);
				}
				else
				{
					calendar.curDate.setMonth(11);
					if(calendar.curDate.getFullYear() != 1)
					{
						calendar.curDate.setFullYear(calendar.curDate.getFullYear() - 1);
					}
					else
					{
						calendar.curDate.setFullYear(calendar.curDate.getFullYear() - 2);
					}
				}
				break;
			
			case 'next':
				var month = calendar.curDate.getMonth();
				if(month < 11)
				{
					calendar.curDate.setMonth(month + 1);
				}
				else
				{
					calendar.curDate.setMonth(0);
					if(calendar.curDate.getFullYear() != -1)
					{
						calendar.curDate.setFullYear(calendar.curDate.getFullYear() + 1);
					}
					else
					{
						calendar.curDate.setFullYear(calendar.curDate.getFullYear() + 2);
					}
				}
				break;
			
			default:
				break;
		}
		
		var today      = new Date();
		var todayDate  = today.getDate();
		var todayMonth = today.getMonth();
		var todayYear  = today.getFullYear();
		
		var getMonth   = calendar.curDate.getMonth();
		var getYear    = calendar.curDate.getFullYear();
		
		var outputTable =	'<table>' +
								'<tr class="days">' +
									'<td>Mon</td>' +
									'<td>Tue</td>' +
									'<td>Wed</td>' +
									'<td>Thu</td>' +
									'<td>Fri</td>' +
									'<td>Sat</td>' +
									'<td>Sun</td>' +
								'</tr>';
								
		var tempDate = new Date();
		tempDate.setMonth(getMonth);
		tempDate.setYear(getYear);
		tempDate.setDate(1);
		var startDayOfWeek = tempDate.getDay();
		
		if(startDayOfWeek == 0)
		{
			startDayOfWeek = 6;
		}
		else
		{
			startDayOfWeek--;
		}
		
		outputTable += '<tr>';
		var tdCount = 0;
		
		for(var i = 0; i < startDayOfWeek; i++)
		{
			outputTable += '<td></td>';
			tdCount++;
		}
			
		var curDay = 1;
		var maxDay = calendar.daysInMonth(getMonth, getYear);
		while(curDay <= maxDay)
		{
			if(tdCount == 0)
			{
				outputTable += '<tr>';
			}
			
			if(curDay == todayDate && getMonth == todayMonth && getYear == todayYear)
			{
				outputTable += '<td class="today"><a href="#" class="cal_click_day">' + curDay + '</a></td>';
			}
			else
			{
				outputTable += '<td><a href="#" class="cal_click_day">' + curDay + '</a></td>';
			}
			tdCount++;
			if(tdCount == 7)
			{
				tdCount = 0;
				outputTable += '</tr>';
			}
			curDay++;
		}
		
		if(tdCount > 0)
		{
			for(var i = tdCount + 1; i <= 7; i++)
			{
				outputTable += '<td></td>';
				tdCount++;
			}
		}
		
		outputTable += '</tr></table>';
		
		calendar.table.innerHTML	= outputTable;
		calendar.month.innerHTML	= calendar.monthNames[getMonth] + ' ' + getYear;
	},
	
	monthNames :
		[
			'januar',
			'februar',
			'marec',
			'april',
			'maj',
			'junij',
			'julij',
			'avgust',
			'september',
			'oktober',
			'november',
			'december',
		],
		
	shortMonthNames :
		[
			'jan',
			'feb',
			'mar',
			'apr',
			'maj',
			'jun',
			'jul',
			'avg',
			'sep',
			'okt',
			'nov',
			'dec',
		],
		
	/**
	 * returns how many days the given month has
	 *
	 * @param month			given month id (0-11)
	 * @param year			given year (4 digit)
	 */
	daysInMonth : function(month, year)
	{
		var retVal = 0;
		
		switch(month)
		{
			case 0:
			case 2:
			case 4:
			case 6:
			case 7:
			case 9:
			case 11:
				retVal = 31;
				break;
				
			case 3:
			case 5:
			case 8:
			case 10:
				retVal = 30;
				break;
				
			case 1:
				if(year%4 == 0 && (year%100 != 0 || year%400 == 0))
				{
					retVal = 29;
				}
				else
				{
					retVal = 28;
				}
				break;
				
			default:
				break;
		}
		
		return retVal;
	},
	
	prepare : function()
	{
		forAll(
			_('content'),
			'input',
			function()
			{
				if(this.type == 'text' && this.className.indexOf('date') != -1)
				{
					new calendar.item(this);
				}
			}
		);
	}
	
}
onLoad(calendar.prepare);
