import { CVE } from "src/game/util/canvas/cve";
import { Vector2 } from "src/game/util/math/vector2";
import { Animator, CharacterSprite } from "./character";


export type AnimationKeys = 'walk' | 'idle' | 'sit';
export class BaseCharacter extends CVE {
    lastPosition: Vector2 = new Vector2(0, 0);
    sprites: Record<string, Animator> = {};
    activeSprite: Animator;
    keysToLoad: string[] = ['walk', 'idle', 'sit'];

    constructor(includeAnimations: string[] = []) {
        super();

        if (includeAnimations.length > 0) {
            this.keysToLoad = includeAnimations;
        }

        this.load({ key: 'walk', grid: [4, 3], to: 9, fps: 5 });
        this.load({ key: 'idle', grid: [5, 4], to: 18, fps: 3 });
        this.load({ key: 'sit', grid: [4, 4], to: 12, fps: 5 });
    }

    load({ key, grid, to, fps = 5, from = 0, imageurl = key }: { imageurl?: string; key: string; grid: [number, number]; from?: number; to: number; fps?: number; }) {

        if (!this.keysToLoad.includes(key)) {
            return;
        }

        void $.loader.loadImage(`dist/spa/images/ani/m/${imageurl}.png`).then(image => {
            this.sprites[key] = new Animator(new CharacterSprite(image, new Vector2(64, 128), grid), from, to, fps)
        });
    }

    preTransform() {
        const newPosition = this.transform.position;
        const lastPosition = this.lastPosition;
        if (lastPosition.subtract(newPosition).magnitude() > 0) {
            const direction = this.transform.position.subtract(lastPosition).normalise();
            this.sprites.walk.flip = direction.x < 0;
            this.sprites.idle.flip = direction.x < 0;
            this.sprites.sit.flip = direction.x < 0;
            this.sprites.walk.preRender();
            this.activeSprite = this.sprites.walk;
        } else {
            this.sprites.sit.preRender();
            this.activeSprite = this.sprites.sit;
        }

        this.transform.setPosition(newPosition);
        this.lastPosition = this.transform.position;

    }
    render() {
        this.activeSprite.render($.canvas, new Vector2(-15, -60), 0.55);
    }
}