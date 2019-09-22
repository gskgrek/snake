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
    let size = 25; // apple size in pixels
    let x = 0; // position on game board
    let y = 0;
    let _value = typeof value === 'number' ? value : 5; // value of apple in points
    let _power = typeof power === 'string' ? power : 'apple'; // apple can also have some type of powers

    /**
     * Set start random position
     */
    let randomPosition = () => {
        x = Math.floor( Math.random() * ($canvas.width / size) );
        y = Math.floor( Math.random() * ($canvas.height / size) );
    };

    /**
     * Draw apple on $canvas
     */
    let draw = () => {
        ctx.fillStyle = "rgba(0, 176, 0, 1)";
        ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
    };

    // GETTERS
    let getPos = () => {
        return {x: x, y: y};
    };

    let getValue = () => {
        return value;
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