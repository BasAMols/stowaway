import { BaseGame } from "../util/baseGame";
import { Vector2 } from "../util/math/vector2";
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
import { Transform2d } from "../util/math/transform";
import { ShipPart } from "./ship";
import { Stars } from "./env/stars";

export type flags = 'open' | 'debug';
export type values = 'speed' | 'zoom';
export class StowawayGame extends BaseGame<flags, values> {
    msPerDay: number = Infinity;
    camera: Camera;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, { open: true, debug: false }, { speed: 1, zoom: 4 });

        this.camera = new Camera();
        $.camera = this.camera;
        $.mouse = this.camera.mouse;
        $.game = this;
        $.routeManager = new RouteManager();
        $.mapManager = new MapManager(mapLocations, mapConnections);
        $.mapManager.build();
        $.peopleManager = new PeopleManager(getPeople());

        const overlays: {
            element: CVE;
            order: number;
            name: string;
        }[] = [];

        new Sky();
        new Stars();
        new Sun();
        new Moon();
        new Test();

        for (let i = 0; i < 15; i++) {
            new ShipPart(i.toString().padStart(4, '0') + '.png', 0.94 + i * 0.01, (0.94 + i * 0.01) > 1.02);
        }

        for (let i = 0; i < 20; i++) {
            if (i > 9 && i < 11) {
                continue;
            }
            ((key: string, offset: number) => {
                const colorOffset = offset * 0.3 + 0.7;
                this.camera.addToZoomLayer(offset, key, new Wave(770 + offset * 10 * 25, 4 * offset, 1 + 3 * offset, [28 * colorOffset, 42 * colorOffset, 58 * colorOffset, 1], [90 * colorOffset, 130 * colorOffset, 180 * colorOffset, 1], 0.0005), 6);
            })('wave' + (i + 1), i * 0.1)
        }

        Object.entries(this.camera.zoomLayers).forEach(([key, layer]) => {
            layer.element.add(key, this, layer.parallax + 1);
        });

        this.applyFlags();
        this.applyValues();

        this.camera.focus = new Vector2(500, 900);
    }



    getTargetPosition(): Vector2 {
        const transform = Transform2d.calculateWorldTransform([$.peopleManager.people.find(person => person.data.name === 'Dave')!.transform, this.transform]);
        return transform.position.add(new Vector2(0, -30));
    }

    preTransform(): void {
        if ($.keyboard.press('e')) $.flags.open = !$.flags.open;
        if ($.keyboard.press('q')) $.flags.debug = !$.flags.debug;

        this.camera.tick();
    }

    postRender(): void {
    }

    applyFlags() {
    }

    applyValues() {
        // this.msPerDay = 60000 / $.values.speed;
    }

}