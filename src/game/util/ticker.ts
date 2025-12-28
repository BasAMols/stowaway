export interface TickerReturnData { deltaTime: number, elapsedTime: number, frameCount: number };
export type TickerCallback = (data: TickerReturnData) => void;

/**
 * A ticker class that uses requestAnimationFrame for smooth animation.
 * Frame rate is variable and matches the browser's refresh rate.
 */
export class Ticker {
    private animationFrameId: number | null = null;
    private callbacks: Set<TickerCallback> = new Set();
    private startTime: number = 0;
    private lastFrameTime: number = 0;
    private frameCount: number = 0;
    private isRunning: boolean = false;

    /**
     * Starts the ticker using requestAnimationFrame
     */
    public start(): void {

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.startTime = performance.now();
        this.lastFrameTime = this.startTime;
        this.frameCount = 0;

        this.tick();
    }

    /**
     * Stops the ticker
     */
    public stop(): void {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Adds a callback to be called on each tick
     */
    public addCallback(callback: TickerCallback): void {
        this.callbacks.add(callback);
    }

    /**
     * Removes a callback
     */
    public removeCallback(callback: TickerCallback): void {
        this.callbacks.delete(callback);
    }

    /**
     * Removes all callbacks
     */
    public clearCallbacks(): void {
        this.callbacks.clear();
    }

    /**
     * Gets the current average frame rate based on elapsed time and frame count
     */
    public get currentFPS(): number {
        if (!this.isRunning || this.frameCount === 0) {
            return 0;
        }
        const elapsedSeconds = (performance.now() - this.startTime) / 1000;
        return this.frameCount / elapsedSeconds;
    }

    /**
     * Gets whether the ticker is currently running
     */
    public get running(): boolean {
        return this.isRunning;
    }

    /**
     * Gets the current frame count
     */
    public get currentFrameCount(): number {
        return this.frameCount;
    }

    /**
     * Gets the total elapsed time since start in milliseconds
     */
    public get elapsedTime(): number {
        if (!this.isRunning) {
            return 0;
        }
        return performance.now() - this.startTime;
    }

    private tick(): void {
        if (!this.isRunning) {
            return;
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        const elapsedTime = currentTime - this.startTime;

        this.frameCount++;
        this.lastFrameTime = currentTime;

        // Call all registered callbacks
        this.callbacks.forEach(callback => {
            callback({ deltaTime, elapsedTime, frameCount: this.frameCount });
        });

        // Schedule next frame
        this.animationFrameId = requestAnimationFrame(() => {
            this.tick();
        });
    }
}
