import { Vector2 } from "../math/vector2";
import { Mouse } from "../mouse";



export abstract class BaseCanvas {
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size: Vector2;
    constructor(canvas: HTMLCanvasElement, size: Vector2) {
        this.cvs = canvas;
        this.cvs.width = size.x;
        this.cvs.height = size.y;
        this.cvs.style.width = size.x + 'px';
        this.cvs.style.height = size.y + 'px';
        this.ctx = this.cvs.getContext('2d')!;
        this.size = size;
    }

    static gradient = {
        radial: (position: Vector2, radius: number, stops: [number, string][]) => {
            const gradient = $.canvas.ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, radius);
            for (const stop of stops) {
                gradient.addColorStop(stop[0], stop[1]);
            }
            return gradient;
        }
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
            if (color) this.ctx.strokeStyle = color;
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
        image: (image: HTMLImageElement, position: Vector2, size: Vector2) => {
            this.ctx.drawImage(image, position.x, position.y, size.x, size.y);
        },
        canvas: (canvas: BaseCanvas, position: Vector2 = new Vector2(0, 0), scale: number = 0) => {
            this.ctx.drawImage(canvas.cvs, 0, 0, canvas.size.x, canvas.size.y, position.x, position.y, canvas.size.x * scale, canvas.size.y * scale);
        }
    }

    mask = {
        _start: (flip: boolean) => {
            this.ctx.globalCompositeOperation = flip ? 'destination-in' : 'destination-out';
            this.ctx.beginPath();
        },
        _end: () => {
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.globalCompositeOperation = 'source-over';
        },
        polygon: (polygon: Vector2[] | [number, number][], flip: boolean = false) => {
            this.mask._start(flip);
            this.ctx.moveTo(polygon[0][0], polygon[0][1]);
            polygon.forEach((point, index) => {
                if (index > 0) {
                    this.ctx.lineTo(point[0], point[1]);
                }
            });
            this.mask._end();

        },
        circle: (position: Vector2, radius: number, flip: boolean = false) => {
            this.mask._start(flip);
            this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
            this.mask._end();
        },
        rect: (position: Vector2, size: Vector2, flip: boolean = false) => {
            this.mask._start(flip);
            this.ctx.rect(position.x, position.y, size.x, size.y);
            this.mask._end();
        }
    }
}