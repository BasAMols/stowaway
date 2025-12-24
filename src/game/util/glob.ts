import { MapManager } from "../stowaway/characters/managers/mapManager";
import { PeopleManager } from "../stowaway/characters/managers/peopleManager";
import { RouteManager } from "../stowaway/characters/managers/routeManager";
import { StowawayGame } from "../stowaway/game";
import { Canvas } from "./canvas/canvas";
import { Loader } from "./canvas/loader";
import { TickerReturnData } from "./game/ticker";
import { Vector2 } from "./math/vector2";

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

    flags: Record<string, boolean>,
    values: Record<string, number>,
}

declare global {
    var $: DollarGlobal;
}

