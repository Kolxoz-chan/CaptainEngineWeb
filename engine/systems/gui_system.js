
class GUISystem
{
	static block = null
	static widgets = []

	static init(id)
	{
		let widget = Game.getWidget()
		GUISystem.block = document.createElement("div");

		GUISystem.block.style.zIndex = 100;
		GUISystem.block.style.position = "absolute";
		GUISystem.block.style.width = "100%"
		GUISystem.block.style.height = "100%"
		GUISystem.block.style.top = "0px"
		GUISystem.block.style.left = "0px"

		widget.appendChild(GUISystem.block)

		for(let i in GUISystem.widgets)
		{
			GUISystem.block.appendChild(GUISystem.widgets[i].getWidget())
		}
	}

	static addWidget(widget)
	{
		GUISystem.widgets.push(widget)
		return widget
	}
}

class Widget
{
	name = null
	widget = null;
	parent = null;
	childs = [];
	default_style = "margin: 0; user-select:none; display: block;"

	constructor(type, style = "")
	{
		this.widget = document.createElement(type);
		this.widget.style.cssText += this.default_style + style

		if(name) Game.widgets_named[name] = this.widget
	}

	setPosition(x, y, type="px")
	{
		this.widget.style.position = "absolute"
		this.widget.style.left = Number.isInteger(x) ? x + type : x;
		this.widget.style.top = Number.isInteger(y) ? y + type : y
		if(type == "%")
		{
			this.widget.style.cssText += `transform: translate(-${x}%, -${y}%)`;
		}
		else
		{
			this.widget.style.cssText += "transform: translate(0, 0)";
		}
	}

	setSize(w, h, type="px")
	{
		this.widget.style.width = Number.isInteger(w) ? w + type : w
		this.widget.style.height = Number.isInteger(h) ? h + type : h
	}

	setStyle(style)
	{
		this.widget.style.cssText += style
	}

	setText(text)
	{
		this.widget.innerHTML = text;
	}

	setVisible(value)
	{
		if(value)
		{
			this.widget.style.display = "block"
		}
		else
		{
			this.widget.style.display = "none"
		}
		
	}

	addEvent(type, func)
	{
		this.widget[type] = func
	}

	addWidget(obj)
	{
		obj.parent = this
		this.childs.push(obj)
		this.widget.appendChild(obj.getWidget())
		return obj
	}

	getWidget()
	{
		return this.widget;
	}
}

class Frame extends Widget
{
	constructor(style = "")
	{
		super("div", style)
	}
}

class Label extends Widget
{
	constructor(text = "", style = "")
	{
		super("p", style)
		this.widget.innerHTML = text
	}
}

class Button extends Widget
{
	constructor(text = "", style = "", func = null)
	{
		style = "border: 2px solid black; background-color: white; font-size: 20pt;" + style
		super("button", style)
		this.widget.innerHTML = text
		if(func) this.widget.onclick = func

	}
}

class Separator extends Widget
{
	constructor(style = "")
	{
		super("hr", style)
	}
}
