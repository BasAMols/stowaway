import { CVE } from "../util/canvas/cve";
import { Vector2 } from "../util/math/vector2";

export type CameraLayers = 'static' | 'sky' | 'horizon' | 'wave' | 'ship' | 'foreground'
export class Camera {

    zoomLayers: Record<string, {
        parallax: number;
        element: CVE;
    }> = {};

    public focus: Vector2 = new Vector2(0, 0);
    public zoom: number = 1;

    // Camera easing parameters
    public enableEasing: boolean = false; // Enable smooth camera movement with easing (false = direct focus value)
    public speed: number = 6000; // Units per second - controls overall responsiveness
    public snapThreshold: number = 10; // Distance threshold for snapping to target (0 = disabled)

    // Internal smoothed position and velocity
    private _smoothedPosition: Vector2 = new Vector2(0, 0);
    private _velocity: Vector2 = new Vector2(0, 0);
    private _initialized: boolean = false;

    constructor() {
        this.addZoomLayer('static', 0);
        this.addZoomLayer('horizon', 0.1);
        this.addZoomLayer('sky', 0.6);
        this.addZoomLayer('wave', 0.9);
        this.addZoomLayer('ship', 1);
        this.addZoomLayer('foreground', 1.5);
    }

    addZoomLayer(key: CameraLayers, parallax: number) {
        this.zoomLayers[key] = {
            parallax: parallax,
            element: new CVE(),
        }

    }

    addToZoomLayer(key: CameraLayers, name: string, element: CVE, order: number = 1) {
        element.add(name, this.zoomLayers[key].element, order);
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
            this._smoothedPosition = this.focus.clone();
            this._velocity = new Vector2(0, 0);
        }

        const windowArea = $.container;
        const worldArea = new Vector2(3840, 1350);
        const worldCenter = worldArea.divide(2);
        const gameArea = new Vector2(1920, 1350);

        // Calculate base scale so that at zoom=1, the entire gameArea fits in windowArea
        const baseScale = Math.min(windowArea.x / gameArea.x, windowArea.y / gameArea.y);

        // Screen center point
        const screenCenter = windowArea.divide(2);

        // Calculate the scale for parallax=1 (main action plane)
        // This is what we use to transform the focus point
        const parallaxOneScale = baseScale * this.zoom;

        // Calculate the visible area in world coordinates based on current zoom
        // This is how much of the world we can see at the current zoom level
        const visibleAreaInWorld = windowArea.divide(parallaxOneScale);

        // Convert smoothed position from gameArea coordinates to worldArea coordinates
        // gameArea is centered in worldArea, so offset is half the difference
        const gameAreaToWorldOffset = worldArea.subtract(gameArea).divide(2);
        const focusInWorld = this._smoothedPosition.add(gameAreaToWorldOffset);

        // Clamp the focus point so we never see outside worldArea
        // We need to ensure the visible area (centered on focus) stays within worldArea bounds
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

        for (const layer of Object.values(this.zoomLayers)) {
            if (layer.parallax === 0) {
                // Static layers (parallax=0) should not be affected by camera at all
                // They draw at window size and don't move or scale
                layer.element.transform.setPosition(0, 0);
                layer.element.transform.setScale(1);
            } else {
                // Calculate scale: baseScale ensures gameArea fits at zoom=1
                // Parallax affects how much the zoom affects this layer
                // At parallax=1: scale = baseScale * zoom (full zoom effect)
                const layerScale = baseScale * (1 + (this.zoom - 1) * layer.parallax);

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
        }
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