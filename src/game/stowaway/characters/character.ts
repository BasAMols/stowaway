import { Canvas } from "src/game/util/canvas/canvas";
import { CVE } from "src/game/util/canvas/cve";
import { Vector2 } from "src/game/util/math/vector2";
import { TaskType, Task } from "./task";
import { Schedule } from "./schedule";
import { SubCanvas } from "src/game/util/canvas/subCanvas";
import { BaseCanvas } from "src/game/util/canvas/baseCanvas";

export class StaticSheet extends SubCanvas {
    constructor(size: Vector2, private grid: [number, number]) {
        super(size);
    }
    subCanvas: SubCanvas;
    _value: number = 0;

    flip: boolean = false;
    value: number = 0;

    lastRender: {
        value: number;
        flip: boolean;
    }

    renderTile(image: HTMLImageElement, start: [number, number], size: [number, number]) {

        if (start[0] + size[0] > this.grid[0] || start[1] + size[1] > this.grid[1]) {
            throw new Error('Tile out of bounds');
        }

        this.subCanvas.ctx.drawImage(
            image,
            0,
            0,
            size[0] * this.size.x,
            size[1] * this.size.y,
            start[0] * this.size.x,
            start[1] * this.size.y,
            size[0] * this.size.x,
            size[1] * this.size.y,
        );

    }
}

export class CharacterSprite {
    constructor(private image: HTMLImageElement, private size: Vector2, private grid: [number, number]) {
        this.subCanvas = new SubCanvas(size);
    }
    subCanvas: SubCanvas;
    _value: number = 0;

    flip: boolean = false;
    value: number = 0;

    lastRender: {
        value: number;
        flip: boolean;
    }

    render() {

        if (this.lastRender && this.lastRender.value === this.value && this.lastRender.flip === this.flip) {
            return;
        }
        this.lastRender = {
            value: this.value,
            flip: this.flip,
        };

        this.subCanvas.clear();
        this.subCanvas.save();

        const column = this.value % this.grid[0];
        const row = Math.floor(this.value / this.grid[0]);

        if (this.flip) {
            this.subCanvas.scale(new Vector2(-1, 1));
            this.subCanvas.move(new Vector2(-this.size.x, 0));
        }

        this.subCanvas.ctx.drawImage(
            this.image,
            column * this.size.x,
            row * this.size.y,
            this.size.x,
            this.size.y,
            0,
            0,
            this.size.x,
            this.size.y,
        );
        this.subCanvas.restore();

    }
}

export interface CharacterType {
    name: string;
    tasks?: (TaskType | Task)[];
}
export class Animator {
    timeRef: number = 0;
    playing: boolean = true;
    length: number;
    duration: number;
    constructor(private sprite: CharacterSprite, private min: number, private max: number, private fps: number) {
        this.length = (this.max - this.min);
        this.duration = this.length / this.fps * 1000;
        this.timeRef = $.tick.elapsedTime;
    }
    getValue() {
        return Math.floor(((($.tick.elapsedTime - this.timeRef) / this.duration) % 1) * this.length + this.min);
    }
    preRender() {
        if (!this.playing) {
            this.timeRef = $.tick.elapsedTime;
        }
        this.sprite.value = this.getValue();
        // this.sprite.value = 7;
        this.sprite.render();
    }
    render(canvas: BaseCanvas, position: Vector2, scale: number) {
        canvas.draw.canvas(this.sprite.subCanvas, position, scale);
    }
    set flip(b: boolean) {
        this.sprite.flip = b;
    }
}

export class Character extends CVE {
    schedule: Schedule;
    activeTask: Task;
    lastPosition: Vector2 = new Vector2(0, 0);
    speed: number = 700;
    sprites: Record<string, Animator> = {};
    activeSprite: Animator;

    constructor(public data: CharacterType) {
        super();
        this.schedule = new Schedule(this, {
            tasks: data.tasks,
        });

        this.load({ key: 'walk', grid: [4, 3], to: 9, fps: 5 });
        this.load({ key: 'idle', grid: [5, 4], to: 18, fps: 5 });
        this.load({ key: 'sit', grid: [4, 4], to: 12, fps: 5 });

        $.camera.createDynamicLayer('character_' + this.data.name, 1.01, this, 115);
    }

    load({ key, grid, to, fps = 5, from = 0, imageurl = key }: { imageurl?: string; key: string; grid: [number, number]; from?: number; to: number; fps?: number; }) {
        void $.loader.loadImage(`dist/spa/images/ani/m/${imageurl}.png`).then(image => {
            this.sprites[key] = new Animator(new CharacterSprite(image, new Vector2(64, 128), grid), from, to, fps)
        });
    }

    preTick(): void {
        $.camera.setDynamicLayerParallax('character_' + this.data.name, this.schedule.getInfoAtTime().depth);
    }

    preTransform() {

        const info = this.schedule.getInfoAtTime();
        this.activeTask = info.task;
        const lastPosition = this.lastPosition;
        if (lastPosition.subtract(info.position).magnitude() > 0) {
            const direction = info.position.subtract(lastPosition).normalise();
            // this.sprites.walk.playing = true;
            // this.sprites.idle.playing = false;
            this.sprites.walk.flip = direction.x < 0;
            this.sprites.idle.flip = direction.x < 0;
            this.sprites.walk.preRender();
            this.activeSprite = this.sprites.walk;
        } else {
            // this.sprites.idle.playing = true;
            // this.sprites.walk.playing = false;
            this.sprites.idle.preRender();
            this.activeSprite = this.sprites.idle;
        }

        this.transform.setPosition(info.position);
        this.lastPosition = info.position;

    }
    render() {
        // $.canvas.draw.rect(new Vector2(-10, -50), new Vector2(20, 50), '#fff');
        this.activeSprite.render($.canvas, new Vector2(-15, -60), 0.55);
    }
}