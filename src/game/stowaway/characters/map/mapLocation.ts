import { Vector2 } from "../../../util/math/vector2";
import { Route } from "../route";
import { MapConnection } from "./mapConnection";
import { MapManager } from "../managers/mapManager";
import { CVE } from "src/game/util/canvas/cve";

export interface MapLocationType {
    position: Vector2;
    name: string;
    depth: number;
}

export class MapLocation extends CVE {
    connections: MapConnection[] = [];
    neighbors: [MapLocation, MapConnection][] = [];
    routes: Record<string, Route> = {};

    public constructor(public data: MapLocationType) {
        super();
        this.data.depth = this.data.depth ?? 0;
        $.camera.addToZoomLayer(2, 'location_' + this.data.name, this, 105);

    }
    registerConnection(connection: MapConnection, a: MapLocation, b: MapLocation): void {
        this.connections.push(connection);

        if (a !== this) this.neighbors.push([a, connection]);
        if (b !== this) this.neighbors.push([b, connection]);
    }
    registerRoute(to: string, route: Route): void {
        this.routes[to] = route;
    }
    render() {
        if ($.flags.debug) {
            $.canvas.draw.circle($.camera.translateCoordinate(this.data.position, 1, 2), 1, '#fff');
        }
    }

}