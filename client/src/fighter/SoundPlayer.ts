module fighter {
    export class SoundPlayer extends egret.DisplayObjectContainer {
        private channel:egret.SoundChannel;
        private sound: egret.Sound 
        public constructor() {
            super();

            this.startLoad();
        }

        private startLoad(): void {
            //创建 URLLoader 对象
            var loader: egret.URLLoader = new egret.URLLoader();
            //设置加载方式为声音
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            //添加加载完成侦听
            loader.addEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
            var url: string = "resource/assets/sound.mp3";
            var request: egret.URLRequest = new egret.URLRequest(url);
            //开始加载
            loader.load(request);
        }

        private onLoadComplete(event: egret.Event): void {
            var loader: egret.URLLoader = <egret.URLLoader>event.target;
            //获取加载到的 Sound 对象
            this.sound= <egret.Sound>loader.data;
        }
        public Start():void{
            this.channel = this.sound.play(0,1);
        }
        public Stop():void{
            if(this.channel)
                this.channel.stop();
        }
    }
}
