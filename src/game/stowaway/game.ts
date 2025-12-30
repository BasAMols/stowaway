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
import { PC } from "./characters/pc";
import { StaticCharacter } from "./characters/staticCharacter";
import { CQuick } from "../util/canvas/cr";
import { QTooltip } from "quasar";
import { Ref } from "vue";

export type flags = 'open' | 'openAll' | 'debug';
export type values = 'speed' | 'zoom';
export class StowawayGame extends BaseGame<flags, values> {
    msPerDay: number = Infinity;
    camera: Camera;
    parts: ShipPart[] = [];
    pc: PC;

    constructor(canvas: HTMLCanvasElement, tooltip: Ref<string, string>) {
        super(canvas, { open: true, openAll: true, debug: true }, { speed: 1, zoom: 4 });

        this.camera = new Camera();
        $.tooltip = tooltip;
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
        // new Stars();
        // new Sun();
        new Moon();
        // new Test();
        new StaticCharacter(new Vector2(472, 934), 'sit1', 1, 'sitTalk', false);
        new StaticCharacter(new Vector2(472 + 27, 934), 'sit2', 1, 'sitNod', true);
        new StaticCharacter(new Vector2(472 + 26, 934 - 2), 'sit3', 0.99, 'sit', true);
        new StaticCharacter(new Vector2(472 + 40, 934 - 9), 'idle', 0.99, 'idle', true);

        for (let i = 0; i < 7; i++) {
            const o = 0.97 + i * 0.015;
            new ShipPart(
                i.toString().padStart(4, '0') + '.png', o,
                (o) > 1.02,
                { x: 0, y: 800, width: 1920, height: 1289 - 800 }
            )
            new ShipPart(
                i.toString().padStart(4, '0') + '.png', o + 0.0001,
                false,
                { x: 0, y: 0, width: 1920, height: 800 }
            );
        }

        this.pc = new PC();

        for (let i = 0; i < 20; i++) {
            ((key: string, offset: number) => {
                const colorOffset = offset * 0.4 + 0.3;
                new Wave(790 + offset * 10 * 25, 4 * offset, 1 + 3 * offset, [28 * colorOffset, 42 * colorOffset, 58 * colorOffset, 1], [90 * colorOffset, 130 * colorOffset, 180 * colorOffset, 1], 0.0005, 1, offset);
            })('wave' + (i + 1), i * 0.1 - 0.02)
        }


        Object.entries(this.camera.zoomLayers).forEach(([key, layer]) => {
            layer.element.add(key, this, layer.parallax + 1);
        });
        Object.entries(this.camera.dynamicLayers).forEach(([key, layer]) => {
            layer.element.add(key, this, layer.parallax + 1);
        });

        this.camera.focus = new Vector2(500, 900);
    }

    tick() {
        $.areaManager.focus = this.pc.transform.position ?? new Vector2(0, 0);
        if ($.keyboard.press('e')) $.flags.open = !$.flags.open;
        if ($.keyboard.press('q')) $.flags.debug = !$.flags.debug;
        if ($.keyboard.press('f')) $.flags.openAll = !$.flags.openAll;

        $.keyboard.tick();
        $.mouse.tick();
        $.canvas.save();
        $.camera.tick();
        $.areaManager.tick();

        this.transform.apply($.canvas.ctx);


        // for (const child of Object.values(this.below).sort((a, b) => a.order - b.order)) {
        //     child.tick();
        // }

        [...Object.values(this.camera.zoomLayers), ...Object.values(this.camera.dynamicLayers)].sort((a, b) => a.parallax - b.parallax).forEach((layer, index) => {
            layer.element.order = index + 1;
            layer.element.tick();
        });


    }

    getTargetPosition(): Vector2 {
        const transform = Transform2d.calculateWorldTransform([$.peopleManager.people.find(person => person.data.name === 'Dave')!.transform, this.transform]);
        return transform.position.add(new Vector2(0, -30));
    }

}