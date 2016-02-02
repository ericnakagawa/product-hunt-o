var Scoreboard = function(game) {
	Phaser.Group.call(this, game);
}

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
	var bmd, background, gameoverText, scoreText, highScoreText, newHighScoreText, startText;

	var thatGame = this.game;
	var that = this;
	
	bmd = this.game.add.bitmapData(this.game.width, this.game.height);
	bmd.ctx.fillStyle = "#000";
	bmd.ctx.fillRect(0,0, this.game.width, this.game.height);
	
	background = this.game.add.sprite(0,0, bmd);
	background.alpha = 0.75;

	this.add(background);

	var isNewHighScore = false;
	var currentHighscore = 0;

	var initials = localStorage.getItem('initials');
	while(!initials || initials == "" || initials.length > 15 || initials.length < 3) {
		initials = prompt("Enter your name:");
		if(initials > 15) {
			alert("Too many letters. Try again.");
		} else if (initials < 3) {
			alert("Too few letters. Try again.");
		} else {
			localStorage.setItem('initials', initials);
		}
	}

	var Highscore = Parse.Object.extend("Producthunto");
	var highscore = new Highscore();
		highscore.save({score: score, initials: initials}).then(function(object) {
	}).then(function(){

		var highscoreQuery = new Parse.Query("Producthunto");
		highscoreQuery.descending("score", "createdAt");
		highscoreQuery.limit(10);
		highscoreQuery.find().then(function(highscores) {
			if(highscores !== undefined && highscores.length > 0) {
				currentHighscore = highscores[0].get("score");
				if(score >= currentHighscore) {
					isNewHighScore = true;
				}
			}

			that.y = thatGame.height;

			gameoverText = thatGame.add.bitmapText(0,100, 'minecraftia', 'Nice hunting!', 36);
			gameoverText.x = thatGame.width/2 - (gameoverText.textWidth / 2);
			that.add(gameoverText);

			scoreText = thatGame.add.bitmapText(0, 200, 'minecraftia', 'You got ' + score + " upvotes!", 24);
			scoreText.x = thatGame.width / 2 - (scoreText.textWidth / 2);  
			that.add(scoreText);

			highScoreText = thatGame.add.bitmapText(0, 250, 'minecraftia', 'Highest Voted', 24);
			highScoreText.x = thatGame.width / 2 - (highScoreText.textWidth / 2);  
			that.add(highScoreText);

			for (var i = highscores.length - 1; i >= 0; i--) {
				highScoreNameText = thatGame.add.bitmapText(0, 290 + (i * 30), 'minecraftia', "" + highscores[i].get("initials"), 18);
				highScoreNameText.x = thatGame.width / 2 - (400 - (400 - highScoreNameText.textWidth));  
				highScoreText = thatGame.add.bitmapText(0, 290 + (i * 30), 'minecraftia', "" + highscores[i].get("score"), 18);
				highScoreText.x = thatGame.width / 2 + 30;
				if(highscores[i].get("score") === score && highscores[i].get("initials") === localStorage.getItem('initials')) {
					highScoreText.tint = 0xff0000;
					highScoreNameText.tint = 0xff0000;
				}
				that.add(highScoreText);
				that.add(highScoreNameText);
			};

			startText = thatGame.add.bitmapText(0, 800, 'minecraftia', 'Tap to play again!', 22);
			startText.x = thatGame.width / 2 - (startText.textWidth / 2);  
			that.add(startText);

			thanks1 = thatGame.add.bitmapText(0, 700, 'minecraftia', 'Thanks for playing! Say hi on Product Hunt!', 16);
			thanks1.x = thatGame.width / 2 - (thanks1.textWidth / 2);  
			that.add(thanks1);

			thanks1 = thatGame.add.bitmapText(0, 730, 'minecraftia', 'Thanks to @staringispolite for the idea.', 16);
			thanks1.x = thatGame.width / 2 - (thanks1.textWidth / 2);  
			that.add(thanks1);

			thanks1 = thatGame.add.bitmapText(0, 760, 'minecraftia', '@gorndt I bet you cant hit #1', 16);
			thanks1.x = thatGame.width / 2 - (thanks1.textWidth / 2);  
			that.add(thanks1);

			if(isNewHighScore) {
				newHighScoreText = thatGame.add.bitmapText(0, 100, 'minecraftia', 'ur #1!', 24);
				newHighScoreText.tint = 0x4ebef7; // '#4ebef7'
				newHighScoreText.x = gameoverText.x + gameoverText.textWidth + 40;
				newHighScoreText.angle = 45;
				that.add(newHighScoreText);
			}

			thatGame.add.tween(that).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

			thatGame.input.onDown.addOnce(that.restart, that);

		}, function(error) {
			console.log(error)
		}); // highscoreQuery.find()

	}); // highscore.save()


};

Scoreboard.prototype.restart = function() {
	this.game.state.start('Game', true, false);
};