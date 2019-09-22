/**
 * Snake object
 *
 * @param ctx
 * @param $canvas
 * @constructor
 */
let Snake = function(ctx, $canvas){
    let size = 25; // snake segment size
    let speed = 1000; // movement speed in miliseconds per segment
    let segments = []; // holds segments positions
    let dir = 'right'; // movement direction
    let initial_length = 4; // starting number of segments
    let step_delta_time = 0;
    let maxX = Math.floor($canvas.width / size ) - 1;
    let maxY = Math.floor($canvas.height / size ) - 1;

    let segments_to_grow = 0;

    /**
     * Initialize snake and draw it initial state on $canvas
     * Head will be at last array position
     */
    let init = () => {
        segments = [];
        dir = 'right';
        let startX = (maxX >> 1) - (initial_length >> 1); // middle of canvas - half of initial length
        let startY = (maxY >> 1);
        for( let i=0; i<initial_length; i++ ){
            segments.push( { x: startX + i, y: startY } );
        }
    };

    /**
     * Calculate next snake move
     *
     * @param time_step integer Time since last game render step in milliseconds
     */
    let step = (time_step) => {
        step_delta_time += time_step;
        if( step_delta_time >= speed ){
            // save head position to move 2nd segment to it
            let prevX = segments[segments.length-1].x;
            let prevY = segments[segments.length-1].y;
            // temporary cache current segment position
            let tmpX = 0;
            let tmpY = 0;

            // move head
            switch(dir){
                case "right":
                    tmpX = segments[segments.length-1].x + 1;
                    if( tmpX > maxX ){
                        tmpX = 0;
                    }
                    segments[segments.length-1].x = tmpX;
                    break;
                case "down":
                    tmpY = segments[segments.length-1].y + 1;
                    if( tmpY > maxY ){
                        tmpY = 0;
                    }
                    segments[segments.length-1].y = tmpY;
                    break;
                case "left":
                    tmpX = segments[segments.length-1].x - 1;
                    if( tmpX < 0 ){
                        tmpX = maxX;
                    }
                    segments[segments.length-1].x = tmpX;
                    break;
                case "up":
                    tmpY = segments[segments.length-1].y - 1;
                    if( tmpY < 0 ){
                        tmpY = maxY;
                    }
                    segments[segments.length-1].y = tmpY;
                    break;
            }

            // move other segments to previous segment position
            for(let i = segments.length-2; i>=0;i--) {
                tmpX = segments[i].x;
                tmpY = segments[i].y;
                segments[i].x = prevX;
                segments[i].y = prevY;
                prevX = tmpX;
                prevY = tmpY;
            }

            step_delta_time = 0;

            // if we have left some segments to add lets grow
            if( segments_to_grow > 0 ){
                grow(segments_to_grow);
            }
        }
    };

    /**
     * Check if snake collides with selected segments
     *
     * @param test_blocks object|array Object or array of objects with x and y coordinates
     */
    let collides = (test_blocks) => {

        //
        if( !Array.isArray(test_blocks) ){
            if( test_blocks.hasOwnProperty('x') && test_blocks.hasOwnProperty('y') ){
                test_blocks = [test_blocks];
            }else{
                test_blocks = [];
            }
        }

        // get snake head point (other blocks move after head so onli this block takes new coordinates)
        let head = segments[segments.length - 1];
        for( let i=0; i<test_blocks.length; i++ ){
            if( head.x === test_blocks[i].x && head.y === test_blocks[i].y ){
                return true;
            }
        }

        return false;
    };

    /**
     * Grow snake
     *
     * @param count integer Amount of segments to grow up
     */
    let grow = (count) => {
        // set new segment outside canvas. It will get position of last snake segment on next step
        segments.unshift({x: -1, y: -1});
        // if snake has to grow more than 1 segment, save its number for next calculations step
        if( count > 0 ){
            segments_to_grow = count - 1;
        }
    };

    /**
     * Change snake move direction
     *
     * @param direction string Values: right, left, up, down
     */
    let turn = (direction) => {
        if (
            (direction === 'right' && dir !== 'left') ||
            (direction === 'left' && dir !== 'right') ||
            (direction === 'up' && dir !== 'down') ||
            (direction === 'down' && dir !== 'up')
        ) {
            dir = direction;
        }
    };

    /**
     * Draw snake on $canvas
     */
    let draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        for( let i=0; i<segments.length; i++ ){
            ctx.fillRect(segments[i].x * size + 1, segments[i].y * size + 1, size - 2, size - 2);
        }
    };

    // GETTERS
    let getSpeed = () => {
        return speed;
    };

    // SETTERS
    let setSpeed = (new_speed) => {
        speed = new_speed;
    };

    return {
        init: init,
        draw: draw,
        step: step,
        turn: turn,
        grow: grow,
        collides: collides,
        getSpeed: getSpeed,
        setSpeed: setSpeed,
    }

};

export default Snake;