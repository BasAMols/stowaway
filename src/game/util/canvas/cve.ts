import { Transform2d } from "../math/transform";

export class CVE {

    below: Record<string, CVE> = {};
    children: Record<string, CVE> = {};
    above: Record<string, CVE> = {};
    parent?: CVE;

    private _order: number = 1;
    public get order(): number {
        return this._order;
    }
    public set order(value: number) {
        this._order = value;
    }

    transform: Transform2d;

    opacity: number = 1;

    setOpacity(opacity: number) {
        this.opacity = opacity;
        return this;
    }

    constructor() {
        this.transform = new Transform2d();
    }

    add(name: string, parent: CVE, order: number = 1) {
        if (parent.children[name]) {
            throw new Error(`Child ${name} already exists`);
        }
        parent.children[name] = this;
        if (order < 0) {
            parent.below[name] = this;
        } else if (order > 0) {
            parent.above[name] = this;
        } else {
            throw new Error(`Order must be less than 0 or greater than 0`);
        }

        this.parent = parent;
        this.order = order;
        return this;
    }

    loaded() {
        Object.values(this.children).forEach(child => child.loaded());
    }

    preTransform() {
        // void
    }
    preRender() {
        // void
    }
    render() {
        // void
    }
    postRender() {
        // void
    }
    tick() {
        $.canvas.save();
        this.preTransform();
        this.transform.apply($.canvas.ctx);
        $.canvas.ctx.globalAlpha = $.canvas.ctx.globalAlpha * this.opacity;
        this.preRender();
        for (const child of Object.values(this.below).sort((a, b) => a.order - b.order)) {
            child.tick();
        }
        this.render();
        for (const child of Object.values(this.above).sort((a, b) => a.order - b.order)) {
            child.tick();
        }
        this.postRender();
        $.canvas.restore();
    }
    get transforms(): Transform2d[] {
        const transforms: Transform2d[] = [];
        let current: CVE | undefined = this;
        while (current) {
            transforms.push(current.transform);
            current = current.parent;
        }
        return transforms;
    }
}
