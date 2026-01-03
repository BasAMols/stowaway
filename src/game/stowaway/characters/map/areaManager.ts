import { Utils } from "src/game/util/math/util";
import { Vector2 } from "src/game/util/math/vector2";
import { ShipPart } from "../../ship";
import { MathUtil } from "src/game/util/math/math";
import { BaseCanvas } from "src/game/util/canvas/baseCanvas";



function squareMask(top: number, bottom: number, left: number, right: number): [number, number][] {
    return [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
    ];
}
function repeatMask(x: number, y: number, size: Vector2, count: number, overlap: number) {
    const masks: [number, number][][] = [];

    for (let i = 0; i < count; i++) {
        masks.push(squareMask(y, y + size.y, x + (i * size.x), x + (i * size.x) + size.x));
    }
    if (overlap > 0) {
        for (let i = 1; i < count; i++) {
            masks.push(squareMask(y, y + size.y, x + i * size.x - overlap, x + i * size.x + overlap));
        }
    }
    return masks;
}

export class AreaManager {
    areas: {
        points: Vector2[];
        opacity: number;
        active: boolean;
    }[] = [];
    constructor() {

        ([
            // top deck
            [[70, 840], [240, 840], [300, 870], [400, 870], [400, 917], [275, 917], [240, 880], [70, 880]], // Top deck

            // captain's quarters
            [[70, 890], [230, 890], [268, 925], [398, 925], [400, 978], [235, 978], [200, 948], [70, 948]], // captain
            [[350, 925], [550, 925], [550, 978], [350, 978]], // captain Door
            [[72, 955], [197, 955], [220, 975], [180, 1010], [107, 1010]], // burrow

            // main deck
            [[406, 890], [420, 890], [480, 940], [1202, 940], [1202, 1020], [535, 1020], [535, 978], [406, 978]], // deck

            // gun deck
            [[110, 1020], [200 - 10, 1020], [235 - 10, 990], [350, 990], [350, 1089], [130, 1089]],
            [[300, 990], [400, 990], [400, 1089], [300, 1089],],
            [[350, 990], [500, 990], [530, 1025], [600, 1025], [600, 1089], [350, 1089]],
            ...repeatMask(550, 1025, new Vector2(100, 64), 7, 50),
            [[1200, 1025], [1390, 1025], [1375, 1089], [1200, 1089]],

            // orlop deck
            [[131, 1095], [250, 1095], [250, 1153], [150, 1153]],
            ...repeatMask(200, 1095, new Vector2(100, 58), 10, 50),
            [[1200, 1095], [1370, 1095], [1320, 1153], [1200, 1153]],

            // cargo deck
            ...repeatMask(200, 1158, new Vector2(100, 64), 10, 50),
            [[1200, 1158], [1310, 1158], [1310, 1222], [1200, 1222]],

        ] as [number, number][][]).forEach((area) => {
            this.areas.push({
                points: area.map(point => new Vector2(
                    point[0] * ShipPart.shipScale,
                    point[1] * ShipPart.shipScale
                )),
                opacity: 0,
                active: false,
            });
        });

    }
    target(position: Vector2): [Vector2, number] | undefined {
        const target = Object.entries($.mapManager.locations)
            .sort((a, b) => a[1].data.position.subtract(position).magnitude() - b[1].data.position.subtract(position).magnitude())[0];

        if (!target) return undefined;

        const p = target[1].data.position.clone()
        return [p, target[1].data.depth];
    }
    checkRooms(position: Vector2) {
        const p = position.clone().subtract(ShipPart.offset).multiply(ShipPart.shipScale);
        this.areas.forEach(area => {
            area.active = Utils.pointInPolygon(p, area.points);
        });
    }
    focus: Vector2 = new Vector2(0, 0);
    tick() {
        this.checkRooms(this.focus);
        this.areas.forEach(area => {
            if (area.active) {
                area.opacity = MathUtil.clamp(area.opacity + $.tick.deltaTime * 0.003, 0, 1);
            } else {
                area.opacity = MathUtil.clamp(area.opacity - $.tick.deltaTime * 0.001, 0, 1);
            }
        });
    }
    mask(canvas: BaseCanvas, offset: Vector2) {
        this.areas.forEach(area => {
            if (area.opacity > 0 || $.flags.openAll) {
                canvas.ctx.globalAlpha = $.flags.openAll ? 1 : area.opacity;
                canvas.save();
                canvas.move(offset);
                canvas.mask.polygon(area.points, false);
                canvas.restore();
                canvas.ctx.globalAlpha = 1;
            }
        });
    }
}