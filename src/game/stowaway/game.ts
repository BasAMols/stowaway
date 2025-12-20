import { BaseGame } from "../util/game/baseGame";

export class StowawayGame extends BaseGame {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    override render(): void {
        $.canvas.ctx.fillStyle = 'red';
        $.canvas.ctx.fillRect(0, 0, $.container.x / 2, $.container.y / 2);
    }
}