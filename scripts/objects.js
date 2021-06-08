/* Native classes */
Object.copy = function(obj, target = {})
{
	for(let i in obj) 
	{	
		if(obj[i] instanceof Array)
		{
			target[i] = Object.copy(obj[i], []);
			continue;
		}
		if(obj[i] instanceof Object) 
		{
			target[i] = Object.copy(obj[i], new obj[i].constructor());
			continue;
		}
		target[i] = obj[i];
	}
	return target;
}

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
	
	reset()
	{
		for(var key in this.components) this.components[key].reset();
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
	
	setEnabled(value)
	{
		this.enabled = value;
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

class Container
{
	name = ""
	enabled = true;
	container = null;
	entities = []
	components = {}
	
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
		if(!this.hasComponent(name)) console.log("WARNING. Container '" + this.name + "' has not '" + name + "' component!")
		return this.components[name];
	}
}

/* Layer of objects*/
class ObjectsLayer extends Container
{
	delete_queue = []
	
	constructor(name)
	{
		super() 
		this.name = name;
	}
	
	addObject(obj)
	{
		if(obj.name) Game.names[obj.name] = obj;
		this.entities.push(obj)
		obj.container = this;
		obj.reset();
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
	
	delete(obj)
	{
		this.delete_queue.push(obj);
	}
	
	update()
	{
		for(var key in this.components)
		{
			if(this.components[key].isEnabled()) this.components[key].update();
		}
		
		for(let i in this.delete_queue)
		{
			let index = this.entities.indexOf(this.delete_queue[i])
			this.entities.splice(index, 1)
		}
		
		this.delete_queue = []
		
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
	
	copy()
	{
		return new Vector2(this.x, this.y); 
	}
	
	equals(point)
	{
		return point.x == this.x && point.y == this.y;
	}
	
	add(vector)
	{
		return new Vector2(this.x + vector.x, this.y + vector.y)
	}
	
	sub(vector)
	{
		return new Vector2(this.x - vector.x, this.y - vector.y)
	}
	
	mul(value)
	{
		return new Vector2(this.x * value, this.y * value)
	}
	
	mulVec(vector)
	{
		return new Vector2(this.x * vector.x, this.y * vector.y)
	}
	
	invert()
	{
		return new Vector2(-this.x, -this.y)
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
		
		if(sum == 0) return new Vector2(0, 0);
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

class Gradient
{	
	spectrum = {}

	static create(begin = new Vector2(0, 0), end = new Vector2(0, 1))
	{
		return new Gradient(begin, end)
	}

	constructor(begin = new Vector2(0, 0), end = new Vector2(0, 1))
	{
		this.begin = begin
		this.end = end
	}
	
	add(coef, color)
	{
		this.spectrum[coef] = color
		return this;
	}
	
	get(size = new Vector2(1, 1))
	{
		let grd = Game.context.createLinearGradient(size.x * this.begin.x, size.y * this.begin.y, size.x * this.end.x, size.y * this.end.y);
		for(let i in this.spectrum)
		{
			grd.addColorStop(i, this.spectrum[i]);
		}
		
		return grd;
	}
}

/* Font class */
class Font
{
	name = ""
	size = 14
	style = 0
	
	constructor(name, size=14, style=0)
	{
		this.name = name
		this.size = size
		this.style = style
	}
	
	toString()
	{
		return `${this.size}px ${this.name}`
	}
}

/* Textures class */
class Texture
{
	name = ""
	rect = new Rect()
	
	constructor(name, rect = null)
	{
		this.name = name
		this.rect = rect
	}
	
	draw(position, size = null)
	{
		if(size) Game.context.drawImage(Resources.getTexture(this.name), position.x, position.y, size.x, size.y);
		else Game.context.drawImage(Resources.getTexture(this.name), position.x, position.y);
	}
}

/* Prefab class */
class Prefab
{
	name = ""
	components = {}
	
	constructor(name = "")
	{
		this.name = name
	}
	
	addComponent(name, props = {})
	{
		this.components[name] = props
	}
	
	getEntity(props = {})
	{
		let comps = Object.copy(this.components);
		
		for(let i in props)
		{
			for(let x in props[i])
			{
				comps[i][x] = props[i][x]
			}
		}
		
		let obj = new Entity()
		for(let i in comps)
		{
			obj.addComponent(eval("new " + i + "()"), comps[i])
		}
		
		return obj;
	}
}