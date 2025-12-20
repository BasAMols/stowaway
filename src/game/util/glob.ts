import { StowawayGame } from "../stowaway/game";
import { Canvas } from "./canvas/canvas";
import { TickerReturnData } from "./game/ticker";
import { Vector2 } from "./math/vector2";

interface DollarGlobal {
    tick: TickerReturnData;
    game: StowawayGame,
    canvas: Canvas,
    container: Vector2
}

declare global {
    var $: DollarGlobal;
}

