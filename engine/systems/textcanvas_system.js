class TextCanvasSystem
{
	static canvas = null;
	static size = null;
	static array = []

	static init()
	{
		// Init widget
		let widget = Game.getWidget()
		this.canvas = document.createElement("pre");
		this.canvas.style.color = "white"
		this.canvas.style.fontFamily = "Consolas, monaco, monospace"
		this.canvas.style.fontSize = "14px"
		this.canvas.style.textAlign = "center"
		widget.appendChild(this.canvas)

		// Clear canvas
		this.clear()
	}

	static clear(char = " ")
	{
		for(let i=0; i<this.size.y; i++)
		{
			this.array[i] = []
			for(let j=0; j<this.size.x; j++)
			{
				this.array[i][j] = char
			}
		}
	}

	static setSize(value)
	{
		this.size = value
	}

	static setValue(x, y, value)
	{
		x = Math.floor(x)
		y = Math.floor(y)

		if(this.array[y])
		{
			if(this.array[y][x])
			{
				this.array[y][x] = value
			}
		}
	}

	static draw(vec, sprite)
	{
		for(let y in sprite)
		{
			let may_draw = false
			for(let x in sprite[y])
			{
				let pos_x = parseInt(x) + vec.x
				let pos_y = parseInt(y) + vec.y
				let ch = sprite[y][x]

				if(ch != " ") may_draw = true

				if(may_draw)
				{
					this.setValue(pos_x, pos_y, ch)
				}
			}
		}
	}

	static update()
	{
		let str = ""
		for(let i in this.array)
		{
			str += this.array[i].join("") + "\n"
		}
		this.canvas.textContent = str
		this.clear()
	}
}
