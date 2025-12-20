import { Transform2d } from "../math/transform";
import { CVE } from "./cve";

export class CQuick extends CVE {
    onRender: (that: CQuick) => void;
    constructor({
        onRender
    }: {
        onRender: (that: CQuick) => void;
    }) {
        super();
        this.onRender = onRender;
    }

    render() {
        this.onRender?.(this);
    }
}