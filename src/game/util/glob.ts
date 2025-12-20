import { Canvas } from "./canvas/canvas";
import type { Game } from "./game/baseGame";
import { TickerReturnData } from "./game/ticker";

declare global {
    var game: Game;
    var canvas: Canvas;
    var tick: TickerReturnData
}

