import { Vector2 } from "../math/vector2";

export class Canvas {
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(cvs: HTMLCanvasElement) {
        this.cvs = cvs;
        this.cvs.width = window.innerWidth;
        this.cvs.height = window.innerHeight;
        this.cvs.style.width = window.innerWidth + 'px';
        this.cvs.style.height = window.innerHeight + 'px';
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
        $.container = new Vector2(width, height);
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
    draw = {
        rect: (position: Vector2, size: Vector2, color?: string | CanvasGradient | CanvasPattern) => {
            if (color) this.ctx.fillStyle = color;
            this.ctx.fillRect(position.x, position.y, size.x, size.y);
        },
        circle: (position: Vector2, radius: number, color?: string | CanvasGradient | CanvasPattern) => {
            if (color) this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        },
        line: (position1: Vector2, position2: Vector2, color?: string | CanvasGradient | CanvasPattern) => {
            if (color) this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(position1.x, position1.y);
            this.ctx.lineTo(position2.x, position2.y);
            this.ctx.stroke();
        },
        polygonStroke: (polygon: Vector2[], color?: string | CanvasGradient | CanvasPattern, lineWidth?: number) => {
            if (color) this.ctx.fillStyle = color;
            if (lineWidth) this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(polygon[0].x, polygon[0].y);
            for (const point of polygon) {
                this.ctx.lineTo(point.x, point.y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        },
        polygonFill: (polygon: Vector2[], color?: string | CanvasGradient | CanvasPattern) => {
            if (color) this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(polygon[0].x, polygon[0].y);
            for (const point of polygon) {
                this.ctx.lineTo(point.x, point.y);
            }
            this.ctx.closePath();
            this.ctx.fill();
        },
    }
}