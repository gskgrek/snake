import Snake from './snake.js';
import Apple from './apple.js';
import Level from './levels.js';

let App = function(){};

App.prototype = function(){

    let state = 'stop';
    let game_speed = 60; // game speed in steps per second -> target frame rate
    let apples_levelup = 10;
    let score = 0; // user score
    let power_time = 10; // default time for time depending powerups
    let power_frequency = 5; // number of apples to show and eat after wich next new apple gets power
    let power_value = 5; // powerups power (value)
    let cur_level = 1; // current level number
    let score_table = []; // stores player results
    let cur_screen = 'menu'; // current screen nanme;

    let ctx;
    let $canvas;
    let $menu;
    let $options;
    let $end;
    let $scoreboard;
    let $fps;
    let $game_fps;
    let $level;
    let $score;
    let $instructions;

    let snake;
    let apple;
    let level;

    let power_apples_eaten = 0; // apples eaten from last power
    let level_apples_eaten = 0; // apples eaten from last level

    let last_frame_time = 0; // last time frame was requested (in ms)
    let time = 0; // time from last frame request;
    let fps = 0; // frames per second statistic
    let fps_frame_time = 0; // last frame time for frames statistic
    let time_step = 1000 / game_speed; // used to simulate target framerate if real is lower
    let last_update_time = 0; // last game frame time for real game frames statistic

    /**
     * Calculate game state after 1 step
     */
    let step = () => {
        if( state === 'play' ) {
            snake.step(time_step);

            if( snake.collides(snake.getSegments(true)) ){ // check if snake collides with himself

                endGame();

            }else if( !snake.isGhost() && snake.collides( level.getSegments())){ // check if snake collides with level obstacles

                endGame();

            } else if (snake.collides(apple.getPos())) { // check if snake collides with apple
                // move apple to new position so in next tick there was no repeated collision that we already handled
                let power = apple.getPower();
                switch (power) {
                    case 'short':
                        snake.grow( -power_value );
                        apple.setDefaultPower();
                        break;
                    case 'long':
                        snake.grow( power_value );
                        apple.setDefaultPower();
                        break;
                    case 'fast':
                        snake.speedUp(power_time * 1000);
                        apple.setDefaultPower();
                        break;
                    case 'slow':
                        snake.slowDown(power_time * 1000);
                        apple.setDefaultPower();
                        break;
                    case 'multiply':
                        snake.grow(1);
                        score += apple.getValue() * power_value;
                        power_apples_eaten++;
                        level_apples_eaten++;
                    case 'ghost':
                        snake.makeGhost(power_time * 1000);
                        apple.setDefaultPower();
                        break;
                    default:
                        snake.grow(1);
                        score += apple.getValue() * level.getMultiplier() * snake.getSpeedScoreMultiplier();
                        power_apples_eaten++;
                        level_apples_eaten++;
                }

                // if snae ate enough apples to level up
                if( level_apples_eaten >= apples_levelup ) {
                    if( cur_level < level.getMaxLevel() ){
                        setLevel(cur_level+1);
                        snake.init();
                        apple.randomPosition([...snake.getSegments(), ...level.getSegments()]);
                    }else{
                        endGame();
                    }
                }else {
                    // place new apple on random position
                    apple.randomPosition([...snake.getSegments(), ...level.getSegments()]);

                    if (power_apples_eaten >= power_frequency) { // and if snake ate enough apples change it to power block
                        power_apples_eaten = 0;
                        apple.setRandomPower();
                    }
                }

            }
        }
    };

    /**
     * Draw current game state
     */
    let draw = () => {
        if( state === 'play' ) {
            clearCanvas();
            level.draw();
            snake.draw();
            apple.draw();
            $score.innerText = score.toString();
        }
    };

    /**
     * What to do if step time is longer than frame time?
     *
     * @returns {number} // number of steps to update game state
     */
    let panic = () => {
        // reset time for time depending calculation
        time = 0;
        return 1; // let application work for 1 step
    };

    let mainLoop = (timestamp) => {
        // don't make calculations if game isn't running
        if( state !== 'play' ){
            return;
        }

        // omit first frame to prevent calculating to many steps at beginning;
        if( last_frame_time === 0 ){
            last_frame_time = timestamp;
            fps_frame_time = timestamp;
            requestAnimationFrame(mainLoop);
            return;
        }

        // calculate time between frames;
        time = timestamp - last_frame_time;
        // calculate system (browser) framerate
        fps = Math.round( 1000 /time );

        // print system framerate;
        $fps.innerText = Math.round( 1000 / (timestamp - fps_frame_time) );
        fps_frame_time = timestamp;

        // if system fps is greater than target fps skip frame. We don't need to make calculations more often.
        if( fps > game_speed ){
            requestAnimationFrame(mainLoop);
            return;
        }

        // print real game framerate
        $game_fps.innerText = Math.round(1000 / (timestamp - last_update_time));
        last_update_time = timestamp;

        // if framerate is lower than target calculate virtual frames (interpolate steps) between current and target framerate
        let steps = Math.round( time / time_step );

        if( steps > 120 ){
            // if steps exceed safe limit panic
            steps = panic();
        }

        // make calculations for required game steps
        while( steps > 0 ) {
            step();
            steps--;
        }
        draw();

        last_frame_time = timestamp;

        requestAnimationFrame(mainLoop);
    };

    /**
     * Start game loop
     */
    let start = () => {
        if( state !== 'play' ) {
            state = 'play';
            apple.randomPosition([...snake.getSegments(), ...level.getSegments()]);
            draw();
            window.requestAnimationFrame(mainLoop);
        }
    };

    /**
     * Stop game loop
     */
    let stop = () => {
        if( state !== 'stop' ) {
            state = 'stop';
        }
    };

    /**
     * End game and show game over screen
     */
    let endGame = () => {
        stop();
        saveScore();
        clearCanvas();
        clearScreen();
        $end.querySelector('#end-score').innerText = score.toString();
        showScreen('end');
    };

    /**
     * Reset game;
     */
    let reset = () => {
        clearCanvas();
        snake.init();
        apple.init();
        setLevel(1);
        score = 0;
        power_apples_eaten = 0;
    };

    let setLevel = (new_level) => {
        cur_level = new_level;
        level.setLevel(cur_level);
        power_apples_eaten = 0;
        level_apples_eaten = 0;
        $level.innerText = cur_level.toString();
        $options.querySelector('#options-level').innerText = cur_level.toString();
    };

    let setSnakeSpeed = (new_speed) => {
        snake.setSpeed(new_speed);
        $options.querySelector('#options-speed').innerText = snake.getSpeed().toString();
    };

    let setPowerTime = (new_power_time) => {
        power_time = new_power_time;
        $options.querySelector('#options-power-time').innerText = power_time.toString();
    };

    let setPowerFreq = (new_power_frequency) => {
        power_frequency = new_power_frequency;
        $options.querySelector('#options-power-freq').innerText = power_frequency.toString();
    };

    let setPowerValue = (new_power_value) => {
        power_value = new_power_value;
        $options.querySelector('#options-power-value').innerText = power_value.toString();
    };

    let saveScore = () => {
        let now = new Date();
        let now_formated = now.getFullYear()
            + '-' + String(now.getMonth() + 1).padStart(2, '0')
            + '-' + String(now.getDate()).padStart(2, '0')
            + ' ' + String(now.getHours()).padStart(2, '0')
            + ':' + String(now.getMinutes()).padStart(2, '0');
        score_table.push({date: now_formated, score: score});
        score_table.sort( (item1, item2) => {
            return item2.score - item1.score;
        });
        if( score_table.length > 5 ){
            score_table.pop();
        }
    };

    let keyEventsHandler = (e) => {
        let prevent = false;
        //console.log( e.key, e.keyCode );
        let key = e.key.toLowerCase() || e.keyCode;

        if( key === 'w' || key === 87 ){ // move snake up

            prevent = true;
            if( state === 'play' ) {
                snake.turn('up');
            }

        }else if( key === 'd' || key === 68 ){ // move snake right

            prevent = true;
            if( state === 'play' ) {
                snake.turn('right');
            }

        }else if( key === 's' || key === 83 ){ // move snake down

            prevent = true;
            if( state === 'play' ) {
                snake.turn('down');
            }else{
                if( cur_screen === 'options' ){
                    let new_speed = snake.getSpeed() + 125;
                    if( new_speed > snake.getMaxSpeed() ){
                        new_speed = snake.getMinSpeed();
                    }
                    setSnakeSpeed(new_speed);
                }
            }

        }else if( key === 'a' || key === 65 ){ // move snake left

            prevent = true;
            if( state === 'play' ) {
                snake.turn('left');
            }

        }else if( key === 'n' || key === 78 ){ // start new game

            prevent = true;
            if( state === 'stop' ) {
                if (cur_screen === 'menu') {
                    clearScreen();
                    start();
                }
            }

        }else if( key === 'o' || key === 79 ){ // go to options screen

            prevent = true;
            if( state === 'stop' ){
                if( cur_screen === 'menu' ){
                    clearScreen();
                    showScreen('options');
                }
            }

        }else if( key === 'm' || key === 77 ){ // exit to main screen

            prevent = true;
            if( state === 'play' ) {
                stop();
                reset();
            }
            clearScreen();
            showScreen('menu');

        }else if( key === 'escape' || key === 27 ){ // exit to main menu screen

            prevent = true;
            if( state === 'play' ) {
                stop();
                reset();
            }
            clearScreen();
            showScreen('menu');

        }else if( key === 'b' || key === 27 ){ // go to scoreboard screen

            prevent = true;
            if( state === 'stop' ){
                clearScreen();
                showScreen('scoreboard');
            }

        }else if( key === 'i' || key === 73 ){ // go to instructions screen

            prevent = true;
            if( state === 'stop' ){
                clearScreen();
                showScreen('instructions');
            }

        }else if( key === 'l' || key === 76 ){ // change game level

            prevent = true;
            if( cur_screen === 'options' ){
                let new_level = cur_level + 1;
                if( new_level > level.getMaxLevel() ){
                    new_level = 1;
                }
                setLevel(new_level);
            }

        }else if( key === 't' || key === 84 ){ // change power life time

            prevent = true;
            if( cur_screen === 'options' ){
                let new_power_time = power_time + 1;
                if( new_power_time > 15 ){
                    new_power_time = 5;
                }
                setPowerTime(new_power_time);
            }

        }else if( key === 'v' || key === 86 ){ // change power show up frequency

            prevent = true;
            if( cur_screen === 'options' ){
                let new_power_value = power_value + 1;
                if( new_power_value > 10 ){
                    new_power_value = 5;
                }
                setPowerValue(new_power_value);
            }

        }

        if( prevent ){
            e.preventDefault();
            e.stopImmediatePropagation();
        }

    };

    let setEvents = () => {
        window.addEventListener('keyup', keyEventsHandler);
    };

    let initObjects = () => {
        snake = new Snake(ctx, $canvas);
        apple = new Apple(ctx, $canvas);
        level = new Level(ctx, $canvas);
    };

    let hideScreen = (name) => {
        switch( name ) {
            case 'menu':
                $menu.classList.remove('show');
                break;
            case 'options':
                $options.classList.remove('show');
                break;
            case 'end':
                $end.classList.remove('show');
                break;
            case 'scoreboard':
                $scoreboard.classList.remove('show');
                break;
            case 'instructions':
                $instructions.classList.remove('show');
                break;
        }
    };
    let showScreen = (name) => {
        cur_screen = name;

        switch( name ) {
            case 'menu':
                $menu.classList.add('show');
                break;
            case 'options':
                $options.querySelector('#options-level').innerText = cur_level.toString();
                $options.querySelector('#options-power-time').innerText = power_time.toString();
                $options.querySelector('#options-power-value').innerText = power_value.toString();
                $options.querySelector('#options-speed').innerText = snake.getSpeed().toString();
                $options.classList.add('show');
                break;
            case 'end':
                $end.classList.add('show');
                break;
            case 'scoreboard':
                let html = '';
                for( let i=0; i<score_table.length; i++ ){
                    html += '<li>' + (i+1) + '. ' + score_table[i].date + ' - ' + score_table[i].score + ' points</li>'
                }
                $scoreboard.querySelector('.list').innerHTML = html;
                $scoreboard.classList.add('show');
                break;
            case 'instructions':
                $instructions.classList.add('show');
                break;
            default:
                cur_screen = 'menu';
                $menu.classList.add('show');
        }
    };

    /**
     * Hide all game screens except canvas
     */
    let clearScreen = () => {
        hideScreen('menu');
        hideScreen('options');
        hideScreen('end');
        hideScreen('scoreboard');
        hideScreen('instructions');
    };

    let clearCanvas = () => {
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
    };

    /**
     * Get dom elements and canvas context
     */
    let getElements = () => {
        $canvas = document.getElementById('canvas');
        ctx = $canvas.getContext('2d', {
            alpha: false,
        });

        $menu = document.getElementById('menu');
        $options = document.getElementById('options');
        $end = document.getElementById('end');
        $scoreboard = document.getElementById('scoreboard');
        $instructions = document.getElementById('instructions');

        $level = document.getElementById('level');
        $score = document.getElementById('score');
        $fps = document.getElementById('fps');
        $game_fps = document.getElementById('game-fps');
    };

    let init = () => {
        getElements();
        setEvents();
        initObjects();
        reset();
        showScreen('menu');

        setLevel(1);
    };

    return {
        init: init,
    }

}();

let app = new App();
app.init();
