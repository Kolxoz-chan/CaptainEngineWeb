/* Style class */
class Style
{
	/* Opacity */
	opacity = 1.0
	
	/* Border style */
	border_width = 2;
	border_color = new Color(0, 0, 128)
	border_style = undefined;
	
	/* Background */
	background_style = new Color(0, 191, 255)
}

/* Base layout */
class Layout
{
	parent = undefined
	widgets = []
	padding = 5;
}

/* Base free layout */
class FreeLayout
{	
	addWidget(widget)
	{
		this.widgets.push(widget)
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
	layout = FreeLayout(this);
	style = new Style()
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
	
	applyStyles()
	{
		Game.context.globalAlpha = this.style.opacity;
		Game.context.fillStyle = this.style.background_style;
		Game.context.strokeStyle = this.style.border_color;
		Game.context.lineWidth = this.style.border_width;
	}
}

/* Form widget */
class Form extends Widget
{	
	update()
	{
		this.applyStyles()
		Game.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
		if(this.style.border_width > 0.0) Game.context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}