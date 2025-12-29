import { Vector2 } from "../../util/math/vector2";
import { MapConnectionType } from "./map/mapConnection";
import { PathCreator } from "../../util/pathCreator";
import { MapLocation } from "./map/mapLocation";
import { Task } from "./task";
import { TimePeriod } from "./time";
import { CharacterType } from "./character";

export const mapLocations: Record<string, [Vector2, number]> = {
    bridgeDeckCabin00: [new Vector2(56.2, 983.31 + 4), 15],
    bridgeDeckCabin01: [new Vector2(152.72, 983.31 + 4), 15],
    bridgeDeckCabin02: [new Vector2(214.21, 983.31 + 4), 15],

    bridgeDeck00: [new Vector2(247.1, 1016.2 + 4), 25],
    bridgeDeck01: [new Vector2(332.9, 1016.2 + 4), 25],
    bridgeDeck02: [new Vector2(390.1, 1016.2 + 4), 25],
    bridgeDeck03: [new Vector2(433, 1016.2 + 4), 25],
    bridgeDeck04: [new Vector2(527.38, 1016.2 + 4), 25],

    mainDeck00: [new Vector2(547.4, 1059.1 + 3), 25],
    mainDeck01: [new Vector2(618.9, 1059.1 + 3), 25],
    mainDeck02: [new Vector2(690.4, 1059.1 + 3), 25],
    mainDeck03: [new Vector2(761.9, 1059.1 + 3), 25],
    mainDeck04: [new Vector2(833.4, 1059.1 + 3), 25],
    mainDeck05: [new Vector2(904.9, 1059.1 + 3), 25],
    mainDeck06: [new Vector2(976.4, 1059.1 + 3), 25],
    mainDeck07: [new Vector2(1047.9, 1059.1 + 3), 25],
    mainDeck08: [new Vector2(1119.4, 1059.1 + 3), 25],
    mainDeck09: [new Vector2(1190.9, 1059.1 + 3), 25],
    mainDeck10: [new Vector2(1262.4, 1059.1 + 3), 25],

    gunDeck00: [new Vector2(151.29, 1127.74 + 4), 25],
    gunDeck01: [new Vector2(222.79, 1127.74 + 4), 25],
    gunDeck02: [new Vector2(294.29, 1127.74 + 4), 25],
    gunDeck03: [new Vector2(365.79, 1127.74 + 4), 25],
    gunDeck04: [new Vector2(437.29, 1127.74 + 4), 25],
    gunDeck05: [new Vector2(508.79, 1127.74 + 4), 25],
    gunDeck06: [new Vector2(580.29, 1127.74 + 4), 25],
    gunDeck07: [new Vector2(651.79, 1127.74 + 4), 25],
    gunDeck08: [new Vector2(723.29, 1127.74 + 4), 25],
    gunDeck09: [new Vector2(794.79, 1127.74 + 4), 25],
    gunDeck10: [new Vector2(866.29, 1127.74 + 4), 25],
    gunDeck11: [new Vector2(937.79, 1127.74 + 4), 25],
    gunDeck12: [new Vector2(1009.29, 1127.74 + 4), 25],
    gunDeck13: [new Vector2(1080.79, 1127.74 + 4), 25],
    gunDeck14: [new Vector2(1152.29, 1127.74 + 4), 25],
    gunDeck15: [new Vector2(1223.79, 1127.74 + 4), 25],
    gunDeck16: [new Vector2(1295.29, 1127.74 + 4), 25],
    gunDeck17: [new Vector2(1366.79, 1127.74 + 4), 25],

    orlopDeck00: [new Vector2(151.29, 1189.23 + 3), 25],
    orlopDeck01: [new Vector2(222.79, 1189.23 + 3), 25],
    orlopDeck02: [new Vector2(294.29, 1189.23 + 3), 25],
    orlopDeck03: [new Vector2(365.79, 1189.23 + 3), 25],
    orlopDeck04: [new Vector2(437.29, 1189.23 + 3), 25],
    orlopDeck05: [new Vector2(508.79, 1189.23 + 3), 25],
    orlopDeck06: [new Vector2(580.29, 1189.23 + 3), 25],
    orlopDeck07: [new Vector2(651.79, 1189.23 + 3), 25],
    orlopDeck08: [new Vector2(723.29, 1189.23 + 3), 25],
    orlopDeck09: [new Vector2(794.79, 1189.23 + 3), 25],
    orlopDeck10: [new Vector2(866.29, 1189.23 + 3), 25],
    orlopDeck11: [new Vector2(937.79, 1189.23 + 3), 25],
    orlopDeck12: [new Vector2(1009.29, 1189.23 + 3), 25],
    orlopDeck13: [new Vector2(1080.79, 1189.23 + 3), 25],
    orlopDeck14: [new Vector2(1152.29, 1189.23 + 3), 25],
    orlopDeck15: [new Vector2(1223.79, 1189.23 + 3), 25],
    orlopDeck16: [new Vector2(1295.29, 1189.23 + 3), 25],
    orlopDeck17: [new Vector2(1366.79, 1189.23 + 3), 25],

    bridgeLoftStair: [new Vector2(272.84, 1006.19), 25],
    loftBridgeStair: [new Vector2(232.8, 980.45), 25],

    bridgeMainStair: [new Vector2(541.68, 1009.05), 25],
    mainBridgeStair: [new Vector2(588.87, 1051.95), 25],

    mainGunStair1: [new Vector2(607.46, 1046.23), 15],
    gunMainStair1: [new Vector2(607.46, 1130.6), 30],

    mainGunStair2: [new Vector2(1090.8, 1046.23), 15],
    gunMainStair2: [new Vector2(1090.8, 1130.6), 30],

    orlopGunStair1: [new Vector2(607.46, 1194.95), 15],
    gunOrlopStair1: [new Vector2(607.46, 1120.59), 30],

    orlopGunStair2: [new Vector2(1090.8, 1194.95), 15],
    gunOrlopStair2: [new Vector2(1090.8, 1120.59), 30],

}

export const mapConnections: {
    from: string;
    to: string;
    depth?: number;
}[] = [
        { from: "bridgeDeckCabin00", to: "bridgeDeckCabin01" },
        { from: "bridgeDeckCabin01", to: "bridgeDeckCabin02" },

        { from: "bridgeDeck00", to: "bridgeDeck01" },
        { from: "bridgeDeck01", to: "bridgeDeck02" },
        { from: "bridgeDeck02", to: "bridgeDeck03" },
        { from: "bridgeDeck03", to: "bridgeDeck04" },
        { from: "bridgeDeck04", to: "bridgeDeck01" },

        { from: "mainDeck00", to: "mainDeck01" },
        { from: "mainDeck01", to: "mainDeck02" },
        { from: "mainDeck02", to: "mainDeck03" },
        { from: "mainDeck03", to: "mainDeck04" },
        { from: "mainDeck04", to: "mainDeck05" },
        { from: "mainDeck05", to: "mainDeck06" },
        { from: "mainDeck06", to: "mainDeck07" },
        { from: "mainDeck07", to: "mainDeck08" },
        { from: "mainDeck08", to: "mainDeck09" },
        { from: "mainDeck09", to: "mainDeck10" },

        { from: "gunDeck00", to: "gunDeck01" },
        { from: "gunDeck01", to: "gunDeck02" },
        { from: "gunDeck02", to: "gunDeck03" },
        { from: "gunDeck03", to: "gunDeck04" },
        { from: "gunDeck04", to: "gunDeck05" },
        { from: "gunDeck05", to: "gunDeck06" },
        { from: "gunDeck06", to: "gunDeck07" },
        { from: "gunDeck07", to: "gunDeck08" },
        { from: "gunDeck08", to: "gunDeck09" },
        { from: "gunDeck09", to: "gunDeck10" },
        { from: "gunDeck10", to: "gunDeck11" },
        { from: "gunDeck11", to: "gunDeck12" },
        { from: "gunDeck12", to: "gunDeck13" },
        { from: "gunDeck13", to: "gunDeck14" },
        { from: "gunDeck14", to: "gunDeck15" },
        { from: "gunDeck15", to: "gunDeck16" },
        { from: "gunDeck16", to: "gunDeck17" },

        { from: "orlopDeck00", to: "orlopDeck01" },
        { from: "orlopDeck01", to: "orlopDeck02" },
        { from: "orlopDeck02", to: "orlopDeck03" },
        { from: "orlopDeck03", to: "orlopDeck04" },
        { from: "orlopDeck04", to: "orlopDeck05" },
        { from: "orlopDeck05", to: "orlopDeck06" },
        { from: "orlopDeck06", to: "orlopDeck07" },
        { from: "orlopDeck07", to: "orlopDeck08" },
        { from: "orlopDeck08", to: "orlopDeck09" },
        { from: "orlopDeck09", to: "orlopDeck10" },
        { from: "orlopDeck10", to: "orlopDeck11" },
        { from: "orlopDeck11", to: "orlopDeck12" },
        { from: "orlopDeck12", to: "orlopDeck13" },
        { from: "orlopDeck13", to: "orlopDeck14" },
        { from: "orlopDeck14", to: "orlopDeck15" },
        { from: "orlopDeck15", to: "orlopDeck16" },
        { from: "orlopDeck16", to: "orlopDeck17" },

        { from: "bridgeLoftStair", to: "loftBridgeStair" },
        { from: "bridgeMainStair", to: "mainBridgeStair" },
        { from: "mainGunStair1", to: "gunMainStair1" },
        { from: "mainGunStair2", to: "gunMainStair2" },
        { from: "orlopGunStair1", to: "gunOrlopStair1" },
        { from: "orlopGunStair2", to: "gunOrlopStair2" },

        { from: "bridgeMainStair", to: "bridgeDeck04" },
        { from: "bridgeDeckCabin02", to: "loftBridgeStair" },
        { from: "bridgeLoftStair", to: "bridgeDeck00" },
        { from: "bridgeLoftStair", to: "bridgeDeck01" },


        { from: "mainBridgeStair", to: "mainDeck00" },
        { from: "mainBridgeStair", to: "mainDeck01" },

        { from: "mainGunStair1", to: "mainBridgeStair" },
        { from: "mainGunStair1", to: "mainDeck02" },

        { from: "gunMainStair1", to: "gunDeck06" },
        { from: "gunMainStair1", to: "gunDeck07" },

        { from: "gunOrlopStair1", to: "gunDeck06" },
        { from: "gunOrlopStair1", to: "gunDeck07" },

        { from: "orlopGunStair1", to: "orlopDeck06" },
        { from: "orlopGunStair1", to: "orlopDeck07" },

        { from: "mainGunStair2", to: "mainDeck07" },
        { from: "mainGunStair2", to: "mainDeck08" },

        { from: "gunMainStair2", to: "gunDeck13" },
        { from: "gunMainStair2", to: "gunDeck14" },

        { from: "gunOrlopStair2", to: "gunDeck12" },
        { from: "gunOrlopStair2", to: "gunDeck14" },

        { from: "orlopGunStair2", to: "orlopDeck13" },
        { from: "orlopGunStair2", to: "orlopDeck14" },



        // { from: "gun1", to: "gun2" },
        // { from: "gun2", to: "gun3" },
        // { from: "gun3", to: "gun4" },
        // { from: "gun4", to: "gun5" },
        // { from: "gun5", to: "gun6" },
        // { from: "gun6", to: "gun7" },
        // { from: "gun7", to: "gun8" },

        // { from: "orlop1", to: "orlop2" },
        // { from: "orlop2", to: "orlop3" },
        // { from: "orlop3", to: "orlop4" },
        // { from: "orlop4", to: "orlop5" },
        // { from: "orlop5", to: "orlop6" },
        // { from: "orlop6", to: "orlop7" },
        // { from: "orlop7", to: "orlop8" },

        // { from: "deck2", to: "deck2Stair", depth: 5 },
        // { from: "deck2Stair", to: "gun4Stair", depth: 5 },
        // { from: "gun4Stair", to: "gun4", depth: 5 },
        // { from: "gun6", to: "gun6Stair", depth: 5 },
        // { from: "gun6Stair", to: "orlop7Stair", depth: 5 },
        // { from: "orlop7Stair", to: "orlop7", depth: 5 },


    ]


export class IdleTask extends Task {
    public constructor({ start, end, location }: { start: TimePeriod; end: TimePeriod; location: MapLocation; }) {
        super({
            name: '', start, end, location, color: 'white', priority: 0,
            animationDuration: 5,
            animationStart: 0,
            animationSpeed: 300,
        });
    }
}
export class SleepTask extends Task {
    public constructor({ start, end, location }: { start: TimePeriod; end: TimePeriod; location: MapLocation; }) {
        super({
            name: 'Sleep', start, end, location, color: '#9f9f9f', priority: 0.1,
            animationDuration: 2,
            animationStart: 68,
            animationOffset: new Vector2(20, -30),
            animationSpeed: 1000,
            depth: 15,
        });
    }
}
export class ShowerTask extends Task {
    public constructor({ start, end, location }: { start: TimePeriod; end: TimePeriod; location: MapLocation; }) {
        super({
            name: 'Wash', start, end, location, color: '#c7c7ff', priority: 1,
            animationDuration: 4,
            animationStart: 30,
            animationSpeed: 1000,
        });

    }
}
export class EatTask extends Task {
    public constructor({ start, end, location }: { start: TimePeriod; end: TimePeriod; location: MapLocation; }) {
        super({
            name: 'Food', start, end, location, color: '#b5d5d8', priority: 1,
            animationDuration: 5,
            animationStart: 0,
            animationSpeed: 200,
        });
    }
}
export class EngineTask extends Task {
    public constructor({ start, end, location }: { start: TimePeriod; end: TimePeriod; location: MapLocation; }) {
        super({
            name: 'Helm', start, end, location, color: '#e1e1e1',
            animationDuration: 4,
            animationStart: 30,
            animationSpeed: 1000,
        });
    }
}
export class WorkTask extends Task {
    public constructor({ start, end, location }: { start: TimePeriod; end: TimePeriod; location: MapLocation; }) {
        super({ name: 'Work', start, end, location, color: '#dcb1cd' });
    }
}

export function getPeople(): CharacterType[] {
    return [
        {
            name: "Dave",
            tasks: [
                new EatTask({ start: 0, end: 1, location: $.mapManager.getLocation("gunDeck04") }),
                new EngineTask({ start: 2, end: 10, location: $.mapManager.getLocation("bridgeDeck02") }),
                new ShowerTask({ start: 10, end: 11, location: $.mapManager.getLocation("bridgeDeckCabin00") }),
                new SleepTask({ start: 15, end: 23, location: $.mapManager.getLocation("orlopDeck04") }),
                new EatTask({ start: 23, end: 24, location: $.mapManager.getLocation("gunDeck04") }),
            ],
        },
        // {
        //     name: "Jane",
        //     tasks: [
        //         new SleepTask({ start: 0, end: 7, location: $.mapManager.getLocation("orlopDeck07") }),
        //         new EngineTask({ start: 10, end: 18, location: $.mapManager.getLocation("bridgeDeck02") }),
        //         new ShowerTask({ start: 18, end: 19, location: $.mapManager.getLocation("bridgeDeckCabin00") }),
        //         new EatTask({ start: 19, end: 21, location: $.mapManager.getLocation("gunDeck04") }),
        //         new SleepTask({ start: 23, end: 24, location: $.mapManager.getLocation("orlopDeck07") }),

        //     ],
        // },
        // {
        //     name: "Andrew",
        //     tasks: [
        //         new EngineTask({ start: 0, end: 2, location: $.mapManager.getLocation("bridgeDeck02") }),
        //         new SleepTask({ start: 2, end: 10, location: $.mapManager.getLocation("orlopDeck10") }),
        //         new ShowerTask({ start: 10, end: 11, location: $.mapManager.getLocation("bridgeDeckCabin00") }),
        //         new EatTask({ start: 12, end: 14, location: $.mapManager.getLocation("gunDeck03") }),
        //         new EngineTask({ start: 18, end: 24, location: $.mapManager.getLocation("bridgeDeck02") }),

        //     ],
        // },
        // {
        //     name: "Tim",
        //     tasks: [
        //         new SleepTask({ start: 0, end: 6, location: $.mapManager.getLocation("orlopDeck15") }),
        //         new EatTask({ start: 7, end: 9, location: $.mapManager.getLocation("gunDeck02") }),
        //         new WorkTask({ start: 9, end: 10, location: $.mapManager.getLocation("mainDeck00") }),
        //         new WorkTask({ start: 10, end: 11, location: $.mapManager.getLocation("mainDeck02") }),
        //         new WorkTask({ start: 11, end: 12, location: $.mapManager.getLocation("mainDeck04") }),
        //         new WorkTask({ start: 12, end: 13, location: $.mapManager.getLocation("mainDeck06") }),
        //         new WorkTask({ start: 14, end: 15, location: $.mapManager.getLocation("mainDeck08") }),
        //         new WorkTask({ start: 15, end: 16, location: $.mapManager.getLocation("gunDeck14") }),
        //         new WorkTask({ start: 16, end: 17, location: $.mapManager.getLocation("gunDeck12") }),
        //         new WorkTask({ start: 17, end: 18, location: $.mapManager.getLocation("gunDeck10") }),
        //         new ShowerTask({ start: 21, end: 22, location: $.mapManager.getLocation("bridgeDeckCabin00") }),
        //         new SleepTask({ start: 22, end: 24, location: $.mapManager.getLocation("orlopDeck15") }),
        //     ],
        // },
    ];
}