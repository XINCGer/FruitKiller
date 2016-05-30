module fighter
{
    /**
     * 主游戏容器
     */
    export class GameContainer extends egret.DisplayObjectContainer
    {
        /**@private*/
        private stageW:number;
        /**@private*/
        private stageH:number;
        /**开始按钮*/
        private btnStart;
        //开始Logo
        private logo;
        /**可滚动背景*/
        private bg:fighter.BgMap;
        /**我的水果杀手*/
        private myFighter:fighter.Killer;
        /**水果容器*/
        private enemyFighters:fighter.Killer[] = [];
        //水果名称
        private enemyName:string[] =["b1","b2","f2"];
        /**触发创建水果的间隔*/
        private enemyFightersTimer:egret.Timer = new egret.Timer(250);
        /**成绩显示*/
        private scorePanel:fighter.ScorePanel;
        /**我的成绩*/
        private myScore:number = 0;
        //我的排行
        private myRank:number = 0;
        //创建一个计时器对象
        private timer: egret.Timer = new egret.Timer(40000,1);
        //声音播放实例
        private sound:SoundPlayer;
        //等待界面
        private tips: fighter.ScorePanel;
        //通信类
        private connecter:Connection = new Connection();
        /**@private*/
        private _lastTime:number;

        public constructor() {
            super();
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }
        /**初始化*/
        private onAddToStage(event:egret.Event){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.createGameScene();
        }
        /**创建游戏场景*/
        private createGameScene():void{
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //背景
            this.bg = new fighter.BgMap();//创建可滚动的背景
            this.addChild(this.bg);
            //开始按钮
            //开始按钮
            this.btnStart = fighter.createBitmapByName("btnStart");//开始按钮
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
            //开始logo
            this.logo = fighter.createBitmapByName("title_png");
            this.logo.x = (this.stageW - this.logo.width) / 2;
            this.logo.y = (this.stageH /5);
            this.btnStart.touchEnabled = true;//开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameStart,this);//点击按钮开始游戏
            this.addChild(this.btnStart);
            this.addChild(this.logo);
            //水果杀手
            this.myFighter = new fighter.Killer(RES.getRes("f1"),100,"f1");
            this.myFighter.y = this.stageH-this.myFighter.height;
            this.addChild(this.myFighter);
            this.scorePanel = new fighter.ScorePanel();
            //实例化音频对象
            this.sound = new SoundPlayer();
            //等待界面
            this.tips= new fighter.ScorePanel();
            //预创建
            this.preCreatedInstance();
        }
        /**预创建一些对象，减少游戏时的创建消耗*/
        private preCreatedInstance():void {
            var i:number = 0;
            var objArr:any[] = [];
            for(i=0;i<20;i++) {
                var enemyFighter:fighter.Killer = fighter.Killer.produce("f2",1000);
                objArr.push(enemyFighter);
            }
            for(i=0;i<20;i++) {
                enemyFighter = objArr.pop();
                fighter.Killer.reclaim(enemyFighter);
            }
        }
        /**游戏开始*/
        private gameStart():void{
            this.myScore = 0;
            this.removeChild(this.btnStart);
            this.removeChild(this.logo);
            this.touchEnabled=true;
            this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            this.myFighter.x = (this.stageW-this.myFighter.width)/2;
            this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER,this.createEnemyFighter,this);
            this.enemyFightersTimer.start();
            if(this.scorePanel.parent==this)
                this.removeChild(this.scorePanel);
            if(this.tips.parent==this){
                this.removeChild(this.tips);
            }
            //注册事件侦听器
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);
            this.timer.start();
            this.sound.Stop();
            this.sound.Start();
        }
        /**响应Touch*/
        private touchHandler(evt:egret.TouchEvent):void{
            if(evt.type==egret.TouchEvent.TOUCH_MOVE)
            {
                var tx:number = evt.localX;
                tx = Math.max(0,tx);
                tx = Math.min(this.stageW-this.myFighter.width,tx);
                this.myFighter.x = tx;
            }
        }
        
        //计时函数
        private timerComFunc() {
            this.gameStop();
        }
        /**创建随机样式水果*/
        private createEnemyFighter(evt:egret.TimerEvent):void{
            var num: number = Math.floor(Math.random() * 3);
            var enemyFighter:fighter.Killer = fighter.Killer.produce(this.enemyName[num],1000);
            enemyFighter.x = Math.random()*(this.stageW-enemyFighter.width);
            enemyFighter.y = -enemyFighter.height-Math.random()*300+50;
            this.addChildAt(enemyFighter,this.numChildren-1);
            this.enemyFighters.push(enemyFighter);
        }
        /**游戏画面更新*/
        private gameViewUpdate(evt:egret.Event):void{
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime:number = egret.getTimer();
            var fps:number = 1000/(nowTime-this._lastTime);
            this._lastTime = nowTime;
            var speedOffset:number = 60/fps;
            //水果运动
            var i: number = 0;
            var theFighter:fighter.Killer;
            var enemyFighterCount:number = this.enemyFighters.length;
              for(i = 0;i < enemyFighterCount;i++){
                theFighter = this.enemyFighters[i];
                if(theFighter.y>this.stage.stageHeight){
                    this.removeChild(theFighter);
                    Killer.reclaim(theFighter);
                    this.enemyFighters.splice(i,1);
                    i--;
                    enemyFighterCount--;
                }
                theFighter.y += 8* speedOffset;
            }
              this.gameHitTest();
        }
        /**游戏碰撞检测*/
        private gameHitTest():void {
            var i:number,j:number;
            var theFighter:fighter.Killer;
            var enemyFighterCount:number = this.enemyFighters.length;
            //将需消失水果记录
            var delFighters:fighter.Killer[] = [];
            //将接到的水果放入del数组
            for(i=0;i<enemyFighterCount;i++) {
                theFighter = this.enemyFighters[i];
                if(fighter.GameUtil.hitTest(this.myFighter,theFighter)) {
                        delFighters.push(theFighter);
                }
            }
            //接到水果就加分
             {
                this.myScore += delFighters.length;
                while(delFighters.length>0) {
                    theFighter = delFighters.pop();
                    this.removeChild(theFighter);
                    this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter),1);
                    fighter.Killer.reclaim(theFighter);
                }
            }
        }
        /**游戏结束*/
        private gameStop():void{
            this.addChild(this.btnStart);
            this.addChild(this.logo);
            this.removeEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER,this.createEnemyFighter,this);
            this.enemyFightersTimer.stop();
            var i:number = 0;
            //清理水果杀手
            var theFighter:fighter.Killer;
            while(this.enemyFighters.length>0) {
                theFighter = this.enemyFighters.pop();
                this.removeChild(theFighter);
                fighter.Killer.reclaim(theFighter);
            }
            //上传成绩并获取排行榜
            this.connecter.sendPostRequest(this.myScore);
            this.connecter.addEventListener(DataEvent.DATA,this.showRank,this);
            //显示计算等待界面
            this.tips.showTips("正在为您计算全球排行...");
            this.tips.x = (this.stageW- this.tips.width) / 2;
            this.tips.y = 100;
            this.addChild(this.tips);
        }
        private showRank(event: DataEvent){
            this.removeChild(this.tips);
            this.myRank=event.rank;
            //显示成绩
            this.scorePanel.showScore(this.myScore,this.myRank);
            this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        }
    }
}