/* Entity class */
class Entity
{
	enabled = true;
	container = null;
	components = {};
	
	/* Public methods */
	constructor(name = null)
	{
		this.name = name;
	}
	
	init()
	{
		for(var key in this.components) this.components[key].init();
	}
	
	update()
	{
		for(var key in this.components)
		{
			if(this.components[key].isEnabled()) this.components[key].update();
		}
	}
	
	addComponent(value, data={})
	{
		let name = value.constructor.name
		if(value.name.length > 0) name = value.name;
		
		this.components[name] = value;
		value.setOwner(this);
		value.setData(data);
	}
	
	hasComponent(name)
	{
		return this.components.hasOwnProperty(name);
	}
	
	getComponent(name)
	{
		if(!this.hasComponent(name)) console.log("WARNING. Object '" + this.name + "' has not '" + name + "' component!")
		return this.components[name];
	}
	
	getContainer()
	{
		return this.container
	}
}

/* Layer of objects*/
class ObjectsLayer
{
	name = ""
	enabled = true;
	container = null;
	entities = []
	
	constructor(name)
	{
		this.name = name;
	}
	
	addObject(obj)
	{
		if(obj.name.length) Game.names[obj.name] = obj;
		this.entities.push(obj)
		obj.container = this;
		obj.init();
	}
	
	getObjecrt(name)
	{
		for(let i in this.entities)
		{
			if(this.entities[i].name == name) return this.entities[i];
		}
		return name
	}
	
	update()
	{
		for(let i in this.entities)
		{
			if(this.entities[i].enabled) this.entities[i].update()
		}
	}
}

/* Level class */
class Level
{
	name = ""
	layers = [];
	
	constructor(name)
	{
		this.name = name;
	}
	
	addLayer(layer)
	{
		layer.container = this;
		this.layers.push(layer)
	}
	
	getLayer(name)
	{
		for(let i in this.layers)
		{
			if(this.layers[i].name == name) return this.layers[i];
		}
		return name
	}
	
	update()
	{
		for(let i in this.layers)
		{
			if(this.layers[i].enabled) this.layers[i].update()
		}
	}
}

/* --------------------------------- Other classes  -------------------------------------- */
class Vector2
{
	x = 0;
	y = 0;
	
	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
	}
	
	equals(point)
	{
		return point.x == this.x && point.y == this.y;
	}
	
	getDistance(point)
	{
		return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
	}
	
	getDirection(point)
	{
		return Math.atan2(point.y - this.y, point.x - this.x) * 180 / Math.PI + 90;
	}
	
	getVectorTo(point)
	{
		let x = point.x - this.x
		let y = point.y - this.y
		let sum = Math.abs(x) + Math.abs(y);
		
		if (this.equals(point)) return new Vector2(0, 0);
		else return new Vector2(x / sum, y / sum);
	}
}

/* Rect class */
class Rect
{
	x = 0; 
	y = 0; 
	w = 0; 
	h = 0;
	
	constructor(x = 0, y = 0, w = 0, h = 0)
	{
		this.x = x
		this.y = y
		this.w = w
		this.h = h
	}
	
	leftTop()
	{
		return new Vector2(this.x, this.y)
	}
	
	leftBottom()
	{
		return new Vector2(this.x, this.y + this.h)
	}
	
	rightTop()
	{
		return new Vector2(this.x + this.w, this.y)
	}
	
	rightBottom()
	{
		return new Vector2(this.x + this.w, this.y + this.h)
	}
	
	isConteined(point)
	{
		let A = this.leftTop()
		let B = this.rightBottom()
		
		return A.x <= point.x && B.x >= point.x && A.y <= point.y && B.y >= point.y
	}
	
	isIntersects(rect)
	{
		let A1 = this.leftTop();
		let B1 = this.rightBottom();
		
		let A2 = rect.leftTop();
		let B2 = rect.rightBottom();
		
		return A1.x <= B2.x && A1.y <= B2.y && B1.x >= A2.x && B1.y >= A2.y
			
	}
	
	equals(rect)
	{
		return rect.x == this.x && rect.y == this.y && rect.w == this.w && rect.h == this.h;
	}
	
	isNullSize()
	{
		return this.w == 0 && this.h == 0;
	}
	
	getCommon(rect)
	{
		let result = new Rect(0, 0, 0, 0);
		
		if(this.isIntersects(rect))
		{
			let A1 = this.leftTop();
			let B1 = this.rightBottom();
			
			let A2 = rect.leftTop();
			let B2 = rect.rightBottom();
			
			result.x = A1.x > A2.x ? A1.x : A2.x
			result.y = A1.y > A2.y ? A1.y : A2.y
			result.w = B1.x < B2.x ? B1.x - A1.x : B2.x - A2.x
			result.h = B1.y < B2.y ? B1.y - A1.y: B2.y - A2.y
		}
		return result;
	}
}

/* Color class */
class Color
{
	r = 0;
	g = 0;
	b = 0;
	a = 255;
	
	constructor(r = 0, g = 0, b = 0, a=255)
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	
	toString()
	{
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}
}