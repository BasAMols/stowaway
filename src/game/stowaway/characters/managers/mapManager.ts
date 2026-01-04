import { Vector2 } from "../../../util/math/vector2";
import { RouteManager } from "./routeManager";
import { mapLocations } from "../list";
import { MapConnection, MapConnectionType } from "../map/mapConnection";
import { MapLocation, MapLocationType } from "../map/mapLocation";


export class MapManager {

    public locations: Record<string, MapLocation> = {};
    public connections: MapConnection[] = [];
    public readonly routeManager: RouteManager;
    // dom: Div;
    // mapSvg: Svg;

    public constructor(
        // private managers: Managers,
        locations: Record<string, [Vector2, number]> = {},
        connections: MapConnectionType[] = [],
    ) {

        for (const location of Object.entries(locations)) {
            this.locations[location[0]] = new MapLocation({ name: location[0], position: location[1][0].add(new Vector2(250, -194)), depth: location[1][1] });
        }

        for (const connection of connections) {
            this.connections.push(new MapConnection(connection));
        }


        this.routeManager = new RouteManager();

    }

    public getLocation(name: string): MapLocation {
        return this.locations[name];
    }

    build(): void {
        for (const connection of this.connections) {
            connection.build();
        }
    }
}