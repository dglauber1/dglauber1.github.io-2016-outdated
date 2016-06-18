var buildingHeight = 100;
var maxDropFloor = buildingHeight;//the maximum floor at which it might break
var minDropFloor = 1;//the minimum floor at which it might break
var cellPhoneOneBroken = false;
var cellPhoneTwoBroken = false;

//returns a boolean
function doesBreak() {
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
	for (floorGuessed = 1; floorGuessed <= numFloors / 2; floorGuessed++) {
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
		triesNecessary = Math.min(triesNecessary, Math.min(numGuesses, floorGuessed));
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
