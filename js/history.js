class EditHistory {
	constructor() {
		this.buffer = [];
		this.count = 0;
	}

	push(obj) {
		this.buffer.push(obj);
	}

	undo() {
		var length = this.buffer.length;
		++this.count;

		if(lenght >= this.count) {
			return this.buffer[length - this.count];
		}else{
			return null;
		}
	}
	redo() {
		var length = this.buffer.length;
		--this.count;

		if(this.count > 0) {
			return this.buffer[length - this.count];
		}else{
			return null;
		}
	}
}

var editHistory = new EditHistory();
