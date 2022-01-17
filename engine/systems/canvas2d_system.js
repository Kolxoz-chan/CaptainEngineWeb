class Canvas2DSystem
{
  static buffer = null
	static context = null;

	static buffer_canvas = null
	static canvas = null;
	static block = null;

  static init()
	{
		/* Init canvas*/
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.style.margin = "auto"
		this.canvas.style.display = "block"

		this.buffer_canvas = document.createElement("canvas");
		this.buffer = this.buffer_canvas.getContext("2d");

		this.block = Game.getWidget()
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

	static setSize(size)
	{
		this.canvas.width = size.x;
		this.canvas.height = size.y;

		this.buffer_canvas.width = size.x;
		this.buffer_canvas.height = size.y;

		//Camera.setSize(size)
	}

	static getPosition()
	{
		return new Vector2(this.canvas.offsetLeft, this.canvas.offsetTop)
	}

	static getSize()
	{
		return new Vector2(this.canvas.width, this.canvas.height)
	}

	static update()
	{
		this.clear()
		this.context.drawImage(this.buffer_canvas, 0, 0)
		this.clearBuffer()
	}

	static applyStyles(styles)
	{
		this.buffer.globalAlpha = styles.opacity;
		this.buffer.fillStyle = styles.fill_color;
		this.buffer.strokeStyle = styles.stroke_color;
		this.buffer.lineWidth = styles.line_width;
	}

	static applyTransform(position, size, angle)
	{
		if(CameraSystem) CameraSystem.apply_transform()

		if(angle != 0)
		{
			let offset = new Vector2(position.x + size.x / 2, position.y + size.y/2)

			this.buffer.translate(offset.x, offset.y)
			this.buffer.rotate(Math.PI / 180 * angle);
			this.buffer.translate(-offset.x, -offset.y)
		}
	}

	static clear()
	{
		let size = this.getSize();
		this.context.clearRect(0, 0, size.x, size.y);
	}

	static clearBuffer()
	{
		let size = this.getSize();
		this.buffer.clearRect(0, 0, size.x, size.y);
	}

	static drawRect(position, size, angle, styles)
	{
		// Settings
		this.applyStyles(styles)
		this.applyTransform(position, size, angle)

		// Draw
		this.buffer.fillRect(position.x, position.y, size.x, size.y);
		if(styles.line_width > 0.0)
		{
			this.buffer.strokeRect(position.x, position.y, size.x, size.y);
		}

		// Reset settings
		this.buffer.resetTransform()
	}

  static drawCircle(position, size, angle, styles)
	{
    let radiuses = new Vector2(size.x/2, size.y/2)
		let center = position.add(radiuses)

		// Settings
		this.applyStyles(styles)
		this.applyTransform(position, size, angle)

		// Draw
		this.buffer.beginPath();
		this.buffer.ellipse(center.x, center.y, radiuses.x, radiuses.y, Math.PI, 0, Math.PI * 2, true);
		this.buffer.fill();
		this.buffer.stroke();

		// Reset settings
		this.buffer.resetTransform()
	}

	static drawImage(position, size, angle, styles)
	{
		let img = ResourcesSystem.textures[styles.image]
		if(!img) return

		// Settings
		this.applyStyles(styles)
		this.applyTransform(position, size, angle)

		this.buffer.drawImage(img, position.x, position.y, size.x, size.y);

		// Reset settings
		this.buffer.resetTransform()
	}
}
