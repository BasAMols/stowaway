export class Ease {
    public static easeInOut(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    public static easeIn(t: number): number {
        return t * t;
    }
    public static easeOut(t: number): number {
        return 1 - (1 - t) * (1 - t);
    }
}