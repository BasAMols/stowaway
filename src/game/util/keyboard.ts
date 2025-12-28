import { Camera } from "./camera";
import { Canvas } from "./canvas/canvas";
import { Vector2 } from "./math/vector2";

export class Keyboard {
    screenSpace: Vector2;
    worldSpace: Vector2;
    down: boolean = false;

    scrollListeners: ((delta: number) => void)[] = [];
    dragListeners: ((delta: Vector2) => void)[] = [];
    screenSpaceLast: Vector2;

    keys: Record<string, number> = {

    };

    constructor(canvas: Canvas) {
        document.body.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.keys[e.key.toLowerCase()]) {
                return;
            }
            this.keys[e.key.toLowerCase()] = 1;
        });
        document.body.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys[e.key.toLowerCase()] = 0;
        });
    }

    buttonDown(key: string, mod: { shift: boolean, ctrl: boolean, alt: boolean } = { shift: false, ctrl: false, alt: false }): number {
        if (mod && Object.entries(mod).some(([key, value]) => value || (this.keys[key.toLowerCase()] ?? 0) > 0)) {
            return 0;
        }
        return this.keys[key.toLowerCase()] ?? 0;
    }

    pressed(key: string, mod: { shift: boolean, ctrl: boolean, alt: boolean } = { shift: false, ctrl: false, alt: false }): boolean {
        return this.buttonDown(key, mod) > 0;
    }

    press(key: string, mod: { shift: boolean, ctrl: boolean, alt: boolean } = { shift: false, ctrl: false, alt: false }): boolean {
        return this.buttonDown(key, mod) === 2;
    }

    tick() {
        Object.keys(this.keys).forEach((key) => {
            if (this.keys[key] > 0) {
                this.keys[key]++;
            }
        });
    }

}