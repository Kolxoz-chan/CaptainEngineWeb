
class GUISystem
{
	static block = null
	static widgets = {}
	static widgets_by_id = {}

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

	static getWidget(name)
	{
		return GUISystem.widgets[name];
	}

	static getWidgetById(id)
	{
		return GUISystem.widgets_by_id[id]
	}

	static addWidget(name, widget)
	{
		GUISystem.widgets[name] = widget
		GUISystem.block.appendChild(widget.widget)
		return widget
	}

	static loadGUI(src)
	{
		let createWidget = function(data)
		{
			// Create object
			let widget = Game.parse("new " + data.type + "()")

			// Settings
			if(data.style) widget.setStyle(data.style)
			if(data.text) widget.setText(data.text)
			if(data.position) widget.setPosition(data.position.x, data.position.y)
			if(data.size) widget.setSize(data.size.w, data.size.h)
			if(data.class) widget.setClass(data.class)
			if(data.id) widget.setId(data.id)
			if(data.visible != undefined) widget.setVisible(data.visible)

			// Adding events
			for(let name in data.events)
			{
				widget.addEvent(name, data.events[name])
			}

			// Loading widgets
			for(let i in data.widgets)
			{
				let obj = data.widgets[i]
				widget.addWidget(createWidget(obj))
			}

			return widget
		}

		ResourcesSystem.loadByURL(src, "text", (value) =>
		{
			let arr = JSON.parse(value)
			for(let name in arr)
			{
				let obj = createWidget(arr[name])
				GUISystem.addWidget(name, obj)
			}
		})
	}
}

class Widget
{
	widget = null;
	parent = null;
	childs = [];

	constructor(type, style = "")
	{
		this.widget = document.createElement(type);
		this.widget.style.cssText += "user-select: none; display: block;" + style
	}

	setPosition(x, y)
	{
		this.widget.style.position = "absolute"
		this.widget.style.left = x;
		this.widget.style.top = y
		let transform = ""

		if(typeof(x) == "string")
		{
			if(x.includes("%")) transform += `translateX(-${x}) `;
		}
		if(typeof(y) == "string")
		{
			if(y.includes("%")) transform += `translateY(-${y}) `;
		}

		if(transform)
		{
			this.widget.style.cssText += "transform: " + transform + "; "
		}
	}

	setId(id)
	{
		if(this.widget.id) GUISystem.widgets_by_id[this.widget.id] = null
		this.id = id
		GUISystem.widgets_by_id[id] = this
	}

	setClass(value)
	{
		this.widget.setAttribute("class", value)
	}

	setSize(w, h)
	{
		this.widget.style.width = w
		this.widget.style.height = h
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
		if(value) this.show()
		else this.hide()
	}

	show()
	{
		this.widget.style.display = "block"
	}

	hide()
	{
		this.widget.style.display = "none"
	}

	addEvent(type, func)
	{
		this.widget[type] = function()
		{
			ResourcesSystem.callScript(func)
		}
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

	setText(value)
	{
		this.widget.innerHTML = value
	}
}

class Button extends Widget
{
	constructor(text = "", style = "")
	{
		super("button", style)
		this.widget.innerHTML = text
	}
}

class Separator extends Widget
{
	constructor(style = "")
	{
		super("hr", style)
	}
}

class Picture extends Widget
{
	constructor(src = "", style = "")
	{
		super("img", style)
		this.widget.src = text
	}
}
