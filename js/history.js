class History {
	constructor() {
		this.buffer = [];
		this.count = 0;
	}

	push(obj) {
		var length = this.buffer.length;
		if(this.count > 0) {
			this.buffer = this.buffer.slice(0, length - this.count);
			this.count = 0;
		}
		this.buffer.push(obj);
	}

	undo() {
		var length = this.buffer.length;
		++this.count;

		if(length - this.count >= 0) {
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
