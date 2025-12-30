import { Vector2 } from "../../../util/math/vector2";
import { PathCreator } from "../../../util/pathCreator";
import { MapLocation } from "./mapLocation";
import { MapManager } from "../managers/mapManager";
import { CVE } from "src/game/util/canvas/cve";

export interface MapConnectionType {
    from: string;
    to: string;
    path?: string;
    oneWay?: boolean;
    depth?: number;
}

export class MapConnection extends CVE {

    fromLocation: MapLocation;
    toLocation: MapLocation;
    distance: number;
    public constructor(public data: MapConnectionType) {
        super();
        if (this.data.from === this.data.to) {
            throw new Error("From and to cannot be the same");
        }

        $.camera.addToZoomLayer(2, 'connection_' + this.data.from + '_' + this.data.to, this, 104);

    }

    build(): void {
        this.fromLocation = $.mapManager.getLocation(this.data.from);
        this.toLocation = $.mapManager.getLocation(this.data.to);
        this.fromLocation.registerConnection(this, this.fromLocation, this.toLocation);

        if (!this.data.oneWay) {
            this.toLocation.registerConnection(this, this.fromLocation, this.toLocation);
        }

        // this.line = new Svg('path', {
        //     d: this.data.path ?? PathCreator(this.fromLocation.data.position, { point: this.toLocation.data.position }),
        //     stroke: 'black',
        //     strokeWidth: 2,
        //     fill: 'none',
        // });

        // this.distance = (this.line.dom as SVGPathElement).getTotalLength();
        this.distance = this.fromLocation.data.position.subtract(this.toLocation.data.position).magnitude();
        this.data.depth = this.data.depth ?? this.toLocation.data.depth;
    }

    getVector(delta: number): Vector2 {
        return this.fromLocation.data.position.moveTowards(this.toLocation.data.position, delta * this.distance);
        // return this.line.getPointAtLength(delta * this.distance);
    }
    render() {
        if ($.flags.debug) {
            $.canvas.draw.line(
                $.camera.translateCoordinate(this.fromLocation.data.position, 1, 2),
                $.camera.translateCoordinate(this.toLocation.data.position, 1, 2),
                '#0f0',
                0.3
            );
        }
    }
}


