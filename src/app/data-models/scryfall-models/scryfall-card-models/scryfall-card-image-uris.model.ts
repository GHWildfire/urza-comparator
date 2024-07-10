export class ScryfallCardImageUris {
    constructor(
        public small?: string,
        public normal?: string,
        public large?: string,
        public png?: string,
        public art_crop?: string,
        public border_crop?: string,
    ) {}

    static fromObject(json: any): ScryfallCardImageUris {
        return new ScryfallCardImageUris(
            json?.small,
            json?.normal,
            json?.large,
            json?.png,
            json?.art_crop,
            json?.border_crop
        )
    }
}