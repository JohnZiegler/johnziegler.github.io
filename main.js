var playerBalance = 0; //Variable used to store the amount of currency or money the player has
var maximumAsteroidOres = 6; //The maximum amount of asteroids we want to have in any given belt at any given time
var activeMiningBelt = new Array(maximumAsteroidOres); //The current active belt the user is mining within
var goldPerClick = 1; //The amount of gold per click the user will recieve per click
var currentUpgrade = 1; //The current upgrade level of the user,
var miningUpgrade = [ //Array used to currently store the tiers of mining
  10, //First upgrade 1->2
  25, //Second upgrade 2->3
  250 //Third Upgrade 3->4
];


let oreStatistics = new Map(); //Creates a new map that is used to store all the ores that could possibly spawn
oreStatistics.set(0,'Veldspar'); //Values are duplicated to simulate weighted chances, with some ores being more
oreStatistics.set(1,'Veldspar'); //Or less likely to spawn based on their rarity.
oreStatistics.set(2,'Scordite');
oreStatistics.set(3,'Scordite');
oreStatistics.set(4,'Pyroxis');
oreStatistics.set(5,'Jaspet');


class mineableOre { //Creates the class of a mineable ore asteroid that the player can aquire minerals froms
    constructor(randomOreName) { //The constructor, which is given a random ore name selected from the map, and generated when this object is created
        this.oreName = randomOreName; //Assign the name that was recieved to this object, based on the map
        this.miningCost = this.getMiningCost(randomOreName); //Finds the mining cost of the ore based on the rarity of the ore iteself
        this.oreQuantity = this.spawnOreQuantity(this.miningCost); //Amount of ore the rock has to be mined
    }

    getMiningCost(oreInputName) { //Function used to find the mining cost of the ore that is created
        console.log("Attempting to create a new ore! input ore: " + oreInputName) //Output to bug find and verify
        switch (oreInputName) { //Switch case to find the ore rarity, based on the inputname found from the map
            case 'Veldspar': //Name of the ore
                console.log("New Veldspar Created!");//Output to find and verify
                return 1; //the rarity modifer value of this ore
                break; //Prevents drip through code
            case 'Scordite':
                console.log("New Scordite Created!");
                return 2;
                break;
            case 'Pyroxis':
                console.log("New Pyroxis Created!");
                return 3;
                break;
            case 'Jaspet':
                console.log("New Jaspet Created!");
                return 4;
                break;
        }
    }

    spawnOreQuantity(miningModifier) { //Function used to find the quantity of the ore within the rocks themselves
        console.log("Attempting to generate ore! Current mining cost: " + miningModifier); //Output to find and verify
        return Math.floor(((1/miningModifier)*(1/miningModifier) * Math.floor((Math.random() + this.miningCost) + Math.floor(6) * Math.floor((Math.random() + this.miningCost) * Math.floor(100))))); ///Bro no idea it just maths
    }
}


function travelNewBelt(){ //Function used when the player wants to travel to a new asteroid belt
    activeMiningBelt = new Array(maximumAsteroidOres); //Creates a new array that will hold the asteroids as they are made and to be mined
    for (i=0; i < maximumAsteroidOres; i++){ //For each element less than the maximum amount of asteroids allowed to spawn...
        activeMiningBelt[i] = new mineableOre(oreStatistics.get(Math.floor(Math.random() * Math.floor(6)))); //Set the element at the current place to a new ore based on the calculation that will roll between 0 and 5, inclusive
    }
    printCurrentBelt(); //Prints the contents of the current belt for the user to see
    console.log(activeMiningBelt); //Output used to find and verify
}

function printCurrentBelt(){ //Function used to print out the current contents of the belt to the user
    document.getElementById("currentBeltDisplay").innerHTML = "This belt contains</br>"; //Get the element tagged currentBeltDisplay and begin to prompt the user about what they are about to see
    for (i=0; i < activeMiningBelt.length; i++){ //For each element in the array
        document.getElementById("currentBeltDisplay").innerHTML += activeMiningBelt[i].oreName + ": " + activeMiningBelt[i].oreQuantity + " units</br>"; //Display out to the user the name of the ore and the quantity it has
    }
}

function mineOre() { //General function the player uses to mine ore, currently a placeholder
    //updatePlayerOre();
}

function getByValue(map, searchValue) { //Javascript function used to find the key based on the value
    for (let [key, value] of map.entries()) { //Using the entries of the supplied map, we are assigning the "first" value equal key, and value as the "response" {EX: oreStatistics.set(0<KEY,       'Veldspar'<VALUE);}
      if (value === searchValue) //If the value we're searching for is within the map
        return key; //Return the key for that given value
    }
  }

function updatePlayerOre(){ //Function used to update the players ore display when the aquire new ore, currently a placeholder
}

function purchaseMiningUpgrade(){ //Function used for upgrading the users mining abilities, currently outdated from test phase
    for (i=0; i < miningUpgrade.length; i++){ //For each of the possible upgrades available to the user...
        if (playerBalance >= miningUpgrade[i] && currentUpgrade < i + 2){ //If they currently have enough gold for the given upgrade, and they are also only purchasing an upgrade that will be an upgrade, but must be purchased sequentially
            document.getElementById("playerConsole").innerHTML = "Upgrade " + (i+1) + " purchased for " + miningUpgrade[i] + " money."; //Print to the player that they have purchased an upgrade and inform on which upgrade that is
            currentUpgrade++; //Increases the current upgrade counter
            playerBalance -= miningUpgrade[i]; //Subtracts the purchase value gold from the player
            printOre(); 
        }
    }
}