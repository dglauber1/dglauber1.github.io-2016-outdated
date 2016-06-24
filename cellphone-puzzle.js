var buildingHeight = 100;
var maxDropFloor = buildingHeight;//the maximum floor at which it might first break
var minDropFloor = 1;//the minimum floor at which it might first break
var cellPhoneOneBroken = false;
var cellPhoneTwoBroken = false;
var guesses = 0;

function handleGuess() {
	if (cellPhoneTwoBroken) {
		return;
	}
	var floorGuess = $("#guess-input").val();
	$("#guess-input").val("");
	var floorGuessNum = Number.parseFloat(floorGuess);
	if (!Number.isInteger(floorGuessNum) || floorGuessNum < 1 || floorGuessNum > 100) {
		$("#error").text("Floor guess must be an integer between 1 and 100");
		return;
	} 
	$("#error").text("");
	$("#num-drops").text("Drops: " + ++guesses);
	if (cellPhoneOneBroken && !cellPhoneTwoBroken && floorGuessNum > minDropFloor) {
		
		$("#feedback").append("<br>Cell phone 2 broke on floor " + floorGuessNum);
		cellPhoneTwoBroken = true;
		maxDropFloor = floorGuessNum;
		$("#drop-phone").hide();
		$("#guess-input").hide();
	} else if (doesBreak(floorGuessNum)) {
		if (!cellPhoneOneBroken) {
			$("#feedback").append("Cell phone 1 broke on floor " + floorGuessNum);
			$("#drop-phone").html("Drop cellphone 2");
			cellPhoneOneBroken = true;
			maxDropFloor = floorGuessNum;
		} else if (!cellPhoneTwoBroken) {
			$("#feedback").append("<br>Cell phone 2 broke on floor " + floorGuessNum);
			cellPhoneTwoBroken = true;
			$("#drop-phone").hide();
			$("#guess-input").hide();
		}
	} else {
		$("#feedback").append("<br>Cellphone didn't break at floor " + floorGuess);
		if (minDropFloor < floorGuessNum + 1) {
			minDropFloor = floorGuessNum + 1;
		}
	}
}

function handleFinalGuess() {
	var finalGuess = $("#final-guess").val();
	var finalGuessNum = Number.parseFloat(finalGuess);
	if (!Number.isInteger(finalGuessNum) || finalGuessNum < 1 || finalGuessNum > 100) {
		$("#error").text("Final guess must be an integer between 1 and 100");
		return;
	}
	$("#error").text("");
	$("#final-guess").hide();
	$(":button").hide();
	$("#final-prompt").hide();
	$("#drop-phone").hide();
	$("#guess-input").hide();
	$("#feedback").append("<br>You guessed that the threshold is floor " + finalGuess);
	if (guessedRight(finalGuess)) {
		$("#feedback").append("<br>Correct! Floor " + minDropFloor + " is the lowest floor at which a dropped cellphone will break.");
		$("#feedback").append("<br>You managed to figure this out in " + guesses + " guesses. Could it be done in less?");
	} else {
		$("#feedback").append("<br>Incorrect. The lowest floor at which a dropped cellphone will break is floor ");
		if (minDropFloor == finalGuess) {
			$("#feedback").append(minDropFloor + 1);
		} else {
			$("#feedback").append(finalGuess - 1);
		}
	}
}


//returns a boolean
function doesBreak(currDropFloor) {
	if (currDropFloor < minDropFloor) {
		return false;
	}
	if (currDropFloor > maxDropFloor) {
		return true;
	}
	if (cellPhoneOneBroken) {
		if (currDropFloor == maxDropFloor) {
			return true;
		} else {
			return false;
		}
	}
		
	var necessaryTriesIfDoesBreak = currDropFloor - minDropFloor;
	var maxTriesIfDoesNotBreak = maxDropFloor - currDropFloor;
	if (necessaryTriesIfDoesBreak > maxTriesIfDoesNotBreak) {
		return true;
	}
	var necessaryTriesIfDoesNotBreak = getTriesNecessary(maxDropFloor - currDropFloor);
	if (necessaryTriesIfDoesBreak > necessaryTriesIfDoesNotBreak) {
		return true;
	} else {
		return false;
	}
}

//returns the number of tries necessary for a building of height numFloors
function getTriesNecessary(numFloors) {
	if (numFloors == 1) {
		return 1;
	}
	var triesNecessary = numFloors;
	var floorGuessed;
	for (floorGuessed = 1; floorGuessed <= numFloors; floorGuessed++) {
		var numGuesses = 0;
		var currentGuess = floorGuessed;
		while (currentGuess <= numFloors && floorGuessed - numGuesses > 0) {
			numGuesses++;
			currentGuess += floorGuessed - numGuesses;
		}
		if (currentGuess <= numFloors) {
			numGuesses += numFloors - currentGuess;
		} else {
			numGuesses += numFloors - (currentGuess - (floorGuessed - numGuesses));
		}
		triesNecessary = Math.min(triesNecessary, Math.max(numGuesses, floorGuessed));
	}
	return triesNecessary;
}

function guessedRight(floorGuess) {
	if (minDropFloor == maxDropFloor) {
		return floorGuess == minDropFloor;
	} else {
		return false;
	}
}
