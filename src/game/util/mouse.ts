import { Camera } from "./camera";
import { Canvas } from "./canvas/canvas";
import { Vector2 } from "./math/vector2";

export class Mouse {
    screenSpace: Vector2;
    worldSpace: Vector2;
    down: boolean = false;

    scrollListeners: ((delta: number) => void)[] = [];
    dragListeners: ((delta: Vector2) => void)[] = [];
    screenSpaceLast: Vector2;
    constructor(canvas: Canvas, private camera: Camera) {
        canvas.cvs.addEventListener('pointermove', (e: PointerEvent) => {
            this.move(e);
        });
        canvas.cvs.addEventListener('pointerleave', (e) => {
            this.release();
        });
        canvas.cvs.addEventListener('pointerdown', (e) => {
            this.start(e);
        });
        canvas.cvs.addEventListener('pointerup', (e) => {
            this.release();
        });
        canvas.cvs.addEventListener('wheel', (e) => {
            this.scrollListeners.forEach(listener => listener(e.deltaY * $.tick.deltaTime));
        });
        canvas.cvs.addEventListener('contextmenu', (e) => {
            this.release();
        });
    }
    private release() {
        this.down = false;
        this.screenSpaceLast = undefined;
    }
    private start(e: PointerEvent) {
        this.down = true;
    }
    private move(e: PointerEvent) {
        this.screenSpace = new Vector2(e.clientX, e.clientY);
        this.worldSpace = this.camera.calculateWorldSpace(this.screenSpace);

        if (this.down) {
            if (this.screenSpaceLast) {
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