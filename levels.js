let level1 = {
    multiplier: 1,
    segments:  []
};

let level2 = {
    multiplier: 2,
    segments: [
        {x: 12, y: 12},
    ]
};

let level3 = {
    multiplier: 3,
    segments: [
        {x: 10, y: 10},
        {x: 15, y: 10},
        {x: 10, y: 15},
        {x: 15, y: 15},
    ]
};

let level4 = {
    multiplier: 4,
    segments: [
        {x: 10, y: 10},
        {x: 15, y: 10},
        {x: 10, y: 15},
        {x: 15, y: 15},
        {x: 12, y: 12},
    ]
};

let level5 = {
    multiplier: 5,
    segments: [
        {x: 10, y: 10},
        {x: 15, y: 10},
        {x: 10, y: 15},
        {x: 15, y: 15},
        {x: 12, y: 12},
        {x: 13, y: 13},
    ]
};


let Level = function(ctx, $canvas){
    let _size = 25; // block size in pixels
    let _segments = []; // holds segments positions
    let _level = 1; // current level num
    let _max_level = 5;
    let _multiplier = 1; // current level points multiplier

    /**
     * Initialize level
     */
    let init = () => {
        _level = 1;
        _segments = level1.segments.splice(0);
        _multiplier = level1.multiplier;
    };

    /**
     * Draw level on $canvas
     */
    let draw = () => {
        ctx.fillStyle = "rgba(125, 0, 0, 1)";
        for( let i=0; i<_segments.length; i++ ){
            ctx.fillRect(_segments[i].x * _size + 1, _segments[i].y * _size + 1, _size - 2, _size - 2);
        }
    };

    // GETTERS
    let getSegments = () => {
        return _segments;
    };

    let getMaxLevel = () => {
        return _max_level;
    };

    let getMultiplier = () => {
        return _multiplier;
    };

    // SETTERS
    let setLevel = (level) => {
        _level = level;
        switch( _level ) {
            case 1:
                _segments = level1.segments.splice(0);
                _multiplier = level1.multiplier;
                break;
            case 2:
                _segments = level2.segments.splice(0);
                _multiplier = level2.multiplier;
                break;
            case 3:
                _segments = level3.segments.splice(0);
                _multiplier = level3.multiplier;
                break;
            case 4:
                _segments = level4.segments.splice(0);
                _multiplier = level4.multiplier;
                break;
            case 5:
                _segments = level5.segments.splice(0);
                _multiplier = level5.multiplier;
                break;
            default:
                _segments = level1.segments.splice(0);
                _multiplier = level1.multiplier;
        }
    };

    return {
        init: init,
        draw: draw,
        getSegments: getSegments,
        getMultiplier: getMultiplier,
        getMaxLevel: getMaxLevel,
        setLevel: setLevel,
    }

};

export default Level;