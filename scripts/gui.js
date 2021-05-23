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
	enabled = true;
	parent = undefined;
	layout = new FreeLayout(this);
	style = {}
	size = new Vector2(0, 0)
	position = new Vector2(0, 0)
	
	isEnabled()
	{
		return this.enabled;
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
	
	getPosition(point)
	{
		let pos = this.position
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
		
		Game.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
		if(this.style.border_width > 0.0) Game.context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
		
		this.layout.update()
	}
}

/* Label widget */
class Label extends Widget
{
	text = ""
	font_name = "Verdana"
	font_size = 14;
	
	constructor(text = "")
	{
		super()
		this.text = text;
		
		this.style.opacity = 1.0
		this.style.border_width = 2;
		this.style.border_color = new Color(0, 0, 0)
		this.style.background_style = new Color(255, 255, 255)
	}
	
	update()
	{	
		let pos = this.getPosition()
	
		Game.context.globalAlpha = this.style.opacity;
		Game.context.fillStyle = this.style.background_style;
		Game.context.strokeStyle = this.style.border_color;
		Game.context.textBaseline = "top";
		
		Game.context.font = this.font_size + "px " + this.font_name;
		Game.context.strokeText(this.text, pos.x, pos.y);
        Game.context.fillText(this.text, pos.x, pos.y);
	}
}
