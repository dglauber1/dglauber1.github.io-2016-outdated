var buildingHeight = 100;
var maxDropFloor = buildingHeight;//the maximum floor at which it might break
var minDropFloor = 1;//the minimum floor at which it might break
var cellPhoneOneBroken = false;
var cellPhoneTwoBroken = false;

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
	var necessaryTriesIfDoesNotBreak = triesNecessary(maxDropFloor - currDropFloor);
}

//returns the number of tries necessary for a building of height numFloors
function triesNecessary(numFloors) {
	if (numFloors == 1) {
		return 1;
	}
}

function guessedRight(floorGuess) {
	if (minDropFloor == maxDropFloor) {
		return floorGuess == minDropFloor;
	} else {
		return false;
	}
}
