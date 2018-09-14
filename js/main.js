let grid;
let pickedColor;
function setPickedColor(col, original) {
    pickedColor = col;
    $("#colorPicker input").spectrum("set", original);
}

class Grid {
    constructor (w, h, tilesize) {
        this.width = w;
        this.height = h;
        this.tilesize = tilesize;
        this.reset();
    }

    reset() {
        this.data = [];
        for (let x = 0; x < this.width; x++) {
            this.data[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.data[x][y] = color(0,0,0,0);
            }
        }
    }

    render() {
        noStroke();
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                fill(this.data[x][y]);
                rect(x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
            }
        }
    }

    set(x, y, r, g, b, a) {
        this.data[x][y] = color(r,g,b,a);
    }

    get(x, y) {
        return this.data[x][y];
    }

    save() {
        let img = createImage(this.width,this.height);
        img.loadPixels();
        for (var i = 0; i < img.width; i++) {
            for (var j = 0; j < img.height; j++) {
                img.set(i, j, this.get(i, j));
            }
        }
        img.updatePixels();
        img.save('pixel-'+(new Date()).getTime(), 'png');
    }
}

let clickMode = 't-brush';

function setup() {    
    let canvas = createCanvas(640, 640);
    canvas.parent(document.querySelector('#canvas'));

    grid = new Grid(32, 32, 20);
    pickedColor = {_r: 0, _g: 0, _b: 0, _a: 1};

    noCursor();

    let tools = document.querySelectorAll('#tools img');
    for (let tool of tools) {
        tool.addEventListener('click', e=>{
            document.querySelector('img.selected').classList.remove('selected');
            tool.classList.add('selected');
            clickMode = tool.id;
        });
    }

    document.querySelector('#p5save img').addEventListener('click', e=>{
        grid.save();
    });
}

let drawEvent = function() {
    if (mouseX < 640 && mouseX > 0 && mouseY < 640 && mouseY > 0) {
        let gridX = int(mouseX / grid.tilesize);
        let gridY = int(mouseY / grid.tilesize);

        switch (clickMode) {
            case 't-brush':
                grid.set(gridX, gridY, round(pickedColor._r), round(pickedColor._g), round(pickedColor._b), round(pickedColor._a * 255));
                break;
            case 't-eraser':
                grid.set(gridX, gridY, 0, 0, 0, 0);
                break;
        }
    }
}

function mousePressed() {drawEvent()}
function mouseDragged() {drawEvent()}

function mouseClicked() {
    setPickedColor(pickedColor, `rgba(${pickedColor._r},${pickedColor._g},${pickedColor._b},${pickedColor._a})`);
}

function draw() {
    background(43,43,43);
    
    grid.render();

    fill(255 - round(pickedColor._r), 255 - round(pickedColor._g), 255 - round(pickedColor._b))
    ellipse(mouseX, mouseY, 9, 9);
    fill(round(pickedColor._r), round(pickedColor._g), round(pickedColor._b), round(pickedColor._a * 255));
    ellipse(mouseX, mouseY, 8, 8);
}