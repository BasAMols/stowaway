export function timeEaser(value: number, keyframes: [number, number][], range: number = 1): number {
    // Handle empty keyframes
    if (keyframes.length === 0) {
        return 0;
    }
    
    // If only one keyframe, return its value
    if (keyframes.length === 1) {
        return keyframes[0][1];
    }
    
    // Sort keyframes by time (first value)
    const sorted = [...keyframes].sort((a, b) => a[0] - b[0]);
    
    // If value is before the first keyframe, return the first keyframe's value
    if (value <= sorted[0][0]) {
        return sorted[0][1];
    }
    
    // If value is after the last keyframe, return the last keyframe's value
    if (value >= sorted[sorted.length - 1][0]) {
        return sorted[sorted.length - 1][1];
    }
    
    // Find the two keyframes the value falls between
    for (let i = 0; i < sorted.length - 1; i++) {
        const [time1, val1] = sorted[i];
        const [time2, val2] = sorted[i + 1];
        
        // Handle hard cut (same time values)
        if (time1 === time2) {
            // If value is exactly at this time or before, use first value
            // Otherwise, continue to next pair
            if (value <= time1) {
                return val1;
            }
            continue;
        }
        
        // Check if value falls between these two keyframes
        if (value >= time1 && value <= time2) {
            // Linear interpolation
            const t = (value - time1) / (time2 - time1);
            return val1 + (val2 - val1) * t;
        }
    }
    
    // Fallback (shouldn't reach here, but just in case)
    return sorted[sorted.length - 1][1];
}
