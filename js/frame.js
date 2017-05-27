class Frame {
	constructor() {
		this.listview = {};

		var that = this;
		document.addEventListener("DOMContentLoaded", function(e) {
			that.listview = new dhtmlXList({
				container : "data_container",
				auto_scroll : true,
				edit : false,
				drag : true,
				select : "multiselect",
				type : {
					template : "<span class='dhx_single'>#label#</span>",
					height : 22,
					padding : 2,
					margin : 0
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

				if(!id) {
					that.listview.unselectAll();
				}
			}, false);
		}, false);
	}

	// void new()
	// Clear list.
	new() {
		this.listview.clearAll();
	}

	// number add(l)
	// Add a frame or frames and return the index.
	// l array : A frame or frames to add.
	add(l) {
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
					label : text,
					data : l.slice()
				}, index);

			}else if(typeof l[0] === "object") {
				for(var v of l) {
					var text = "0x" + ("0000" + v[0].toString(16)).slice(-4) + ", " + "0x" + ("0000" + v[1].toString(16)).slice(-4) + ", " +
						"0x" + ("0000" + v[2].toString(16)).slice(-4) + ", " + "0x" + ("0000" + v[3].toString(16)).slice(-4);

					this.listview.add({
						label : text,
						data : v.slice()
					}, index);
					++index;
				}
			}
			return index;
		}
	}
	// void remove(id)
	// Remove specified frame or frames.
	// id number/array : ID of a frame or frames to remove.
	remove(id) {
		this.listview.unselectAll();
		this.listview.remove(id);
	}

	// array getSelectedId()
	// Return IDs of selected frames.
	getSelectedIds() {
		return this.listview.getSelected(true);
	}

	// void getData(id)
	// Get specified frame data.
	// id number/array : ID of a frame to get data of.
	getData(id) {
		var ref;
		if(typeof id === "number" || typeof id === "string") {
			ref = id;
		}else{
			ref = id[0];
		}

		if(this.listview.exists(ref)) {
			var v = this.listview.get(ref);
			return v.data.slice();
		}else{
			return null;
		}
	}
	// array getSelectedData()
	// Get data of selected frames.
	getSelectedData() {
		var ids = this.listview.getSelected(true);
		var contents = [];

		for(var id of ids) {
			var v = this.listview.get(id);
			contents.push(v.data.slice());
		}
		return contents;
	}
	// array getAllData()
	// Get data of all frames.
	getAllData() {
		var id = this.listview.first();
		var contents = [];

		for(;this.listview.exists(id);) {
			var v = this.listview.get(id);
			contents.push(v.data.slice());

			id = this.listview.next(id);
		}
		return contents;
	}
	// void setData(id, l)
	// Set data of specified frame.
	// id : ID of a frame to set data.
	// data : Data to set.
	setData(id, l) {
		var text = "0x" + ("0000" + l[0].toString(16)).slice(-4) + ", " + "0x" + ("0000" + l[1].toString(16)).slice(-4) + ", " +
			"0x" + ("0000" + l[2].toString(16)).slice(-4) + ", " + "0x" + ("0000" + l[3].toString(16)).slice(-4);

		var v = this.listview.get(id);
		v.label = text;
		v.data = l;
		this.listview.set(id, v);
	}

	count() {
		return this.listview.dataCount();
	}
	idByIndex(id) {
		return this.listview.idByIndex(id);
	}
	indexById(index) {
		return this.listview.indexById(index);
	}
};
