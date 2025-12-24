import { MapConnection } from "../map/mapConnection";
import { MapLocation } from "../map/mapLocation";
import { MapManager } from "./mapManager";
import { Route } from "../route";

export class RouteManager {

    routes: Route[] = [];

    constructor() {
    }


    createNullRoute(locationA: MapLocation): Route {
        const route = new Route({
            from: locationA,
            to: locationA,
            through: [],
            connections: [],
        });
        return route;
    }

    findRoute(locationA: MapLocation, locationB: MapLocation): Route {
        const found = this.routes.find(route =>
            (route.data.from === locationA && route.data.to === locationB));
        if (found) {
            return found;
        }
        return this.createRoute(locationA, locationB);
    }

    private static recursiveRoute(locationA: MapLocation, locationB: MapLocation, route: MapLocation[], distance: number, exclude: MapLocation[], connections: MapConnection[]): {
        route: MapLocation[],
        distance: number,
        end: boolean,
        connections: MapConnection[],
    } | false {

        const excludeList = [...exclude, locationA];

        if (locationA === locationB) {
            return {
                route: [...route, locationA],
                distance: distance,
                end: true,
                connections: [...connections],
            };
        }

        const possiblities: {
            route: MapLocation[],
            distance: number,
            end: boolean,
            connections: MapConnection[],
        }[] = [];



        for (const neighbor of locationA.neighbors) {
            if (excludeList.includes(neighbor[0])) {
                continue;
            }

            const d = neighbor[1].distance;
            const foundRoute = RouteManager.recursiveRoute(neighbor[0], locationB, [...route, locationA], distance + d, excludeList, [...connections, neighbor[1]]);
            if (foundRoute) {
                possiblities.push(foundRoute);
            }
        }

        if (possiblities.length > 0) {
            return possiblities.sort((a, b) => a.distance - b.distance)[0];
        }
        return false;

    }
    private createRoute(locationA: MapLocation, locationB: MapLocation): Route {
        const foundRoute = RouteManager.recursiveRoute(locationA, locationB, [], 0, [], []);

        if (!foundRoute) {
            throw new Error('No route found');
        }

        const route = new Route({
            from: locationA,
            to: locationB,
            through: foundRoute.route,
            distance: foundRoute.distance,
            connections: foundRoute.connections,
        });

        return route;
    }
}