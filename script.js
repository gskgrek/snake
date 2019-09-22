import Snake from './snake.js';import Apple from './apple.js';import * as Levels from './levels.js';let App = function(){};App.prototype = function(){    let ctx;    let $canvas;    let $menu;    let $options;    let $fps;    let $game_fps;    let $level;    let $score;    let snake;    let apple;    let state = 'stop';    let game_speed = 60; // game speed in steps per second -> target frame rate    let level = Levels.level1;    let last_frame_time = 0; // last time frame was requested (in ms)    let time = 0; // time from last frame request;    let fps = 0; // frames per second statistic    let fps_frame_time = 0; // last frame time for frames statistic    let time_step = 1000 / game_speed; // used to simulate target framerate if real is lower    let last_update_time = 0; // last game frame time for real game frames statistic    /**     * Calculate game state after 1 step     */    let step = () => {        snake.step(time_step);        if( snake.collides(apple.getPos()) ){            snake.grow(1);            apple.randomPosition();        }    };    /**     * Draw current game state     */    let draw = () => {        clearCanvas();        snake.draw();        apple.draw();    };    /**     * What to do if step time is longer than frame time?     *     * @returns {number} // number of steps to update game state     */    let panic = () => {        // reset time for time depending calculation        time = 0;        return 1; // let application work for 1 step    };    let mainLoop = (timestamp) => {        // don't make calculations if game isn't running        if( state !== 'play' ){            return;        }        // omit first frame to prevent calculating to many steps at beginning;        if( last_frame_time === 0 ){            last_frame_time = timestamp;            fps_frame_time = timestamp;            requestAnimationFrame(mainLoop);            return;        }        // calculate time between frames;        time = timestamp - last_frame_time;        // calculate system framerate        fps = Math.round( 1000 /time );        // print system framerate;        $fps.innerText = Math.round( 1000 / (timestamp - fps_frame_time) );        fps_frame_time = timestamp;        // if system fps is greater than target fps skip frame (we don't need to make calculations)        if( fps > game_speed ){            requestAnimationFrame(mainLoop);            return;        }        // print real game framerate        $game_fps.innerText = Math.round(1000 / (timestamp - last_update_time));        last_update_time = timestamp;        // if framerate is lower than target calculate virtual frames (game steps) between frames needed to be calculated        let steps = Math.round( time / time_step );        if( steps > 120 ){            // if steps exceed safe limit panic            steps = panic();        }        // make calculations for required game steps        while( steps > 0 ) {            step();            steps--;        }        draw();        last_frame_time = timestamp;        requestAnimationFrame(mainLoop);    };    let start = () => {        if( state !== 'play' ) {            state = 'play';            apple.randomPosition();            draw();            window.requestAnimationFrame(mainLoop);        }    };    let stop = () => {        if( state !== 'stop' ) {            state = 'stop';        }    };    let reset = () => {        clearCanvas();        snake.init();    };    let keyEventsHandler = (e) => {        let prevent = false;        //console.log( e.key, e.keyCode );        let key = e.key.toLowerCase() || e.keyCode;        if( key === 'arrowup' || key === 38 ){ // move snake up            prevent = true;            if( state === 'play' ) {                snake.turn('up');            }        }else if( key === 'arrowright' || key === 39 ){ // move snake right            prevent = true;            if( state === 'play' ) {                snake.turn('right');            }        }else if( key === 'arrowdown' || key === 40 ){ // move snake down            prevent = true;            if( state === 'play' ) {                snake.turn('down');            }        }else if( key === 'arrowleft' || key === 37 ){ // move snake left            prevent = true;            if( state === 'play' ) {                snake.turn('left');            }        }else if( key === 'n' || key === 78 ){ // start new game            prevent = true;            reset();            clearCanvas();            clearScreen();            start();        }else if( key === 'o' || key === 79 ){ // go to options screen            prevent = true;            if( state === 'stop' ){                clearScreen();                showScreen('options');            }        }else if( key === 'm' || key === 77 ){ // exit to main screen            prevent = true;            stop();            reset();            clearScreen();            showScreen('menu');        }else if( key === 'escape' || key === 27 ){ // exit to main menu screen            prevent = true;            stop();            reset();            clearScreen();            showScreen('menu');        }        if( prevent ){            e.preventDefault();            e.stopImmediatePropagation();        }    };    let setEvents = () => {        window.addEventListener('keyup', keyEventsHandler);    };    let initObjects = () => {        snake = new Snake(ctx, $canvas);        apple = new Apple(ctx, $canvas);    };    let hideScreen = (name) => {        switch( name ) {            case 'menu':                $menu.classList.remove('show');                break;            case 'options':                $options.classList.remove('show');                break;        }    };    let showScreen = (name) => {        switch( name ) {            case 'menu':                $menu.classList.add('show');                break;            case 'options':                $options.getElementById('options-speed').innerText = snake.getSpeed()+'';                $options.classList.add('show');                break;        }    };    /**     * Hide all game screens except canvas     */    let clearScreen = () => {        hideScreen('options');        hideScreen('menu');    };    let clearCanvas = () => {        ctx.fillStyle = "rgba(255, 255, 255, 1)";        ctx.clearRect(0, 0, $canvas.width, $canvas.height);    };    /**     * Get dom elements and canvas context     */    let getElements = () => {        $canvas = document.getElementById('canvas');        ctx = $canvas.getContext('2d', {            alpha: false,        });        $menu = document.getElementById('menu');        $options = document.getElementById('options');        $level = document.getElementById('level');        $score = document.getElementById('score');        $fps = document.getElementById('fps');        $game_fps = document.getElementById('game-fps');    };    let init = () => {        getElements();        setEvents();        initObjects();        reset();        showScreen('menu');        console.log( Levels );    };    return {        init: init,    }}();let app = new App();app.init();