import { Camera } from "./camera";
import { Canvas } from "./canvas/canvas";
import { Vector2 } from "./math/vector2";

export class Mouse {
    screenSpace: Vector2;
    worldSpace: Vector2;
    down: boolean = false;
    downTime: number = 0;
    scrollListeners: ((delta: number) => void)[] = [];
    dragListeners: ((delta: Vector2) => void)[] = [];
    screenSpaceLast: Vector2;
    click: {
        time: number;
        double: boolean;
        noDouble: boolean;
        delta: number;
        position: Vector2;
        screenSpace: Vector2;
    }
    constructor(canvas: Canvas, private camera: Camera) {
        canvas.cvs.addEventListener('pointermove', (e: PointerEvent) => {
            this.move(e);
        });
        canvas.cvs.addEventListener('pointerleave', (e) => {
            this.down = false;
            this.screenSpaceLast = undefined;
            this.downTime = 0;
        });
        canvas.cvs.addEventListener('pointerdown', (e) => {
            this.down = true;
        });
        canvas.cvs.addEventListener('pointerup', (e) => {
            this.down = false;
            if (!this.click || this.downTime < 100) {
                this._click();
            }
            this.screenSpaceLast = undefined;
            this.downTime = 0;
        });
        canvas.cvs.addEventListener('wheel', (e) => {
            this.scrollListeners.forEach(listener => listener(e.deltaY * $.tick.deltaTime));
        });
        canvas.cvs.addEventListener('contextmenu', (e) => {
            this.down = false;
            this.screenSpaceLast = undefined;
            this.downTime = 0;
        });
    }
    private _click() {

        if (this.click && this.click.delta < 200) {
            this.click.double = true;
            this.doubleClickListeners.forEach(listener => listener(this.worldSpace));
        } else {
            this.click = {
                time: $.tick.elapsedTime,
                double: false,
                noDouble: false,
                delta: 0,
                position: this.worldSpace,
                screenSpace: this.screenSpace,
            };
            this.clickListeners.forEach(listener => listener(this.worldSpace));
        }
    }
    tick() {
        if (this.click) {
            this.click.delta += $.tick.deltaTime;
            if (this.click.delta >= 200 && !this.click.double && !this.click.noDouble) {
                this.click.noDouble = true;
                this.noDoubleClickListeners.forEach(listener => listener(this.worldSpace));
            }
        }
        if (this.down) {
            this.downTime += $.tick.deltaTime;
        }
    }

    clickListeners: ((position: Vector2) => void)[] = [];
    doubleClickListeners: ((position: Vector2) => void)[] = [];
    noDoubleClickListeners: ((position: Vector2) => void)[] = [];
    registerClickListener(listener: (position: Vector2) => void) {
        this.clickListeners.push(listener);
    }
    registerDoubleClickListener(listener: (position: Vector2) => void) {
        this.doubleClickListeners.push(listener);
    }
    registerNoDoubleClickListener(listener: (position: Vector2) => void) {
        this.noDoubleClickListeners.push(listener);
    }
    private move(e: PointerEvent) {
        this.screenSpace = new Vector2(e.clientX, e.clientY);
        this.worldSpace = this.camera.calculateWorldSpace(this.screenSpace);

        if (this.down) {
            if (this.screenSpaceLast && this.downTime > 20) {
                this.dragListeners.forEach(listener => listener(this.screenSpace.subtract(this.screenSpaceLast)));
            }
            this.screenSpaceLast = this.screenSpace.clone();
        }
    }
    addScrollListener(listener: (delta: number) => void) {
        this.scrollListeners.push(listener);
    }
    addDragListener(listener: (delta: Vector2) => void) {
        this.dragListeners.push(listener);
    }
    getWorldSpace(parallax: number = 1) {
        return this.camera.calculateWorldSpace(this.screenSpace, parallax);
    }
}