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
			operator.new();
			break;
		case "save":
			operator.save();
			break;
		case "open":
			operator.read(operator.load);
			break;
		case "export":
			operator.exportFrames();
			break;
		case "import":
			operator.read(operator.importFrames);
			break;

		case "paste":
			operator.paste();
			break;
		case "copy":
			operator.copy();
			break;
		case "cut":
			operator.copy();
			operator.remove();
			break;

		case "undo":
			operator.undo();
			break;
		case "redo":
			operator.redo();
			break;

		case "play":
			operator.play();
			break;

		case "inverse":
			editor.inverse();
			break;
		}
	});
	ribbon.attachEvent("onStateChange", function(id, state) {
		switch(id) {
		case "play":
			operator.play(state);
			break;
		}
	});

	Mousetrap.bind('shift+n', function(){
		operator.new();
	});
	Mousetrap.bind('shift+o', function(){
		operator.read(operator.load);
	});
	Mousetrap.bind('shift+s', function(){
		operator.save();
	});
}, false);
