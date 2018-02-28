import Building, { BuildingType } from './Building';
import {vec3} from 'gl-matrix';

class City {
    positions: number[] = [];
    normals: number[] = []; // Initial normals for the ground
    colors: number[] = [];
    indices: number[] = [];
    size: number;
    occupied: boolean[] = []; // used to make sure we dont spawn a building on another building
    sections: number;

    buildings: Building[] = [];
    buildingPos: vec3[] = [];

    constructor(dimensions: number) {
        this.size = dimensions;
        this.initializeCity();
        this.sections = dimensions / 10;
        for(let x = 0; x < this.sections; x++) {
            for (let z = 0; z < this.sections; z++) {
                this.occupied[x * this.sections + z] = false;
            }
        }

    }

    initializeCity() {
        let largesections = this.size / 100;
        for(let x = 0; x < largesections; x++) {
            for (let z = 0; z < largesections; z++) { // For each section (x,z)
                if (Math.random() < 0.20) { // 20% chance it gets settled initially
                    let location = vec3.fromValues(Math.random() * 50 + 25 + (x * 100), 0, Math.random() * 50 + 25 + (z * 100)); // Randomly settle in the center 50 units of a 100 unit space
                    let buil = new Building(BuildingType.BIGHOUSE, vec3.fromValues(Math.random() * 5 + 5, Math.random() * 3 + 3, Math.random() * 2 + 2));
                    this.buildings.push(buil);
                    this.buildingPos.push(location);
                    this.occupied[x * this.sections + z] = true;
                }
            }
        }
    }

    growCity() {
        for (let i = 0; i < this.buildings.length; i++) { // give each building a chance to expand
            let buil = this.buildings[i];
            let incr = Math.random();
            if (buil.type == BuildingType.BIGHOUSE) {
                if (incr < 0.8) {
                    let newbuil = new Building(BuildingType.BIGHOUSE, vec3.add(vec3.create(), buil.dimensions, vec3.fromValues(Math.random() * 2, Math.random() * 2 + 1, Math.random() * 2)));
                    this.buildings[i] = newbuil;
                }
            }
            else if (buil.type == BuildingType.HOUSE) {
                if (incr < 0.3 && buil.dimensions[0] < 4 && buil.dimensions[1] < 4) {
                    let rand = Math.random();
                    let newbuil = new Building(BuildingType.HOUSE, vec3.add(vec3.create(), buil.dimensions, vec3.fromValues(rand, Math.random(), rand)));
                    this.buildings[i] = newbuil;
                }
            }
            else if (buil.type == BuildingType.HOTEL) {
                if (incr < 0.2 && buil.dimensions[0] < 8 && buil.dimensions[1] < 6) {
                    let newbuil = new Building(BuildingType.HOTEL, vec3.add(vec3.create(), buil.dimensions, vec3.fromValues(Math.random(), Math.random(), 0)));
                    this.buildings[i] = newbuil;
                }
            }
            else if (buil.type == BuildingType.OFFICE) {
                if (incr < 0.5 && buil.dimensions[0] < 9 && buil.dimensions[1] < 12 && buil.dimensions[2] < 9) {
                    let newbuil = new Building(BuildingType.OFFICE, vec3.add(vec3.create(), buil.dimensions, vec3.fromValues(Math.random(), Math.random(), Math.random())));
                    this.buildings[i] = newbuil;
                }
            }
            else if (buil.type == BuildingType.SKYSCRAPER) {
                if (incr < 0.3 && buil.dimensions[0] < 9) {
                    let newbuil = new Building(BuildingType.OFFICE, vec3.add(vec3.create(), buil.dimensions, vec3.fromValues(Math.random(), Math.random() * 2 + 1, Math.random())));
                    this.buildings[i] = newbuil;
                }
            }
        }

        let tempbuils: Building[] = []; // Store new buildings in here so it doesnt grow on itself during the same iteration
        let tempbuilpos: vec3[] = [];
        for(let x = 0; x < this.sections; x++) {
            for(let z = 0; z < this.sections; z++) {
                if (!this.occupied[x * this.sections + z]) {
                    let mindist = 500;
                    let closesttype: BuildingType;
                    for(let i = 0; i < this.buildingPos.length; i++) { // Get the distance to the closest building, and the building's type
                        let location = vec3.fromValues(x * 10, 0, z * 10);
                        let diff = vec3.subtract(vec3.create(), location, this.buildingPos[i]);
                        let dist = vec3.length(diff);
                        if (dist < mindist) {
                            mindist = dist;
                            closesttype = this.buildings[i].type;
                        }
                    }

                    let randspawn = Math.random();
                    if (closesttype == BuildingType.BIGHOUSE) { // If the closest house is a mansion
                        if (mindist > 400) {
                            if (randspawn < 0.8) {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                        else if (mindist > 250) {
                            if (randspawn < 0.4) {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else if (randspawn < 0.45) {
                                let rand = Math.random() * 2 + 1;
                                let buil = new Building(BuildingType.HOUSE, vec3.fromValues(rand, Math.random() + 1, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                    }
                    else if (closesttype == BuildingType.OFFICE) {
                        if (mindist > 150) {
                            if (randspawn < 0.1) {
                                let buil = new Building(BuildingType.HOTEL, vec3.fromValues(Math.random() * 5 + 5, Math.random() * 2 + 2, 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            if (randspawn < 0.8) {
                                let rand = Math.random() * 2 + 1;
                                let buil = new Building(BuildingType.HOUSE, vec3.fromValues(rand, Math.random() + 1, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                        else if (mindist > 100) {
                            if (randspawn < 0.2) { 
                                let buil = new Building(BuildingType.HOTEL, vec3.fromValues(Math.random() * 5 + 4, Math.random() * 2 + 2, 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else if (randspawn < 0.5) {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else if (randspawn < 0.7) {
                                let rand = Math.random() * 2 + 1;
                                let buil = new Building(BuildingType.HOUSE, vec3.fromValues(rand, Math.random() + 1, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else if (randspawn < 0.85) {
                                let rand = Math.random() * 3 + 6;
                                let buil = new Building(BuildingType.SKYSCRAPER, vec3.fromValues(rand, Math.random() * 10 + 10, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                        else if (mindist > 50) {
                            if (randspawn < 0.7) {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else if (randspawn < 0.95) {
                                let rand = Math.random() * 3 + 6;
                                let buil = new Building(BuildingType.SKYSCRAPER, vec3.fromValues(rand, Math.random() * 10 + 10, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                    }
                    else if (closesttype == BuildingType.HOUSE) {
                        if (mindist > 150) {
                            if (randspawn < 0.5) {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                        else if (mindist > 75) {
                            if (randspawn < 0.9) {
                                let rand = Math.random() * 2 + 1;
                                let buil = new Building(BuildingType.HOUSE, vec3.fromValues(rand, Math.random() + 1, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                        else if (randspawn < 0.5) {
                            let rand = Math.random() * 2 + 1;
                            let buil = new Building(BuildingType.HOUSE, vec3.fromValues(rand, Math.random() + 1, rand));
                            let location = vec3.fromValues(x * 10, 0, z * 10);
                            tempbuils.push(buil);
                            tempbuilpos.push(location);
                            this.occupied[x * this.sections + z] = true;
                        }
                    }
                    else if (closesttype == BuildingType.SKYSCRAPER) {
                        if (mindist > 100) {
                            if (randspawn < 0.3) {
                                let buil = new Building(BuildingType.HOTEL, vec3.fromValues(Math.random() * 5 + 5, Math.random() * 2 + 2, 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else if (randspawn < 0.4) {
                                let rand = Math.random() * 3 + 6;
                                let buil = new Building(BuildingType.SKYSCRAPER, vec3.fromValues(rand, Math.random() * 10 + 10, rand));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                            else {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                        if (mindist > 75) {
                            if (randspawn < 0.4) {
                                let buil = new Building(BuildingType.OFFICE, vec3.fromValues(Math.random() * 3 + 2, Math.random() * 5 + 4, Math.random() * 2 + 2));
                                let location = vec3.fromValues(x * 10, 0, z * 10);
                                tempbuils.push(buil);
                                tempbuilpos.push(location);
                                this.occupied[x * this.sections + z] = true;
                            }
                        }
                    }
                }
                // As a note being closest to a hotel doesnt spawn anything
            }
        }

        // After spawning new buildings, add them to our list of buildings
        for (let i = 0; i < tempbuils.length; i++) {
            this.buildings.push(tempbuils[i]);
            this.buildingPos.push(tempbuilpos[i]);
        }


    }

    generateVbos() {
        // Reset vbos when we generate them
        this.positions = [0,0,0,1,
                        0,0,this.size,1,
                        this.size, 0, this.size, 1,
                        this.size, 0, 0, 1];
        this.normals = [0,1,0,1,
                            0,1,0,1,
                            0,1,0,1,
                            0,1,0,1];
        this.colors = [0,0.6,0,1,
                            0,0.6,0,1,
                            0,0.6,0,1,
                            0,0.6,0,1];
        this.indices = [0,1,2,
                            0,2,3];

        for(let i = 0; i < this.buildings.length; i++) { // For each building translate it and add its info to our vbo arrays
            let loc = this.buildingPos[i];
            let pos = this.buildings[i].positions;
            let nor = this.buildings[i].normals;
            let col = this.buildings[i].colors;
            let idx = this.buildings[i].indices;

            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n] + (this.positions.length / 4));
            }

            for(let n = 0; n < pos.length; n = n + 4) {
                this.positions.push(pos[n] + loc[0]);
                this.positions.push(pos[n + 1] + loc[1]);
                this.positions.push(pos[n + 2] + loc[2]);
                this.positions.push(pos[n + 3]);

                this.normals.push(nor[n]);
                this.normals.push(nor[n + 1]);
                this.normals.push(nor[n + 2]);
                this.normals.push(nor[n + 3]);

                this.colors.push(col[n]);
                this.colors.push(col[n + 1]);
                this.colors.push(col[n + 2]);
                this.colors.push(col[n + 3]);

            }

        }


    }

};

export default City;