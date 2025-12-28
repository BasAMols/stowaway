import { MapManager } from "../stowaway/characters/managers/mapManager";
import { PeopleManager } from "../stowaway/characters/managers/peopleManager";
import { RouteManager } from "../stowaway/characters/managers/routeManager";
import { StowawayGame } from "../stowaway/game";
import { Camera } from "./camera";
import { Canvas } from "./canvas/canvas";
import { Loader } from "./canvas/loader";
import { TickerReturnData } from "./ticker";
import { Vector2 } from "./math/vector2";
import { Mouse } from "./mouse";
import { Keyboard } from "./keyboard";

export interface DollarGlobal {
    tick: TickerReturnData;
    game: StowawayGame,
    canvas: Canvas,
    container: Vector2,
    day: number,
    hour: number,
    time: number,
    loader: Loader,
    mapManager: MapManager,
    peopleManager: PeopleManager,
    routeManager: RouteManager,
    camera: Camera,
    mouse: Mouse,
    keyboard: Keyboard,
    flags: Record<string, boolean>,
    values: Record<string, number>,
}

declare global {
    var $: DollarGlobal;
}

