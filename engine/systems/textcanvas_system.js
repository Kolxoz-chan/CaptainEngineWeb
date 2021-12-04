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
				this.setValue(j, i, char)
			}
		}
	}

	static setSize(value)
	{
		this.size = value
	}

	static setValue(x, y, value)
	{
		this.array[y][x] = value
	}

	static draw(vec, sprite)
	{
		for(let y in sprite)
		{
			for(let x in sprite[y])
			{
				let pos_x = parseInt(x) + vec.x
				let pos_y = parseInt(y) + vec.y

				this.setValue(pos_x, pos_y, sprite[y][x])
			}
		}
	}

	static update()
	{
		this.draw(new Vector2(15,6),
	  	[
	  		",   ,",
		    "|\\_/|",
		    "(O_O)",
		    ">(~)<",
		    "/-V-\\",
		    "U' 'U"
	  	])

		let str = ""
		for(let i in this.array)
		{
			str += this.array[i].join("") + "\n"
		}
		this.canvas.innerHTML = str
	}




}
