export class Loader {

    setup: boolean = false;
    loading: number = 0;
    loaded: number = 0;
    get ready(): boolean {
        return this.loaded === this.loading && this.setup;
    }
    constructor() {

    }

    loadImage(src: string): Promise<HTMLImageElement> {
        this.loading += 1;
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                this.loaded += 1;
                resolve(image);
            }
        });
    }
}