import { CVE } from "../util/canvas/cve";
import { Vector2 } from "../util/math/vector2";

export type CameraLayers = 'static' | 'sky' | 'horizon' | 'wave1' | 'wave2' | 'wave3' | 'ship' | 'foreground'
export class Camera {

    zoomLayers: Record<string, {
        parallax: number;
        element: CVE;
    }> = {};

    public focus: Vector2 = new Vector2(0, 0);
    public zoom: number = 1;

    constructor() {
        this.addZoomLayer('static', 0);
        this.addZoomLayer('horizon', 0.3);
        this.addZoomLayer('sky', 0.6);
        this.addZoomLayer('wave1', 0.9);
        this.addZoomLayer('wave2', 1);
        this.addZoomLayer('wave3', 1.1);
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

        const windowArea = $.container;
        const worldArea = new Vector2(3840, 2160);
        const worldCenter = worldArea.divide(2);
        const gameArea = new Vector2(1920, 1080);

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

        // Convert focus from gameArea coordinates to worldArea coordinates
        // gameArea is centered in worldArea, so offset is half the difference
        const gameAreaToWorldOffset = worldArea.subtract(gameArea).divide(2);
        const focusInWorld = this.focus.add(gameAreaToWorldOffset);

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
}