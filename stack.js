////////////////////////
////// Stack API ///////
////////////////////////

function Stack (state) {
    this.index = 0;
    this.states = [state];
};

Stack.prototype = {
    appendState: function (newState) {
        this.index++;
        let index = this.index;
        if (index < this.states.length) {
            this.states.splice(index);
        }
        this.states[index] = newState;
        return newState
    },
    get currentState() {
        return this.states[this.index]
    },
    get nextState() {
        if (this.index != this.states.length-1) {
            this.index++;
        }
        return this.states[this.index]
    },
    get previousState() {
        if (this.index !=0) {
            this.index--;
        }
        return this.states[this.index]
    }
};