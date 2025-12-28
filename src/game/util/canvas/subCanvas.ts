import { Vector2 } from "../math/vector2";
import { BaseCanvas } from "./baseCanvas";



export class SubCanvas extends BaseCanvas {
    constructor(size: Vector2) {
        super(document.createElement('canvas'), size);
    }

}