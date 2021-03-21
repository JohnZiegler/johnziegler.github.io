// #region Variables and Game Data
var playerBalance = 0; //Variable used to store the amount of currency or money the player has
var maximumAsteroidOres = 6; //The maximum amount of asteroids we want to have in any given belt at any given time
var ORE_LEVEL_0 = 'Veldspar';
var ORE_LEVEL_1 = 'Scordite';
var ORE_LEVEL_2 = 'Pyroxis';
var ORE_LEVEL_3 = 'Jaspet';
var maximumOreTypes = 4; //The current maximum amount of ore types in the game
var activeMiningBelt = new Array(maximumAsteroidOres); //The current active belt the user is mining within
var goldPerClick = 1; //The amount of gold per click the user will recieve per click
var currentUpgrade = 1; //The current upgrade level of the user,
var miningUpgrade = [ //Array used to currently store the tiers of mining
    10, //First upgrade 1->2
    25, //Second upgrade 2->3
    250 //Third Upgrade 3->4
];
var statusAutoMiningEnabled = false; //Variable used to determine if the autoMiner should currently be active or not

let playerOreQuantities = new Map(); //Creates a new map that stores the amount of ore the player has currently
playerOreQuantities.set(ORE_LEVEL_0, 0);
playerOreQuantities.set(ORE_LEVEL_1, 0);
playerOreQuantities.set(ORE_LEVEL_2, 0);
playerOreQuantities.set(ORE_LEVEL_3, 0);

let oreStatistics = new Map(); //Creates a new map that is used to store all the ores that could possibly spawn
oreStatistics.set(0, ORE_LEVEL_0); //Values are duplicated to simulate weighted chances, with some ores being more
oreStatistics.set(1, ORE_LEVEL_0); //Or less likely to spawn based on their rarity.
oreStatistics.set(2, ORE_LEVEL_1);
oreStatistics.set(3, ORE_LEVEL_1);
oreStatistics.set(4, ORE_LEVEL_2);
oreStatistics.set(5, ORE_LEVEL_3);

let oreList = new Map(); //A map for finding the given name of an ore based on it's number
oreList.set(0, ORE_LEVEL_0);
oreList.set(1, ORE_LEVEL_1);
oreList.set(2, ORE_LEVEL_2);
oreList.set(3, ORE_LEVEL_3);
// #endregion

class miningAssistant { //Creates a miningAssistant class which is the blueprint for our autoMiner

    constructor() {
        this.upgradeCost = new Array(maximumOreTypes); //Variable for the object to hold the upgradeCost (in ores) of each upgrade they want to purchase
        this.miningQuantity = 1; //Variable for the amount of ore each miningAssistant can mine, currently no upgrade paths and is set to 1
        this.minerCount = 0; //Variable used to count the amount of miningAssistant the player has purchase, is increased with increaseMinerQuantity()
        this.upgradeSpeed = 1; //Variable used to hold the frequency of mining activities for the autoMiners, is increased with increaseMinerSpeed()
    }
    recalculateUpgradeCost(){ //Function used to recalculate the upgrade cost when the player purchases an upgrade
        for (i = 0; i < maximumOreTypes; i++) { //For each of the ore types that exist...
            this.upgradeCost[i] = Math.ceil(this.upgradeCost[i] * 1.10); //Create a new upgrade cost for the player
        }
    }

    increaseMinerCount(){ //Function used to increase the amount of miningAssistant in the belt
        this.minerCount++; //Increase the miner count by one
            this.recalculateUpgradeCost(); //Create a new upgrade cost for the player
            statusAutoMiningEnabled = true; //Enable the ability to autoMine
    }
    increaseMinerSpeed(){ //Function used to increase the speed of miningAssistant
        this.upgradeSpeed++; //Increase the miner speed by one
            this.recalculateUpgradeCost(); //Create a new upgrade cost for the player
    }

    initialUpgradeCost() { //Function used to set the initial upgrade cost of the upgrades, in ore prices
        var i = 0;
        for (i = 0; i < maximumOreTypes; i++) { //For each of the ores that exist...
            //this.upgradeCost[i] = 1; //Test line to speed up testing of upgrades and debug
            this.upgradeCost[i] = (i + 1) * 5; //Sets the base upgrades based on this formula, currently a placeholder
            console.log("Upgrade cost for slot " + i + ": " + this.upgradeCost[i]);
        }
    }

}
var autoMiner = new miningAssistant(); //Creates a new miningAssistant object
autoMiner.initialUpgradeCost(); //Runs the intial set up for the upgrade costs
setInterval(updateAutoMine, (1000 / autoMiner.upgradeSpeed));//setInterval(function you want to call, how often you want to call it (e.g. 1000/15))


class mineableOre { //Creates the class of a mineable ore asteroid that the player can aquire minerals froms
    constructor(randomOreName) { //The constructor, which is given a random ore name selected from the map, and generated when this object is created
        this.oreName = randomOreName; //Assign the name that was recieved to this object, based on the map
        this.miningCost = this.getMiningCost(randomOreName); //Finds the mining cost of the ore based on the rarity of the ore iteself
        this.oreQuantity = this.spawnOreQuantity(this.miningCost); //Amount of ore the rock has to be mined
    }

    getMiningCost(oreInputName) { //Function used to find the mining cost of the ore that is created
        console.log("Attempting to create a new ore! input ore: " + oreInputName) //Output to bug find and verify
        switch (oreInputName) { //Switch case to find the ore rarity, based on the inputname found from the map
            case ORE_LEVEL_0: //Name of the ore
                console.log("New Veldspar Created!");//Output to find and verify
                return 1; //the rarity modifer value of this ore
                break; //Prevents drip through code
            case ORE_LEVEL_1:
                console.log("New Scordite Created!");
                return 2;
                break;
            case ORE_LEVEL_2:
                console.log("New Pyroxis Created!");
                return 3;
                break;
            case ORE_LEVEL_3:
                console.log("New Jaspet Created!");
                return 4;
                break;
        }
    }

    spawnOreQuantity(miningModifier) { //Function used to find the quantity of the ore within the rocks themselves
        //console.log("Attempting to generate ore! Current mining cost: " + miningModifier); //Output to find and verify
        return Math.floor(((1 / miningModifier) * (1 / miningModifier) * Math.floor((Math.random() + this.miningCost) + Math.floor(6) * Math.floor((Math.random() + this.miningCost) + Math.floor(100))))); ///Bro no idea it just maths
    }
}
function travelNewBelt() { //Function used when the player wants to travel to a new asteroid belt
    
    if(autoMiner.minerCount != 0){ //If the user has any auto miners... (For when the player previously had no ore in a belt and changes to a new belt, enables mining without purchasing an upgrade)
        statusAutoMiningEnabled = true; //Enable the ability to auto mine
    }

    activeMiningBelt = new Array(maximumAsteroidOres); //Creates a new array that will hold the asteroids as they are made and to be mined
    for (i = 0; i < maximumAsteroidOres; i++) { //For each element less than the maximum amount of asteroids allowed to spawn...
        activeMiningBelt[i] = new mineableOre(oreStatistics.get(Math.floor(Math.random() * Math.floor(6)))); //Set the element at the current place to a new ore based on the calculation that will roll between 0 and 5, inclusive
    }
    printCurrentBelt(); //Prints the contents of the current belt for the user to see
    console.log(activeMiningBelt); //Output used to find and verify
}
function printCurrentBelt() { //Function used to print out the current contents of the belt to the user
    document.getElementById("currentBeltDisplay").innerHTML = "This belt contains</br>"; //Get the element tagged currentBeltDisplay and begin to prompt the user about what they are about to see
    for (i = 0; i < activeMiningBelt.length; i++) { //For each element in the array
        if (activeMiningBelt[i].oreQuantity > 0) { //As long as each object is a valid object to be printed
            document.getElementById("currentBeltDisplay").innerHTML += activeMiningBelt[i].oreName + ": " + activeMiningBelt[i].oreQuantity + " units <button id=\"mineButton" + i + "\" onclick=\"mineOre(" + i + ")\">Mine</button></br>"; //Display out to the user the name of the ore and the quantity it has
        }
    }
}
function mineOre(orePositionNumber) { //General function the player uses to mine ore, currently a placeholder
    console.log("Attempting to mine...")
        ; if (activeMiningBelt[orePositionNumber].oreQuantity > 0) { //As long as the rock has ore to be mined from it...
            console.log("Before mining: " + activeMiningBelt[orePositionNumber].oreQuantity);
            activeMiningBelt[orePositionNumber].oreQuantity -= 1; //Subtract one from the available ore to be mined
            console.log("After mining: " + activeMiningBelt[orePositionNumber].oreQuantity);
            playerOreQuantities.set(activeMiningBelt[orePositionNumber].oreName, (playerOreQuantities.get(activeMiningBelt[orePositionNumber].oreName) + 1)); //Add the amount to he users amount (set the value based on the ore name of the ore, and set the amount of ore owned by the player based on the name to increment by 1)
            console.log("Successfully mined!");
        } else if (activeMiningBelt[orePositionNumber].oreQuantity <= 0) { //If the ore quantity has been depleated
            console.log("You've run out of ore to mine!");
            for (i = orePositionNumber; i < maximumAsteroidOres; i++) { //For each element in the activeMiningBelt array
                activeMiningBelt[i] = activeMiningBelt[i + 1]; //Move it up one to replace the ore that was just mined
            }

        }
    printCurrentBelt();
    updatePlayerOre();
}
function getByValue(map, searchValue) { //Javascript function used to find the key based on the value
    for (let [key, value] of map.entries()) { //Using the entries of the supplied map, we are assigning the "first" value equal key, and value as the "response" {EX: oreStatistics.set(0<KEY,       ORE_LEVEL_0<VALUE);}
        if (value === searchValue) //If the value we're searching for is within the map
            return key; //Return the key for that given value
    }
}
function updatePlayerOre() { //Function used to update the players ore display when the aquire new ore, currently a placeholder
    document.getElementById("playerConsole").innerHTML = "My Ore Inventory:</br>";
    document.getElementById("playerConsole").innerHTML += "Veldspar: " + playerOreQuantities.get(ORE_LEVEL_0) + "</br>";
    document.getElementById("playerConsole").innerHTML += "Scordite: " + playerOreQuantities.get(ORE_LEVEL_1) + "</br>";
    document.getElementById("playerConsole").innerHTML += "Pyroxis: " + playerOreQuantities.get(ORE_LEVEL_2) + "</br>";
    document.getElementById("playerConsole").innerHTML += "Jaspet: " + playerOreQuantities.get(ORE_LEVEL_3) + "</br>";

}
function purchaseAutoMinerQuantity() { //Function used for upgrading the users mining abilities
    upgradeVerify = true; //Variable used to make sure we have a full pass of the values and that the user can afford the upgrade

    
    for (i = 0; i < maximumOreTypes; i++) {
        if (playerOreQuantities.get(oreList.get(i)) < autoMiner.upgradeCost[i]) { //If the player cannot afford a single element...
            upgradeVerify = false; //The entire purchase will fail
            console.log("Can't afford that yet.");
        }
    }
    if (upgradeVerify) { //If the user does have enough value in each...
        for (i = 0; i < maximumOreTypes; i++)
            playerOreQuantities.set(oreList.get(i), playerOreQuantities.get(oreList.get(i)) - autoMiner.upgradeCost[i]); //The cost is subtracted from the users ore quantities
        updatePlayerOre(); //Update the text so the player can see the amount taken
        if (autoMiner.minerCount == 0) {
            document.getElementById("menu").innerHTML += "<button id=\"upgradeAutoMinerSpeed\" onclick=\"purchaseAutoMinerSpeed()\">Upgrage Mining Speed</button></br>";
        }
        autoMiner.increaseMinerCount();
        console.log("Congratulations on your purhcase!");

    }
    displayUpgradeCosts();
}

function purchaseAutoMinerSpeed() { //Function used for upgrading the users mining speed
    upgradeVerify = true; //Variable used to make sure we have a full pass of the values and that the user can afford the upgrade

    for (i = 0; i < maximumOreTypes; i++) {
        if (playerOreQuantities.get(oreList.get(i)) < autoMiner.upgradeCost[i]) { //If the player cannot afford a single element...
            upgradeVerify = false; //The entire purchase will fail
            console.log("Can't afford that yet.");
        }
    }
    if (upgradeVerify) { //If the user does have enough value in each...
        for (i = 0; i < maximumOreTypes; i++)
            playerOreQuantities.set(oreList.get(i), playerOreQuantities.get(oreList.get(i)) - autoMiner.upgradeCost[i]); //The cost is subtracted from the users ore quantities
        updatePlayerOre(); //Update the text so the player can see the amount taken
        autoMiner.increaseMinerSpeed();
        console.log("Congratulations on your purchase!");

    }
    displayUpgradeCosts();
}

function displayUpgradeCosts(){ //Function used to display the current upgrade costs of the purchasable upgrades
    document.getElementById("upgradeMaterials").innerText = "Mining Assistant Costs:\n"; //Writes to the upgradeMatierals section on what the user needs to upgrade
    for (i = 0; i < maximumOreTypes; i++) { //For each of the ore types that exist...
        document.getElementById("upgradeMaterials").innerText += oreList.get(i) + ": " + autoMiner.upgradeCost[i] + "\n";
    }
}

function updateAutoMine() { //Function used for calculating the ore automatically mined
    if (statusAutoMiningEnabled) { //If the player has currently earned auto mining capabilities...
        oreLocation = Math.floor(Math.random() * maximumAsteroidOres); //Attempts to pick an ore to mine by randomly selecting an available ore rock
        miningAttempts = 0; //Variable used to make sure we don't infinitely check asteroids that we already know are mined
        console.log(oreLocation + " is the ore you are mining!");

        while (activeMiningBelt[oreLocation].oreQuantity == 0) { //If the current ore has no available ore to be mined...
            console.log(activeMiningBelt[oreLocation] + " is out of ore! Attempting to remine...")
            if ((oreLocation + 1) == activeMiningBelt.length) { //If the selected ore is the ore currently at the end of the array (oreLocation index 0, last node will equal the length of the array)
                oreLocation = 0; //Set the ore to be mined to the first ore in the array
                miningAttempts++; //Increase the attempts count
                console.log("Starting at the first asteroid");
            } else {
                console.log("Attemtping to mine further down the chain...")
                oreLocation++; //Increase the position of the array by one in an attempt to mine the next ore
                miningAttempts++; //Increase the attempt count
            }


            if (miningAttempts >= maximumAsteroidOres) { //If the auto mine has attempted to search at least every rock available to be put into belts...
                statusAutoMiningEnabled = false; //Set the auto mining to false, as there is no more ore available here to be mined, and the player will need to find a new belt
                console.log("Out of ore! You need to go find new ore to mine!")
                break; //Break gets us out of this while loop, after disabling the condition that would set this off in the first place
            }
        }

        if (activeMiningBelt[oreLocation].oreQuantity > calculateAutoMiningAmount()) { //If the quantity of the ore is greater than what can be mined by the autominers...
            console.log("Successfully mined!");
            activeMiningBelt[oreLocation].oreQuantity -= calculateAutoMiningAmount(); //Subtract the ore mined from the available amount
            playerOreQuantities.set(activeMiningBelt[oreLocation].oreName, playerOreQuantities.get(activeMiningBelt[oreLocation].oreName) + calculateAutoMiningAmount()); //Increase the player quantities with that much of the ore
        } else if (activeMiningBelt[oreLocation].oreQuantity <= calculateAutoMiningAmount() && activeMiningBelt[oreLocation].oreQuantity != 0) { //Otherwise, as long as there is an amount of ore in the rock to be mined, so long as it is less than the amount auto miners are able to mine...
            playerOreQuantities.set(activeMiningBelt[oreLocation].oreName, playerOreQuantities.get(activeMiningBelt[oreLocation].oreName) + activeMiningBelt[oreLocation].oreQuantity); //Only give to the player the amount of ore remaining in the rock
            activeMiningBelt[oreLocation].oreQuantity = 0; //Sets the rocks value to 0, as all the available ore has been removed from the rock
        }
        updatePlayerOre();
        printCurrentBelt();
    }

}

function calculateAutoMiningAmount() { //Function used to calculate the amount of ore mined by the auto miner swarm
    return autoMiner.miningQuantity * autoMiner.minerCount; //Multiplies the amount of auto miners by the amount each miner can mine
}