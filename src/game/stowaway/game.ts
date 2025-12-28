import { BaseGame } from "../util/game/baseGame";
import { Vector2 } from "../util/math/vector2";
import { Ship } from "./ship";
import { Sky } from "./env/sky";
import { Wave } from "./env/wave";
import { Camera } from "../util/camera";
import { Character } from "./characters/character";
import { PeopleManager } from "./characters/managers/peopleManager";
import { MapManager } from "./characters/managers/mapManager";
import { RouteManager } from "./characters/managers/routeManager";
import { getPeople, mapConnections, mapLocations } from "./characters/list";
import { Moon } from "./env/moon";
import { CVE } from "../util/canvas/cve";
import { Sun } from "./env/sun";
import { Test } from "./characters/test";
import { Ship2 } from "./ship2";

export type flags = 'open' | 'debug';
export type values = 'speed' | 'zoom';
export class StowawayGame extends BaseGame<flags, values> {
    msPerDay: number = 60000;
    camera: Camera;
    ship: Ship;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, { open: true, debug: false }, { speed: 1, zoom: 4 });

        $.game = this;
        $.routeManager = new RouteManager();
        $.mapManager = new MapManager(mapLocations, mapConnections);
        $.mapManager.build();
        $.peopleManager = new PeopleManager(getPeople());

        this.camera = new Camera();
        this.ship = new Ship();

        $.camera = this.camera;
        $.mouse = this.camera.mouse;

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

        const addWave = (key: string, offset: number) => {
            const colorOffset = offset * 0.3 + 0.7;
            this.camera.addToZoomLayer(offset, key, new Wave(770 + offset * 10 * 25, 4 * offset, 1 + 3 * offset, [28 * colorOffset, 42 * colorOffset, 58 * colorOffset, 1], [90 * colorOffset, 130 * colorOffset, 180 * colorOffset, 1], 0.0005), 6);
        }

        this.camera.addToZoomLayer(0, 'sky', sky, 1);
        this.camera.addToZoomLayer(0, 'sun', sun, 2);
        this.camera.addToZoomLayer(0, 'moon', moon, 3);


        for (let i = 0; i < 15; i++) {
            addWave('wave' + (i + 1), i * 0.1);
        }

        // this.camera.addToZoomLayer(0.7, 'ship2', new Ship2(new Vector2(-400, 50), 0.7), 10);

        this.camera.addToZoomLayer(1, 'ship', this.ship, 10);
        this.camera.addToZoomLayer(1.04, 'ship', this.ship.front, 10);
        this.camera.addToZoomLayer(1.5, 'test', new Test(), 100);

        overlays.forEach((overlay) => {
            this.camera.addToZoomLayer(1.5, overlay.name, overlay.element, overlay.order);
        });

        Object.entries(this.camera.zoomLayers).forEach(([key, layer]) => {
            layer.element.add(key, this, layer.parallax + 100);
        });

        this.applyFlags();
        this.applyValues();

        this.camera.focus = new Vector2(500, 900);
    }

    preTransform(): void {
        // this.camera.focus = new Vector2(Math.sin($.tick.elapsedTime * 0.0003) * 300 + 1000, 700 + Math.sin($.tick.elapsedTime * 0.0005) * 200);
        // this.camera.focus = this.ship.getTargetPosition();
        this.ship.focus = $.camera.translateCoordinate(this.ship.getTargetPosition(), 1, 1.04);
        this.camera.tick();

    }

    postRender(): void {
    }

    applyFlags() {
    }

    applyValues() {
        this.msPerDay = 60000 / $.values.speed;
    }

}