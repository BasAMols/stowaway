import { Utils } from "src/game/util/math/util";
import { Vector2 } from "src/game/util/math/vector2";
import { ShipPart } from "../../ship";
import { MathUtil } from "src/game/util/math/math";
import { BaseCanvas } from "src/game/util/canvas/baseCanvas";


export class AreaManager {
    areas: {
        points: Vector2[];
        opacity: number;
        active: boolean;
    }[] = [];
    constructor() {

        ([
            [[0, 840], [230, 900], [300, 920], [400, 920], [400, 980], [230, 980], [230, 950], [0, 940]],
            [[410, 920], [1200, 920], [1200, 1020], [550, 1020], [550, 980], [410, 980]],
            [[0, 987], [375, 987], [375, 1089], [0, 1089]],
            [[325, 987], [532, 987], [532, 1025], [700, 1025], [700, 1089], [325, 1089]],
            [[650, 1025], [900, 1025], [900, 1089], [650, 1089]],
            [[750, 1025], [1000, 1025], [1000, 1089], [750, 1089]],
            [[850, 1025], [1100, 1025], [1100, 1089], [850, 1089]],
            [[950, 1025], [1200, 1025], [1200, 1089], [950, 1089]],
            [[1050, 1025], [1350, 1025], [1350, 1089], [1050, 1089]],
            [[150, 1095], [400, 1095], [400, 1152], [150, 1152]],
            [[350, 1095], [500, 1095], [500, 1152], [350, 1152]],
            [[450, 1095], [600, 1095], [600, 1152], [450, 1152]],
            [[550, 1095], [700, 1095], [700, 1152], [550, 1152]],
            [[650, 1095], [800, 1095], [800, 1152], [650, 1152]],
            [[750, 1095], [900, 1095], [900, 1152], [750, 1152]],
            [[850, 1095], [1000, 1095], [1000, 1152], [850, 1152]],
            [[950, 1095], [1100, 1095], [1100, 1152], [950, 1152]],
            [[1050, 1095], [1200, 1095], [1200, 1152], [1050, 1152]],
            [[1150, 1095], [1500, 1095], [1500, 1152], [1150, 1152]],
            [[300, 1165], [1300, 1165], [1300, 1222], [300, 1222]],
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