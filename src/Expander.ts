
interface IExpRules {
    [key: string]: () => string[];
}

const ExpRules : IExpRules = {
    R : function() : string[] { // The "root" of the tree can grow taller
        let r = Math.random();
        let s : string[] = [];
        if (r <= 0.2) {
            s.push('s');
        }
        r = Math.random();
        if (r <= 0.75) { // Trunk can get smaller as it grows longer
            s.push('U');
        }
        if (r <= 0.8) {
            s.push('T');
        }
        if (r <= 0.9) {
            s.push('T');
        }
        s.push('R');
        r = Math.random();
        if (r <= 0.4) { // Can spawn coconuts
            s.push('[');
            s.push('C');
            s.push(']');
        }
        r = Math.random();
        if (r <= 0.3) { // Can create large leaf tips
            s.push('[');
            s.push('P');
            s.push(']');
        }
        if (r <= 0.6) {
            s.push('[');
            s.push('P');
            s.push(']');
        }
        if (r <= 0.8) {
            s.push('[');
            s.push('P');
            s.push(']');
        }
        return s;
    },
    C : function() : string[] { // Coconuts can grow bigger
        let r = Math.random();
        let s : string[] = [];
        if (r <= 0.4) {
            s.push('S');
        }
        s.push('C');
        return s;
    },
    P : function() : string[] { // Large leaf tips can make the leaf grow longer
        let r = Math.random();
        let s : string[] = [];
        if (r <= 0.2) { //Leaf can get smaller if it grows
            s.push('s');
        }
        if (r <= 0.8) {
            s.push('D'); // As the leaf gets longer it should sag more
            s.push('1');
            s.push('1');
            s.push('L');
            s.push('[');
            s.push('l');
            s.push('p');
            s.push(']');
            s.push('[');
            s.push('l');
            s.push('p');
            s.push(']');
        }
        if (r <= 0.4) {
            s.push('1');
            s.push('1');
            s.push('L');
            s.push('[');
            s.push('l');
            s.push('p');
            s.push(']');
            s.push('[');
            s.push('l');
            s.push('p');
            s.push(']');
        }
        s.push('P');
        return s;
    },
    L : function() : string[] { // Large leaf sections can spawn small leaf tips
        let r = Math.random();
        let s : string[] = [];
        let counter = 0;
        if (r <= 0.6) {
            s.push('1');
            counter++;
        }
        r = Math.random();
        if (r <= 0.4) {
            s.push('1');
            counter++;
        }
        s.push('L');
        for(let i = 0; i < counter; i++) {
            s.push('[');
            s.push('l');
            s.push('p');
            s.push(']');
        }
        return s;
    },
    p : function() : string[] { // Small leaf tips can grow longer as well
        let r = Math.random();
        let s : string[] = [];
        if (r <= 0.4) { // can get smaller if it grows
            s.push('s');
        }
        if (r <= 0.85) {
            s.push('D');
            s.push('l');
        }
        s.push('p');
        return s;
    },

    // Trunk sections and small leaf sections dont spawn anything else
    T : function() : string[] {
        return ['T'];
    },
    l : function() : string[]  {
        return ['l'];
    },
    //Modifiers
    '[' : function() : string[]  {
        return ['['];
    },
    ']' : function() : string[]  {
        return [']'];
    },
    '1' : function() : string[] { // Using this to count the number of small leaves on each big leaf for spacing purposes
        return ['1'];
    },

    S : function() : string[]  { // Size up
        return ['S'];
    },
    s : function() : string[]  { // Size down
        return ['s'];
    },
    U : function() : string[]  { // Curve up
        return ['U'];
    }, 
    D : function() : string[]  { // Curve down
        return  ['D'];
    },

    };

class Expander {
    seed: string[];
    tree: string[];

    constructor(s: string[]) {
        this.seed = s;
    }

    expandSeed(iters: number) { // Expands the seed of the tree to some # of iterations. Stored in tree
        let exp = this.seed; 
        for(let i = 0; i < iters; i++) { // For each iteration make a temp array
            let temp: string[] = [];
            for (let j = 0; j < exp.length; j++) { // Expand each current character/string
                let c : string = exp[j];
                let s = ExpRules[c]();
                for (let k = 0; k < s.length; k++) {// Add the expanded string to temp
                    temp.push(s[k]);
                }
            }
            exp = temp; // Replace exp with the expanded string
        }
        this.tree = exp; // Store the final expanded string in tree
        console.log(this.tree);
    }



};

export default Expander;