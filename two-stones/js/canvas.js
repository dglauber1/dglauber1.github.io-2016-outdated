MAP_WIDTH = window.innerWidth; 
MAP_HEIGHT = window.innerHeight;
PIXELS_PER_TILE = 100;
MAX_PIXELS_PER_TILE = 125;
MIN_PIXELS_PER_TILE = 35;
GRID_WIDTH = MAP_WIDTH / PIXELS_PER_TILE;
GRID_HEIGHT = MAP_HEIGHT / PIXELS_PER_TILE;
CANVAS_X = 25; //pixel displacement from grid origin 
CANVAS_Y = 25; //pixel displacement from grid origin

map = document.getElementById('map');
$("#zoomSlider")[0].min = MIN_PIXELS_PER_TILE;
$("#zoomSlider")[0].max = MAX_PIXELS_PER_TILE;
$("#zoomSlider")[0].value = PIXELS_PER_TILE;

map.width = MAP_WIDTH;
map.height = MAP_HEIGHT;

pieces = {}; //2D array. elements: (1 -> human piece, -1 -> computer piece)
showGrid = true;
$(document).ready(function() {
    paintMap();
});

//$("#showGrid").on("click", function() {
//    showGrid = this.checked;
//    paintMap();
//});

computerthinking = false;
mousedown = false;
mapdragged = false;
initial_mouse_x = 0;
initial_mouse_y = 0;
humanturn = 1;
longeststreak = 0;

function getstreak(x, y) {
    var toReturn = {};
    var maxStreak = 0;
    var toPlaceX;
    var toPlaceY;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (pieces[i + x] == null || pieces[i + x][j + y] == null) {
                incrementX = i * -1;
                incrementY = j * -1;
                var streak = 1;
                while (pieces[incrementX + x] != null && pieces[incrementX + x][incrementY + y] != null && pieces[incrementX + x][incrementY + y] != -1) {
                    streak++;
                    incrementX += i * -1;
                    incrementY += j * -1;    
                }
                if (streak > maxStreak) {
                    maxStreak = streak;
                    toPlaceX = i + x;
                    toPlaceY = j + y;
                }
            }
        }
    }
    toReturn["streak"] = maxStreak;
    toReturn["toPlaceX"] = toPlaceX;
    toReturn["toPlaceY"] = toPlaceY;
    return toReturn;
}

function updateBoardWeights(x, y) {
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (pieces[i + x] == null || pieces[i + x][j + y] == null) {
                incrementX = i * -1;
                incrementY = j * -1;
                var streak = 1;
                while (pieces[incrementX + x] != null && pieces[incrementX + x][incrementY + y] != null && pieces[incrementX + x][incrementY + y] != -1) {
                    streak++;
                    incrementX += i * -1;
                    incrementY += j * -1;    
                }
                if (boardWeights[i + x] == null) {
                    boardWeights[i + x] = {};
                }
                if (boardWeights[i + x][j + y] == null) {
                    boardWeights[i + x][j + y] = [0, 0]; //[board weight, max streak]
                }
                boardWeights[i + x][j + y][0] = parseInt(boardWeights[i + x][j + y][0]) + streak;
                if (streak > boardWeights[i + x][j + y][1]) {
                    boardWeights[i + x][j + y][1] = streak;
                }
            }
        }
    }
}

function getstreakSmart() {
    var maxWeight = 0;
    var gridX;
    var gridY;
    console.log(boardWeights);
    for (var x in boardWeights) {
        for (var y in boardWeights[x]) {
            if (maxWeight < boardWeights[x][y][0]) {
                maxWeight = boardWeights[x][y][0];
                gridX = x;
                gridY = y;
            }
        }
    }
    toReturn = {};
    toReturn["streak"] = boardWeights[gridX][gridY][1];
    toReturn["toPlaceX"] = gridX;
    toReturn["toPlaceY"] = gridY;
    return toReturn;
}

boardWeights = {};
function computerPlacePiece() {
    boardWeights = {};
    var gridX;
    var gridY;
    var maxStreak = 0;
    for (var x in pieces) {
        for (var y in pieces[x]) {
            if (pieces[x][y] == -1) {
                continue;
            }
            updateBoardWeights(parseInt(x), parseInt(y));
            //getstreak(parseInt(x), parseInt(y));
            // if (returnObject["streak"] > maxStreak) {
            //     gridX = returnObject["toPlaceX"];
            //     gridY = returnObject["toPlaceY"];
            //     maxStreak = returnObject["streak"];
            // }
        }
    }
    var returnObject = getstreakSmart();
    gridX = returnObject["toPlaceX"];
    gridY = returnObject["toPlaceY"];
    // maxStreak = returnObject["streak"];
    if (pieces[gridX] == null) {
        pieces[gridX] = {};
    }
    pieces[gridX][gridY] = -1;
}

function updateStreak(x, y) {
    var maxStreak = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (pieces[i + x] == null || pieces[i + x][j + y] == null) {
                incrementX = i * -1;
                incrementY = j * -1;
                var streak = 1;
                while (pieces[incrementX + x] != null && pieces[incrementX + x][incrementY + y] != null && pieces[incrementX + x][incrementY + y] != -1) {
                    streak++;
                    incrementX += i * -1;
                    incrementY += j * -1;    
                }
                if (streak > maxStreak) {
                    maxStreak = streak;
                }
            }
        }
    }
    if (maxStreak < longeststreak) {
        return;
    }
    longeststreak = maxStreak;
    streakString = "";
    for (var i = 0; i < maxStreak; i++) {
        streakString += "&#9679;";
    }
    $("#streak").html(streakString);
}

hoverX = null;
hoverY = null;

function handleMouseMove() {
    var canvasX = Math.floor((currMouseX + (CANVAS_X % PIXELS_PER_TILE + PIXELS_PER_TILE) % PIXELS_PER_TILE) / PIXELS_PER_TILE); 
    var canvasY = Math.floor((currMouseY + (CANVAS_Y % PIXELS_PER_TILE + PIXELS_PER_TILE) % PIXELS_PER_TILE) / PIXELS_PER_TILE);
//    var gridX = Math.floor((currMouseX + CANVAS_X) / PIXELS_PER_TILE);
//    var gridY = Math.floor((currMouseY + CANVAS_Y) / PIXELS_PER_TILE);
//    if (pieces[gridX] != null && pieces[gridX][gridY] != null) {
//        hoverX = null;
//        hoverY = null;
//        return;
//    }
    hoverX = canvasX;
    hoverY = canvasY;
}

function handleMouseClick() {
	if (computerthinking) {
		return;
	}
	var gridX = Math.floor((initial_mouse_x + CANVAS_X) / PIXELS_PER_TILE); 
	var gridY = Math.floor((initial_mouse_y + CANVAS_Y) / PIXELS_PER_TILE);
    if (pieces[gridX] != null && pieces[gridX][gridY] != null) {
		return;
	}
    humanturn++;
	if (pieces[gridX] == null) {
		pieces[gridX] = {};
	}
	pieces[gridX][gridY] = 1;
    updateStreak(gridX, gridY);
//	hoverX = null;
//	hoverY = null;
	paintMap();
    if (humanturn > 2) {
        computerthinking = true;
		paintMap();
        setTimeout(function() { 
            computerPlacePiece();
            computerthinking = false;
            handleMouseMove();
            paintMap();
        }, 500);  
        humanturn = 1;
    }
}


function panMap(newPixelsPerTile, mouseX, mouseY) {
	var newGridWidth = MAP_WIDTH / newPixelsPerTile;
	var newGridHeight = MAP_HEIGHT / newPixelsPerTile;

    var mouseTilesXOld = mouseX / PIXELS_PER_TILE;
    var mouseTilesYOld = mouseY / PIXELS_PER_TILE;

    var mouseTilesXNew = mouseX / newPixelsPerTile;
    var mouseTilesYNew = mouseY / newPixelsPerTile;

    var changeToCanvasX = (mouseTilesXOld - mouseTilesXNew) * newPixelsPerTile;
    var changeToCanvasY = (mouseTilesYOld - mouseTilesYNew) * newPixelsPerTile;
    CANVAS_X = CANVAS_X * GRID_WIDTH / newGridWidth + changeToCanvasX;
    CANVAS_Y = CANVAS_Y * GRID_HEIGHT / newGridHeight + changeToCanvasY;
}

function zoomMap(newPixelsPerTile, mouseX, mouseY) {
    var changeFactor = PIXELS_PER_TILE / newPixelsPerTile;
    panMap(newPixelsPerTile, mouseX, mouseY);
    GRID_WIDTH = MAP_WIDTH / newPixelsPerTile;
	GRID_HEIGHT = MAP_HEIGHT / newPixelsPerTile;
    PIXELS_PER_TILE = newPixelsPerTile;
}

function zoomScroll(event) {
    event.preventDefault();
    var newPixelsPerTile = PIXELS_PER_TILE * (1 + event.originalEvent.wheelDelta / 120 / 50);
    if (newPixelsPerTile < $("#zoomSlider")[0].min) {
        return;
    }
    if (newPixelsPerTile > $("#zoomSlider")[0].max) {
        return;
    }
    
    initial_mouse_x = event.pageX;
    initial_mouse_y = event.pageY;
    zoomMap(newPixelsPerTile, initial_mouse_x, initial_mouse_y);
    $("#zoomSlider")[0].value = newPixelsPerTile;
}

$(window).on("resize", function(event){
	MAP_WIDTH = window.innerWidth;
	MAP_HEIGHT = window.innerHeight;
	GRID_WIDTH = MAP_WIDTH / PIXELS_PER_TILE;
	GRID_HEIGHT = MAP_HEIGHT / PIXELS_PER_TILE;
	map.width = MAP_WIDTH;
	map.height = MAP_HEIGHT;
	paintMap();
});

$(window).on("mouseout", function(event) {
    hoverX = null;
    hoverY = null;
    paintMap();
});

//mousewheel isn't recognized by firefox browsers
$("#map").on('mousewheel', function(event){
    zoomScroll(event);
	currMouseX = event.pageX; //mouse position may not be initialized in the case where
	currMouseY = event.pageY; //a user refreshes browser and scrolls without first moving mouse
    handleMouseMove(event.pageX, event.pageY);
    paintMap();
});

$("#zoomSlider").on("input", function(event) {
    var sliderValue = parseFloat($("#zoomSlider")[0].value);
    zoomMap(sliderValue, MAP_WIDTH / 2, MAP_WIDTH / 2);
	paintMap();
});

$("#zoom-wrapper").on("mousewheel", function(event) {
    zoomScroll(event);
	currMouseX = event.pageX; //mouse position may not be initialized in the case where
	currMouseY = event.pageY; //a user refreshes browser and scrolls without first moving mouse
    handleMouseMove(event.pageX, event.pageY);
    paintMap();
});

sliderDragged = false;
$("#zoomSlider").on("mousedown", function(event) {
	sliderDragged = true;
	hoverX = null;
	hoverY = null;
	paintMap();
});

$("#map").on('mousedown', function(event){
	mousedown = true;
	initial_mouse_x = event.pageX;
	initial_mouse_y = event.pageY;
    initial_canvas_x = CANVAS_X;
    initial_canvas_y = CANVAS_Y;
});

$(window).on('mouseup', function(event){
    if (!mapdragged && !sliderDragged) {
        initial_mouse_x = event.pageX;
        initial_mouse_y = event.pageY;
		handleMouseClick();
    }
	sliderDragged = false;
    mousedown = false;
    mapdragged = false;
	paintMap();
});

$(window).on('mousemove', function(event){
	if (sliderDragged) {
		return;
	}
	if (mousedown) {
        event.preventDefault();
        if (!mapdragged) {
            mapdragged = true;
        }
		CANVAS_X = initial_canvas_x + initial_mouse_x - event.pageX;
		CANVAS_Y = initial_canvas_y + initial_mouse_y - event.pageY;
    }
    currMouseX = event.pageX;
    currMouseY = event.pageY;
    handleMouseMove();
    paintMap();
});
