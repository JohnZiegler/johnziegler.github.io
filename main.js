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
let playerOreQuantities = new Map();
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

class miningAssistant { //The skeleton for what will be the idle part of the idle mining
    constructor(){
        this.cost = new Array(maximumOreTypes); //Creates a new array that will hold the cost of this type of upgrade
        
        this.assignCost(); 
    }

    assignCost(){
        for (i=0; i < maximumOreTypes; i++){
            this.cost[i] = (i+1) * 5;
        }
    }
}

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
        console.log("Attempting to generate ore! Current mining cost: " + miningModifier); //Output to find and verify
        return Math.floor(((1 / miningModifier) * (1 / miningModifier) * Math.floor((Math.random() + this.miningCost) + Math.floor(6) * Math.floor((Math.random() + this.miningCost) + Math.floor(100))))); ///Bro no idea it just maths
    }
}


function travelNewBelt() { //Function used when the player wants to travel to a new asteroid belt
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
        if ( activeMiningBelt[i].oreQuantity > 0) { //As long as each object is a valid object to be printed
            document.getElementById("currentBeltDisplay").innerHTML += activeMiningBelt[i].oreName + ": " + activeMiningBelt[i].oreQuantity + " units <button id=\"mineButton" + i + "\" onclick=\"mineOre(" + i + ")\">Mine</button></br>"; //Display out to the user the name of the ore and the quantity it has
        }
    }
}

function mineOre(orePositionNumber) { //General function the player uses to mine ore, currently a placeholder

    if (activeMiningBelt[orePositionNumber].oreQuantity > 0) { //As long as the rock has ore to be mined from it...
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

function purchaseMiningAssistant() { //Function used for upgrading the users mining abilities, currently outdated from test phase
    upgradeVerify = true; //Variable used to make sure we have a full pass of the values and that the user can afford the upgrade
    autoMiner = new miningAssistant; //Creates a new miningAssistant object that has our mining upgrades
    document.getElementById("upgradeMaterials").innerText = "Mining Assistant Costs:\n"; //Writes to the upgradeMatierals section on what the user needs to upgrade

    for (i=0; i < autoMiner.cost.length; i++){
        document.getElementById("upgradeMaterials").innerText += oreList.get(i) + ": " + autoMiner.cost[i] + "\n";
        if (playerOreQuantities.get(oreList.get(i)) < autoMiner.cost[i]){ //If the player cannot afford a single element...
            upgradeVerify = false; //The entire purchase will fail
            console.log("Can't afford that yet.");
        }
        }
        if (upgradeVerify){ //If the user does have enough value in each...
            for (i=0; i < autoMiner.cost.length; i++)
            playerOreQuantities.set(oreList.get(i), playerOreQuantities.get(oreList.get(i)) - autoMiner.cost[i]); //The cost is subtracted from the users ore quantities
            updatePlayerOre(); //Update the text so the player can see the amount taken
            console.log("Congratulations on your purhcase!");
    }
}