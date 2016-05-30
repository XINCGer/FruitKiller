var startButtonSkin=(function (_super) {
	__extends(startButtonSkin, _super);
	function startButtonSkin() {
		_super.call(this);
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [];
		this._Image1_i();
		
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.AddItems("_Image1","",0,"")
				])
		];
	}
	var _proto = startButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.horizontalCenter = 0;
		t.source = "btnStart";
		t.verticalCenter = 1;
		return t;
	};
	Object.defineProperty(_proto, "skinParts", {
		get: function () {
			return [];
		},
		enumerable: true,
		configurable: true
	});
	return startButtonSkin;
})(eui.Skin);