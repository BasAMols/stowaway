import { CVE } from "src/game/util/canvas/cve";
import { Vector2 } from "src/game/util/math/vector2";
import { Animator, CharacterSprite } from "./character";


export type AnimationKeys = 'walk' | 'idle' | 'sit' | 'sitNod' | 'sitTalk' | 'run';
export class BaseCharacter extends CVE {
    lastPosition: Vector2 = new Vector2(0, 0);
    sprites: Record<string, Animator> = {};
    activeSprite: Animator;
    keysToLoad: AnimationKeys[] = ['walk', 'idle', 'sit', 'sitNod', 'sitTalk', 'run'];

    constructor(includeAnimations: AnimationKeys[] = []) {
        super();

        if (includeAnimations.length > 0) {
            this.keysToLoad = includeAnimations;
        }

        this.load({ key: 'walk', grid: [4, 3], to: 10, fps: 5 });
        this.load({ key: 'idle', grid: [5, 4], to: 19, fps: 3 });
        this.load({ key: 'sit', grid: [4, 4], to: 13, fps: 5 });
        this.load({ key: 'sitNod', grid: [5, 5], to: 23, fps: 5 });
        this.load({ key: 'sitTalk', grid: [5, 5], to: 23, fps: 5 });
        this.load({ key: 'run', grid: [3, 2], to: 5, fps: 5 });
    }

    load({ key, grid, to, fps = 5, from = 0, imageurl = key }: { imageurl?: string; key: AnimationKeys; grid: [number, number]; from?: number; to: number; fps?: number; }) {

        if (!this.keysToLoad.includes(key)) {
            return;
        }

        void $.loader.loadImage(`src/assets/ani/m/${imageurl}.png`).then(image => {
            this.sprites[key] = new Animator(new CharacterSprite(image, new Vector2(64, 128), grid), from, to, fps)
        });
    }

    render() {
        this.activeSprite.render($.canvas, new Vector2(-15, -50), 0.45);
    }
}