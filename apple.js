/**
 * Apple object
 *
 * @param ctx
 * @param $canvas
 * @param power string Apple power:
 *         apple - default; add 'value' points to score;
 *         short - remove 'value' number of segments from snake;
 *         long - add 'value' number of segments to snake;
 *         fast - speed up snake for 'value' number of seconds;
 *         slow - slow down snake for 'value' number of seconds;
 *         ghost - make obstacles transparent for snake for 'value' number of seconds
 * @param value integer Apple power value
 * @constructor
 */
let Apple = function(ctx, $canvas, power, value){
    let _size = 25; // apple size in pixels
    let _x = 0; // position on game board
    let _y = 0;
    let _value = typeof value === 'number' ? value : 5; // value of apple in points
    let _power = typeof power === 'string' ? power : 'apple'; // apple can also have some type of powers

    /**
     * Set start random position
     */
    let randomPosition = () => {
        _x = Math.floor( Math.random() * ($canvas.width / _size) );
        _y = Math.floor( Math.random() * ($canvas.height / _size) );
    };

    /**
     * Initialize apple
     */
    let init = () => {
        _value = 5;
        _power = 'apple';
    };

    /**
     * Draw apple on $canvas
     */
    let draw = () => {
        ctx.fillStyle = "rgba(0, 176, 0, 1)";
        ctx.fillRect(_x * _size + 1, _y * _size + 1, _size - 2, _size - 2);
    };

    // GETTERS
    let getPos = () => {
        return {x: _x, y: _y};
    };

    let getValue = () => {
        return _value;
    };

    let getPower = () => {
        return _power;
    };

    return {
        getPos: getPos,
        getValue: getValue,
        randomPosition: randomPosition,
        draw: draw,
        getPower: getPower,
    }

};

export default Apple;