/* Entity class */
class Entity
{
	/* Public fields */
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
}

/* Layer of objects*/
class Layer
{
	entities = []
	
	addObject(obj)
	{
		this.names[obj.name] = obj;
		this.entities.push(obj)
		obj.init();
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
	poisition = new Vector2();
	size = new Vector2();
	
	constructor(x = 0, y = 0, w = 0, h = 0)
	{
		this.poisition = new Vector2(x, y);
		this.size = new Vector2(w, h);
	}
	
	leftTop()
	{
		return new Vector2(this.poisition.x, this.poisition.y)
	}
	
	leftBottom()
	{
		return new Vector2(this.poisition.x, this.poisition.y + this.size.y)
	}
	
	rightTop()
	{
		return new Vector2(this.poisition.x + this.size.x, this.poisition.y)
	}
	
	rightBottom()
	{
		return new Vector2(this.poisition.x + this.size.x, this.poisition.y + this.size.y)
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
		let B1 = this.leftBottom();
		let C1 = this.rightTop();
		let D1 = this.rightBottom();
		
		let A2 = rect.leftTop();
		let B2 = rect.leftBottom();
		let C2 = rect.rightTop();
		let D2 = rect.rightBottom();
		
		return
			A1.x <= B2.x && A1.y <= D2.y &&
			B1.x >= A2.x && B1.y <= C2.y &&
			C1.x >= D2.x && C1.y >= B2.y &&
			D1.x <= С2.x && D1.y >= A2.y
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