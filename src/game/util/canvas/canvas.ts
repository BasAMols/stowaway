import { Vector2 } from "./util/math/vector2";

export class Canvas {
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor() {
        this.cvs = document.createElement('canvas');
        this.cvs.width = window.innerWidth;
        this.cvs.height = window.innerHeight;
        this.ctx = this.cvs.getContext('2d')!;

        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.cvs.width = width;
        this.cvs.height = height;
        this.cvs.style.width = width + 'px';
        this.cvs.style.height = height + 'px';
    }
    save() {
        this.ctx.save();
    }
    restore() {
        this.ctx.restore();
    }
    move(v: Vector2) {
        this.ctx.translate(v.x, v.y);
    }
    scale(v: Vector2) {
        this.ctx.scale(v.x, v.y);
    }
    rotate(angle: number) {
        this.ctx.rotate(angle);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    }

}