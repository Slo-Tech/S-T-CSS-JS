(function(jQuery){
/*
 * Editable 1.3.4-beta
 *
 * Copyright (c) 2009 Arash Karimzadeh (arashkarimzadeh.com)
 * Licensed under the MIT (MIT-LICENSE.txt)
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Mar 04 2009
 */
jQuery.fn.editable = function(options){
	var defaults = {
		onEdit: null,
		onSubmit: null,
		onCancel: null,
		editClass: null,
		submit: null,
		cancel: null,
		type: 'text', //text, textarea or select
		submitBy: 'blur', //blur,change,dblclick,click
		editBy: 'click',
		options: null
	}
	if(options=='disable')
		return this.unbind(this.data('editable.options').editBy,this.data('editable.options').toEditable);
	if(options=='enable')
		return this.bind(this.data('editable.options').editBy,this.data('editable.options').toEditable);
	if(options=='destroy')
		return  this.unbind(this.data('editable.options').editBy,this.data('editable.options').toEditable)
					.data('editable.previous',null)
					.data('editable.current',null)
					.data('editable.options',null);
	
	var options = jQuery.extend(defaults, options);
	
	options.toEditable = function(){
		jQuerythis = jQuery(this);
		jQuerythis.data('editable.current',jQuerythis.html());
		opts = jQuerythis.data('editable.options');
		jQuery.editableFactory[opts.type].toEditable(jQuerythis.empty(),opts);
		// Configure events,styles for changed content
		jQuerythis.data('editable.previous',jQuerythis.data('editable.current'))
			 .children()
				 .focus()
				 .addClass(opts.editClass);
		// Submit Event
		if(opts.submit){
			jQuery('<button/>').appendTo(jQuerythis)
						.html(opts.submit)
						.one('mousedown',function(){opts.toNonEditable(jQuery(this).parent(),true)});
		}else
			jQuerythis.one(opts.submitBy,function(){opts.toNonEditable(jQuery(this),true)})
				 .children()
				 	.one(opts.submitBy,function(){opts.toNonEditable(jQuery(this).parent(),true)});
		// Cancel Event
		if(opts.cancel)
			jQuery('<button/>').appendTo(jQuerythis)
						.html(opts.cancel)
						.one('mousedown',function(){opts.toNonEditable(jQuery(this).parent(),false)});
		// Call User Function
		if(jQuery.isFunction(opts.onEdit))
			opts.onEdit.apply(	jQuerythis,
									[{
										current:jQuerythis.data('editable.current'),
										previous:jQuerythis.data('editable.previous')
									}]
								);
	}
	options.toNonEditable = function(jQuerythis,change){
		opts = jQuerythis.data('editable.options');
		// Configure events,styles for changed content
		jQuerythis.one(opts.editBy,opts.toEditable)
			 .data( 'editable.current',
				    change 
						?jQuery.editableFactory[opts.type].getValue(jQuerythis,opts)
						:jQuerythis.data('editable.current')
					)
			 .html(
				    opts.type=='password'
				   		?'*****'
						:jQuerythis.data('editable.current')
					);
		// Call User Function
		var func = null;
		if(jQuery.isFunction(opts.onSubmit)&&change==true)
			func = opts.onSubmit;
		else if(jQuery.isFunction(opts.onCancel)&&change==false)
			func = opts.onCancel;
		if(func!=null)
			func.apply(jQuerythis,
						[{
							current:jQuerythis.data('editable.current'),
							previous:jQuerythis.data('editable.previous')
						}]
					);
	}
	this.data('editable.options',options);
	return  this.one(options.editBy,options.toEditable);
}
jQuery.editableFactory = {
	'text': {
		toEditable: function(jQuerythis,options){
			jQuery('<input/>').appendTo(jQuerythis)
						 .val(jQuerythis.data('editable.current'));
		},
		getValue: function(jQuerythis,options){
			return jQuerythis.children().val();
		}
	},
	'password': {
		toEditable: function(jQuerythis,options){
			jQuerythis.data('editable.current',jQuerythis.data('editable.password'));
			jQuerythis.data('editable.previous',jQuerythis.data('editable.password'));
			jQuery('<input type="password"/>').appendTo(jQuerythis)
										 .val(jQuerythis.data('editable.current'));
		},
		getValue: function(jQuerythis,options){
			jQuerythis.data('editable.password',jQuerythis.children().val());
			return jQuerythis.children().val();
		}
	},
	'textarea': {
		toEditable: function(jQuerythis,options){
			jQuery('<textarea/>').appendTo(jQuerythis)
							.val(jQuerythis.data('editable.current'));
		},
		getValue: function(jQuerythis,options){
			return jQuerythis.children().val();
		}
	},
	'select': {
		toEditable: function(jQuerythis,options){
			jQueryselect = jQuery('<select/>').appendTo(jQuerythis);
			jQuery.each( options.options,
					function(key,value){
						jQuery('<option/>').appendTo(jQueryselect)
									.html(value)
									.attr('value',key);
					}
				   )
			jQueryselect.children().each(
				function(){
					var opt = jQuery(this);
					if(opt.text()==jQuerythis.data('editable.current'))
						return opt.attr('selected', 'selected').text();
				}
			)
		},
		getValue: function(jQuerythis,options){
			var item = null;
			jQuery('select', jQuerythis).children().each(
				function(){
					if(jQuery(this).attr('selected'))
						return item = jQuery(this).text();
				}
			)
			return item;
		}
	}
}
})(jQuery);