/**
 * Snake object
 *
 * @param ctx
 * @param $canvas
 * @constructor
 */
let Snake = function(ctx, $canvas){
    let _size = 25; // snake segment size
    let _speed = 1000; // movement speed in miliseconds per segment
    let _min_speed = 250; // snake minimum speed value
    let _max_speed = 1750; // snake maximum speed value
    let _segments = []; // holds segments positions
    let _direction = 'right'; // movement direction
    let _initial_length = 2; // starting number of segments
    let _step_delta_time = 0;
    let _maxX = Math.floor($canvas.width / _size ) - 1;
    let _maxY = Math.floor($canvas.height / _size ) - 1;

    let _segments_to_grow = 0;

    /**
     * Initialize snake and draw it initial state on $canvas
     * Head will be at last array position
     */
    let init = () => {
        _segments = [];
        _direction = 'right';
        let startX = (_maxX >> 1) - (_initial_length >> 1); // middle of canvas - half of initial length
        let startY = (_maxY >> 1);
        for( let i=0; i<_initial_length; i++ ){
            _segments.push( { x: startX + i, y: startY } );
        }
    };

    /**
     * Calculate next snake move
     *
     * @param time_step integer Time since last game render step in milliseconds
     */
    let step = (time_step) => {
        _step_delta_time += time_step;
        if( _step_delta_time >= _speed ){
            // save head position to move 2nd segment to it
            let prevX = _segments[_segments.length-1].x;
            let prevY = _segments[_segments.length-1].y;
            // temporary cache current segment position
            let tmpX = 0;
            let tmpY = 0;

            // move head
            switch(_direction){
                case "right":
                    tmpX = _segments[_segments.length-1].x + 1;
                    if( tmpX > _maxX ){
                        tmpX = 0;
                    }
                    _segments[_segments.length-1].x = tmpX;
                    break;
                case "down":
                    tmpY = _segments[_segments.length-1].y + 1;
                    if( tmpY > _maxY ){
                        tmpY = 0;
                    }
                    _segments[_segments.length-1].y = tmpY;
                    break;
                case "left":
                    tmpX = _segments[_segments.length-1].x - 1;
                    if( tmpX < 0 ){
                        tmpX = _maxX;
                    }
                    _segments[_segments.length-1].x = tmpX;
                    break;
                case "up":
                    tmpY = _segments[_segments.length-1].y - 1;
                    if( tmpY < 0 ){
                        tmpY = _maxY;
                    }
                    _segments[_segments.length-1].y = tmpY;
                    break;
            }

            // move other segments to previous segment position
            for(let i = _segments.length-2; i>=0;i--) {
                tmpX = _segments[i].x;
                tmpY = _segments[i].y;
                _segments[i].x = prevX;
                _segments[i].y = prevY;
                prevX = tmpX;
                prevY = tmpY;
            }

            _step_delta_time = 0;

            // if we have left some segments to add lets grow
            if( _segments_to_grow > 0 ){
                grow(_segments_to_grow);
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
        let head = _segments[_segments.length - 1];
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
        _segments.unshift({x: -1, y: -1});
        // if snake has to grow more than 1 segment, save its number for next calculations step
        if( count > 0 ){
            _segments_to_grow = count - 1;
        }
    };

    /**
     * Change snake move direction
     *
     * @param direction string Values: right, left, up, down
     */
    let turn = (direction) => {
        if (
            (direction === 'right' && _direction !== 'left') ||
            (direction === 'left' && _direction !== 'right') ||
            (direction === 'up' && _direction !== 'down') ||
            (direction === 'down' && _direction !== 'up')
        ) {
            _direction = direction;
        }
    };

    /**
     * Draw snake on $canvas
     */
    let draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        for( let i=0; i<_segments.length; i++ ){
            if( i < _segments.length - 1 ) {
                ctx.fillRect(_segments[i].x * _size + 3, _segments[i].y * _size + 3, _size - 6, _size - 6); // draw body segments smaller than head
            }else{
                ctx.fillRect(_segments[i].x * _size + 1, _segments[i].y * _size + 1, _size - 2, _size - 2);
            }
        }
    };

    // GETTERS
    let getSpeed = () => {
        return _speed;
    };

    let getMinSpeed = () => {
        return _min_speed;
    };

    let getMaxSpeed = () => {
        return _max_speed;
    };

    let getSpeedScoreMultiplier = () => {
        let mid_speed = ((_max_speed - _min_speed) >> 1) + _min_speed;
        return Math.round(mid_speed / _min_speed );
    };

    let getSegments = (remove_head) => {
        let _remove_head = typeof remove_head === 'undefined' ? false : remove_head;

        if( _remove_head ){
            let new_segments = _segments.slice(0);
            new_segments.pop();
            return new_segments;
        }else {
            return _segments;
        }
    };

    // SETTERS
    let setSpeed = (speed) => {
        if( speed > _max_speed ) {
            _speed = _max_speed;
        }else if( speed < _min_speed ) {
            _speed = _min_speed;
        }else{
            _speed = speed;
        }
    };

    return {
        init: init,
        draw: draw,
        step: step,
        turn: turn,
        grow: grow,
        collides: collides,
        getSpeed: getSpeed,
        getSegments: getSegments,
        getMinSpeed: getMinSpeed,
        getMaxSpeed: getMaxSpeed,
        getSpeedScoreMultiplier: getSpeedScoreMultiplier,
        setSpeed: setSpeed,
    }

};

export default Snake;