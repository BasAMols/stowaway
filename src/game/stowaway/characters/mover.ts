import { Vector2 } from "src/game/util/math/vector2";
import { PC } from "./pc";
import { MapLocation } from "./map/mapLocation";
import { MapConnection } from "./map/mapConnection";

export class Mover {

    input: Vector2 | undefined;
    speed: number = 5;
    target: PC;

    currentLocation: MapLocation | undefined;
    currentConnection: MapConnection | undefined;

    constructor() {

    }

    tick() {
        this.checkInput();
    }

    checkInput() {
        this.input = undefined;
        const up = Number($.keyboard.pressed('w')) - Number($.keyboard.pressed('s'));
        const left = Number($.keyboard.pressed('d')) - Number($.keyboard.pressed('a'));
        if (up !== 0 || left !== 0) {
            this.input = new Vector2(left, up);
            this.speed = this.target.speed;
        } else {
            this.input = undefined;
            this.speed = 0;
        }
    }

    // collectConnections(): MapConnection[] {
    //     return $.mapManager.connections;
    // }

    reset(position?: Vector2) {
        this.currentLocation = Object.values($.mapManager.locations).sort((a, b) => a.data.position.subtract(position ?? this.target.transform.position).magnitude() - b.data.position.subtract(this.target.transform.position).magnitude())[0];
        this.target.transform.setPosition(this.currentLocation.data.position);
        this.currentConnection = undefined;
    }

    collectOptions() {
        // if (this.currentLocation) {

        // }
    }

    connections(mapConnection: MapConnection, distance: number) {

    }
    checkOptionsAgainstInput(options: Vector2[]) {
        if (!this.input) {
            return undefined;
        }
        // find the option that is closest to the input. Vector indicates direction.
        // only return if option is withing 45 degrees of the input.
        const angle = Math.atan2(this.input.y, this.input.x);
        const angleThreshold = 45 * Math.PI / 180;
        for (const option of options) {
            const optionAngle = Math.atan2(option.y, option.x);
            const angleDifference = Math.abs(angle - optionAngle);
            if (angleDifference < angleThreshold) {
                return option;
            }
        }
        return undefined;

    }

}
