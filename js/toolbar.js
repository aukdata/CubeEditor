var myToolbar;

document.addEventListener("DOMContentLoaded", function(e) {
	myToolbar = new dhtmlXToolbarObject({
		parent: "toolbar",
		icon_path: "./imgs/",
		xml: "toolbar.xml"
	});

	myToolbar.attachEvent("onClick", function(id) {
		switch(id) {
		case "new":
			core.listview.clearAll();
			editor.change();
			break;
		case "save":
			core.save();
			break;
		case "open":
			core.load();
			break;

		case "inverse":
			editor.inverse();
			break;
		}

		log("onClick event button(" + id + ") was clicked");
	});

	Mousetrap.bind('shift+n', function(){
		core.new();
	});
	Mousetrap.bind('shift+o', function(){
		core.load();
	});
	Mousetrap.bind('shift+s', function(){
		core.save();
	});
	Mousetrap.bind('shift+t', function(){
		core.listview.refresh();
		log(core.listview.get(core.listview.last()));
	});
}, false);
