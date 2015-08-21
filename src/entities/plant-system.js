var defaults = {
    root:        'X',
    formula:     {'X' : 'F-[[X]+X]+F[+FX]-X', 'F' : 'FF'},
    generations: 4,
    angle:       40,
    x:           10,
    y:           10,
    radius:      5
};

function merge_options (obj1, obj2) {
    var obj3 = {};
    for (var attr in obj1) { obj3[attr] = obj1[attr]; }
    for (attr     in obj2) { obj3[attr] = obj2[attr]; }
    return obj3;
}

module.exports = function (options) {

    options = options || {};
    options = merge_options(defaults, options);

    if (options.generations > 10) throw 'Nope';

    var stack = [];

    // New lSystem - fractal/tree
    var frac = new lSystem.LSystem(options.root, options.formula);
    console.log(frac.generate(options.generations));

    // Fractal RunHandler([init defaults])
    var hfrac = new lSystem.LRunHandler({
        a: options.angle,
        x: options.x,
        y: options.y,
        r: options.radius,
        raMap:{},   // radius-angle map/cache
        stack:[]    // stack for tree
    });

    // Specify conditions. State functions
    hfrac.on('F', function() {
        var step = {
            from: [ this.x, this.y ],
            to:   null
        };
        // cache angle values
        // If the angles are repeated(highly likely),
        // it will reuse existing calculations
        // to preserve the decimal approximation.
        hash = this.r + '#' + this.a;
        if(typeof this.raMap[hash] == 'undefined') {
            this.raMap[hash] = {
                x : Math.round(this.r * Math.cos(this.a * Math.PI/180)),
                y : Math.round(this.r * Math.sin(this.a * Math.PI/180))
            };
        }
        this.x += this.raMap[hash].x;
        this.y += this.raMap[hash].y;
        step.to = [ this.x, this.y ];

        stack.push(step);
    });

    hfrac.on('+', function() {
        this.a += 25;
    });

    hfrac.on('-', function() {
        this.a -= 25;
    });

    hfrac.on('[', function() {
        this.stack.push({ x:this.x, y:this.y, a:this.a });
    });

    hfrac.on(']', function() {
        var ls = this.stack.pop();
        this.x = ls.x;
        this.y = ls.y;
        this.a = ls.a;
    });

    frac.run(hfrac);

    return stack;
};


function function_name (argument) {




}

