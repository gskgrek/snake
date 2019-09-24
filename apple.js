let powers = [
    {
        name: 'short',
        value: 2,
        color: "rgba(0, 255, 0, 1)",
    },
    {
        name: 'long',
        value: 2,
        color: "rgba(255, 0, 0, 1)",
    },
    {
        name: 'fast',
        value: 10,
        color: "rgba(255, 255, 0, 1)",
    },
    {
        name: 'slow',
        value: 10,
        color: "rgba(0, 255, 255, 1)",
    },
    {
        name: 'multiply',
        value: 2,
        color: "rgba(0, 0, 255, 1)",
    },
    {
        name: 'ghost',
        value: 10,
        color: "rgba(255, 0, 255, 1)",
    }
];


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
 *         multiply - multiply current apple points by 'value'
 *         ghost - make obstacles transparent for snake for 'value' number of seconds
 * @param value integer Apple power value
 * @constructor
 */
let Apple = function(ctx, $canvas){
    let _default_power = 'apple';
    let _default_value = 5;
    let _default_color = "rgba(0, 176, 0, 1)";

    let _size = 25; // apple size in pixels
    let _x = 0; // position on game board
    let _y = 0;
    let _value = _default_value; // value of power
    let _power = _default_power; // apple can also have some type of powers
    let _color = _default_color;
    let _powers = powers.splice(0);

    /**
     * Set start random position
     */
    let randomPosition = (exclude=[]) => {
        let nX = Math.floor( Math.random() * ($canvas.width / _size) );
        let nY = Math.floor( Math.random() * ($canvas.height / _size) );

        while( exclude.includes({x: nX, y: nY}) ){
            nX = Math.floor( Math.random() * ($canvas.width / _size) );
            nY = Math.floor( Math.random() * ($canvas.height / _size) );
        }

        _x = nX;
        _y = nY;
    };

    /**
     * Initialize apple
     */
    let init = () => {

    };

    /**
     * Draw apple on $canvas
     */
    let draw = () => {
        ctx.fillStyle = _color;
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

    // SETTERS
    let setPower = (power) => {
        _power = power;
        _powers.forEach( (item) => {
            if( item.name === _power ){
                _color = item.color;
            }
        });
    };

    let setValue = (value) => {
        _value = value;
    };

    let setRandomPower = () => {
        let power = _powers[ Math.floor( Math.random() * _powers.length ) ];
        setPower( power.name );
        setValue( power.value );
    };

    let setDefaultPower = () => {
        setPower(_default_power);
        setValue(_default_value);
    };

    return {
        init: init,
        draw: draw,
        randomPosition: randomPosition,
        getPos: getPos,
        getValue: getValue,
        getPower: getPower,
        setPower: setPower,
        setValue: setValue,
        setRandomPower: setRandomPower,
        setDefaultPower: setDefaultPower,
    }

};

export default Apple;