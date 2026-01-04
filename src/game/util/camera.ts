import { CVE } from "./canvas/cve";
import { MathUtil } from "./math/math";
import { Utils } from "./math/util";
import { Vector2 } from "./math/vector2";
import { Mouse } from "./mouse";

export class Camera {

    mouse: Mouse;
    zoomLayers: Record<string, {
        parallax: number;
        element: CVE;
    }> = {};

    dynamicLayers: Record<string, {
        parallax: number;
        element: CVE;
    }> = {};

    public focus: Vector2 = new Vector2(0, 0);

    // Camera easing parameters
    public enableEasing: boolean = false; // Enable smooth camera movement with easing (false = direct focus value)
    public speed: number = 6000; // Units per second - controls overall responsiveness
    public snapThreshold: number = 10; // Distance threshold for snapping to target (0 = disabled)

    public sway: number = 0.5;
    public swaySpeed: number = 0.0009;
    rotationalSway: number = 2;
    rotationalSwaySpeed: number = 0.0001;

    // Internal smoothed position and velocity
    private _smoothedPosition: Vector2 = new Vector2(0, 0);
    private _velocity: Vector2 = new Vector2(0, 0);
    private _initialized: boolean = false;

    static worldArea: Vector2 = new Vector2(5000, 1800);
    static gameArea: Vector2 = new Vector2(1920, 1800);

    constructor() {

        this.mouse = new Mouse($.canvas, this);
        this.mouse.addScrollListener((delta) => {
            $.values.zoom = MathUtil.clamp($.values.zoom + (delta * -0.0002 * $.values.zoom), 1.6, 40);
        });
        this.mouse.addDragListener((delta) => {
            this.focus = this.focus.add(delta.multiply(-1 / $.values.zoom / 0.9)).clamp(new Vector2(0, 0), new Vector2(3840, 1350));
        });
    }

    private addZoomLayer(key: string, parallax: number) {
        this.zoomLayers[key] = {
            parallax: parallax,
            element: new CVE(),
        }
    }

    addToDynamicLayer(key: string, element: CVE, order: number = 1) {
        element.add(key, this.dynamicLayers[key].element, 1);
    }

    createDynamicLayer(key: string, parallax: number, element: CVE, order: number = 1) {
        this.dynamicLayers[key] = {
            parallax: parallax,
            element: new CVE(),
        }
        this.addToDynamicLayer(key, element, order);
    }

    setDynamicLayerParallax(key: string, parallax: number) {
        this.dynamicLayers[key].parallax = parallax;
    }

    addToZoomLayer(parallax: number, name: string, element: CVE, order: number = 1) {

        const key = 'p' + parallax;
        if (!this.zoomLayers[key]) {
            this.addZoomLayer(key, parallax);
        }
        element.add(name, this.zoomLayers[key].element, order);
    }

    calculateWorldSpace(screenSpace: Vector2, parallax: number = 1) {
        const windowArea = $.container;
        const worldArea = new Vector2(3840, 1350);
        const gameArea = new Vector2(1920, 1350);

        // Calculate base scale so that at zoom=1, the entire gameArea fits in windowArea
        const baseScale = Math.min(windowArea.x / gameArea.x, windowArea.y / gameArea.y);

        // Calculate the scale for parallax=1 (main action plane - 'ship' layer)
        const parallaxOneScale = baseScale * $.values.zoom;

        // Screen center point
        const screenCenter = windowArea.divide(2);

        // Get current smoothed focus (same calculation as in tick)
        let currentFocus = this._smoothedPosition;
        if (!this._initialized) {
            currentFocus = this.focus;
        }

        // Convert focus from gameArea coordinates to worldArea coordinates
        const gameAreaToWorldOffset = worldArea.subtract(gameArea).divide(2);
        const focusInWorld = currentFocus.add(gameAreaToWorldOffset);

        // Calculate the visible area in world coordinates based on current zoom
        const visibleAreaInWorld = windowArea.divide(parallaxOneScale);

        // Clamp the focus point so we never see outside worldArea
        const minFocusX = visibleAreaInWorld.x / 2;
        const maxFocusX = worldArea.x - visibleAreaInWorld.x / 2;
        const minFocusY = visibleAreaInWorld.y / 2;
        const maxFocusY = worldArea.y - visibleAreaInWorld.y / 2;

        const clampedFocusInWorld = new Vector2(
            Math.max(minFocusX, Math.min(maxFocusX, focusInWorld.x)),
            Math.max(minFocusY, Math.min(maxFocusY, focusInWorld.y))
        );

        // Convert back to gameArea coordinates for positioning calculations
        const clampedFocus = clampedFocusInWorld.subtract(gameAreaToWorldOffset);

        // Handle static layers (parallax=0) - they don't transform
        if (parallax === 0) {
            // Static layers are drawn at window size, so screen space = world space
            return screenSpace;
        }

        // For parallax=1, use the optimized formula
        if (parallax === 1) {
            // Reverse the transformation: screen space -> world space
            // For parallax=1: screenPos = (worldPos - clampedFocus) * parallaxOneScale + screenCenter
            // Therefore: worldPos = (screenPos - screenCenter) / parallaxOneScale + clampedFocus
            const offsetFromScreenCenter = screenSpace.subtract(screenCenter);
            const worldSpace = offsetFromScreenCenter.divide(parallaxOneScale).add(clampedFocus);
            return worldSpace;
        }

        // For other parallax values, calculate layer-specific scale and position
        // This matches the calculation in tick() for layers with the specified parallax
        const layerScale = baseScale * (1 + ($.values.zoom - 1) * parallax);
        const focusInScreenSpace = clampedFocus.multiply(parallaxOneScale);
        const offsetToCenter = screenCenter.subtract(focusInScreenSpace);
        const layerPosition = offsetToCenter.multiply(parallax);

        // Reverse the transformation: screen space -> world space
        // The forward transformation for a layer with parallax p:
        // screenPos = worldPos * layerScale + layerPosition
        // Therefore: worldPos = (screenPos - layerPosition) / layerScale
        const worldSpace = screenSpace.subtract(layerPosition).divide(layerScale);

        return worldSpace;
    }

    translateCoordinate(coordinate: Vector2, from: number, to: number): Vector2 {
        // If both parallax values are the same, no transformation needed
        if (from === to) {
            return coordinate.clone();
        }

        const windowArea = $.container;

        // Calculate base scale so that at zoom=1, the entire gameArea fits in windowArea
        const baseScale = Math.min(windowArea.x / Camera.gameArea.x, windowArea.y / Camera.gameArea.y);

        // Calculate the scale for parallax=1 (main action plane - 'ship' layer)
        const parallaxOneScale = baseScale * $.values.zoom;

        // Screen center point
        const screenCenter = windowArea.divide(2);

        // Get current smoothed focus (same calculation as in tick)
        let currentFocus = this._smoothedPosition;
        if (!this._initialized) {
            currentFocus = this.focus;
        }

        // Convert focus from gameArea coordinates to worldArea coordinates
        const gameAreaToWorldOffset = Camera.worldArea.subtract(Camera.gameArea).divide(2);
        const focusInWorld = currentFocus.add(gameAreaToWorldOffset);

        // Calculate the visible area in world coordinates based on current zoom
        const visibleAreaInWorld = windowArea.divide(parallaxOneScale);

        // Clamp the focus point so we never see outside worldArea
        const minFocusX = visibleAreaInWorld.x / 2;
        const maxFocusX = Camera.worldArea.x - visibleAreaInWorld.x / 2;
        const minFocusY = visibleAreaInWorld.y / 2;
        const maxFocusY = Camera.worldArea.y - visibleAreaInWorld.y / 2;

        const clampedFocusInWorld = new Vector2(
            Math.max(minFocusX, Math.min(maxFocusX, focusInWorld.x)),
            Math.max(minFocusY, Math.min(maxFocusY, focusInWorld.y))
        );

        // Convert back to gameArea coordinates for positioning calculations
        const clampedFocus = clampedFocusInWorld.subtract(gameAreaToWorldOffset);

        // Helper function to get layer transform values for a given parallax
        const getLayerTransform = (parallax: number) => {
            if (parallax === 0) {
                // Static layers don't transform
                return { scale: 1, position: new Vector2(0, 0) };
            }
            const layerScale = baseScale * (1 + ($.values.zoom - 1) * parallax);
            const focusInScreenSpace = clampedFocus.multiply(parallaxOneScale);
            const offsetToCenter = screenCenter.subtract(focusInScreenSpace);
            const layerPosition = offsetToCenter.multiply(parallax);
            return { scale: layerScale, position: layerPosition };
        };

        // Step 1: Convert from 'from' parallax world space to screen space
        const fromTransform = getLayerTransform(from);
        let screenSpace: Vector2;

        if (from === 0) {
            // Static layer: world space = screen space
            screenSpace = coordinate.clone();
        } else {
            // Forward transform: screenPos = worldPos * layerScale + layerPosition
            screenSpace = coordinate.multiply(fromTransform.scale).add(fromTransform.position);
        }

        // Step 2: Convert from screen space to 'to' parallax world space
        const toTransform = getLayerTransform(to);
        let worldSpace: Vector2;

        if (to === 0) {
            // Static layer: screen space = world space
            worldSpace = screenSpace.clone();
        } else {
            // Reverse transform: worldPos = (screenPos - layerPosition) / layerScale
            worldSpace = screenSpace.subtract(toTransform.position).divide(toTransform.scale);
        }

        return worldSpace;
    }

    tick() {
        // Initialize smoothed position on first tick
        if (!this._initialized) {
            this._smoothedPosition = this.focus.clone();
            this._initialized = true;
        }

        // Update smoothed position with easing and velocity (if enabled)
        if (this.enableEasing) {
            this._updateSmoothedPosition();
        } else {
            // Use focus directly when easing is disabled
            const swayAmount = this.sway * ($.flags.debug ? 0 : 1) * (40 / $.values.zoom);
            this._smoothedPosition = this.focus.clone().add(new Vector2(Math.sin($.tick.elapsedTime * this.swaySpeed) * swayAmount * 2 - swayAmount, Math.sin($.tick.elapsedTime * this.swaySpeed * 0.5) * swayAmount * 2 - swayAmount));
            this._velocity = new Vector2(0, 0);
        }

        const windowArea = $.container;

        // Calculate base scale so that at zoom=1, the entire gameArea fits in windowArea
        const baseScale = Math.min(windowArea.x / Camera.gameArea.x, windowArea.y / Camera.gameArea.y);

        // Screen center point
        const screenCenter = windowArea.divide(2);

        // Calculate the scale for parallax=1 (main action plane)
        // This is what we use to transform the focus point
        const parallaxOneScale = baseScale * $.values.zoom;

        // Calculate the visible area in world coordinates based on current zoom
        // This is how much of the world we can see at the current zoom level
        const visibleAreaInWorld = windowArea.divide(parallaxOneScale);

        // Convert smoothed position from gameArea coordinates to worldArea coordinates
        // gameArea is centered in worldArea, so offset is half the difference
        const gameAreaToWorldOffset = Camera.worldArea.subtract(Camera.gameArea).divide(2);
        const focusInWorld = this._smoothedPosition.add(gameAreaToWorldOffset);

        // Clamp the focus point so we never see outside worldArea
        // We need to ensure the visible area (centered on focus) stays within worldArea bounds
        const minFocusX = visibleAreaInWorld.x / 2;
        const maxFocusX = Camera.worldArea.x - visibleAreaInWorld.x / 2;
        const minFocusY = visibleAreaInWorld.y / 2;
        const maxFocusY = Camera.worldArea.y - visibleAreaInWorld.y / 2;

        const clampedFocusInWorld = new Vector2(
            Math.max(minFocusX, Math.min(maxFocusX, focusInWorld.x)),
            Math.max(minFocusY, Math.min(maxFocusY, focusInWorld.y))
        );

        // Convert back to gameArea coordinates for positioning calculations
        const clampedFocus = clampedFocusInWorld.subtract(gameAreaToWorldOffset);


        [...Object.values(this.zoomLayers), ...Object.values(this.dynamicLayers)].forEach((layer) => {
            if (layer.parallax === 0) {
                // Static layers (parallax=0) should not be affected by camera at all
                // They draw at window size and don't move or scale
                layer.element.transform.setPosition(0, 0);
                layer.element.transform.setScale(1);
            } else {
                // Calculate scale: baseScale ensures gameArea fits at zoom=1
                // Parallax affects how much the zoom affects this layer
                // At parallax=1: scale = baseScale * zoom (full zoom effect)
                const layerScale = baseScale * (1 + ($.values.zoom - 1) * layer.parallax);

                // Calculate position: at parallax=1, focus point should be centered on screen
                // The clamped focus is in gameArea coordinates (converted from worldArea after clamping)
                // We use the clamped focus to ensure we never show content outside worldArea bounds
                // 1. Transform clamped focus to screen space using parallax=1 scale
                // 2. Calculate offset needed to center it
                // 3. Apply parallax to determine how much this layer moves
                // At parallax=1: position = screenCenter - clampedFocus * parallaxOneScale (focus centered)
                // At parallax=0: position = 0 (no movement)
                const focusInScreenSpace = clampedFocus.multiply(parallaxOneScale);
                const offsetToCenter = screenCenter.subtract(focusInScreenSpace);
                const layerPosition = offsetToCenter.multiply(layer.parallax);

                layer.element.transform.setPosition(layerPosition);
                layer.element.transform.setScale(layerScale);
            }
        });

    }

    private _updateSmoothedPosition() {
        const deltaTime = $.tick.deltaTime / 1000; // Convert to seconds

        // Calculate distance to target
        const distance = this.focus.subtract(this._smoothedPosition);
        const distanceMagnitude = distance.magnitude();

        // Calculate direction to target
        const directionToTarget = distanceMagnitude > 0.001
            ? distance.normalise()
            : new Vector2(0, 0);

        // Get current velocity
        const velocityMagnitude = this._velocity.magnitude();
        const currentDirection = velocityMagnitude > 0.1
            ? this._velocity.normalise()
            : new Vector2(0, 0);
        const movingTowardsTarget = currentDirection.dot(directionToTarget) > 0;

        // Calculate stopping distance based on current velocity
        // Using v^2 = 2as, so s = v^2 / (2a)
        const decelerationRate = this.speed * 2.5; // Deceleration rate
        const stoppingDistance = (velocityMagnitude * velocityMagnitude) / (2 * decelerationRate);

        // Determine if we should decelerate (when close to target)
        const decelerationZone = Math.max(50, stoppingDistance * 1.5); // Start decelerating when within stopping distance
        const shouldDecelerate = distanceMagnitude < decelerationZone && movingTowardsTarget && velocityMagnitude > 0.1;

        // Snap to target if within threshold (only if snapThreshold > 0)
        if (this.snapThreshold > 0 && distanceMagnitude < this.snapThreshold && velocityMagnitude < 1) {
            this._smoothedPosition = this.focus.clone();
            this._velocity = new Vector2(0, 0);
            return;
        }

        // Calculate acceleration based on situation
        let acceleration: Vector2;

        if (shouldDecelerate) {
            // Decelerate smoothly as we approach target
            // Use a smooth deceleration curve based on distance
            const decelerationFactor = Math.min(1, distanceMagnitude / decelerationZone);

            // Gradually increase deceleration as we get closer
            // This creates a smooth ease-out effect
            const smoothDecelerationRate = decelerationRate * (0.5 + 0.5 * (1 - decelerationFactor));
            acceleration = currentDirection.multiply(-smoothDecelerationRate);

            // Apply a gentle pull towards target that increases as we get closer
            // This ensures we reach the target smoothly
            const pullStrength = (1 - decelerationFactor) * this.speed * 0.3;
            const pullAcceleration = directionToTarget.multiply(pullStrength);
            acceleration = acceleration.add(pullAcceleration);

            // If velocity is very low and we're close, apply stronger deceleration to stop smoothly
            if (velocityMagnitude < this.speed * 0.2 && distanceMagnitude < decelerationZone * 0.5) {
                const finalDeceleration = this.speed * 1.5;
                acceleration = acceleration.add(currentDirection.multiply(-finalDeceleration * (1 - decelerationFactor)));
            }
        } else if (movingTowardsTarget || velocityMagnitude < 0.1) {
            // Moving towards target or stationary: accelerate towards target
            const accelerationMagnitude = this.speed * 2; // Acceleration in units per second squared
            acceleration = directionToTarget.multiply(accelerationMagnitude);
        } else {
            // Moving away from target: decelerate first (opposite to current velocity)
            const decelerationMagnitude = this.speed * 3; // Stronger deceleration
            acceleration = currentDirection.multiply(-decelerationMagnitude);

            // Once we've slowed down enough, start accelerating towards target
            if (velocityMagnitude < this.speed * 0.1) {
                const accelerationMagnitude = this.speed * 2.5; // Slightly faster acceleration to catch up
                acceleration = directionToTarget.multiply(accelerationMagnitude);
            }
        }

        // Update velocity with acceleration
        this._velocity = this._velocity.add(acceleration.multiply(deltaTime));

        // Clamp velocity to maximum speed
        const newVelocityMagnitude = this._velocity.magnitude();
        const maxSpeed = this.speed;
        if (newVelocityMagnitude > maxSpeed * 1.5) {
            this._velocity = this._velocity.normalise().multiply(maxSpeed * 1.5);
        }

        // Update smoothed position with velocity
        this._smoothedPosition = this._smoothedPosition.add(this._velocity.multiply(deltaTime));

        // Soft overshoot prevention - gradually reduce velocity instead of snapping
        const newDistance = this.focus.subtract(this._smoothedPosition);
        const newDistanceMagnitude = newDistance.magnitude();
        if (newDistanceMagnitude > distanceMagnitude && movingTowardsTarget && distanceMagnitude < decelerationZone) {
            // We overshot while in deceleration zone - apply strong deceleration
            const overshootFactor = Math.min(1, (newDistanceMagnitude - distanceMagnitude) / decelerationZone);
            const overshootDeceleration = currentDirection.multiply(-this.speed * 5 * overshootFactor);
            this._velocity = this._velocity.add(overshootDeceleration.multiply(deltaTime));

            // If we're very close and overshooting, gradually reduce velocity to zero
            if (newDistanceMagnitude < 5 && velocityMagnitude > 0.5) {
                this._velocity = this._velocity.multiply(0.8); // Gradually reduce velocity
            }
        }
    }
}