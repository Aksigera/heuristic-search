const scale = 60;
IHaveNeighbours = {
	neighbours: [],
	findNeighbours: function () {
		var neighbour = {};

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (!((i + j) % 2)) {
					continue;
				}
				neighbour.y = this.y + i;
				neighbour.x = this.x + j;
				if (isFree(neighbour)) {
					this.neighbours.push(new Node(neighbour.y, neighbour.x));
					window.view.fillCell(neighbour.x, neighbour.y);
					window.view.fillCell(this.x, this.y, 'red');
				}
			}
		}
	}
};

function Node(y, x) {
	this.x = x;
	this.y = y;
}
Node.prototype = IHaveNeighbours;

function Field(size, walls) {
	this.nodes = [];
	this.edge = [-1, size];
	this.walls = walls;

	for (let y = size; y !== 0; y--) {
		this.nodes[y] = [];
		for (var x = size; x != 0; x--) {
			this.nodes[y][x] = new Node(y, x);
		}
	}
}

function isFree(node) {
	var
		walls = window.field.walls,
		edge = window.field.edge;

	if (!(edge.indexOf(node.y) === -1)) {
		return false;
	}
	else if (!(edge.indexOf(node.x) === -1)) {
		return false;
	}
	else
		for (let i = walls.length - 1; i >= 0; i--) {

			if (walls[i][0] === node.y && walls[i][1] === node.x) {
				console.warn('стена: [' + node.y + ', ' + node.x + ']');
				return false;
			}
		}

	return true;
}

function heuristicSearch() {
	field.currNode.findNeighbours();
	field.currNode = findLeader();
	if (field.currNode.x === field.finishNode.x && field.currNode.y === field.finishNode.y) {
		field.finished = true;
	}
}

function findLeader() {
	//TODO: надо доставать объекты из общего массива Field.nodes, иначе туфта. поехали
	var leaderNeighbour = {};
	leaderNeighbour.H = Infinity;
	for (let i = field.currNode.neighbours.length - 1; i >= 0; i--) {
		field.currNode.neighbours[i] = countMasses(field.currNode.neighbours[i]);
		if (field.currNode.neighbours[i].H < leaderNeighbour.H) {
			leaderNeighbour = field.currNode.neighbours[i];
		}
	}debugger

	return leaderNeighbour;
}

function countMasses(node) {
	node['G'] = Math.abs(node.y - field.startNode.y) + Math.abs(node.x - field.startNode.x);
	node['H'] = Math.abs(node.y - field.finishNode.y) + Math.abs(node.x - field.finishNode.x);
	node['F'] = node.G + node.H;
	node.parentNode = field.currNode;

	return node;
}

function init(iterations, size, start, finish, walls = []) {
	window.view = new View(size, scale);

	for (var row = (size - 1); row >= 0; row--) {
		for (var col = (size - 1); col >= 0; col--) {
			window.view.drawCell(col, row);
		}
	}

	window.field = new Field(size, walls);
	field.finished = false;
	field.currNode = field.startNode = new Node(start[0], start[1]); //TODO: Сохранить значения координат для finish и start nodes в переменные и проверить разницу в  производительности
	field.finishNode = new Node(finish[0], finish[1]);

	var timer = new Timer('Heuristic Search');

	for (window.iteration = iterations; iteration !== 0; iteration--) {
		heuristicSearch();
		if (field.finished === true) {
			window.iteration = 1;
			console.log('FINISHED!!!');
			console.log(field.currNode);
		}
	}

	timer.stop();
}

function Timer(name) {
	var start = new Date();
	return {
		stop: function () {
			var end = new Date();
			var time = end.getTime() - start.getTime();
			console.log('Timer:', name, 'finished in', time, 'ms');
		}
	}
}

function View(size, scale) {
	this.scale = scale;
	this.canvas = document.getElementById("canvas");
	this.canvas.width = size * scale * 1.2;
	this.canvas.height = size * scale * 1.2;
	this.ctx = this.canvas.getContext("2d");
	this.ctx.fillStyle = "green";
	this.ctx.strokeRect(0, 0, size * this.scale, size * this.scale);
	this.drawCell = function (col, row) {
		this.ctx.strokeRect(col * scale, row * scale, scale, scale);
	};
	this.fillCell = function (col, row, color = 'green') {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(col * scale + 1, row * scale + 1, scale - 2, scale - 2);
	}
}
init(100, 12, [0, 0], [12, 12]);



