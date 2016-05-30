module fighter
{
    /**
     * 成绩显示
     */
    export class ScorePanel extends egret.Sprite
    {
        private txt:egret.TextField;

        public constructor() {
            super();
            var g:egret.Graphics = this.graphics;
            g.beginFill(0x000000,0.8);
            g.drawRect(0,0,400,200);
            g.endFill();
            this.txt = new egret.TextField();
            this.txt.width = 400;
            this.txt.height = 200;
            this.txt.textAlign = "center";
            this.txt.textColor = 0xFFFFFF;
            this.txt.size = 24;
            this.txt.y = 60;
            this.addChild(this.txt);
            this.touchChildren = false;
            this.touchEnabled = false;
        }

        public showScore(value:number,rank:number):void {
            var msg:string = "时间到！\n您的成绩是:\n"+value+"\n您的全球排行："+rank;
            this.txt.text = msg;
        }
        public showTips(str: string){
            var msg =str;
            this.txt.text=msg;
            this.txt.size=30;
            this.txt.textColor = 0xFF0000;
            this.txt.y=90;
        }
    }
}