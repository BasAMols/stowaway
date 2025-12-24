import { StowawayGame } from "../stowaway/game";
import { Canvas } from "./canvas/canvas";
import { Loader } from "./canvas/loader";
import { TickerReturnData } from "./game/ticker";
import { Vector2 } from "./math/vector2";

interface DollarGlobal {
    tick: TickerReturnData;
    game: StowawayGame,
    canvas: Canvas,
    container: Vector2,
    day: number,
    loader: Loader,
    flags: Record<string, boolean>,
}

declare global {
    var $: DollarGlobal;
}

