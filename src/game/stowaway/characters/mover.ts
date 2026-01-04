import { Vector2 } from "src/game/util/math/vector2";
import { PC } from "./pc";
import { MapLocation } from "./map/mapLocation";
import { MapConnection } from "./map/mapConnection";
import { MathUtil } from "src/game/util/math/math";

export class Mover {

    input: Vector2 | undefined;
    camera: Vector2 | undefined;
    target: PC;

    currentLocation: MapLocation | undefined;
    currentConnection: MapConnection | undefined;

    constructor() {

    }

    tick() {
        this.checkInput();
        if (this.input) {
            this.target.transform.setPosition(this.target.transform.position.add(this.input));
        }
        if (this.camera) {
            $.camera.focus = $.camera.focus.add(this.camera.multiply(this.target.speed));
        }
    }

    checkInput() {
        this.input = undefined;
        const up = Number($.keyboard.pressed('s')) - Number($.keyboard.pressed('w'));
        const left = Number($.keyboard.pressed('d')) - Number($.keyboard.pressed('a'));
        if (up !== 0 || left !== 0) {
            this.input = new Vector2(left, up).multiply(this.target.speed).multiply($.tick.deltaTime);
        } else {
            this.input = undefined;
        }
        this.camera = undefined;
        const upCamera = Number($.keyboard.pressed('arrowDown')) - Number($.keyboard.pressed('arrowUp'));
        const leftCamera = Number($.keyboard.pressed('arrowRight')) - Number($.keyboard.pressed('arrowLeft'));
        if (upCamera !== 0 || leftCamera !== 0) {
            this.camera = new Vector2(leftCamera, upCamera).multiply($.tick.deltaTime, 10);
        } else {
            this.camera = undefined;
        }

        const zoom = Number($.keyboard.pressed('pageUp')) - Number($.keyboard.pressed('pageDown'));
        if (zoom !== 0) {
            $.values.zoom = MathUtil.clamp($.values.zoom + (zoom * 0.001 * $.values.zoom * $.tick.deltaTime), 1.6, 40);
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
