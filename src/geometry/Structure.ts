import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Structure extends Drawable {
    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    colors: Float32Array;
    //center: vec4;

    constructor() {
        super();
        //this.center = vec4.fromValues(center[0], center[1], center[2], 1);
        this.positions = new Float32Array([]);
        this.normals = new Float32Array([]);
        this.indices = new Uint32Array([]);

    }

    static createCubePos(): number[] {
        let center = vec3.fromValues(0,0,0); // This is more of an origin
        // Side length of 1
        let offset = 1.0;

        // Create the positions for the cube
        let cubePos = [center[0], center[1], center[2], 1, // -Z face
                                        center[0] + offset, center[1], center[2], 1,
                                        center[0] + offset, center[1] + offset, center[2], 1,
                                        center[0], center[1] + offset, center[2], 1,

                                        center[0] + offset, center[1], center[2] + offset, 1, // +Z face
                                        center[0], center[1], center[2] + offset, 1,
                                        center[0], center[1] + offset, center[2] + offset, 1,
                                        center[0] + offset, center[1] + offset, center[2] + offset, 1,

                                        center[0], center[1], center[2] + offset, 1, // -X face
                                        center[0], center[1], center[2], 1,
                                        center[0], center[1] + offset, center[2], 1,
                                        center[0], center[1] + offset, center[2] + offset, 1,

                                        center[0] + offset, center[1], center[2], 1, // +X face
                                        center[0] + offset, center[1], center[2] + offset, 1,
                                        center[0] + offset, center[1] + offset, center[2] + offset, 1,
                                        center[0] + offset, center[1] + offset, center[2], 1,

                                        center[0], center[1], center[2] + offset, 1, // -Y face
                                        center[0] + offset, center[1], center[2] + offset, 1,
                                        center[0] + offset, center[1], center[2], 1,
                                        center[0], center[1], center[2], 1,

                                        center[0], center[1] + offset, center[2], 1, // +Y face
                                        center[0] + offset, center[1] + offset, center[2], 1,
                                        center[0] + offset, center[1] + offset, center[2] + offset, 1,
                                        center[0], center[1] + offset, center[2] + offset, 1];

        return cubePos;
    }

    static createCubeNor(): number[] {

        let cubeNor = [0, 0, -1.0, 1,
                                        0, 0, -1.0, 1,
                                        0, 0, -1.0, 1,
                                        0, 0, -1.0, 1,
                                    
                                        0, 0, 1.0, 1,
                                        0, 0, 1.0, 1,
                                        0, 0, 1.0, 1,
                                        0, 0, 1.0, 1,

                                        -1, 0, 0, 1,
                                        -1, 0, 0, 1,
                                        -1, 0, 0, 1,
                                        -1, 0, 0, 1,

                                        1, 0, 0, 1,
                                        1, 0, 0, 1,
                                        1, 0, 0, 1,
                                        1, 0, 0, 1,

                                        0, -1, 0, 1,
                                        0, -1, 0, 1,
                                        0, -1, 0, 1,
                                        0, -1, 0, 1,

                                        0, 1, 0, 1,
                                        0, 1, 0, 1,
                                        0, 1, 0, 1,
                                        0, 1, 0, 1];

        return cubeNor;
    }


    static createCubeIdx(startIdx: number): number[] {
        let cubeIdx: number[] = [];
        let idx = 0;

        for (let i = 0; i < 24; i += 4) {
            cubeIdx[idx] = i + startIdx;
            cubeIdx[idx + 1] = i + 1 + startIdx;
            cubeIdx[idx + 2] = i + 2 + startIdx;

            cubeIdx[idx + 3] = i + startIdx;
            cubeIdx[idx + 4] = i + 2 + startIdx;
            cubeIdx[idx + 5] = i + 3 + startIdx;
            idx = idx + 6;
        }

        return cubeIdx;
    }

    static createSquarePos(): number[] {

        // Create the positions for a door
        let sqrPos = [0, 0, 0, 1,
                       1, 0, 0, 1,
                       1, 1, 0, 1,
                       0, 1, 0, 1];

        return sqrPos;
    }

    static createSquareNor(): number[] {
        let sqrNor = [0, 0, -1, 1,
                        0, 0, -1, 1,
                        0, 0, -1, 1,
                        0, 0, -1, 1];

        return sqrNor;
    }

    static createSquareIdx(startIdx: number): number[] {
        let sqrIdx = [startIdx, startIdx + 1, startIdx + 2,
                        startIdx, startIdx + 2, startIdx + 3];

        return sqrIdx;

    }

    static createBWindowPos(): number[] {
        let windPos = Structure.createSquarePos();
        let divPos = Structure.createSquarePos();
        let offset = vec3.fromValues(0.45, 0, 0.01);
        let scale = vec3.fromValues(0.1, 1, 1);
        for(let i = 0; i < divPos.length; i = i + 4) {
            windPos.push(divPos[i] * scale[0] + offset[0]);
            windPos.push(divPos[i + 1] * scale[1] + offset[1]);
            windPos.push(divPos[i + 2] * scale[2] + offset[2]);
            windPos.push(divPos[i + 3]);
        }
        return windPos;
    }

    static createBWindowNor(): number[] {
        let windNor = Structure.createSquareNor();
        for (let i = 0; i < windNor.length; i = i + 4) {
            windNor.push(windNor[i]);
        }
        return windNor;
    }

    static createBWindowIdx(startIdx: number): number[] {
        let windIdx = [startIdx, startIdx + 1, startIdx + 2,
                        startIdx, startIdx + 2, startIdx + 3,
                        startIdx + 4, startIdx + 5, startIdx + 6,
                        startIdx + 4, startIdx + 6, startIdx + 7];

        return windIdx;

    }

    static createSRoofPos(): number[] {

        // Create the positions for the cube
        let roofPos = [0, 0, 0, 1, // -Z face
                                        1, 0, 0, 1,
                                        0.8, 1, 0.2, 1,
                                        0.2, 1, 0.2, 1,

                                        1, 0, 1, 1, // +Z face
                                        0, 0, 1, 1,
                                        0.2, 1, 0.8, 1,
                                        0.8, 1, 0.8, 1,

                                        0, 0, 1, 1, // -X face
                                        0, 0, 0, 1,
                                        0.2, 1, 0.2, 1,
                                        0.2, 1, 0.8, 1,

                                        1, 0, 0, 1, // +X face
                                        1, 0, 1, 1,
                                        0.8, 1, 0.8, 1,
                                        0.8, 1, 0.2, 1,

                                        0, 0, 1, 1, // -Y face
                                        1, 0, 1, 1,
                                        1, 0, 0, 1,
                                        0, 0, 0, 1,

                                        0.2, 1, 0.2, 1, // +Y face
                                        0.8, 1, 0.2, 1,
                                        0.8, 1, 0.8, 1,
                                        0.2, 1, 0.8, 1];

        return roofPos;
    }

    static createSRoofNor(): number[] {

        let roofNor = [0, 0.1961, -0.9806, 1,
                                        0, 0.1961, -0.9806, 1,
                                        0, 0.1961, -0.9806, 1,
                                        0, 0.1961, -0.9806, 1,
                                    
                                        0, 0.1961, 0.9806, 1,
                                        0, 0.1961, 0.9806, 1,
                                        0, 0.1961, 0.9806, 1,
                                        0, 0.1961, 0.9806, 1,

                                        -0.9806, 0.1961, 0, 1,
                                        -0.9806, 0.1961, 0, 1,
                                        -0.9806, 0.1961, 0, 1,
                                        -0.9806, 0.1961, 0, 1,

                                        0.9806, 0.1961, 0, 1,
                                        0.9806, 0.1961, 0, 1,
                                        0.9806, 0.1961, 0, 1,
                                        0.9806, 0.1961, 0, 1,

                                        0, -1, 0, 1,
                                        0, -1, 0, 1,
                                        0, -1, 0, 1,
                                        0, -1, 0, 1,

                                        0, 1, 0, 1,
                                        0, 1, 0, 1,
                                        0, 1, 0, 1,
                                        0, 1, 0, 1];

        return roofNor;
    }

    static createPRoofPos(): number[] {

        // Create the positions for the cube
        let roofPos = [0, 0, 0, 1, // -Z face
                                        1, 0, 0, 1,
                                        0.7, 1, 0.5, 1,
                                        0.3, 1, 0.5, 1,

                                        1, 0, 1, 1, // +Z face
                                        0, 0, 1, 1,
                                        0.3, 1, 0.5, 1,
                                        0.7, 1, 0.5, 1,

                                        0, 0, 1, 1, // -X face
                                        0, 0, 0, 1,
                                        0.3, 1, 0.5, 1,

                                        1, 0, 0, 1, // +X face
                                        1, 0, 1, 1,
                                        0.7, 1, 0.5, 1,

                                        0, 0, 1, 1, // -Y face
                                        1, 0, 1, 1,
                                        1, 0, 0, 1,
                                        0, 0, 0, 1];

        return roofPos;
    }

    static createPRoofNor(): number[] {

        let roofNor = [0, 0.4472, -0.8944, 1,
                                        0, 0.4472, -0.8944, 1,
                                        0, 0.4472, -0.8944, 1,
                                        0, 0.4472, -0.8944, 1,
                                    
                                        0, 0.4472, 0.8944, 1,
                                        0, 0.4472, 0.8944, 1,
                                        0, 0.4472, 0.8944, 1,
                                        0, 0.4472, 0.8944, 1,

                                        -0.9578, 0.2874, 0, 1,
                                        -0.9578, 0.2874, 0, 1,
                                        -0.9578, 0.2874, 0, 1,

                                        0.9578, 0.2874, 0, 1,
                                        0.9578, 0.2874, 0, 1,
                                        0.9578, 0.2874, 0, 1,

                                        0, -1, 0, 1,
                                        0, -1, 0, 1,
                                        0, -1, 0, 1,
                                        0, -1, 0, 1];

        return roofNor;
    }

    static createPRoofIdx(startIdx: number): number[] {
        let roofIdx = [startIdx, startIdx + 1, startIdx + 2,
            startIdx, startIdx + 2, startIdx + 3,
        
            startIdx + 4, startIdx + 5, startIdx + 6,
            startIdx + 4, startIdx + 6, startIdx + 7,
        
            startIdx + 8, startIdx + 9, startIdx + 10,

            startIdx + 11, startIdx + 12, startIdx + 13,
        
            startIdx + 14, startIdx + 15, startIdx + 16,
            startIdx + 14, startIdx + 16, startIdx + 17];

        return roofIdx;
    }

    createCity(pos: number[], nor: number[], col: number[], idx: number[]) {
        this.positions = new Float32Array(pos);
        this.normals = new Float32Array(nor);
        this.colors = new Float32Array(col);
        this.indices = new Uint32Array(idx);

        this.create();
    }

    create() {

        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.generateCol();

        this.count = this.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        console.log(`Created City`);
    }


};

export default Structure;