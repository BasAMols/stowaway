import { BaseGame } from "../util/baseGame";
import { Vector2 } from "../util/math/vector2";
import { Sky } from "./env/sky";
import { Ocean, Wave } from "./env/wave";
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
import { Ship, ShipPart } from "./ship";
import { PC } from "./characters/pc";
import { StaticCharacter } from "./characters/staticCharacter";
import { CQuick } from "../util/canvas/cr";
import { QTooltip } from "quasar";
import { Ref } from "vue";
import { LayerAsset } from "../util/layerAsset";
import { Islands } from "./env/islands";
import { Mover } from "./characters/mover";

export type flags = 'open' | 'openAll' | 'debug' | 'night';
export type values = 'speed' | 'zoom';
export class StowawayGame extends BaseGame<flags, values> {
    msPerDay: number = Infinity;
    parts: ShipPart[] = [];
    pc: PC;

    constructor(canvas: HTMLCanvasElement, tooltip: Ref<string, string>) {
        super(canvas, { open: false, openAll: false, debug: false, night: false, }, { speed: 1, zoom: 5 });

        $.tooltip = tooltip;
        $.game = this;
        $.routeManager = new RouteManager();
        $.mapManager = new MapManager(mapLocations, mapConnections);
        $.mapManager.build();
        $.peopleManager = new PeopleManager(getPeople());
        $.mover = new Mover();

        new Sky();
        new Moon();
        new Ocean();
        new Islands();
        new Ship();

        new StaticCharacter(new Vector2(450, 1233), 'sit1', 1.025, 'sitTalk', false);
        new StaticCharacter(new Vector2(450 + 27, 1233), 'sit2', 1.025, 'sitNod', true);
        new StaticCharacter(new Vector2(450 + 26, 1233 - 2), 'sit3', 1.02, 'sit', true);
        new StaticCharacter(new Vector2(450 + 60, 1233 - 2), 'idle', 1.02, 'idle', true);
        this.pc = new PC();

        this.pc.transform.setPosition(new Vector2(950, 1170));


        $.camera.addToZoomLayer(2, 'areaManager', new CQuick({
            onRender: (that) => {
                if ($.flags.debug) {
                    $.areaManager.areas.forEach(area => {
                        $.canvas.draw.polygonStroke(area.points.map(point => $.camera.translateCoordinate(point.divide(ShipPart.shipScale).add(ShipPart.offset), 1.06, 2)), '#f33', 1);
                    });
                }
            },
        }), 1);

        $.camera.focus = new Vector2(1100, 1200);
        $.mover.target = this.pc;
    }

    tick() {
        if ($.keyboard.press('e')) $.flags.open = !$.flags.open;
        if ($.keyboard.press('q')) $.flags.debug = !$.flags.debug;
        if ($.keyboard.press('f')) $.flags.openAll = !$.flags.openAll;
        if ($.keyboard.press('n')) $.flags.night = !$.flags.night;

        $.mover.tick();

        super.tick();

        $.areaManager.focus = this.pc.transform.position ?? new Vector2(0, 0);
        $.areaManager.tick();

        this.transform.apply($.canvas.ctx);
    }

    getTargetPosition(): Vector2 {
        const transform = Transform2d.calculateWorldTransform([$.peopleManager.people.find(person => person.data.name === 'Dave')!.transform, this.transform]);
        return transform.position.add(new Vector2(0, -30));
    }

}