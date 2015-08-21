
var Plant = require('./plant-system');

module.exports = {
    init: function (options) {
        this.steps = 0;
        this.plant = Plant(this.params);
    },

    update: function (dt) {
        if (Math.floor(Math.random() * 100) < 30)
            this.steps++;
    },

    draw: function () {
        for (var i = 0; i < this.plant.length && i < this.steps; i++) {
            var step = this.plant[i];
            ox.context.beginPath();
            ox.context.moveTo( step.from[0], step.from[1] );
            ox.context.lineTo( step.to[0], step.to[1] );
            ox.context.stroke();
        }
    }
};
