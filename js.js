const scale = 40;
lastNode = null;
error = false;

NodeProto = {
    open: function () {
        this.index = field.opened.length;
        this.opened = 1;
        field.opened.push(this);
        window.view.fillCell(this.x, this.y);

    },

    close: function () {
        if (error) {
            debugger
        }
        for (var i = field.opened.length-1; i >= 0; i--) {
            if (field.opened[i].index == this.index) {
                field.opened.splice(i, 1);
            }
        }
        field.opened.splice(this.index, 1);
        this.opened = 2;
    }
};

function Node(y, x) {
    this.y = y;
    this.x = x;
    this.opened = 0;
}
Node.prototype = NodeProto;

function Field(size, walls) {
    this.nodes = [];
    this.edge = [-1, size];
    this.walls = walls;
    this.opened = [];

    for (let y = size; y >= 0; y--) {
        this.nodes[y] = [];
        for (let x = size; x >= 0; x--) {
            this.nodes[y][x] = new Node(y, x);
        }
    }

    for (let i = walls.length - 1; i >= 0; i--) {
        window.view.fillCell(walls[i][1], walls[i][0], 'black');
    }
}

function heuristicSearch() {
    var lowInd = field.opened.length - 1;
    for (var i = lowInd; i >= 0; i--) {

        if (field.opened[i].F < field.opened[lowInd].F) {
            lowInd = i;
        }
    }
    field.currNode = field.opened[lowInd];
    console.log(field.currNode);
    if (lastNode === field.currNode) {
        error = true;
        debugger
    }
    lastNode = field.currNode;

    field.currNode.close();

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!((i + j) % 2)) {
                continue;
            }

            if (isFree({
                    y: field.currNode.y + i,
                    x: field.currNode.x + j
                })) {
                var gScore = field.currNode.G + 1;
                var gScoreIsBest = false;
                var neighbor = window.field.nodes[field.currNode.y + i][field.currNode.x + j];
                if (neighbor.opened === 0) {
                    gScoreIsBest = true;
                    neighbor.open();
                    neighbor['H'] = Math.abs(neighbor.y - field.finishNode.y) + Math.abs(neighbor.x - field.finishNode.x);
                }
                else if (gScore < neighbor.G) {
                    gScoreIsBest = true;
                }

                if (gScoreIsBest) {
                    neighbor.parentNode = field.currNode;
                    neighbor.G = gScore;
                    neighbor.F = neighbor.G + neighbor.H;
                    window.view.fillCell(neighbor.x, neighbor.y, 'green');
                    window.view.ctx.fillText('G:' + neighbor.G, (neighbor.x + .1) * scale, (neighbor.y + .4) * scale);
                    window.view.ctx.fillText('H:' + neighbor.H, (neighbor.x + .1) * scale, (neighbor.y + .8) * scale);
                }

                window.view.fillCell(field.currNode.x, field.currNode.y, 'red');
            }
        }
    }

    if (field.currNode.x === field.finishNode.x && field.currNode.y === field.finishNode.y) {
        field.finished = true;
        window.view.fillCell(field.currNode.x, field.currNode.y, 'yellow');
    }
}

function isFree(node) {

    if (node.opened === 2) return false;
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

function init(iterations, size, start, finish, walls = []) {
    window.view = new View(size, scale);
    for (var row = (size - 1); row >= 0; row--) {
        for (var col = (size - 1); col >= 0; col--) {
            window.view.drawCell(col, row);
        }
    }

    window.field = new Field(size, walls);
    field.finished = false;
    field.startNode = field.nodes[start[0]][start[1]];
    field.finishNode = field.nodes[finish[0]][finish[1]];
    field.startNode.open();
    field.startNode['G'] = 0;
    field.startNode['F'] = Math.abs(field.startNode.y - field.finishNode.y) + Math.abs(field.startNode.x - field.finishNode.x);
    view.fillCell(field.finishNode.x, field.finishNode.y, 'yellow');


    var timer = new Timer('Heuristic Search');
    for (window.iteration = iterations; iteration !== 0; iteration--) {
        heuristicSearch();
        if (field.finished === true) {
            window.iteration = 1;
            console.log('FINISHED!!!');
        }
    }
    while (field.currNode.parentNode) {
        window.view.fillCell(field.currNode.x, field.currNode.y, 'blue');
        field.currNode = field.currNode.parentNode;
    }
    timer.stop();
}

function View(size, scale) {
    this.scale = scale;
    this.canvas = document.getElementById("canvas");
    this.canvas.width = size * scale * 1.2;
    this.canvas.height = size * scale * 1.2;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.font = '' + 0.3 * scale + "pt Arial";
    this.ctx.strokeRect(0, 0, size * this.scale, size * this.scale);
    this.drawCell = function (col, row) {
        this.ctx.strokeRect(col * scale, row * scale, scale, scale);
        // window.view.ctx.fillText('y:' + row, (col + .2) * scale, (row + .4) * scale);
        // window.view.ctx.fillText('x:' + col, (col + .2) * scale, (row + .8) * scale);
        // window.view.ctx.fillText('x:' + col, (col + .2) * scale, (row + .8) * scale);
    };
    this.fillCell = function (col, row, color = 'pink') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(col * scale + 1, row * scale + 1, scale - 2, scale - 2);

        this.ctx.fillStyle = 'black';
        // window.view.ctx.fillText('y:' + row, (col + .2) * scale, (row + .4) * scale);
        // window.view.ctx.fillText('x:' + col, (col + .2) * scale, (row + .8) * scale);
        // window.view.ctx.fillText('x:' + col, (col + .2) * scale, (row + .8) * scale);
    }
}

init(1500, 12, [1, 1], [10, 10], [
    [11, 9],
    [10, 9],
    [9, 9],
    [8, 9],
    [6, 9],
    [4, 9],
    [2, 9],
    [1, 9],
    [0, 9]
]);


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
