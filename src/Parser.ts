import Turtle, {TurtleType} from './Turtle';
import Tree from './geometry/Tree';
import {vec3, vec4, mat4} from 'gl-matrix';

class Parser {
    turtles: Turtle[] = []; // Stack of Turtles
    branchPos: number[] = Tree.createBranchPos(); // these two hold the default positions/normals for a single branch
    branchNor: number[] = Tree.createBranchNor();
    currentCol: number[] = Tree.createBranchCol();
    positions: number[] = []; // Holds all the position data for the final vbo
    normals: number[] = []; // Holds all the normals for the final vbo
    colors: number[] = [];

    constructor() {}

    parse(s: string[]) {
        let leafCount = 0;
        let leafIdx = 0;
        let startDir = vec3.random(vec3.create());
        startDir[1] = Math.abs(startDir[1]) * 0.6 + 0.4;
        let t = new Turtle(vec3.fromValues(0,0,0), startDir, TurtleType.TRUNK);
        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            if (c == '[') {
                this.turtles.push(t);
                let nType: TurtleType;
                let newDir = vec3.random(vec3.create());
                let newPos = vec3.clone(t.location);
                if (t.ttype == TurtleType.LARGE_LEAF) {
                    nType = TurtleType.SMALL_LEAF;
                    
                    let tempDir = vec3.fromValues(t.direction[1], t.direction[2], -t.direction[0]);
                    vec3.cross(newDir, tempDir, t.direction);
                    vec3.add(newDir, newDir, vec3.scale(vec3.create(), t.direction, Math.random() * 0.2 + 0.2));
                    newDir[1] = newDir[1] * 0.2 - 0.2;
                    vec3.normalize(newDir, newDir);
                    if ((leafIdx % 2) == 0) {
                        newDir[0] *= -1;
                        newDir[2] *= -1;
                    }
                    leafIdx++;
                    vec3.add(newPos, newPos, vec3.scale(vec3.create(), t.direction, (leafIdx / leafCount) - 1));
                    vec3.add(newPos, newPos, vec3.scale(vec3.create(), newDir, -0.2));
                    if (leafIdx == leafCount) {
                        leafIdx = 0;
                        leafCount = 0;
                    }

                }
                else {
                    let next = s[i + 1];
                    if (next == 'S' || next == 'C') {
                        nType = TurtleType.COCONUT;
                        vec3.add(newPos, newPos, vec3.scale(vec3.create(), newDir, 0.25));
                    }
                    else {
                        nType = TurtleType.LARGE_LEAF;
                        vec3.add(newPos, newPos, vec3.scale(vec3.create(), t.direction, 0.5));
                        vec3.add(newPos, newPos, vec3.scale(vec3.create(), newDir, -0.25));
                        newDir[0] = newDir[0] * 0.8 + 0.2
                        newDir[2] = newDir[2] * 0.8 + 0.2;
                        vec3.normalize(newDir, newDir);
                    }
                }

                t = new Turtle(newPos, newDir, nType);
            }
            else if (c == ']') {
                t = this.turtles.pop();
            }
            else if (c == '1') {
                leafCount++;
            }
            else {
                switch (c) {
                    case 'C' :
                    this.currentCol = Tree.createCocoCol();
                    this.addBranch(t.getTransform());
                    break;
                    case 'T' :
                    t.move();
                    this.currentCol = Tree.createBranchCol();
                    this.addBranch(t.getTransform());
                    break;
                    case 'L' :
                    t.move();
                    this.currentCol = Tree.createLeafCol();
                    this.addBranch(t.getTransform());
                    break;
                    case 'l' :
                    t.move();
                    this.currentCol = Tree.createLeafCol();
                    this.addBranch(t.getTransform());
                    break;
                    case 'U' :
                    t.rotateUp();
                    break;
                    case 'D' :
                    t.rotateDown();
                    break;
                    case 'S' :
                    t.scaleUp();
                    break;
                    case 's' :
                    t.scaleDown();
                    break;

                }
            }
        }

    }

    addBranch(transform: mat4) { // Transforms the base branch and adds it to the list of positions and normals
        let invTransp = mat4.clone(transform);
        mat4.invert(invTransp, invTransp);
        mat4.transpose(invTransp, invTransp);
        for (let i = 0; i < this.branchPos.length; i = i + 4) {
            let pos = vec4.fromValues(this.branchPos[i], this.branchPos[i + 1], this.branchPos[i + 2], this.branchPos[i + 3]);
            vec4.transformMat4(pos, pos, transform);
            let nor = vec4.fromValues(this.branchNor[i], this.branchNor[i + 1], this.branchNor[i + 2], this.branchNor[i + 3]);
            vec4.transformMat4(nor, nor, invTransp);
            let col = vec4.fromValues(this.currentCol[i], this.currentCol[i + 1], this.currentCol[i + 2], this.currentCol[i + 3]);
            for(let j = 0; j < 4; j++) {
                this.positions.push(pos[j]);
                this.normals.push(nor[j]);
                this.colors.push(col[j]);
            }
        }
        //console.log(this.positions);
        //console.log(transform);
    }

};

export default Parser;