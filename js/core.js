class FrameCore{
	constructor() {
		this.listview = {};
		this.filename = "untitled.lca";
		this.modified = false;

		this.clipboard = [[]];
		this.history = [[[]]];
		this.playing = false;

		var that = this;
		document.addEventListener("DOMContentLoaded", function(e) {
			that.listview = new dhtmlXList({
				container: "data_container",
				auto_scroll: true,
				edit: false,
				drag: true,
				select: "multiselect",
				type: {
					template: "<span class='dhx_single'>#label#</span>",
					height: 22,
					padding: 2,
					margin: 0
				}
			});

			that.listview.attachEvent("onAfterAdd", function (obj) {
				window.setTimeout(function() {
					that.listview.select(obj);
        }, 0);
			});

			var div = document.getElementById("data_container");
			div.addEventListener("click", function(e) {
				var id = that.listview.locate(e);

				if(id == null) {
					that.listview.unselectAll();
				}
			}, false);

			that.setModified(false);
		}, false);

		window.addEventListener("beforeunload", function(e) {
			if(that.modified) {
				e.returnValue = "Unsaved changes will be lost.";
			}
		}, false);
	}

	new() {
		core.listview.clearAll();
		this.filename = "untitled.lca"
		editor.change();
		this.setModified(false);
	}

	add(l = [0, 0, 0, 0]) {
		if(l.length > 0) {
			var ids = this.listview.getSelected(true);
			var index;
			if(ids.length > 0) {
				index = this.listview.indexById(ids[ids.length - 1]) + 1;
			}else{
				index = this.listview.dataCount();
			}
			this.listview.unselectAll();

			if(typeof l[0] === "number") {

				var text = "0x" + ("0000" + l[0].toString(16)).slice(-4) + ", " + "0x" + ("0000" + l[1].toString(16)).slice(-4) + ", " +
					"0x" + ("0000" + l[2].toString(16)).slice(-4) + ", " + "0x" + ("0000" + l[3].toString(16)).slice(-4);

				this.listview.add({
					label: text,
					data: l
				}, index);


			}else if(typeof l[0] === "object") {

				for(var v of l) {
					var text = "0x" + ("0000" + v[0].toString(16)).slice(-4) + ", " + "0x" + ("0000" + v[1].toString(16)).slice(-4) + ", " +
						"0x" + ("0000" + v[2].toString(16)).slice(-4) + ", " + "0x" + ("0000" + v[3].toString(16)).slice(-4);

					this.listview.add({
						label: text,
						data: v
					}, index);
					index++;
				}
			}

			this.setModified(true);
		}
	}
	remove() {
		var sel = this.listview.getSelected();
		this.listview.unselectAll();
		this.listview.remove(sel);

		this.setModified(true);
	}

	get(id) {
		var v = this.listview.get(id);
		return v.data;
	}
	getSelected() {
		var ids = this.listview.getSelected(true);
		var contents = [[]];

		for(var id of ids) {
			var v = this.listview.get(id);
			contents.push(v.data);
		}
		return contents;
	}
	getAll() {
		var id = this.listview.first();
		var contents = [[]];

		for(;this.listview.exists(id);) {
			var v = this.listview.get(id);
			contents.push(v.data);

			id = this.listview.next(id);
		}
		return contents;
	}
	set(id, l) {
		var text = "0x" + ("0000" + l[0].toString(16)).slice(-4) + ", " + "0x" + ("0000" + l[1].toString(16)).slice(-4) + ", " +
			"0x" + ("0000" + l[2].toString(16)).slice(-4) + ", " + "0x" + ("0000" + l[3].toString(16)).slice(-4);

		var v = this.listview.get(id);
		v.label = text;
		v.data = l;
		this.listview.set(id, v);

		this.setModified(true);
	}

	read(onread) {
		var input = document.createElement("input");
		input.setAttribute("type", "file");
		var contents = [];

		var that = this;
		input.addEventListener("change", function(e) {
			var files = e.target.files;

			if(files.length > 0) {
				var file = files[0];
				var reader = new FileReader();

				reader.onload = function(e) {
					var array = new Uint16Array(e.target.result);

					var length = array.length / 4;
					for(var i=0; i < length; ++i) {
						var layer = [0, 0, 0, 0];
						layer[0] = array[i * 4 + 0];
						layer[1] = array[i * 4 + 1];
						layer[2] = array[i * 4 + 2];
						layer[3] = array[i * 4 + 3];

						contents.push(layer);
					}

					onread(that, file.name, contents);
				}
				reader.onerror = function(e) {
					alert("Error during loading a file : " + e);
				}

				reader.readAsArrayBuffer(file);
			}
		}, false);

		input.click();
	}
	write(contents) {
		var number = contents.length;
		var array = new Uint16Array(number * 4);

		for(var i= 0; i < number; ++i) {
			array[i * 4 + 0] = contents[i][0];
			array[i * 4 + 1] = contents[i][2];
			array[i * 4 + 2] = contents[i][3];
			array[i * 4 + 3] = contents[i][4];
		}

		var blob = new Blob([array], {type : "application/octet-stream"});

		var a = document.createElement("a");
		a.download = this.filename;
		a.target   = "_blank";

		a.href = window.URL.createObjectURL(blob);
	  a.click();
	}
	load(that, title, contents) {
		that.listview.clearAll();
		that.add(contents);

		that.filename = title;
		that.setModified(false);
	}
	save() {
		var id = this.listview.first();
		var contents = [];

		for(;this.listview.exists(id);) {
			var v = this.listview.get(id);
			var layer = v.data;
			contents.push(layer);

			id = this.listview.next(id);
		}

		this.write(contents);

		this.setModified(false);
	}
	exportFrames() {
		var contents = this.getSelected();

		if(contents.length > 0) {
			this.write(contents);
		}else{
			alert("No frames are selected.");
		}
	}
	importFrames(that, title, contents) {
		that.add(contents);
	}

	play(state) {
		this.playing = state;

		if(this.playing) {
			var that = this;
			function caller() {
				var selIds = that.listview.getSelected(true);
				var selId = selIds.length > 0 ? that.listview.next(selIds[0]) : null;
				if(!selId) {
					var selId = that.listview.first();
				}
				that.listview.unselectAll();
				that.listview.select(selId);
				that.listview.show(selId);

				if(that.playing) {
					window.setTimeout(caller, 100);
				}
			}

			caller();
		}
	}

	copy() {
		this.clipboard = this.getSelected();
	}
	paste() {
		if(this.clipboard.length > 0) {
			this.add(this.clipboard);
		}
	}

	undo() {

	}
	redo() {

	}

	setModified(flag) {
		this.modified = flag;
		document.title = (this.modified ? "*" : "") + this.filename + " - Cube Editor";
	}
};

var core = new FrameCore();
