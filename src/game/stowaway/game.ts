import { BaseGame } from "../util/game/baseGame";
import { Vector2 } from "../util/math/vector2";
import { Ship } from "./ship";
import { Sky } from "./env/sky";
import { Wave } from "./env/wave";
import { Camera } from "./camera";

export type flags = 'open';
export class StowawayGame extends BaseGame<flags> {
    msPerDay: number = 60000;
    camera: Camera;
    ship: Ship;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, { open: false });

        this.camera = new Camera();
        this.ship = new Ship();

        const sky = new Sky();

        this.camera.addToZoomLayer('static', 'sky', sky, 1);
        // this.camera.addToZoomLayer('ship', 'wave1', new Wave(new Vector2(0, 700), 3, 3, "#263342", 0.0005), 5);
        // this.camera.addToZoomLayer('ship', 'wave2', new Wave(new Vector2(0, 800 + 150), 6, 2.4, "#263342", 0.0005), 7);
        this.camera.addToZoomLayer('ship', 'ship', this.ship, 10);
        // this.camera.addToZoomLayer('ship', 'ship3', new Wave(new Vector2(0, 770 + 150), 4, 2, "#263342", 0.0003), 12);

        sky.overlays.forEach((overlay) => {
            this.camera.addToZoomLayer('foreground', overlay.name, overlay.element, overlay.order);
        });

        Object.entries(this.camera.zoomLayers).forEach(([key, layer]) => {
            layer.element.add(key, this, layer.parallax + 100);
        });

        this.camera.zoom = 1;
        this.camera.focus = new Vector2(1920 / 2, 1080 / 2);
    }

    preTransform(): void {
        this.camera.tick();
    }

    postRender(): void {
    }

    applyFlags() {
        this.ship.open = $.flags.open ? 1 : 0;
    }

}