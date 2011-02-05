/* controls (spremeni, brisi, ...) */
$(document).ready(function(){

	var controls =
	{
		prepare : function()
		{
			var divClass;
			var textareaDiv = null;
			
			var editField = $('#content_field').get(0);
			if(editField)
			{
				var controlsDiv = edit.toolbar();
				edit.field = editField;
				editField.parentNode.parentNode.insertBefore(controlsDiv, editField.parentNode);
				
				
				$('#content_field:not(.processed)').each(function(){
					var form_height = $.cookie('form_height');
					if (form_height){
						$(this).height(parseInt(form_height, 10));
					}
				});
				$('#content_field:not(.processed)').TextAreaResizer();
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

if ($('#content_field').length > 0) {
	controls.prepare();
};

});
