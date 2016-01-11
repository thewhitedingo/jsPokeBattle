var pokemon = function(name, type, level, health, effect, status) { // set up class for pokemon objects
	this.name = name;
	this.type = type;
	this.level = level;
	this.health = health;
	this.effect = effect;
	this.status = status;
};

pokemon.prototype.playerInfo = function(){ //method to add player info
	$('#pname').text(this.name);
	$('#plevel').text(this.level);
};

pokemon.prototype.enemyInfo = function() { // method to add enemy info
	$('#ename').text(this.name);
	$('#elevel').text(this.level);
};

pokemon.prototype.updateHealth = function(startHealth) { // method to update health of player or enemy, 
	if (this.status === "player") {						// has argument for start health if health was 
		var bar = $('#phealth');						// different from 100
	}
	else {
		var bar = $("#ehealth");
	};

	if ((this.health/startHealth) < .25) { // changes color of health bar
		bar.css("background-color", "red");
	} else if ((this.health/startHealth) < .55) {
		bar.css("background-color", "yellow");
	};
		
	bar.width((this.health/startHealth)*45);
};

var move = function(name, type1, type2, power, accuracy, target) { // move class
	this.name = name; 
	this.type1 = type1;
	this.type2 = type2;
	this.power = power;
	this.target = target;
	this.accuracy = accuracy;
};

move.prototype.addMove = function(selector) { // method to add move to page
	$(selector).text(this.name);
}

move.prototype.attack = function(defender, attacker) { // the attack method for a move
	
	var movetype = this.type1;
	var poketype = defender.type;
	var health = defender.health;
	var power = this.power;
	var effect = attacker.effect;

	var damage = function(movetype, poketype, power) { // determines move damage

		var movetype = movetype;
		var poketype = poketype;
		var power = power;

		var superEffective = function(power) {
			var damage = power * 2;
			return damage;
		};
		var ineffective = function(power) {
			var damage = power * .5;
			return damage;
		}	
		if (movetype === "water" && poketype === "fire") {
			var damage = superEffective(power);
			return damage;
		} else if (movetype === "fire" && poketype === "water") {
			var damage = ineffective(power);
			return damage;
		} else if (movetype === "electric" && poketype === "electric") {
			var damage = ineffective(power);
			return damage;
		} else if (movetype === "fire" && poketype === "fire") {
			var damage = ineffective(power);
			return damage;
		} else {
			var damage = power;

			return damage;
		};
	};

	if (this.type2 === "attack") { // determines type of move to see if it changes health or effect
		if (typeof effect === "number") {
			var newHealth = health - (effect + damage(movetype, poketype, power));

			defender.health = newHealth
			defender.updateHealth(100);
		} else {
			var newHealth = health - damage(movetype, poketype, power);

			defender.health = newHealth
			defender.updateHealth(100);
		}
	} else {
		if (this.target === "attacker") {
			var newEffect = power;
			attacker.effect = newEffect;

			return attacker.effect;
		} else {
			var newEffect = power;
			defender.effect = newEffect;

			return defender.effect;
		}

	};
};

var ember = new move("Ember", "fire", "attack", 25, 60, "defender"); //create all move objects
var scratch = new move("Scratch", "normal", "attack", 15, 80, "defender");
var leer = new move("Leer", "normal", "defense", 10, 100, "attacker");
var burn = new move("Burn", "normal", "defense", "burn", 60, "defender");
var thundershock = new move("Thundershock", "electric", "attack", 25, 60, "defender");
var thunderbolt = new move("Thunderbolt", "electric", "attack",15,  80, "defender");
var thunderwave = new move("Thunderwave", "electric", "defense", "paralyze", 60, "defender");
var tailwhip = new move("Tailwhip", "normal", "defense", 10, 100, "attacker");

var pikachu = new pokemon("Pikachu", "electric", "lv 13", 100, 1, "enemy"); // create all pokemon objects
var charmander = new pokemon("Charmander", "fire", "lv 12", 100, 1, "player"); // this can allow coding for choosing of pokemon

function playerStart (pokemon) { // this is to determine starting health for updateHealth function,
	var startHealth = pokemon.health; // if health was different from 100

	return startHealth;
}

function enemyStart (pokemon) {
	var startHealth = pokemon.health;

	return startHealth;
}

var playerTurn = function() { //turn object to activate players turn

};

var playerMoves = [ember, scratch, leer, burn];
var moveSelectors = ["#mb1-text", "#mb2-text", "#mb3-text", "#mb4-text"]

playerTurn.play = function() {

	var box = $("#chat-text");
	var attackAnimate = $("#attack");
	var currentMove;

	var setUpPlayerField = function() { // gives player field functionality
		$("#user-buttons").removeClass("hide");
		box.text("What will " + player.name + " do?");

		for (var i = playerMoves.length - 1; i >= 0; i--) {
			playerMoves[i].addMove(moveSelectors[i]);
		};

		$("#move-1, #move-2, #move-3, #move-4").unbind().click(function () {
			var move = $(this).attr("value");
			currentMove = playerMoves[move];
			attack();
		})
	};

	var attack = function () {
		var setAccuracy = Math.floor(Math.random() * 100);

		if (setAccuracy <= currentMove.accuracy) {
			box.text(player.name + " used " + currentMove.name + "!")
			attackAnimation();
			currentMove.attack(enemy, player);
		} else {
			box.text(player.name + "'s attack missed!");
			currentState = enemyTurn;
			setTimeout(loop, 1500);
		}
	}


	var attackAnimation = function () {
		attackAnimate.removeClass("enemyAttack");
		attackAnimate.addClass("playerAttack");
		attackAnimate.removeClass("hide");
		attackAnimate.fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);

		currentState = enemyTurn;
		setTimeout(loop, 1500);
	}

	setUpPlayerField();
}

var enemyTurn = function() {

};

var enemyMoves = [thunderwave, thunderbolt, thundershock, tailwhip];

enemyTurn.play = function() {
	var randomMove = Math.floor(Math.random() * 4);
	var currentMove = enemyMoves[randomMove];
	var box = $("#chat-text");
	var attackAnimate = $("#attack");

	var setUpEnemyField = function () {
		box.text(enemy.name + " is about to attack!")
		$("#user-buttons").addClass("hide");
		prepareAttack();
	}

	var prepareAttack = function () {
		$('#esprite').animate({
			top: "-=10",
		}, 200, function(){
			$('#esprite').animate({
				top: "+=10",
			}, 200)
		})
		setTimeout(attack, 1500);
	}

	var attack = function () {
		var setAccuracy = Math.floor(Math.random() * 100);
			if (setAccuracy <= currentMove.accuracy) {
				box.text(enemy.name + " used " + currentMove.name + "!");
				currentMove.attack(player, enemy);
				attackAnimation();
			} else {
				box.text(enemy.name + "'s attack missed!");
				currentState = playerTurn;
				setTimeout(loop, 1500);
			};
	}

	var attackAnimation = function () {
		attackAnimate.removeClass("playerAttack");
		attackAnimate.addClass("enemyAttack");
		attackAnimate.removeClass("hide");
		attackAnimate.fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);

		currentState = playerTurn;
		setTimeout(loop, 1500);
	}

	setUpEnemyField();
};

effectTimer = function (pokemon) { //sets the timer for certain effects so they wear off
	if (typeof pokemon.effect === "string") {
		if (turnY = turnX + 3 && Math.floor(Math.random()*3) > 2) {
			pokemon.effect = 1;
		};
	};
};

var loop = function() {
	if(enemy.health <= 0) {
		$('#gameover').removeClass('hide');
		$('#user-buttons').remove();
		$('#player').remove();
		$('#enemy').remove();
		$('#chat-text').text("You won! Refresh to play again.");
	} else if(player.health <= 0) {
		$('#gameover').removeClass('hide');
		$('#user-buttons').remove();
		$('#player').remove();
		$('#enemy').remove();
		$('#chat-text').text("You lost! Refresh to try again.");
	} else {
		currentState.play();
	};
};

var init = function() {
	player.playerInfo();
	enemy.enemyInfo();

	playerStartH = playerStart(charmander);
	enemyStartH = enemyStart(pikachu);

	player.health = 100;
	enemy.health = 100;

	currentState = playerTurn;
	loop();
};

var playerStartHealth = playerStart(charmander);
var enemyStartHealth = enemyStart(pikachu);
var player = charmander;
var enemy = pikachu; 

var turn = 0;
var turnY;
var currentState;

init();