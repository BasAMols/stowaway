import { Utils } from "src/game/util/math/util";
import { Vector2 } from "src/game/util/math/vector2";
import { ShipPart } from "../../ship";
import { MathUtil } from "src/game/util/math/math";
import { BaseCanvas } from "src/game/util/canvas/baseCanvas";

export class AreaManager {
    areas: Record<string, {
        polygon: Vector2[];
        opacity: number;
    }> = {
            'captain': { polygon: [new Vector2(0, 1680), new Vector2(460, 1800), new Vector2(600, 1840), new Vector2(800, 1840), new Vector2(800, 1960), new Vector2(460, 1960), new Vector2(460, 1900), new Vector2(0, 1880)], opacity: 0, },
            'gun1': { polygon: [new Vector2(0, 1975), new Vector2(750, 1975), new Vector2(750, 2180), new Vector2(0, 2180)], opacity: 0, },
            'gun2': { polygon: [new Vector2(650, 1975), new Vector2(1065, 1975), new Vector2(1065, 2050), new Vector2(1400, 2050), new Vector2(1400, 2180), new Vector2(650, 2180)], opacity: 0, },
            'gun3': { polygon: [new Vector2(1300, 2050), new Vector2(1800, 2050), new Vector2(1800, 2180), new Vector2(1300, 2180)], opacity: 0, },
            'gun3a': { polygon: [new Vector2(1500, 2050), new Vector2(2000, 2050), new Vector2(2000, 2180), new Vector2(1500, 2180)], opacity: 0, },
            'gun4': { polygon: [new Vector2(1700, 2050), new Vector2(2200, 2050), new Vector2(2200, 2180), new Vector2(1700, 2180)], opacity: 0, },
            'gun4a': { polygon: [new Vector2(1900, 2050), new Vector2(2400, 2050), new Vector2(2400, 2180), new Vector2(1900, 2180)], opacity: 0, },
            'gun5': { polygon: [new Vector2(2100, 2050), new Vector2(2700, 2050), new Vector2(2700, 2180), new Vector2(2100, 2180)], opacity: 0, },
            'orlop1a': { polygon: [new Vector2(300, 2190), new Vector2(800, 2190), new Vector2(800, 2305), new Vector2(300, 2305)], opacity: 0, },
            'orlop2a': { polygon: [new Vector2(700, 2190), new Vector2(1000, 2190), new Vector2(1000, 2305), new Vector2(700, 2305)], opacity: 0, },
            'orlop3': { polygon: [new Vector2(900, 2190), new Vector2(1200, 2190), new Vector2(1200, 2305), new Vector2(900, 2305)], opacity: 0, },
            'orlop3a': { polygon: [new Vector2(1100, 2190), new Vector2(1400, 2190), new Vector2(1400, 2305), new Vector2(1100, 2305)], opacity: 0, },
            'orlop4': { polygon: [new Vector2(1300, 2190), new Vector2(1600, 2190), new Vector2(1600, 2305), new Vector2(1300, 2305)], opacity: 0, },
            'orlop4a': { polygon: [new Vector2(1500, 2190), new Vector2(1800, 2190), new Vector2(1800, 2305), new Vector2(1500, 2305)], opacity: 0, },
            'orlop5': { polygon: [new Vector2(1700, 2190), new Vector2(2000, 2190), new Vector2(2000, 2305), new Vector2(1700, 2305)], opacity: 0, },
            'orlop5a': { polygon: [new Vector2(1900, 2190), new Vector2(2200, 2190), new Vector2(2200, 2305), new Vector2(1900, 2305)], opacity: 0, },
            'orlop6': { polygon: [new Vector2(2100, 2190), new Vector2(2400, 2190), new Vector2(2400, 2305), new Vector2(2100, 2305)], opacity: 0, },
            'orlop7': { polygon: [new Vector2(2300, 2190), new Vector2(3000, 2190), new Vector2(3000, 2305), new Vector2(2300, 2305)], opacity: 0, },
            'cargo': { polygon: [new Vector2(600, 2190 + 140), new Vector2(2600, 2190 + 140), new Vector2(2600, 2305 + 140), new Vector2(600, 2305 + 140)], opacity: 0, },
        }
    constructor() {


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
            if (Utils.pointInPolygon(p, area[1].polygon)) {
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
            if (area.opacity > 0) {
                canvas.ctx.globalAlpha = area.opacity;
                canvas.save();
                canvas.move(offset);
                canvas.mask.polygon(area.polygon, false);
                canvas.restore();
                canvas.ctx.globalAlpha = 1;
            }
        });
    }
}