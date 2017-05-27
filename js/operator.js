class Operator {
	constructor() {
		this.frames = new Frame();
		this.filename = "untitled.lca";
		this.modified = false;

		this.history = new History();
		this.clipboard = [];
		this.playing = false;

		var that = this;
		window.addEventListener("beforeunload", function(e) {
			if(that.modified) {
				e.returnValue = "Unsaved changes will be lost.";
			}
		}, false);
	}

	new() {
		this.frames.new();
		this.filename = "untitled.lca"
		editor.change();
		this.setModified(false);
	}

	add() {
		var addedIndex = this.frames.add([0, 0, 0, 0]);
		this.setModified(true, {
			operation : "add",
			frames : [{
				index : addedIndex,
				odata : null,
				ndata : [0, 0, 0, 0]
			}]
		});
	}
	remove() {
		var sel = this.frames.getSelectedIds();
		var obj = {
			operation : "remove",
			frames : []
		}
		for(var v of sel) {
			obj.frames.push({
				index : this.frames.indexById(v),
				odata : this.frames.getData(v),
				ndata : null
			});
		}

		this.frames.remove(sel);
		this.setModified(true, obj);
	}

	get() {
		var data = this.frames.getSelectedData();
		return data.length > 0 ? data[0] : null;
	}
	set(l) {
		var ids = this.frames.getSelectedIds();

		if(ids.length == 1) {
			var data = this.frames.getData(ids[0]);

			this.frames.setData(ids[0], l);
			this.setModified(true, {
				operation : "set",
				frames : [{
					index : this.frames.indexById(ids[0]),
					odata : data,
					ndata : l
				}]
			});
		}
	}

	move(dir) {
		var selIds = this.frames.getSelectedIds();

		if(selIds.length === 1 && (dir === "up") || (dir === "down")) {
			var index1 = this.frames.indexById(selIds[0]);
			var index2 = (dir === "up") ? index1 - 1 : index1 + 1;

			if(0 <= index1 && index1 < this.frames.count()) {
				var data1 = this.frames.getData(selIds[0]);
				var data2 = this.frames.getData(this.frames.idByIndex(index2));
				var objs = {
					operation : "set",
					frames : [
						{
							index : index1,
							odata : data1,
							ndata : data2
						},
						{
							index : index2,
							odata : data2,
							ndata : data1
						}
					]
				};
				this.setModified(true, objs);

				switch(dir) {
				case "up":
					this.frames.listview.moveUp(selIds[0]);
					break;
				case "down":
					this.frames.listview.moveDown(selIds[0]);
					break;
				}
			}
		}
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

	save() {
		this.write(this.frames.getAllData());
		this.setModified(false);
	}
	load(that, title, contents) {
		that.frames.new();
		that.frames.add(contents);

		that.filename = title;
		that.setModified(false);
	}
	exportFrames() {
		var contents = this.frames.getSelectedData();

		if(contents.length > 0) {
			this.write(contents);
		}else{
			alert("No frames are selected.");
		}
	}
	importFrames(that, title, contents) {
		that.frames.add(contents);
	}

	play(state) {
		this.playing = state;

		if(this.playing) {
			var that = this;
			function caller() {
				var selIds = that.frames.getSelectedIds();
				var selId = selIds.length > 0 ? that.frames.listview.next(selIds[0]) : null;
				if(!selId) {
					var selId = that.frames.listview.first();
				}
				that.frames.listview.unselectAll();
				that.frames.listview.select(selId);
				that.frames.listview.show(selId);

				if(that.playing) {
					window.setTimeout(caller, 100);
				}
			}

			caller();
		}
	}

	copy() {
		this.clipboard = this.frames.getSelectedData();
	}
	paste() {
		if(this.clipboard.length > 0) {
			this.frames.add(this.clipboard);
		}
	}

	undo() {
		var obj = this.history.undo();

		if(obj) {
			for(var frame of obj.frames) {
				var id = this.frames.idByIndex(frame.index);
				switch(obj.operation) {
				case "add":
					this.frames.remove(id);
					break;

				case "set":
					this.frames.setData(id, frame.odata);
					break;

				case "remove":
					this.frames.add(frame.odata);
					break;
				}
			}
		}
	}
	redo() {

	}

	setModified(flag, obj) {
		if(flag) {
			this.history.push(obj);
		}

		this.modified = flag;
		document.title = (this.modified ? "*" : "") + this.filename + " - Cube Editor";
	}
};

var operator = new Operator();
