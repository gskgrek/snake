/**
 * Apple object
 *
 * @param ctx
 * @param $canvas
 * @constructor
 */
let Apple = function(ctx, $canvas, power){
    let size = 25; // apple size in pixels
    let x = 0; // position on game board
    let y = 0;
    let value = 5; // value of apple in points
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
        console.log(_power);
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

    return {
        getPos: getPos,
        getValue: getValue,
        randomPosition: randomPosition,
        draw: draw,
    }

};

export default Apple;