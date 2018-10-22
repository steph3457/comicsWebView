declare interface Element {
    requestFullScreen?(): void;
    webkitRequestFullScreen?(): void;
}

declare interface Document {
    webkitCancelFullScreen?(): void;
}
