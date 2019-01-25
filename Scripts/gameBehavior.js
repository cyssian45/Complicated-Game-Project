//all rectangles are defined here
var rects = [[20, 20, 100, 560], [20, 20, 760, 100], [710, 20, 70, 560], [596, 530, 184, 50], [482, 480, 164, 50], [368, 430, 164, 50], [254, 480, 164, 50], [140, 530, 164, 50], [140, 380, 50, 150], [190, 318, 50, 112], [140, 256, 50, 112], [190, 194, 50, 112], [140, 140, 50, 104], [140, 140, 550, 42], [640, 140, 50, 320], [552, 410, 138, 50], [280, 222, 320, 148], [552, 222, 48, 238]];

//finish line!!
var finishLine = [330, 222, 4, 148]
//car variable
var car;

function startGame()
{
    //creates new car object
    car = new carConstructor(20, 40, "red", 70, 550);
    //starts the game
    myGameArea.start();
}

//sets up the game area
var myGameArea = 
{
    canvas : document.createElement("canvas"),
    
    //Run when webpage opens. Initializes canvas. Sets up the event listeners that look for key presses.
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);                
        //Event Listeners
        window.addEventListener('keydown', function (e)
        {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        
        window.addEventListener('keyup', function (e) 
        {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//Car constructor. Includes all aspects of the car (see parameters)
function carConstructor(width, height, color, x, y, type) {

    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0;
    this.friction = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
    
    //Update redraws the rectangle with the correct orientation (This controls the rotation of the car)
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();    
    }
    
    //newPos moves the car forwards and backwards based on the "angle" value
    this.newPos = function() {
        this.speed += this.acceleration;
        if (this.speed > 0) {
            this.speed += this.friction;
        } else if (this.speed < 0) {
            this.speed -= this.friction;
        }
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    this.checkEdges = function() {

        if(this.x <= 0 ) { // top edge              
            this.speed = 0;
            this.x = 0;
        }
        if(this.y >= myGameArea.canvas.height) { // bottom edge
            this.speed = 0;
            this.y = myGameArea.canvas.height;                    
        }
        if(this.y <= 0) { // left edge
            this.speed = 0;
            this.y = 0;
        }
        if(this.x >= myGameArea.canvas.width) { // right edge
            this.speed = 0;
            this.x = myGameArea.canvas.width;
        }
    }
    
    this.crashCheck = function() {
        var crashStatus = true;
        var i;
        for (i = 0; i < rects.length; ++i) {
            if (this.x < rects[i][0] + rects[i][2] && this.x > rects[i][0] && this.y < rects[i][1] + rects[i][3] && this.y > rects[i][1]) {
                crashStatus = false;
                break;
            }
        }
        return crashStatus;
    }
    this.winCheck = function() {
        var winStatus = false;
        if (this.x < finishLine[0] + finishLine[2] && this.x > finishLine[0] && this.y < finishLIne[1] + finishLine[3] && this.y > finishLine[1]) {
            winStatus = true;
        }
        return winStatus;
    }
}

//updateGameArea does the actual updating when called during each interval (see start function in myGameArea)
function updateGameArea() {
    if (car.crashCheck()) {
        myGameArea.context.fillStyle = "#000000";
        myGameArea.context.font = "30px Arial";
        myGameArea.context.fillText("Game Over", 10, 50);
        return;
    }
    //checking win condition, not working
    /*if (car.winCheck()) {
        myGameArea.context.fillStyle = "#000000";
        myGameArea.context.font = "30px Arial";
        myGameArea.context.fillText("You Won!", 10, 50);
        return;
    }*/
    //clears the board
    myGameArea.clear();
    //Draws rectangles
    myGameArea.context.fillStyle = "#808080";
    var i;
    for (i = 0; i < rects.length; ++i) {
        myGameArea.context.fillRect(rects[i][0], rects[i][1], rects[i][2], rects[i][3]);
    }
    myGameArea.context.fillStyle = "#000000";
    myGameArea.context.fillRect(finishLine[0], finishLine[1], finishLine[2], finishLine[3]);
    car.moveAngle = 0;
    //car.speed = 0; ***Leave this commented***
    //Depending on which key is pressed, the appropriate value is adjusted
    if (myGameArea.keys && myGameArea.keys[65]) {
        car.moveAngle = -2; 
    }
    
    if (myGameArea.keys && myGameArea.keys[68]) {
        car.moveAngle = 2;
    }
    
    if (myGameArea.keys && myGameArea.keys[87]) {
        car.acceleration += .001; 
        car.friction = 0;
    } else if (myGameArea.keys && myGameArea.keys[83]) {
        car.acceleration += -.001; 
        car.friction = 0;
    } else {
        car.acceleration = 0;
        car.friction += -.00005;
    }
    
    //These adjusted values are then used in newPos and update to redraw the new car
    car.newPos();
    car.checkEdges();
    car.update();
}