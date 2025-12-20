import { Vector2 } from './vector2';

export class Transform2d {
    private _position: Vector2 = new Vector2(0, 0);
    private _rotation: number = 0; // in degrees
    private _scale: Vector2 = new Vector2(1, 1);
    private _anchor: Vector2 = new Vector2(0, 0); // normalized 0-1 or pixel values

    private _cachedMatrix: [number, number, number, number, number, number] | null = [1, 0, 0, 1, 0, 0];

    public constructor() {
    }

    public get position(): Vector2 {
        return this._position.clone();
    }

    public setPosition(value: number, y?: number): Transform2d;
    public setPosition(value: Vector2): Transform2d;
    public setPosition(value: Vector2 | number, y?: number) {
        if (typeof value === 'number') {
            this._position = new Vector2(value, y ?? value);
        } else {
            this._position = value.clone();
        }
        this._cachedMatrix = null;
        this.calculateMatrix();
        return this
    }

    public move(value: Vector2) {
        this._position = this._position.add(value);
        this._cachedMatrix = null;
        this.calculateMatrix();
        return this
    }

    public get rotation(): number {
        return this._rotation;
    }

    public setRotation(value: number) {
        this._rotation = value;
        this._cachedMatrix = null;
        this.calculateMatrix();
        return this
    }

    public rotate(value: number) {
        this._rotation = this._rotation + value;
        this._cachedMatrix = null;
        this.calculateMatrix();
        return this
    }

    public get scale(): Vector2 {
        return this._scale.clone();
    }

    public setScale(value: Vector2 | number) {
        if (typeof value === 'number') {
            this._scale = new Vector2(value, value);
        } else {
            this._scale = value.clone();
        }
        this._cachedMatrix = null;
        this.calculateMatrix();
        return this
    }


    public get anchor(): Vector2 {
        return this._anchor.clone();
    }

    public setAnchor(value: Vector2) {
        this._anchor = value.clone();
        this._cachedMatrix = null;
        this.calculateMatrix();
        return this
    }

    /**
     * Gets the anchor point in pixels.
     * If anchor values are between 0-1, they're treated as normalized (0-1 range).
     * Otherwise, they're treated as pixel values.
     */
    private getAnchorPoint(): Vector2 {
        return this._anchor;
    }

    /**
     * Calculates and caches the CSS transform matrix string.
     * The matrix combines: translation, rotation, and scale with proper anchor point handling.
     * 
     * Transformation order: T(-anchor) -> Scale -> Rotate -> T(anchor) -> T(position)
     * This ensures transformations occur around the anchor point, then the element is moved to position.
     */
    private calculateMatrix(): void {
        const anchorPoint = this.getAnchorPoint();
        const rotationRad = (this._rotation * Math.PI) / 180;
        const cos = Math.cos(rotationRad);
        const sin = Math.sin(rotationRad);
        const sx = this._scale.x;
        const sy = this._scale.y;

        const anchorX = anchorPoint.x;
        const anchorY = anchorPoint.y;

        // Matrix multiplication: T(position) * T(anchor) * R * S * T(-anchor)
        // CSS matrix format: matrix(a, b, c, d, e, f) represents:
        // [a c e]
        // [b d f]
        // [0 0 1]

        // Calculate rotation-scale matrix: R * S
        const a = sx * cos;
        const b = sx * sin;
        const c = -sy * sin;
        const d = sy * cos;

        // Apply anchor point transformation
        // Matrix chain: T(position) * T(anchor) * R * S * T(-anchor)
        // After R*S*T(-anchor): translation = (-sx*anchorX*cos + sy*anchorY*sin, -sx*anchorX*sin - sy*anchorY*cos)
        // After T(anchor): add anchor back = (anchorX - sx*anchorX*cos + sy*anchorY*sin, anchorY - sx*anchorX*sin - sy*anchorY*cos)
        // After T(position): add position = (px + anchorX - sx*anchorX*cos + sy*anchorY*sin, py + anchorY - sx*anchorX*sin - sy*anchorY*cos)
        // Note: c = -sy*sin, so -anchorY*c = sy*anchorY*sin (positive)
        const e = this._position.x + anchorX - (anchorX * a) - (anchorY * c);
        const f = this._position.y + anchorY - (anchorX * b) - (anchorY * d);

        this._cachedMatrix = [a, b, c, d, e, f];
    }

    apply(ctx: CanvasRenderingContext2D) {
        if (this._cachedMatrix) {
            ctx.transform(...this._cachedMatrix);
        }
    }

}