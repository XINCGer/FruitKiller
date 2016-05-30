module fighter
{
    /**
     * 水果杀手，利用对象池
     */
    export class Killer extends egret.DisplayObjectContainer
    {
        private static cacheDict:Object = {};
		/**
        /**生产*/
        public static produce(textureName:string,fireDelay:number):fighter.Killer
        {	
            if(fighter.Killer.cacheDict[textureName]==null)
                fighter.Killer.cacheDict[textureName] = [];
            var dict:fighter.Killer[] = fighter.Killer.cacheDict[textureName];
            var theFighter:fighter.Killer;
            if(dict.length>0) {
                theFighter = dict.pop();
            } else {
                theFighter = new fighter.Killer(RES.getRes(textureName),fireDelay,textureName);
            }
            theFighter.blood = 10;
            return theFighter;
        }
        /**回收*/
        public static reclaim(theFighter:fighter.Killer):void
        {
			var textureName: string = theFighter.textureName;
            if(fighter.Killer.cacheDict[textureName]==null)
                fighter.Killer.cacheDict[textureName] = [];
            var dict:fighter.Killer[] = fighter.Killer.cacheDict[textureName];
            if(dict.indexOf(theFighter)==-1)
                dict.push(theFighter);
        }

        /**杀手位图*/
        private bmp:egret.Bitmap;
        /**创建子弹的时间间隔*/
        private fireDelay:number;
        /**定时射*/
        private fireTimer:egret.Timer;
        /**水果杀手生命值*/
        public blood:number = 10;
		//可视为水果杀手类型名
		public textureName:string;
        public constructor(texture:egret.Texture,fireDelay:number,textureName:string) {
            super();
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texture);
			this.textureName = textureName;
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
        }
    }
}