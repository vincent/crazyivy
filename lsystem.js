/*!
 * L-System Rules processor v0.2
 * http://flareup.org/~cmdr2/l-systems/
 *
 * By: @cmdr2, @kalyan02
 * Date: 1:49 AM 12/13/2010 +0530
 */

/*
 * Read up about L-Systems at http://en.wikipedia.org/wiki/L_Systems
 *
 * Known limitations:
 * - The LHS in the rules can have only one alphabet symbol
 *
 * To Do:
 *  - Unit tests
 */

if (typeof lSystem == "undefined")
	lSystem = function() {};

/**
 * Declares an LSystem object, encapsulating the initialState and rules.
 * @arg initialState contains the string with the initial tokens, e.g.: AB
 * @arg rules an array containing objects that define the rules with lhs
 * 	and rhs, e.g: {A : "AB", B : "A"}
 */
lSystem.LSystem = function(initialState, rules) {
	this.initialState = initialState;
	this.currentState = initialState;
	this.rules = rules;
};

/**
 * Parse the LSystem for the given number of generations
 * @arg generationCount the number of generations to run the simulation for, e.g.: 6
 * @return returns the value of the LSystem string after the given no. of generations
 */
lSystem.LSystem.prototype.generate = function(generationCount) {
	// Generate regex
	var currentString = this.currentState;
	regStr = [];
	for( eachVar in this.rules )
		regStr.push( eachVar );
	regExp = new RegExp( regStr.join('|'), 'g' );
	self = this;
	// Apply rules for given generation count untill the end of civilization
	for( i=0; i<generationCount; i++ ) {
		currentString = currentString.replace( regExp, function(stateVar) {
			return self.rules[stateVar];
		});
	}

	this.currentState = currentString;
	return currentString;
}

/**
 * To not to break the current demo
 */
lSystem.LSystem.prototype.parse = function(generationCount) {
	return this.generate(generationCount);
}

/**
 * Run. Run. Run.
 * the entire length,
 * apply the handles
 * For all the states
 * to decide curve's fate
 */
lSystem.LSystem.prototype.run = function( handle ) {
	for( i=0; i<this.currentState.length; i++ ) {
		if( typeof handle == 'object' && typeof handle.exec == 'function' ) {
			//console.log( this.currentState[i] );
			handle.exec.apply( handle, [ this.currentState[i] ] );
		}
		else
		if( typeof handle == 'function' )
			handle.apply( handle, [ this.currentState[i], i ] );
	}
}

/**
 * RunHanler for a generated LSystem
 * @require lsystem.LSystem.js
 * @author Kalyan Chakravarthy
 */
if ( typeof lSystem == 'undefined' || typeof lSystem.LSystem == 'undefined' )
    throw "ERROR: lSystem.LSystem.js library is required";

/**
 * Object clonner. All the other ones out there are dumb.
 */
lSystem.util = {
    oClone : function(obj) {
        Clonner = function() {};
        Clonner.prototype = obj;
        var nObj = new Clonner();
        for( eachVar in nObj ) {
            if( typeof nObj[eachVar] == 'object' )
                nObj[eachVar] = lSystem.util.oClone(obj[eachVar]);
        }
        return nObj;
    }
};

/**
 * LSystem handler.
 * Essentially its a queue of functions. Functions are registered per state variable
 * Each state variable currently supports only one function handler
 *
 * @why? Because it makes it easier to write lsystem demos
 *
 * @args [Object] -> initializes the handler namespace
 */
lSystem.LRunHandler = function() {
    this.tokenHandles = {};
    this.currState = {};
    this.stateFuncs = {};
    this.stateVars = {};
    if( typeof arguments[0] == 'object' )
        this.stateVars = lSystem.util.oClone(arguments[0]);
};

lSystem.LRunHandler.prototype = {
    on : function( stateVar, handler ) {
        if( typeof handler == 'function' )
            this.stateFuncs[stateVar] = handler;
    },
    exec : function(stateVar) {
        oldState = lSystem.util.oClone(this.stateVars);
        currStateFunc = this.stateFuncs[stateVar];
        /**
         * Applying in this.stateVars context will let the programmer use
         * this.a, this.x, etc in the handler instead of this.stateVars.x, etc.
         *
         * 3 optional parameters are also passed, like the state before the function execution,
         * current state and a reference to the current handler
         */
        if( typeof currStateFunc == 'function' )
            currStateFunc.apply( this.stateVars, [ this.stateVars, oldState, this ] );
    }
};

/**
 * var hFrac = new lSystem.LRunHandler()
 * hFrac.on( 'A', { 'x' : '+25', run : drawFoo } )
 * hFrac.on( '+', { 'a' : '+25' } )
 * hFrac.on( '+', function() { this.a+=25 } );
 * hFrac.on( '[', function() { this.state.push( cloneObj(this.state) ) } )
 * hFrac.on( ']', function() { this.state = stateArr.pop() } );
 * hFrac.on( '-', { 'a' : '-25' } )
 * hFrac.run( LSystem.ExampleFactory.newPlantInstance(), 10 )
 */
