//namespace
var ScriptLoader = {}; 

//scripts object storing the state and callbacks of scripts
ScriptLoader.scripts = {}; 

//Handle multiple script callbacks to one single script
ScriptLoader.onScriptLoad = function(url) {
	var script = this.scripts[url];
	script.loaded = true;
	for (var i = 0, len = script.callbacks.length; i < len; i++)
	{
		var callback = script.callbacks[i];
		if (typeof callback != 'undefined') callback();
	}
};

//Main loader function
ScriptLoader.load = function(url, callback) {

	//Check if script has already been added to the loader
	if (this.scripts[url] != undefined)
	{
		if (this.scripts[url].loaded) //File loaded
		{
			//Run callback straight away
			if (typeof callback != 'undefined') callback();
		}
		else //Still loading
		{
			//Add callback to list for running later
			this.scripts[url].callbacks.push(callback);
		}

		//Script already requested so exit here
		return;
	}

	//Create tracker for this script to monitor status and build a list of callbacks
	this.scripts[url] = {loaded: false, callbacks: [callback]};

	//Add script element to DOM and add onload handlers for callbacks
	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState) //IE
	{
		script.onreadystatechange = function()
		{
            if (script.readyState == "loaded" ||
                    script.readyState == "complete")
			{
                script.onreadystatechange = null;

				ScriptLoader.onScriptLoad(url);
			}
        };
    }
   else //Other browsers
   {
	    script.onload = function(event)
	    {
			ScriptLoader.onScriptLoad(url);
	   };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
};


ScriptLoader.load('http://st.livecd.net/script/jquery.js', function() {
	ScriptLoader.load('http://st.livecd.net/script/js_quicktags.js');

	ScriptLoader.load('http://st.livecd.net/script/jquery.prettyPhoto.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.editable.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.timers.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.hoverIntent.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.form.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.textarearesizer.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.hotkeys.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.autocomplete.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.comet.js');
	ScriptLoader.load('http://st.livecd.net/script/jquery.cookie.js');

	ScriptLoader.load('http://st.livecd.net/script/jquery.auto.js');

	ScriptLoader.load('http://st.livecd.net/script/scripts.js', function(){
		ScriptLoader.load('http://st.livecd.net/script/legacy.js');
	});
});
