import { CQuick } from "./canvas/cr";
import { SubCanvas } from "./canvas/subCanvas";
import { Vector2 } from "./math/vector2";

export interface LayerAssetProps {
    url: string;
    key: string;
    fromIndex: number;
    toIndex: number;
    extention: string;
    position: Vector2;
    originalSize: Vector2;
    scale: number;
    drawScale: number;
    depth: number;
    increment: number;

    onRender?: (subCanvas: SubCanvas, position: Vector2, scale: number, drawScale: number) => void;
    preTransform?: (that: CQuick) => void;

}

export class LayerAsset {
    constructor({ url, key, fromIndex, toIndex, extention, position, originalSize, scale, drawScale, depth, increment, onRender, preTransform }: LayerAssetProps) {
        for (let i = fromIndex; i < toIndex; i++) {
            void $.loader.loadImage(url + String(i).padStart(4, '0') + extention).then((image) => {
                const subCanvas = new SubCanvas(originalSize.multiply(scale));
                subCanvas.draw.image(image, new Vector2(0, 0), originalSize.multiply(scale));
                $.camera.addToZoomLayer(depth + i * increment, key + i, new CQuick({
                    onPreTransform: preTransform,
                    onRender: () => {
                        if (onRender) {
                            onRender(subCanvas, position, scale, drawScale);
                        }
                        $.canvas.draw.canvas(subCanvas, position, drawScale / scale);
                    }
                }), 1);
            });
        }
    }
}
