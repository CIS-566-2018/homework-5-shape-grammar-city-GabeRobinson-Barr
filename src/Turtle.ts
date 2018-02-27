import {vec3, vec4, mat3, mat4} from 'gl-matrix';

const PI = 3.14159;

export enum TurtleType {
    TRUNK,
    LARGE_LEAF,
    SMALL_LEAF,
    COCONUT,
};

class Turtle {
    location: vec3 = vec3.create();
    direction: vec3 = vec3.create();
    scale: vec3 = vec3.create();
    scaleMod : number = 5;
    depth: number = 0;
    ttype: TurtleType;


    constructor(pos: vec3, dir: vec3, t: TurtleType) {
        this.location = pos;
        this.direction = dir;
        this.ttype = t;
        if (t == TurtleType.TRUNK) {
            this.scale[0] = (Math.random() * 0.3) + 0.4;
            this.scale[2] = (Math.random() * 0.1) + 1.2;
            this.scale[1] = this.scale[0] + (Math.random() * 0.2 - 0.1); // Trunk should be more or less round
        }
        else if (t == TurtleType.LARGE_LEAF) {
            this.scale[2] = (Math.random() * 0.3) + 0.7;
            this.scale[0] = (Math.random() * 0.1) + 0.1;
            this.scale[1] = (Math.random() * 0.1) + 0.1;
        }
        else if (t == TurtleType.SMALL_LEAF) {
            this.scale[2] = (Math.random() * 0.3) + 0.4;
            this.scale[1] = 0.1;
            this.scale[0] = (Math.random() * 0.1) + 0.1;
        }
        else if (t == TurtleType.COCONUT) {
            let r = Math.random() * 0.3 + 0.25;
            this.scale = vec3.fromValues(r,r,r);
            this.move();
        }
        
    }

    copy() : Turtle {
        let newt : Turtle = new Turtle(vec3.clone(this.location), vec3.clone(this.direction), this.ttype);
        newt.scale = vec3.clone(this.scale);
        newt.scaleMod = this.scaleMod;
        return newt;
    }
    

    move() { // Add a section to the tree
        this.depth += 1;
        this.scale[2] *= 0.9; // As we add more sections each section should get smaller height wise

        vec3.add(this.location, this.location, vec3.scale(vec3.create(), this.direction, this.scale[2]));
    }

    rotateUp() {
        let r = Math.random() * 0.3 + 0.2;
        this.direction[1] += r;
        vec3.normalize(this.direction, this.direction);
    }

    rotateDown() {
        let r = Math.random() * 0.3 + 0.2;
        this.direction[1] -= r;
        vec3.normalize(this.direction, this.direction);
    }

    scaleUp() {
        if (this.scaleMod < 10) {
            this.scaleMod++;
        }
    }

    scaleDown() {
        if (this.scaleMod > 1) {
            this.scaleMod--;
        }
    }



    getTransform(): mat4 {
        let bit = vec3.fromValues(this.direction[1], this.direction[2], -this.direction[0]);
        let tan = vec3.cross(vec3.create(), bit, this.direction);
        vec3.cross(bit, tan, this.direction); // Get nor,tan,bit for rotation
        vec3.normalize(this.direction, this.direction);
        vec3.normalize(bit, bit);
        vec3.normalize(tan, tan);

        let trans = mat4.fromValues(-tan[0], -tan[1], -tan[2], 0.0,
                                    -bit[0], -bit[1], -bit[2], 0.0,
                                    this.direction[0], this.direction[1], this.direction[2], 0.0,
                                    this.location[0], this.location[1], this.location[2], 1.0); // Translate/rotate matrix
        let tempScale = vec3.clone(this.scale);
        let sclOff = this.scaleMod / 5;
        tempScale[0] *= sclOff;
        tempScale[1] *= sclOff;
        if (this.ttype == TurtleType.COCONUT) {
            tempScale[2] *= sclOff;
        }
        mat4.scale(trans, trans, tempScale); // Scale by our scale
        //console.log(this.direction);

        return trans;
    }

};

export default Turtle;