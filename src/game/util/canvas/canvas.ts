import { Vector2 } from "../math/vector2";
import { BaseCanvas } from "./baseCanvas";

export class Canvas extends BaseCanvas {
    constructor(cvs: HTMLCanvasElement) {
        super(cvs, new Vector2(window.innerWidth, window.innerHeight));
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.cvs.width = width;
        this.cvs.height = height;
        this.cvs.style.width = width + 'px';
        this.cvs.style.height = height + 'px';
        $.container = new Vector2(width, height);
        this.size = new Vector2(width, height);
    }

}