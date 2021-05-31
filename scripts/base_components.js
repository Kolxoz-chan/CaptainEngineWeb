class ComponentBase
{	
	name = ""
	enabled = true;
	joined = {};
	default = {};
	
	init()
	{
		/* Abstract method */
	}
	
	update()
	{
		/* Abstract method */
	}
	
	reset()
	{
		let arr = Object.copy(this.default)
		for(let i in arr) this[i] = arr[i]
	}

	join(name)
	{
		this.joined[name] = this.owner.getComponent(name)
		return this.joined[name];
	}
	
	setName(value)
	{
		this.name = value
	}
	
	isEnabled()
	{
		return this.enabled;
	}
	
	setEnabled(value)
	{
		this.enabled = value
	}
	
	setOwner(owner)
	{
		this.owner = owner
	}
	
	isEnabled()
	{
		return this.enabled
	}
	
	setData(data)
	{
		for(var name in data)
		{
			this[name] = data[name]
		}
	}
}


/* Drawable сomponent */
class DrawableComponent extends ComponentBase
{	
	name = "DrawableComponent"
	fill_color = new Color(255, 255, 255)
	stroke_color = new Color(0, 0, 0)
	line_width = 0.0;
	opacity = 1.0;
	
	getOpacity()
	{
		return this.opacity
	}
	
	setFillColor(color)
	{
		this.fill_color = color;
	}
	
	setStrokeColor(color)
	{
		this.stroke_color = color;
	}
	
	setLineWidth(value)
	{
		this.line_width = value
	}
	
	setOpacity(value)
	{
		this.opacity = value
	}
	
	applyStyles()
	{
		Game.context.globalAlpha = this.opacity;
		Game.context.fillStyle = this.fill_color;
		Game.context.strokeStyle = this.stroke_color;
		Game.context.lineWidth = this.line_width;
	}
	
	applyTransformation()
	{
		let transform_component = this.joined["TransformComponent"]
		let position = transform_component.getPosition()
		let size = transform_component.getSize()
		let angle = transform_component.getAngle()
		let axis = transform_component.getAxis()
		
		Camera.apply_transform()
		
		Game.context.translate(position.x + size.x * axis.x, position.y + size.y * axis.y)
		Game.context.rotate(Math.PI / 180 * angle);
		Game.context.translate(-size.x * axis.x - position.x, -size.y * axis.y - position.y)
	}
}

/* Base colider component*/
class ColiderComponent extends ComponentBase
{	
	name = "ColiderComponent"
	objects = []
	coliding = true;
	
	isIntersects(colider)
	{
		let A = this.getRect()
		let B = colider.getRect()
		let C = A.getCommon(B)

		if(!C.isNullSize())
		{
			for(let y = C.y; y < C.y + C.h; y++)
			{
				for(let x = C.x; x < C.x + C.w; x++)
				{
					let point = new Vector2(x, y)
					if(this.isContained(point) && colider.isContained(point)) return true;
				}
			}
		}
		return false;
	}
	
	update()
	{
		this.objects = [];
		let container = this.owner.getContainer()
		for(let i in container.entities)
		{
			if(container.entities[i].hasComponent("ColiderComponent") && this.owner !== container.entities[i])
			{
				let colider = container.entities[i].getComponent("ColiderComponent")
				if(this.isIntersects(colider)) 
				{
					this.objects.push(container.entities[i])
				}
			}
		}
	}
}

/* Attribute component*/
class AttributeComponent extends ComponentBase
{	
	value = null
	min_value = -Number.MAX_VALUE
	max_value = Number.MAX_VALUE
	
	addValue(value)
	{
		this.setValue(this.value + value);
	}
	
	setValue(value)
	{
		this.value = value;
		if(this.value < this.min_value) this.value = this.min_value
		if(this.value > this.max_value) this.value = this.max_value
	}
	
	getValue()
	{
		return this.value
	}
	
	isZero()
	{
		return this.value == 0;
	}
	
	isMin()
	{
		return this.value == this.min_value;
	}
	
	isMax()
	{
		return this.value == this.max_value;
	}
	
	isGreaterZero()
	{
		return this.value > 0;
	}
	
	isLessZero()
	{
		return this.value < 0;
	}
	
	resetZero()
	{
		this.setValue(0)
	}
	
	resetMax()
	{
		this.setValue(this.max_value)
	}
	
	resetMin()
	{
		this.setValue(this.min_value)
	}
}