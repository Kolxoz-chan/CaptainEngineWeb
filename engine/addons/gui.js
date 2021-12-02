
class GUI
{
	static block = null
	static widgets = []

	static init(id)
	{
		let div = document.getElementById(id);
		GUI.block = document.createElement("div");

		GUI.block.style.zIndex = 100;
		GUI.block.style.position = "absolute";
		GUI.block.style.width = "100%"
		GUI.block.style.height = "100%"
		GUI.block.style.top = "0px"
		GUI.block.style.left = "0px"

		div.appendChild(GUI.block)
	}

	static addWidget(widget)
	{
		GUI.widget.push(widget)
		GUI.block.appendChild()
	}
}

class Widget
{
	name = null
	widget = null;
	parent = null;
	childs = [];
	default_style = "margin: 0; user-select:none; display: block;"

	constructor(type, name = null, style = "")
	{
		this.name = name
		this.widget = document.createElement(type);
		this.widget.style.cssText += this.default_style + style

		if(name) Game.widgets_named[name] = this.widget
	}

	show()
	{
		//if(this.parent) this.parent.show()
		this.widget.style.display = "block";
	}

	hide()
	{
		this.widget.style.display = "none";
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

	setDisplay(type)
	{
		this.widget.style.display = type
	}

	addEvent(type, func)
	{
		this.widget[type] = func
	}

	addChild(obj)
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
	constructor(name = null, style = "")
	{
		super("div", name, style)
	}
}

class Label extends Widget
{
	constructor(name = null, text = "", style = "")
	{
		super("p", name, style)
		this.widget.innerHTML = text
	}
}

class Button extends Widget
{
	constructor(name = null, text = "", style = "")
	{
		super("button", name, style)
		this.widget.innerHTML = text
	}
}
