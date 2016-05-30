module fighter {
    export class Connection extends egret.DisplayObjectContainer {
        private rank:number = 0;
        public constructor() {
            super();
        }
        public sendGetRequest(value:number): void {
            var params = "?score="+value;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open("http://localhost/Test/get_test.php" + params,egret.HttpMethod.GET);
            request.send();
            request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
            request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
        }
        private onGetComplete(event: egret.Event){
            var request = <egret.HttpRequest>event.currentTarget;
            console.log("get data : ",request.response);
            this.rank = parseInt(request.response);
            console.log(this.rank);
        }
        private onGetIOError(event: egret.IOErrorEvent): void {
            console.log("get error : " + event);
        }
        private onGetProgress(event: egret.ProgressEvent): void {
            console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        }
        public sendPostRequest(value:number) {
            var params = "score=" + value;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open("http://www.goodwk.site/zs/post_test.php",egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            request.send(params);
            request.addEventListener(egret.Event.COMPLETE,this.onPostComplete,this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onPostIOError,this);
            request.addEventListener(egret.ProgressEvent.PROGRESS,this.onPostProgress,this);
        }
        private onPostComplete(event: egret.Event) {
            var request = <egret.HttpRequest>event.currentTarget;
            console.log("post data : ",request.response);
            this.rank = parseInt(request.response);
            console.log(this.rank);
            //生成自定义事件
            var datarEvent: DataEvent = new DataEvent(DataEvent.DATA);
            datarEvent.rank=this.rank;
            //发送要求事件
            this.dispatchEvent(datarEvent);
        }
        private onPostIOError(event: egret.IOErrorEvent): void {
            console.log("post error : " + event);
        }
        private onPostProgress(event: egret.ProgressEvent): void {
            console.log("post progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        }
    }
}
