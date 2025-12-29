import { Transform2d } from "../math/transform";
import { CVE } from "./cve";

export class CQuick extends CVE {
    onRender: (that: CQuick) => void;
    init(that: CQuick): void {
        // void
    }
    constructor({
        onRender,
        init,
        transform,
    }: {
        onRender?: (that: CQuick) => void;
        init?: (that: CQuick) => void;
        transform?: Transform2d;
    }) {
        super();
        this.init = init;
        this.onRender = onRender;
        if (transform) this.transform = transform;
        this.init?.(this);
    }

    render() {
        this.onRender?.(this);
    }
}