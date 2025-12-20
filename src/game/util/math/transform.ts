import { Vector2 } from './vector2';

export class Transform2d {
    private _position: Vector2 = new Vector2(0, 0);
    private _rotation: number = 0; // in degrees
    private _scale: Vector2 = new Vector2(1, 1);
    private _anchor: Vector2 = new Vector2(0, 0); // pixel values

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
        return this
    }

    public move(value: Vector2) {
        this._position = this._position.add(value);
        return this
    }

    public get rotation(): number {
        return this._rotation;
    }

    public setRotation(value: number) {
        this._rotation = value;
        return this
    }

    public rotate(value: number) {
        this._rotation = this._rotation + value;
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
        return this
    }

    public get anchor(): Vector2 {
        return this._anchor.clone();
    }

    public setAnchor(value: Vector2) {
        this._anchor = value.clone();
        return this
    }

    /**
     * Applies the transform to the canvas context.
     * 
     * Transformation order for proper anchor point handling:
     * 1. Translate to position (moves the element to its local position)
     * 2. Translate to anchor point (moves origin to where rotation/scale should happen)
     * 3. Rotate around anchor
     * 4. Scale around anchor
     * 5. Translate back by negative anchor (so drawing at 0,0 is relative to element's origin)
     * 
     * This ensures:
     * - Position is independent of anchor point
     * - Rotation and scaling occur around the anchor point
     * - Drawing at local (0,0) draws from the element's top-left corner
     */
    apply(ctx: CanvasRenderingContext2D) {
        // 1. Translate to position (moves element to its local position)
        ctx.translate(this._position.x, this._position.y);

        // 2. Translate to anchor point (so rotation/scale happen around it)
        ctx.translate(this._anchor.x, this._anchor.y);

        // 3. Rotate (in radians) - rotates around the anchor point
        const rotationRad = (this._rotation * Math.PI) / 180;
        ctx.rotate(rotationRad);

        // 4. Scale - scales around the anchor point
        ctx.scale(this._scale.x, this._scale.y);

        // 5. Translate back by negative anchor (so 0,0 is the element's origin)
        ctx.translate(-this._anchor.x, -this._anchor.y);
    }

    /**
     * Calculates the combined world transform from an array of transforms.
     * The array should be ordered from child to parent (as returned by CVE.transforms).
     * 
     * @param transforms Array of transforms from child to parent
     * @returns Object containing world position (of origin), anchor position (in world space), rotation (degrees), and scale
     */
    static calculateWorldTransform(transforms: Transform2d[]): {
        position: Vector2;
        anchorPosition: Vector2;
        rotation: number;
        scale: Vector2;
    } {
        if (transforms.length === 0) {
            return {
                position: new Vector2(0, 0),
                anchorPosition: new Vector2(0, 0),
                rotation: 0,
                scale: new Vector2(1, 1)
            };
        }

        // Start with the first (innermost child) transform
        const childTransform = transforms[0];
        let worldPosition = childTransform.position.clone();
        // Transform anchor offset through child's own rotation and scale first
        const childRotationRad = (childTransform.rotation * Math.PI) / 180;
        const childCos = Math.cos(childRotationRad);
        const childSin = Math.sin(childRotationRad);
        const childAnchor = childTransform.anchor;
        let worldAnchorOffset = new Vector2(
            (childAnchor.x * childCos - childAnchor.y * childSin) * childTransform.scale.x,
            (childAnchor.x * childSin + childAnchor.y * childCos) * childTransform.scale.y
        );
        let worldRotation = childTransform.rotation;
        let worldScale = childTransform.scale.clone();

        // Process from child (first) to parent (last) to build up world transform
        // transforms[0] is the innermost child, transforms[length-1] is the root parent
        for (let i = 1; i < transforms.length; i++) {
            const parentTransform = transforms[i];
            const parentPos = parentTransform.position;
            const parentRotation = parentTransform.rotation;
            const parentScale = parentTransform.scale;

            // Convert parent rotation to radians for calculations
            const parentRotationRad = (parentRotation * Math.PI) / 180;
            const cos = Math.cos(parentRotationRad);
            const sin = Math.sin(parentRotationRad);

            // Transform origin position through parent's transform
            const rotatedOriginX = worldPosition.x * cos - worldPosition.y * sin;
            const rotatedOriginY = worldPosition.x * sin + worldPosition.y * cos;
            const scaledOriginX = rotatedOriginX * parentScale.x;
            const scaledOriginY = rotatedOriginY * parentScale.y;
            worldPosition = new Vector2(
                scaledOriginX + parentPos.x,
                scaledOriginY + parentPos.y
            );

            // Transform anchor offset through parent's rotation and scale
            // (but don't add parent position - it's an offset, not an absolute position)
            const rotatedAnchorX = worldAnchorOffset.x * cos - worldAnchorOffset.y * sin;
            const rotatedAnchorY = worldAnchorOffset.x * sin + worldAnchorOffset.y * cos;
            worldAnchorOffset = new Vector2(
                rotatedAnchorX * parentScale.x,
                rotatedAnchorY * parentScale.y
            );

            // Add rotation (degrees) - rotations are additive
            worldRotation += parentRotation;

            // Multiply scale - scales are multiplicative
            worldScale = new Vector2(
                worldScale.x * parentScale.x,
                worldScale.y * parentScale.y
            );
        }

        // The anchor position is the world position plus the transformed anchor offset
        const worldAnchorPos = worldPosition.add(worldAnchorOffset);

        return {
            position: worldPosition,
            anchorPosition: worldAnchorPos,
            rotation: worldRotation,
            scale: worldScale
        };
    }

}