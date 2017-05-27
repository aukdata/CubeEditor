class FrameEditor {
	constructor() {
		this.frame = [0, 0, 0, 0];
		this.layer = 0;

		this.prevClicked = {x:-1, y:-1};
		this.changeTo = true;
		this.wheelingCountX = 0;

		var that = this;
		document.addEventListener("DOMContentLoaded", function(e) {
			operator.frames.listview.attachEvent("onSelectChange", function() {
				that.change();
			});

			var table = document.getElementById("table_grid");
			var changeGrid = function(e) {
				var grid = document.elementFromPoint(e.clientX, e.clientY);
				var id = grid.id;

				if(id.substr(0, 4) == "grid") {
					var x = parseInt(id.substring(4, 5));
					var y = parseInt(id.substring(5, 6));
					if(that.prevClicked.x == -1 && that.prevClicked.y == -1) {
						that.changeTo = !that.get(x, y);
					}
					if(that.prevClicked.x != x || that.prevClicked.y != y) {
						that.set(x, y, that.changeTo);
						that.prevClicked.x = x;
						that.prevClicked.y = y;
					}
				}
			};
			table.addEventListener("mousedown", function(e) {
				changeGrid(e);
				table.addEventListener("mousemove", changeGrid, false);
			}, false);
			table.addEventListener("mouseup", function(e) {
				operator.set(that.frame);
				that.prevClicked.x = -1;
				that.prevClicked.y = -1;
				table.removeEventListener("mousemove", changeGrid, false);
			}, false);
		}, false);

		document.addEventListener("wheel", function(e) {
			var hovered = document.elementFromPoint(e.clientX, e.clientY);
			if(hovered.id == "frame_editor" || hovered.id.substring(0, 4) == "grid") {
				e.preventDefault();

				var dt = e.timeStamp - that.prevTimeStamp;
				that.prevTimeStamp = e.timeStamp;
				if(dt < 50) return false;

				if(e.deltaX <= -120 || 120 <= e.deltaX) {
					if(operator.frames.getSelectedIds().length == 1) {
						var layer = that.layer + (e.deltaX < 0 ? -1 : 1);
						if(layer < 0) layer = 0;
						if(3 < layer) layer = 3;

						that.setLayer(layer);
					}
				}

				if(e.deltaY <= -120 || 120 <= e.deltaY) {
					var selIds = operator.frames.getSelectedIds();
					if(selIds.length == 1) {
						var index = operator.frames.indexById(selIds[0]) + (e.deltaY < 0 ? -1 : 1);

						if(0 <= index && index < operator.frames.count()) {
							operator.frames.listview.unselectAll();
							operator.frames.listview.select(operator.frames.idByIndex(index));
						}
					}
				}
			}
		}, false);
	}

	change() {
		var sel = operator.frames.getSelectedIds();
		if(sel.length == 1) {
			if(operator.frames.listview.exists(sel[0])) {
				this.frame = operator.frames.getData(sel[0]);
			}else{
				this.frame = [0, 0, 0, 0];
			}
			this.update();

			$("#editor").css("visibility", "visible");
			$("#mes_not_selected").css("display", "none");
		}else{
			this.frame = [0, 0, 0, 0];

			$("#editor").css("visibility", "hidden");
			$("#mes_not_selected").css("display", "inline");
		}
	}

	update() {
		for(var x=0;x < 4;++x) {
			for(var z=0;z < 4;++z) {
				var id = "#grid" + x + z;

				if((this.frame[this.layer] & (0x0001 << (4 * z + x))) != 0) {
					$(id).css("background-color", "lightgreen");
				}else{
					$(id).css("background-color", "white");
				}
			}
		}

		viewer.set(this.frame);
	}

	get(x, z) {
		return (this.frame[this.layer] & (0x0001 << (4 * z + x))) != 0;
	}
	set(x, z, val) {
		if(operator.frames.getSelectedIds().length == 1) {
			var id = "#grid" + x + z;

			if(val) {
				this.frame[this.layer] |= (0x0001 << (4 * z + x));
				$(id).css("background-color", "lightgreen");
			}else{
				this.frame[this.layer] &= ~(0x0001 << (4 * z + x));
				$(id).css("background-color", "white");
			}

			viewer.set(this.frame);
		}
	}
	click(x, y) {
		if(0 <= x && x < 4 && 0 <= y && y < 4) {
			this.set(x, y, !this.get(x, y));
		}
	}

	setLayer(n) {
		this.layer = n;
		$("#layer1").css("background-color", "white");
		$("#layer2").css("background-color", "white");
		$("#layer3").css("background-color", "white");
		$("#layer4").css("background-color", "white");
		$("#layer" + (this.layer + 1)).css("background-color", "lightgray");

		this.update();
	}

	inverse() {
		for(var i = 0; i < 4; ++i) {
			this.frame[i] = ~this.frame[i];
		}
		this.update();
	}
};

var editor = new FrameEditor();
