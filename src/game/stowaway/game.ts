import { BaseGame } from "../util/game/baseGame";
import { Vector2 } from "../util/math/vector2";
import { Ship } from "./ship";
import { Sky } from "./env/sky";
import { Wave } from "./env/wave";
import { Camera } from "./camera";
import { Character } from "./characters/character";
import { PeopleManager } from "./characters/managers/peopleManager";
import { MapManager } from "./characters/managers/mapManager";
import { RouteManager } from "./characters/managers/routeManager";
import { getPeople, mapConnections, mapLocations } from "./characters/list";
import { Moon } from "./env/moon";
import { CVE } from "../util/canvas/cve";
import { Sun } from "./env/sun";

export type flags = 'open' | 'debug';
export type values = 'speed' | 'zoom';
export class StowawayGame extends BaseGame<flags, values> {
    msPerDay: number = 60000;
    camera: Camera;
    ship: Ship;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, { open: false, debug: false }, { speed: 1, zoom: 1 });

        $.game = this;
        $.routeManager = new RouteManager();
        $.mapManager = new MapManager(mapLocations, mapConnections);
        $.mapManager.build();
        $.peopleManager = new PeopleManager(getPeople());

        this.camera = new Camera();
        this.ship = new Ship();

        const overlays: {
            element: CVE;
            order: number;
            name: string;
        }[] = [];
        const sky = new Sky();
        overlays.push(...sky.overlays);
        const sun = new Sun();
        overlays.push(...sun.overlay);
        const moon = new Moon();
        overlays.push(...moon.overlay);

        this.camera.addToZoomLayer('static', 'sky', sky, 1);
        this.camera.addToZoomLayer('horizon', 'sun', sun, 2);
        this.camera.addToZoomLayer('horizon', 'moon', moon, 3);
        this.camera.addToZoomLayer('ship', 'wave1', new Wave(700 + 300, 5, 3, [28, 42, 58, 1], [90, 130, 180, 1], 0.0005), 6);
        this.camera.addToZoomLayer('ship', 'wave2', new Wave(800 + 150 + 300, 7, 2.4, [28, 42, 58, 1], [90, 130, 180, 1], 0.0005), 7);
        this.camera.addToZoomLayer('ship', 'ship', this.ship, 10);
        this.camera.addToZoomLayer('ship', 'ship4', new Wave(770 + 150 + 300 + 40, 7, 2, [28, 42, 58, 1], [90, 130, 180, 1], 0.0003, 0.75), 13);

        overlays.forEach((overlay) => {
            this.camera.addToZoomLayer('foreground', overlay.name, overlay.element, overlay.order);
        });

        Object.entries(this.camera.zoomLayers).forEach(([key, layer]) => {
            layer.element.add(key, this, layer.parallax + 100);
        });

        this.camera.zoom = 1;
        this.camera.focus = new Vector2(1920 / 2, 600);
    }

    preTransform(): void {
        // this.camera.focus = new Vector2(Math.sin($.tick.elapsedTime * 0.0003) * 300 + 1000, 700 + Math.sin($.tick.elapsedTime * 0.0005) * 200);
        this.camera.focus = this.ship.getTargetPosition();
        this.camera.tick();

    }

    postRender(): void {
    }

    applyFlags() {
        this.ship.open = $.flags.open ? 1 : 0;
    }

    applyValues() {
        this.camera.zoom = $.values.zoom;
        this.msPerDay = 60000 / $.values.speed;
    }

}