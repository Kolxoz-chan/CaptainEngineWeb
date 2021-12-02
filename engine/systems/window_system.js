class WindowSystem
{
  static offscreen = null
	static context = null;
	static canvas = null;
	static block = null;

  static init(id)
	{
		/* Init canvas*/
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");

		this.canvas.offscreen = document.createElement("canvas");
		this.offscreen = this.canvas.offscreen.getContext("2d");

		this.block = document.getElementById(id);
		this.block.oncontextmenu = function(){return false}
		this.block.appendChild(this.canvas);
	}

  static getMaxSize()
	{
		return new Vector2(window.screen.width, window.screen.height)
	}

	static setFullScreen(value)
	{
		if(value)
		{
			this.canvas.requestFullscreen();
			if(this.settings.resizable)
			{
				this.setSize(this.getMaxSize())
			}
		}
	}

	static resetOffscreen(size)
	{
		this.canvas.offscreen.width = size.x
		this.canvas.offscreen.height = size.y
	}

	static setSize(size)
	{
		this.canvas.width = size.x;
		this.canvas.height = size.y;
		Camera.setSize(size)
	}

	static update()
	{
		
	}
}
