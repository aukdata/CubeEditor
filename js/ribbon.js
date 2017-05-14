var ribbon = {};

document.addEventListener("DOMContentLoaded", function(e) {
	ribbon = new dhtmlXRibbon({
		parent: "ribbon",
		iconset: "awesome",
		json: "ribbon.json"
	});

	ribbon.attachEvent("onClick", function(id) {
		switch(id) {
		case "new":
			core.new();
			break;
		case "save":
			core.save();
			break;
		case "open":
			core.read(core.load);
			break;
		case "export":
			core.exportFrames();
			break;
		case "import":
			core.read(core.importFrames);
			break;
		case "play":
			core.play();
			break;

		case "paste":
			core.paste();
			break;
		case "copy":
			core.copy();
			break;
		case "cut":
			core.copy();
			core.remove();
			break;

		case "inverse":
			editor.inverse();
			break;
		}
	});
	ribbon.attachEvent("onStateChange", function(id, state) {
		switch(id) {
		case "play":
			core.play(state);
			break;
		}
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
