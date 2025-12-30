import { Vector2 } from "../../util/math/vector2";
import { MapConnectionType } from "./map/mapConnection";
import { PathCreator } from "../../util/pathCreator";
import { MapLocation } from "./map/mapLocation";
import { Task } from "./task";
import { TimePeriod } from "./time";
import { CharacterType } from "./character";


function horizontal(data: {
    name: string;
    start: number;
    to: number;
    position: Vector2;
    distance: number;
    offset?: {
        index: number;
        offset: Vector2;
    }[],
    excludeBack?: number[],
    excludeBackward?: number[],
    excludeForward?: number[],
    excludeFront?: number[],
    excludeDirect?: number[],
}) {
    const list = [];
    for (let index = data.start; index < data.to + 1; index++) {

        const frontKey = data.name + String(index).padStart(2, '0');
        const backKey = data.name + String(index).padStart(2, '0') + 'Back';
        const nextFrontKey = data.name + String(index + 1).padStart(2, '0');
        const nextBackKey = data.name + String(index + 1).padStart(2, '0') + 'Back';

        let frontPosition = data.position.add(new Vector2(index * data.distance, 0));
        let backPosition = data.position.add(new Vector2(index * data.distance, -8));

        const o = data.offset?.find(o => o.index === index);
        if (o) {
            frontPosition = frontPosition.add(o.offset);
            backPosition = backPosition.add(o.offset);
        }

        mapLocations[frontKey] = [frontPosition, 1.02];
        mapLocations[backKey] = [backPosition, 1.00];

        if (!data.excludeDirect?.includes(index)) mapConnections.push({ from: frontKey, to: backKey })
        if (index < data.to && !data.excludeFront?.includes(index)) mapConnections.push({ from: frontKey, to: nextFrontKey })
        if (index < data.to && !data.excludeBack?.includes(index)) mapConnections.push({ from: backKey, to: nextBackKey })
        if (index < data.to && !data.excludeForward?.includes(index)) mapConnections.push({ from: frontKey, to: nextBackKey })
        if (index < data.to && !data.excludeBackward?.includes(index)) mapConnections.push({ from: backKey, to: nextFrontKey })
        // if (index > data.start && !data.excludeLeft?.includes(index)) mapConnections.push({ from: frontKey, to: lastBackKey })
        // if (index > data.start && !data.excludeLeft?.includes(index)) mapConnections.push({ from: backKey, to: lastFrontKey })

        // if (back) list.push({ from: name + String(index).padStart(2, '0') + 'Back', to: name + String(index + 1).padStart(2, '0') + 'Back' })
    }
    return list
}

function stairs(data: {
    from: string;
    to: string;
}) {
    mapConnections.push({ from: data.from + '12Back', to: data.to + '12' })
    mapConnections.push({ from: data.from + '22Back', to: data.to + '22' })
}

function task(data: {
    key: string;
    position: Vector2;
    depth: number;
    connections: string[];
}) {
    mapLocations[data.key] = [data.position, data.depth];
    for (const connection of data.connections) {
        mapConnections.push({ from: data.key, to: connection })
    }
}

export const mapLocations: Record<string, [Vector2, number]> = {};
export const mapConnections: {
    from: string;
    to: string;
    depth?: number;
}[] = [];

const stairOffset = [
    { index: 12, offset: new Vector2(+6, 0) },
    { index: 22, offset: new Vector2(-15, 0) },
]
horizontal({
    name: 'bridgeDeckCabin', start: 1, to: 4, position: new Vector2(0, 988), distance: 50,
    offset: [
        ...stairOffset,
        { index: 1, offset: new Vector2(-5, 0) },
        { index: 4, offset: new Vector2(30, 0) }
    ]
});
horizontal({
    name: 'bridgeDeck', start: 4, to: 11, position: new Vector2(0, 1020), distance: 50,
    offset: [
        ...stairOffset,
        { index: 4, offset: new Vector2(30, 0) },
        { index: 5, offset: new Vector2(20, 0) },
        { index: 11, offset: new Vector2(-15, 0) }
    ]
});
horizontal({
    name: 'mainDeck', start: 11, to: 25, position: new Vector2(0, 1063), distance: 50,
    offset: [...stairOffset],
    excludeForward: [11, 12, 21, 22, 14, 23],
    excludeBackward: [11, 12, 21, 22, 14, 23],
    excludeDirect: [12, 22, 23],
});
horizontal({
    name: 'gunDeck', start: 3, to: 29, position: new Vector2(0, 1131), distance: 50,
    offset: [...stairOffset,],
    excludeForward: [11, 12, 21, 22, 14, 23],
    excludeBackward: [11, 12, 21, 22, 14, 23],
    excludeDirect: [12, 22, 23],

});
horizontal({
    name: 'orlopDeck', start: 5, to: 26, position: new Vector2(0, 1196), distance: 50,
    offset: [...stairOffset, { index: 5, offset: new Vector2(-25, 0) }],
    excludeForward: [11, 12, 21, 22, 14, 23],
    excludeBackward: [11, 12, 21, 22, 14, 23],
    excludeDirect: [12, 22, 23],

});
horizontal({
    name: 'cargoDeck', start: 6, to: 25, position: new Vector2(0, 1268), distance: 50,
    offset: [...stairOffset,],
    excludeForward: [11, 12, 11, 12, 21, 22, 14, 23],
    excludeBackward: [11, 12, 21, 22, 14, 23],
    excludeDirect: [12, 22, 23],

});

stairs({ from: 'mainDeck', to: 'gunDeck' })
stairs({ from: 'gunDeck', to: 'orlopDeck' })
stairs({ from: 'orlopDeck', to: 'cargoDeck' })

mapConnections.push({ from: 'bridgeDeckCabin04Back', to: 'bridgeDeck05Back' });
mapConnections.push({ from: 'bridgeDeck11Back', to: 'mainDeck12Back' });

task({
    key: 'wheel',
    position: new Vector2(375, 1016),
    depth: 1.01,
    connections: ['bridgeDeck08Back', 'bridgeDeck08', 'bridgeDeck07Back', 'bridgeDeck07']
});


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
        // {
        //     name: "Dave",
        //     tasks: [
        //         new EatTask({ start: 0, end: 1, location: $.mapManager.getLocation("gunDeck04") }),
        //         new EngineTask({ start: 2, end: 10, location: $.mapManager.getLocation("bridgeDeck02") }),
        //         new ShowerTask({ start: 10, end: 11, location: $.mapManager.getLocation("bridgeDeckCabin00") }),
        //         new SleepTask({ start: 15, end: 23, location: $.mapManager.getLocation("orlopDeck04") }),
        //         new EatTask({ start: 23, end: 24, location: $.mapManager.getLocation("gunDeck04") }),
        //     ],
        // },
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