class TextCanvasSystem
{
	static canvas = null;
	
	init()
	{
		let widget = Game.getWidget()
		this.canvas = document.createElement("pre");
		widget.appendChild(this.canvas)
	}

	update()
	{

	}
}