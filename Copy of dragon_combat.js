/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 540, init, create, update);
    function init() {
        //  Tiled JSON Test
        myGame.loader.addTextFile('jsontest', 'assets/dragon_combat.json');
        myGame.loader.addImageFile('jsontiles', 'assets/Tilesheet-land-v5.png');

		myGame.loader.addTextureAtlas('dragons', 'assets/dragons.png', 'assets/dragons.json');
		myGame.loader.addTextureAtlas('fireball', 'assets/fireball.png', 'assets/fireball.json');
		
		
        myGame.loader.load();
    }
    var map;
    var r_dragon;
    var bullets;
	var fireRate = 0;

    function create() {
        map = myGame.createTilemap('jsontiles', 'jsontest', Phaser.Tilemap.FORMAT_TILED_JSON);
	
        //map.setCollisionRange(51, 53);
	    //map.setCollisionRange(61, 63);
	    //map.setCollisionRange(71, 73);
	

        //  When the car collides with the cactus tile we'll flash the screen red briefly,
        //  but it won't stop the car (the separateX/Y values are set to false)
        //map.setCollisionByIndex([31], Phaser.Collision.ANY, true, false, false);
        
        //  When the car collides with the sign post tile we'll stop the car moving (separation is set to true)
        map.setCollisionByIndex([51,52,53,61,62,63,71,72,73,74,81,101,102,111,112], Phaser.Collision.ANY, true, true, true);
        
        //  This is the callback that will be called every time map.collide() returns true
        map.collisionCallback = collide;
        
        
        //  This is the context in which the callback is called (usually 'this' if you want to be able to access local vars)
        map.collisionCallbackContext = this;

        r_dragon = myGame.createSprite(20, map.heightInPixels/2, 'dragons');
        r_dragon.name = 'red_dragon';

		bullets = myGame.createGroup(50);
		 //  Create our bullet pool
        for(var i = 0; i < 50; i++) {
            var tempBullet = new Phaser.Sprite(myGame, r_dragon.centerX, r_dragon.centerY, 'fireball');
            tempBullet.exists = false;
            tempBullet.name = "fireball_bullet";
            tempBullet.rotationOffset = 90;
            tempBullet.setBounds(-100, -100, 1700, 900);
            tempBullet.outOfBoundsAction = Phaser.GameObject.OUT_OF_BOUNDS_KILL;
            tempBullet.animations.add('fire_ball', [
            'fireball01_01.png',
            'fireball02_02.png',
            'fireball03_03.png',
            'fireball04_04.png',
            'fireball05_05.png',
            'fireball06_06.png'
            ], 9, true, false);

            bullets.add(tempBullet);
        }
		        
        myGame.camera.follow(r_dragon);
        
        //r_dragon.x = 200;
        
        //  If you are using a Texture Atlas and want to specify the frames of an animation by their name rather than frame index
        //  then you can use this format:
        r_dragon.animations.add('fly_up', [
        'dragon_02_61.png', 
        'dragon_02_62.png', 
        'dragon_02_63.png', 
        'dragon_02_64.png', 
        'dragon_02_65.png', 
        'dragon_02_66.png', 
        'dragon_02_67.png', 
        'dragon_02_68.png',  
        'dragon_02_69.png', 
        'dragon_02_70.png'
        ], 9, true, false);
        r_dragon.animations.add('fly_left', ['dragon_02_41.png', 'dragon_02_42.png', 'dragon_02_43.png', 'dragon_02_44.png', 'dragon_02_45.png', 'dragon_02_46.png', 'dragon_02_47.png', 'dragon_02_48.png',  'dragon_02_49.png', 'dragon_02_50.png'], 9, true, false);
        r_dragon.animations.add('fly_down', ['dragon_02_21.png', 'dragon_02_22.png', 'dragon_02_23.png', 'dragon_02_24.png', 'dragon_02_25.png', 'dragon_02_26.png', 'dragon_02_27.png', 'dragon_02_28.png',  'dragon_02_29.png', 'dragon_02_30.png'], 9, true, false);
        r_dragon.animations.add('fly_right', ['dragon_02_01.png', 'dragon_02_02.png', 'dragon_02_03.png', 'dragon_02_04.png', 'dragon_02_05.png', 'dragon_02_06.png', 'dragon_02_07.png', 'dragon_02_08.png',  'dragon_02_09.png', 'dragon_02_10.png'], 9, true, false);

        r_dragon.animations.add('idle_up', ['dragon_02_61.png'], 9, true, false);
        r_dragon.animations.add('idle_left', ['dragon_02_41.png'], 9, true, false);
        r_dragon.animations.add('idle_down', ['dragon_02_21.png'], 9, true, false);
        r_dragon.animations.add('idle_right', ['dragon_02_01.png'], 9, true, false);

        r_dragon.animations.play('fly_up');
        r_dragon.velocity.x = -100;


        //  for now like this, but change to auto soon
        myGame.world.setSize(map.widthInPixels, map.heightInPixels);
        console.log('world size', map.widthInPixels, map.heightInPixels);
        myGame.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);

        myGame.onRenderCallback = render;
        
        r_dragon.rotationOffset = 90;
        r_dragon.setBounds(10, 10, map.widthInPixels - 94, map.heightInPixels - 94);
    }

    function updateBullets(target) {
        //console.log('updating bullets');
        //if ((target.x > myGame.stage.width) || (target.y > myGame.stage.height)) {
       if (target.exists) {
           if (target.x < -40 || target.x > 1640 || target.y < -40 || target.y > 840) {
                target.exists = false;
            }
       }
    }

    function bulletCollides(targetA) {
        console.log("bullet crash");
        recycleBullet(targetA);
    }
    
    function collide(in_ob, coll_Data){
        console.log(in_ob);
        if (in_ob.name === 'fireball_bullet') {
            in_ob.animations.stop("fire_ball");
            bulletCollides(in_ob); 
        }
    }
    function update() {
        map.collide(r_dragon);
        map.collide(bullets);

	    myGame.camera.renderDebugInfo(32, 32);
        r_dragon.velocity.x = 0;
        r_dragon.velocity.y = 0;
        r_dragon.angularVelocity = 0;
        r_dragon.angularAcceleration = 0;
		
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            r_dragon.angularVelocity = -200;

        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            r_dragon.angularVelocity = 200;

        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            var motion = myGame.motion.velocityFromAngle(r_dragon.angle, 300);
            r_dragon.velocity.copyFrom(motion);
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            fire();
        }
        //bullets.forEach(updateBullets);

        //map.collide();
        //myGame.collide(bullets, map, bulletCollides);
    }

    function recycleBullet(bullet) {
        
        //if(bullet.exists && bullet.x < -40 || bullet.x > 1640 || bullet.y < -40 || bullet.y > 840) {
        if(bullet.exists) {
            console.log(bullet);
            bullet.exists = false;
        }
    }

    function fire() {
        if(myGame.time.now > fireRate) {
            var b = bullets.getFirstAvailable();

			//var tm_angle =  Math.abs(Math.ceil(r_dragon.angle % 360) + r_dragon.rotationOffset);
			//console.log(tm_angle);
			//console.log("s: " + Math.floor(Math.sin(tm_angle)));
			//console.log("c: " + Math.ceil(Math.cos(tm_angle)));
            //b.x = r_dragon.x + (36 * Math.floor(Math.sin(tm_angle)));
			//b.x = r_dragon.x + (Math.sin(tm_angle) * r_dragon.height);
            //b.y = r_dragon.y  * Math.cos(Math.ceil(r_dragon.angle % 360));
            //b.y = r_dragon.y + (Math.cos(tm_angle) * r_dragon.width);

            b.x = r_dragon.x + (r_dragon.height/2);
            b.y = r_dragon.y;

            var bulletMotion = myGame.motion.velocityFromAngle(r_dragon.angle, 400);
            b.revive();
            b.animations.play('fire_ball');
            b.angle = r_dragon.angle + r_dragon.rotationOffset;
            b.velocity.setTo(bulletMotion.x, bulletMotion.y);
            fireRate = myGame.time.now + 100;
        }
    }

    function render() {
        //map.renderDebugInfo(400, 16);
    }
})();