/* Base layout */
class Layout
{
	parent = undefined
	widgets = []
	padding = 5;
}

/* Base free layout */
class FreeLayout extends Layout
{	
	constructor(parent)
	{
		super()
		this.parent = parent
	}

	addWidget(widget)
	{
		this.widgets.push(widget)
		widget.parent = this.parent
	}
	
	update()
	{
		for(let i in this.widgets)
		{
			if(this.widgets[i].isEnabled()) this.widgets[i].update()
		}
	}
}

/* Base widget */
class Widget
{
	static ABSOLUTE = 0;
	static RELATIVE = 1;
	
	enabled = true;
	parent = undefined;
	layout = new FreeLayout(this);
	style = {}
	
	size = new Vector2(0, 0)
	position = new Vector2(0, 0)
	
	position_type = {"x" : Widget.ABSOLUTE, "y" : Widget.ABSOLUTE}
	size_type = {"x" : Widget.ABSOLUTE, "y" : Widget.ABSOLUTE}
	
	isEnabled()
	{
		return this.enabled;
	}
	
	setStyle(style)
	{
		Object.assign(this.style, style);
	}
	
	setPosition(point)
	{
		this.position = point;
	}
	
	setSize(size)
	{
		this.size = size
	}
	
	setLayout(layout)
	{
		this.layout = layout;
	}
	
	setPositionType(x, y)
	{
		this.position_type = {"x" : x, "y" : y}
	}
	
	setSizeType(x, y)
	{
		this.size_type = {"x" : x, "y" : y}
	}
	
	getSpace()
	{
		if(this.parent)
		{
			return this.parent.getSize().add(this.getSize().invert())
		}
		return Game.getSize().add(this.getSize().invert());
	}
	
	getSize()
	{
		let size = this.size.copy()
		if(this.size_type.x == Widget.RELATIVE) size.x *= this.parent ? this.parent.getSize().x : Game.canvas.width
		if(this.size_type.y == Widget.RELATIVE) size.y *= this.parent ? this.parent.getSize().y : Game.canvas.height
		
		return size;
	}
	
	getPosition(point)
	{
		let pos = this.position.copy()
		let space = this.getSpace()
		if(this.position_type.x == Widget.RELATIVE) pos.x *= space.x
		if(this.position_type.y == Widget.RELATIVE) pos.y *= space.y
		if(this.parent)
		{
			let position = this.parent.getPosition();
			let value = new Vector2(position.x + this.layout.padding, position.y + this.layout.padding)
			return pos.add(value)
		}
		return pos;
	}
}

/* Form widget */
class Form extends Widget
{	
	constructor()
	{
		super()
		this.style = {
			"font_name" : "Verdana",
			"font_size" : 14,
			"opacity" : 1.0,
			"border_width" : 2,
			"border_color" : new Color(0, 0, 0),
			"border_style" : undefined,
			"background_style" : new Color(255, 255, 255),
		}
		this.style.opacity = 1.0
		this.style.border_width = 2;
		this.style.border_color = new Color(0, 0, 128)
		this.style.border_style = undefined;
		this.style.background_style = new Color(0, 191, 255)
	}

	update()
	{
		Game.context.globalAlpha = this.style.opacity;
		Game.context.fillStyle = this.style.background_style;
		Game.context.strokeStyle = this.style.border_color;
		Game.context.lineWidth = this.style.border_width;
		
		let position = this.getPosition();
		let size = this.getSize();
		
		if(this.style.background_style) Game.context.fillRect(position.x, position.y, size.x, size.y);
		if(this.style.border_width > 0.0 && this.style.border_color) Game.context.strokeRect(position.x, position.y, size.x, size.y);
		
		this.layout.update()
	}
}

/* Label widget */
class Label extends Widget
{
	icon = null
	text = ""
	
	constructor(text = "")
	{
		super()
		this.text = text;
		this.style = {
			"font" : null,
			"opacity" : 1.0,
			"border_width" : 2,
			"border_color" : new Color(0, 0, 0),
			"background_style" : new Color(255, 255, 255),
			"icon_size" : new Vector2(32, 32)
		}
	}
	
	getSize()
	{
		let size
		if(!this.size.equals(new Vector2(0, 0)))
		{
			size = this.size.copy()
			if(this.size_type.x == Widget.RELATIVE) size.x *= this.parent ? this.parent.getSize().x : Game.canvas.width
			if(this.size_type.y == Widget.RELATIVE) size.y *= this.parent ? this.parent.getSize().y : Game.canvas.height
			
			return size;
		}
		else
		{
			Game.context.font = this.style.font;
			let metrics = Game.context.measureText(this.text);
			size = new Vector2(metrics.width, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
		}
		if(this.icon) size.x += icon_size.x;
		
		return size
	}
	
	update()
	{	
		if(this.style.font)
		{
			let pos = this.getPosition()
		
			Game.context.globalAlpha = this.style.opacity;
			Game.context.fillStyle = this.style.background_style;
			Game.context.strokeStyle = this.style.border_color;
			Game.context.textBaseline = "top";
		
			Game.context.font = this.style.font;
			Game.context.strokeText(this.text, pos.x, pos.y);
			Game.context.fillText(this.text, pos.x, pos.y);
		}
	}
}

/* Label widget */
class Picture extends Widget
{
	image = ""
	
	constructor(image = null)
	{
		super()
		this.image = image;
		this.style = {
			"opacity" : 1.0,
			"border_width" : 2,
			"border_color" : new Color(0, 0, 0),
		}
	}
	
	getSize()
	{
		let size = this.size.copy()
		if(this.size_type.x == Widget.RELATIVE) size.x *= this.parent ? this.parent.getSize().x : Game.canvas.width
		if(this.size_type.y == Widget.RELATIVE) size.y *= this.parent ? this.parent.getSize().y : Game.canvas.height
		
		return size;
	}
	
	setImage(image)
	{
		this.image = image
	}
	
	update()
	{	
		if(this.image)
		{
			let pos = this.getPosition()
			let size = this.getSize()
		
			Game.context.globalAlpha = this.style.opacity;
			Game.context.strokeStyle = this.style.border_color;
		
			this.image.draw(pos, size)
			if(this.line_width > 0.0) Game.context.strokeRect(pos.x, pos.y, size.x, size.y);
		}
	}
}
