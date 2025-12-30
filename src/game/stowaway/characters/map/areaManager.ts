import { Utils } from "src/game/util/math/util";
import { Vector2 } from "src/game/util/math/vector2";
import { ShipPart } from "../../ship";
import { MathUtil } from "src/game/util/math/math";
import { BaseCanvas } from "src/game/util/canvas/baseCanvas";


export class AreaManager {
    areas: Record<string, {
        points: [number, number][];
        opacity: number;
    }> = {

            'captain': { points: [[0, 840], [230, 900], [300, 920], [400, 920], [400, 980], [230, 980], [230, 950], [0, 940]], opacity: 0, },
            'deck': { points: [[410, 920], [1200, 920], [1200, 1020], [550, 1020], [550, 980], [410, 980]], opacity: 0, },
            'gun1': { points: [[0, 987], [375, 987], [375, 1089], [0, 1089]], opacity: 0, },
            'gun2': { points: [[325, 987], [532, 987], [532, 1025], [700, 1025], [700, 1089], [325, 1089]], opacity: 0, },
            'gun3': { points: [[650, 1025], [900, 1025], [900, 1089], [650, 1089]], opacity: 0, },
            'gun3a': { points: [[750, 1025], [1000, 1025], [1000, 1089], [750, 1089]], opacity: 0, },
            'gun4': { points: [[850, 1025], [1100, 1025], [1100, 1089], [850, 1089]], opacity: 0, },
            'gun4a': { points: [[950, 1025], [1200, 1025], [1200, 1089], [950, 1089]], opacity: 0, },
            'gun5': { points: [[1050, 1025], [1350, 1025], [1350, 1089], [1050, 1089]], opacity: 0, },
            'orlop1a': { points: [[150, 1095], [400, 1095], [400, 1152], [150, 1152]], opacity: 0, },
            'orlop2a': { points: [[350, 1095], [500, 1095], [500, 1152], [350, 1152]], opacity: 0, },
            'orlop3': { points: [[450, 1095], [600, 1095], [600, 1152], [450, 1152]], opacity: 0, },
            'orlop3a': { points: [[550, 1095], [700, 1095], [700, 1152], [550, 1152]], opacity: 0, },
            'orlop4': { points: [[650, 1095], [800, 1095], [800, 1152], [650, 1152]], opacity: 0, },
            'orlop4a': { points: [[750, 1095], [900, 1095], [900, 1152], [750, 1152]], opacity: 0, },
            'orlop5': { points: [[850, 1095], [1000, 1095], [1000, 1152], [850, 1152]], opacity: 0, },
            'orlop5a': { points: [[950, 1095], [1100, 1095], [1100, 1152], [950, 1152]], opacity: 0, },
            'orlop6': { points: [[1050, 1095], [1200, 1095], [1200, 1152], [1050, 1152]], opacity: 0, },
            'orlop7': { points: [[1150, 1095], [1500, 1095], [1500, 1152], [1150, 1152]], opacity: 0, },
            'cargo': { points: [[300, 1165], [1300, 1165], [1300, 1222], [300, 1222]], opacity: 0, },
        }
    constructor() {
        Object.entries(this.areas).forEach(([key, area]) => {
            area.points.map(point => {
                point[0] = point[0] * ShipPart.shipScale;
                point[1] = point[1] * ShipPart.shipScale;
            });
        });

    }
    target(position: Vector2): Vector2 | undefined {
        const target = Object.entries($.mapManager.locations)
            .filter(location => location[1].data.position.y > position.y)
            .sort((a, b) => a[1].data.position.subtract(position).magnitude() - b[1].data.position.subtract(position).magnitude())[0];

        if (!target) return undefined;

        const p = target[1].data.position.clone()
        p.x = position.x
        return p;
    }
    findRoom(position: Vector2): string[] | undefined {
        const p = position.clone().subtract(ShipPart.offset).multiply(ShipPart.shipScale);
        const keys: string[] = [];
        Object.entries(this.areas).forEach(area => {
            if (Utils.pointInPolygon(p, area[1].points)) {
                keys.push(area[0]);
            }
        });
        return keys;

        // const target = Object.entries($.mapManager.locations)
        //     .filter(location => location[1].data.position.y > position.y)
        //     .sort((a, b) => a[1].data.position.subtract(position).magnitude() - b[1].data.position.subtract(position).magnitude())[0];

        // if (!target) return undefined;

        // return target[0];
    }
    focus: Vector2 = new Vector2(0, 0);
    tick() {
        // const keys = $.areaManager.findRoom(this.pc.transform.position);
        // console.log(this.focus);

        const keys = this.findRoom(this.focus);
        Object.entries(this.areas).forEach(([key, area]) => {
            const active = keys?.includes(key) ?? false;
            if (active) {
                area.opacity = MathUtil.clamp(area.opacity + $.tick.deltaTime * 0.003, 0, 1);
                // area.opacity = 1;
            } else {
                area.opacity = MathUtil.clamp(area.opacity - $.tick.deltaTime * 0.001, 0, 1);
                // area.opacity = 0;
            }
        });
    }
    mask(canvas: BaseCanvas, offset: Vector2) {
        Object.values(this.areas).forEach(area => {
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