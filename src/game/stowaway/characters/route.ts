import { Ease } from "../../util/math/ease";
import { Vector2 } from "../../util/math/vector2";
import { MapConnection } from "./map/mapConnection";
import { MapLocation } from "./map/mapLocation";
import { TimePeriod } from "./time";
import { Travel } from "./travel";
import { Character } from "./character";


export interface RouteType {
    from: MapLocation;
    to: MapLocation;
    through: MapLocation[];
    connections: MapConnection[];
    distance?: number;
}

export class Route {
    distance: number;
    segments: {
        connection: MapConnection;
        distance: number;
        start: number;
        end: number;
        direction: -1 | 1;
    }[] = [];
    public constructor(public data: RouteType) {
        let totalDistance = 0;

        for (let index = 0; index < data.connections.length; index++) {
            const connection = data.connections[index];
            this.segments.push({
                connection: connection,
                distance: connection.distance,
                start: totalDistance,
                end: totalDistance + connection.distance,
                direction: connection.fromLocation === data.through[index] ? 1 : -1,
            });
            totalDistance += connection.distance;
        }
        this.distance = totalDistance;
    }

    public getSegmentVector(time: number): [Vector2, number] {
        const segment = this.segments.find(segment => time >= segment.start && time <= segment.end);
        let delta = ((time - segment.start) / segment.distance);

        if (segment.direction === -1) {
            delta = 1 - delta;
        }
        return [segment.connection.getVector(delta), segment.connection.data.depth];
    }

    createTravel(subject: Character, arrivalTime: TimePeriod): Travel {
        return new Travel({
            route: this,
            subject: subject,
            arrivalTime: arrivalTime,
        });
    }
}