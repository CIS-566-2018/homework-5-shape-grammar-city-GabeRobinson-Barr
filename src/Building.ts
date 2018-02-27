import {vec3, vec4, mat4} from 'gl-matrix';
import Structure from './geometry/Structure';

export enum BuildingType {
    HOUSE,
    BIGHOUSE,
    HOTEL,
    OFFICE,
    SKYSCRAPER,
};

const PI = 3.14159;

class Building {
    type: BuildingType;
    dimensions: vec3; // Width, depth, height of this building
    stories: number;
    sectionsW: number;
    sectionsD: number;
    frontwall: string[] = [];
    leftwall: string[] = [];
    rightwall: string[] = [];
    backwall: string[] = [];
    roof: string[] = [];
    garage: boolean = false;

    // Stuff to hold VBO data
    positions: number[] = [];
    normals: number[] = [];
    colors: number[] = [];
    indices: number[] = [];

    constructor(t: BuildingType, dim: vec3) {
        this.dimensions = vec3.clone(dim);
        this.type = t;
        this.generateAspects();
    }

    generateAspects() { // This function will generate all the features of this particular buildingm 
        this.stories = Math.floor(this.dimensions[1]);
        
        if (this.type == BuildingType.HOUSE) {
            this.generateHouse();
            this.generateHouseVbos();
        }
        else if (this.type == BuildingType.BIGHOUSE) {
            this.generateBigHouse();
            this.generateBigHouseVbos();
        }
        else if (this.type == BuildingType.HOTEL) {
            this.generateHotel();
            this.generateHotelVbos();
        }
        else if (this.type == BuildingType.OFFICE) {
            this.generateOffice();
            this.generateOfficeVbos();
        }
        else if (this.type == BuildingType.SKYSCRAPER) {
            this.generateSkyscraper();
            console.log(this.roof);
            this.generateSkyscraperVbos();
        }
    }

    generateHouse() {
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width / (2.0 / 3.0));
        this.sectionsD = Math.floor(depth);


        for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
            this.frontwall.push('['); // Characters starts a story
            this.backwall.push('[');
            this.leftwall.push('[');
            this.rightwall.push('[');
            for (let i = 0; i < this.sectionsW; i++) { // For each section in the width set values for front and back wall
                let rand = Math.random();
                if (rand < 0.2 * s) { // Small Window
                    this.frontwall.push('w');
                }
                else if (rand < (0.2 * s + 0.1)) { // double Window
                    this.frontwall.push('W');
                }
                else {
                    this.frontwall.push('_');
                }

                rand = Math.random();
                if (rand < 0.2) { // Small Window
                    this.backwall.push('w');
                }
                else if (rand < 0.3) { // double Window
                    this.backwall.push('W');
                }
                else {
                    this.backwall.push('_');
                }
                
            }
            for (let i = 0; i < this.sectionsD; i++) { // For each section in the depth
                let rand = Math.random();
                if (rand < 0.2 * s) { // Small Window
                    this.leftwall.push('w');
                }
                else { // Sides of a small house should not have double windows
                    this.leftwall.push('_');
                }

                rand = Math.random();
                if (rand < 0.2 * s) { // Small Window
                    this.rightwall.push('w');
                }
                else {
                    this.rightwall.push('_');
                }
            }
            this.frontwall.push(']'); // Characters ends a story
            this.backwall.push(']');
            this.leftwall.push(']');
            this.rightwall.push(']');
        }

        let rand = Math.random();
        let doorLoc = Math.floor(4 * rand * (1.0 - rand) * this.sectionsW); // Set the location of the door. Probablility skewed towards center
        this.frontwall[doorLoc + 1] = 'D';

        if (this.sectionsW < 3) {
            this.roof.push('F');
        }
        else {
            if (Math.random() < 0.3) {
                this.roof.push('F');
            }
            else {
                this.roof.push('P');
            }
        }
        if (Math.random() < 0.2) {
            this.garage = true;
        }

    }
    
    generateBigHouse() { // This is closer to a mansion
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width);
        this.sectionsD = Math.floor(depth / 2.0);

        for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
            this.frontwall.push('['); // Characters starts a story
            this.backwall.push('[');
            this.leftwall.push('[');
            this.rightwall.push('[');
            for (let i = 0; i < this.sectionsW; i++) {
                //Frontwall
                let rand = Math.random(); 
                if (i == 0 || i == (this.sectionsW - 1)) { // the ends of a mansion can have extentions or towers
                    if (rand < 0.1) {
                        this.frontwall.push('T');
                    }
                    else if (rand < 0.3) {
                        this.frontwall.push('B');
                    }
                    else {
                        rand = Math.random();
                        if (rand < 0.5) {
                            this.frontwall.push('W');
                        }
                        else {
                            this.frontwall.push('_');
                        }
                    }
                }
                else {
                    rand = Math.random();
                    if (rand < 0.7) {
                        this.frontwall.push('W');
                    }
                    else {
                        this.frontwall.push('_');
                    }
                }
                // backwall
                rand = Math.random(); 
                if (rand < 0.75) {
                    this.backwall.push('W');
                }
                else {
                    this.backwall.push('_');
                }
            }

            for (let i = 0; i < this.sectionsD; i++) {
                // Leftwall
                let rand = Math.random();
                if (rand < 0.8) {
                    this.leftwall.push('W');
                }
                else {
                    this.leftwall.push('_');
                }
                // Rightwall
                rand = Math.random();
                if (rand < 0.8) {
                    this.rightwall.push('W');
                }
                else {
                    this.rightwall.push('_');
                }
            }

            this.frontwall.push(']'); // Characters ends a story
            this.backwall.push(']');
            this.leftwall.push(']');
            this.rightwall.push(']');
        }

        if (this.sectionsW % 2 == 0) { // Door is centered with 3 sections
            let mid = this.sectionsW / 2;
            this.frontwall[mid] = 'D';
            this.frontwall[mid + 1] = 'D';
            this.frontwall[mid + 2] = 'D';
        }
        else { // Door is centered with 2 sections
            let mid = (this.sectionsW - 1) / 2;
            this.frontwall[mid + 1] = 'D';
            this.frontwall[mid + 2] = 'D';
        }

        this.roof.push('P'); // All mansion roofs have points

        if (Math.random() < 0.1) {
            this.garage = true;
        }
    }

    generateHotel() {
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width / 2) * 2;
        this.sectionsD = 1;

        let doublesided = Math.random() < 0.5; // Determines if the hotel has rooms on both sides or not
        for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
            this.frontwall.push('['); // Characters starts a story
            this.backwall.push('[');
            this.leftwall.push('[');
            this.rightwall.push('[');
            for (let i = 0; i < this.sectionsW; i++) {
                let rand = Math.random(); 
                if (i == 0 || i == (this.sectionsW - 1)) {
                    if (rand < 0.8) {
                        this.frontwall.push('B');
                    }
                    else {
                        this.frontwall.push('_');
                    }
                    this.backwall.push('_');
                }
                else if (i % 2 == 0) { // If its not at the end alternate windows and doors
                    this.frontwall.push('W');
                    if (doublesided) {
                        this.backwall.push('W');
                    }
                    else {
                        this.backwall.push('_');
                    }
                }
                else {
                    this.frontwall.push('D')
                    if (doublesided) {
                        this.backwall.push('D');
                    }
                    else {
                        this.backwall.push('_');
                    }
                }
            }
            this.leftwall.push('_'); // No windows on the sides of the hotel
            this.rightwall.push('_');


            this.frontwall.push(']'); // Characters ends a story
            this.backwall.push(']');
            this.leftwall.push(']');
            this.rightwall.push(']');
        }

        this.roof.push('F');
        this.garage = true; // Garage serves as the service desk
    }

    generateOffice() { // Office grammar is a bit different from the others
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width);
        this.sectionsD = Math.floor(depth);

        let roofrand = Math.random();
        // The first 3 types of office buildings are very standardized
        if (roofrand < 0.5) { // One type of office building
            this.roof.push('M');
        }
        else if (roofrand < 0.6) { // Another type of office building
            this.roof.push('L')
        }
        else if (roofrand < 0.7) { // A third type
            this.roof.push('l');
        }
        else { // If it is none of these types use the 4th type that has less identical floors
            this.roof.push('S');
            for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
                this.frontwall.push('['); // Characters starts a story
                this.backwall.push('[');
                this.leftwall.push('[');
                this.rightwall.push('[');

                let inset = Math.random() < 0.5;
                let started = false;
                let ended = false;
                for (let i = 0; i < this.sectionsW; i++) { // Assume each section of an office building has a window
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsW / 2) && rand < 0.05) { // Start an extended or inset section
                            started = true;
                            if (inset) {
                                this.frontwall.push('I');
                            }
                            else {
                                this.frontwall.push('E');
                            }
                        }
                        else {
                            this.frontwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsW / 2) && rand < 0.8) { // End the section
                            ended = true;
                            this.frontwall.push('w');
                        }
                        else {
                            if (inset) {
                                this.frontwall.push('I');
                            }
                            else {
                                this.frontwall.push('E');
                            }
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.frontwall.push('w');
                    } 
                }

                started = false;
                ended = false;
                for (let i = 0; i < this.sectionsW; i++) { // Repeat for the back wall
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsW / 2) && rand < 0.05) { // Start an extended or inset section
                            started = true;
                            if (inset) {
                                this.backwall.push('I');
                            }
                            else {
                                this.backwall.push('E');
                            }
                        }
                        else {
                            this.backwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsW / 2) && rand < 0.8) { // End the section
                            ended = true;
                            this.backwall.push('w');
                        }
                        else {
                            if (inset) {
                                this.backwall.push('I');
                            }
                            else {
                                this.backwall.push('E');
                            }
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.backwall.push('w');
                    } 
                }
                started = false;
                ended = false;
                for (let i = 0; i < this.sectionsD; i++) { // Do the same for the left wall
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsD / 2) && rand < 0.05) { // Start an extended or inset section
                            started = true;
                            if (inset) {
                                this.leftwall.push('I');
                            }
                            else {
                                this.leftwall.push('E');
                            }
                        }
                        else {
                            this.leftwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsD / 2) && rand < 0.9) { // End the section
                            ended = true;
                            this.leftwall.push('w');
                        }
                        else {
                            if (inset) {
                                this.leftwall.push('I');
                            }
                            else {
                                this.leftwall.push('E');
                            }
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.leftwall.push('w');
                    } 
                }
                started = false;
                ended = false;
                for (let i = 0; i < this.sectionsD; i++) { // Do the same for the right wall
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsD / 2) && rand < 0.05) { // Start an extended or inset section
                            started = true;
                            if (inset) {
                                this.rightwall.push('I');
                            }
                            else {
                                this.rightwall.push('E');
                            }
                        }
                        else {
                            this.rightwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsD / 2) && rand < 0.9) { // End the section
                            ended = true;
                            this.rightwall.push('w');
                        }
                        else {
                            if (inset) {
                                this.rightwall.push('I');
                            }
                            else {
                                this.rightwall.push('E');
                            }
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.rightwall.push('w');
                    } 
                }

                this.frontwall.push(']'); // Characters ends a story
                this.backwall.push(']');
                this.leftwall.push(']');
                this.rightwall.push(']');
            }
        } // End grammar for the 4th type of office building

        this.garage = false; // no garage in an office

        let doorWidth = Math.floor(Math.random() * (this.sectionsW - 2)) + 2; // door must be at least 2 sections wide
        let doorStart = Math.floor(Math.random() * (this.sectionsW - doorWidth));
        for (let i = 0; i < doorWidth; i++) { // Set door sections
            this.frontwall[doorStart + i + 1] = 'D';
        }

    }

    generateSkyscraper() {
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        
        let roofrand = Math.random();
        // The first 3 types of office buildings are very standardized
        if (roofrand < 1.0) { // flat top skyscraper
            this.roof.push('F');
        }
        else if (roofrand < 0.6) { // Pointed top skyscraper
            this.roof.push('P')
        }
        else if (roofrand < 0.7) { // A Round Skyscraper
            this.roof.push('R');
        }
        roofrand = (Math.random() * 5) + 1; // How many layered tiers the roof has

        for (let i = 0; i < roofrand; i++) { // Add each tier to the array
            this.roof.push('T');
        }

        // Skyscrapers assume all sections are window/wall/window pattern
        // the ground floor is all doors

        this.garage = false; // no garage
    }

    pushColor(r: number, g: number, b: number, n: number) {
        for (let i = 0; i < n; i++) {
            this.colors.push(r);
            this.colors.push(g);
            this.colors.push(b);
            this.colors.push(1);
        }
    }

    // the next few functions parse the string data and create vbos for the building
    generateHouseVbos() { 
        let temppos = Structure.createCubePos();
        let tempnor = Structure.createCubeNor();
        let tempidx = Structure.createCubeIdx(0);

        for (let i = 0; i < temppos.length; i = i + 4) {
            temppos[i] *= this.dimensions[0];
            temppos[i + 1] *= this.dimensions[1];
            temppos[i + 2] *= this.dimensions[2];
        }

        this.positions = temppos;
        this.normals = tempnor;
        this.indices = tempidx;
        this.pushColor(0.96, 0.96, 0.89, temppos.length / 4);

        let offsetW = this.dimensions[0] / this.sectionsW;
        let offsetD = this.dimensions[2] / this.sectionsD;
        let offsetH = this.dimensions[1] / this.stories;

        let story = 0;
        let section = 0;
        for (let i = 0; i < this.frontwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetW,offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetW * section, offsetH * story, this.dimensions[2]);
            let s = this.frontwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'D') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.18, 0.18, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.5, 0.8, 1));
                vec3.add(off, off, vec3.fromValues(0.25, 0, 0.01));
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.6, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.2, 0.3, 0.01));
                section++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.1, 0.1, 0.1, 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.8, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.1, 0.3, 0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.backwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetW, offsetH, -1);
            let off: vec3 = vec3.fromValues(offsetW * section, offsetH * story, 0);
            let s = this.backwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'D') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.18, 0.18, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.5, 0.8, 1));
                vec3.add(off, off, vec3.fromValues(0.25, 0, -0.01));
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.6, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.2, 0.3, -0.01));
                section++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.1, 0.1, 0.1, 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.8, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.1, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(-nor[n], -nor[n + 1], -nor[n + 2]));

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.leftwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetD, offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetD * section, offsetH * story, 0);
            let s = this.leftwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.4, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.3, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                let vpos = vec3.rotateY(vec3.create(), vec3.fromValues(pos[n], pos[n + 1], pos[n + 2]), 
                vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), PI / 2);

                this.positions.push(vpos[0]);
                this.positions.push(vpos[1]);
                this.positions.push(vpos[2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));
                vec3.rotateY(nvec, nvec, vec3.fromValues(0,0,0), PI / 2);

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.leftwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetD, offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetD * section, offsetH * story, 0);
            let s = this.leftwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.4, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.3, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                let vpos = vec3.rotateY(vec3.create(), vec3.fromValues(pos[n], pos[n + 1], pos[n + 2]), 
                vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), -PI / 2);

                this.positions.push(vpos[0]);
                this.positions.push(vpos[1]);
                this.positions.push(vpos[2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));
                vec3.rotateY(nvec, nvec, vec3.fromValues(0,0,0), -PI / 2);

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        let pos: number[] = [];
        let nor: number[] = [];
        let idx: number[] = [];
        let scale: vec3 = vec3.fromValues(this.dimensions[0] + offsetW / 2, offsetH / 2, this.dimensions[2] + offsetD / 2);
        let off: vec3 = vec3.fromValues(-offsetW / 4, this.dimensions[1], -offsetD / 4);
        if (this.roof[0] == 'F') {
            pos = Structure.createCubePos();
            nor = Structure.createCubeNor();
            idx = Structure.createCubeIdx(this.positions.length / 4);
        }
        else {
            pos = Structure.createPRoofPos();
            nor = Structure.createPRoofNor();
            idx = Structure.createPRoofIdx(this.positions.length / 4);
            scale[1] = this.dimensions[1] / 2;
        }
        this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
        for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];

                this.normals.push(nor[n]);
                this.normals.push(nor[n + 1]);
                this.normals.push(nor[n + 2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
    }

    generateBigHouseVbos() {

    }

    generateHotelVbos() {

    }

    generateOfficeVbos() {

    }

    generateSkyscraperVbos() {

        let roofnum = 0;
        for (let i = 0; i < this.roof.length; i++) {
            if (this.roof[i] == 'T') {
                roofnum++;
            }
        }

        if (this.roof[0] == 'F') {
            let pos = Structure.createCubePos();
            let nor = Structure.createCubeNor();
            let idx = Structure.createCubeIdx(0);

            let temppos: number[] = [];

            for (let i = 0; i < pos.length; i = i + 4) {
                this.positions.push(pos[i] * this.dimensions[0]);
                this.positions.push(pos[i + 1] * this.dimensions[1]);
                this.positions.push(pos[i + 2] * this.dimensions[2]);
                this.positions.push(pos[i + 3]);
                
                this.normals.push(nor[i]);
                this.normals.push(nor[i + 1]);
                this.normals.push(nor[i + 2]);
                this.normals.push(nor[i + 3]);
            }

            for(let i = 0; i < idx.length; i++) {
                this.indices.push(idx[i]);
            }

            this.pushColor(0.96, 0.96, 0.89, pos.length / 4);


            let offset = vec3.fromValues(0, this.dimensions[1], 0);
            for (let i = 0; i < roofnum; i++) {
                temppos = [];
                offset[0] = (this.dimensions[0] - (this.dimensions[0] / ((i + 2) / 2))) / 2;
                offset[2] = (this.dimensions[2] - (this.dimensions[2] / ((i + 2) / 2))) / 2;
                let scale = vec3.fromValues(this.dimensions[0] / ((i + 2) / 2), 1.0 - (i / 10), this.dimensions[2] / ((i + 2) / 2));
                idx = Structure.createCubeIdx(this.positions.length / 4);

                for (let n = 0; n < pos.length; n = n + 4) {
                    temppos[n] = pos[n] * scale[0] + offset[0];
                    temppos[n + 1] = pos[n + 1] * scale[1] + offset[1];
                    temppos[n + 2] = pos[n + 2] * scale[2] + offset[2];
                    temppos[n + 3] = pos[n + 3];

                    this.positions.push(temppos[n]);
                    this.positions.push(temppos[n + 1]);
                    this.positions.push(temppos[n + 2]);
                    this.positions.push(temppos[n + 3]);

                    this.normals.push(nor[n]);
                    this.normals.push(nor[n + 1]);
                    this.normals.push(nor[n + 2]);
                    this.normals.push(nor[n + 3]);
                }
                this.pushColor(0.76, 0.76, 0.69, pos.length / 4);
                
                for (let n = 0; n < idx.length; n++) {
                    this.indices.push(idx[n]);
                }
                
                offset[1] += scale[1];
            }

        }
        console.log(roofnum);
        
    }

};

export default Building;