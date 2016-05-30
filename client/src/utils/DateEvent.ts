module fighter {
    export class DataEvent extends egret.Event {
        public static DATA: string = "TransSuccess";
        public rank:number = 0;
        public constructor(type: string,bubbles: boolean = false,cancelable: boolean = false) {
            super(type,bubbles,cancelable);
        }
    }
}
