import { Transform2d } from "../math/transform";
import { CVE } from "./cve";

export class CQuick extends CVE {
    onRender: (that: CQuick) => void;
    onPreTransform: (that: CQuick) => void;
    init(that: CQuick): void {
        // void
    }
    constructor({
        onRender,
        init,
        transform,
        onPreTransform,
    }: {
        onRender?: (that: CQuick) => void;
        init?: (that: CQuick) => void;
        transform?: Transform2d;
        onPreTransform?: (that: CQuick) => void;
    }) {
        super();
        this.init = init;
        this.onRender = onRender;
        if (transform) this.transform = transform;
        if (onPreTransform) this.onPreTransform = onPreTransform;
        this.init?.(this);
    }

    preTransform() {
        if (this.onPreTransform) this.onPreTransform(this);
    }

    render() {
        this.onRender?.(this);
    }
}