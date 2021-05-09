/* Game class */
class Game
{
	/* Public fields */
	entities = [];
	names = {};
	started = false;
	data = new Date();
	fps = 60;
	
	/* Public methods */
	constructor(id)
	{
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.block = document.getElementById(id);
		
		var arr = ['keydown', 'keyup', 'mousedown', 'mouseup'];
		for(var i in arr)
		{
			document.body.addEventListener(arr[i], Input.handleEvent);
		}
	}
	
	addEntity(ent)
	{
		this.names[ent.name] = ent;
		this.entities.push(ent)
		ent.init();
	}
	
	setSize(w, h)
	{
		this.canvas.width = w;
		this.canvas.height = h;
	}
	
	setStyle(style)
	{
		this.canvas.style = style;
	}
	
	getObject(name)
	{
		if(this.names[name]) return this.names[name];
		else console.log("WARNING. There is no object named '" + name + "'")
	}
	
	setFPS(value)
	{
		this.fps = value
	}
	
	create()
	{
		this.block.appendChild(this.canvas);
	}
	
	start()
	{
		if(!this.started)
		{
			this.started = true;
			var self = this;
			setTimeout(function(){self.loop()}, 1000 / this.fps);
		}
	}
	
	loop()
	{
		if(this.started)
		{
			Time.update()
			Input.update()
			
			this.update()
			this.draw()

			var self = this;
			setTimeout(function(){self.loop()}, 1000 / this.fps);
		}
	}
	
	clear()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	update()
	{
		for(var i in this.entities) 
		{
			this.entities[i].update();
		}
	}
	
	draw()
	{
		this.clear()
		for(var i in this.entities) this.entities[i].draw(this.context);
	}
}

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
	
	draw(context)
	{
		if(this.hasComponent("DrawableComponent"))
		{
			let visual_component = this.getComponent("DrawableComponent");
			visual_component.draw(context)
		}
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
		this.components[value.constructor.name] = value;
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

/* Time class */
class Time
{
	static date = new Date();
	static delta_time = 0;
	
	static update()
	{
		let time = this.date.getTime()
		Time.date = new Date();
		Time.delta_time = (this.date.getTime() - time) / 1000;
	}
}

/* Input handler class */
class Input
{
	static mouse_clicked = {};
	static keyboard_clicked = {};
	
	static update()
	{
		for(let key in Input.mouse_clicked) Input.mouse_clicked[key] = false;
		for(let key in Input.keyboard_clicked) Input.mouse_clicked[key] = false;
	}
	
	static handleEvent(event)
	{		
		switch(event.type)
		{
			case "keydown": 	Input.keyboard_clicked[event.code] = true; break;
			case "keyup": 		delete Input.keyboard_clicked[event.code]; break;
			case "mousedown": 	Input.mouse_clicked[event.button] = true; break;
			case "mouseup": 	delete Input.mouse_clicked[event.button]; break;
		}
	}
	
	static isMousePressed(button)
	{
		return Input.mouse_clicked[button] != undefined;
	}
	
	static isMouseClicked(button)
	{
		return Input.mouse_clicked[button] == true;
	}
	
	static isKeyPressed(button)
	{
		return Input.keyboard_clicked[button] != undefined;
	}
	
	static isKeyClicked(button)
	{
		return Input.keyboard_clicked[button] == true;
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
	
	getDistance(point)
	{
		return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
	}
	
	getDirection(point)
	{
		return Math.atan2(point.y - this.y, point.x - this.x) * 180 / Math.PI;
	}
}

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

/* --------------------------------- Components  -------------------------------------- */
class ComponentBase
{	
	enabled = true;
	joined = {}
	
	init()
	{
		/* Abstract method */
	}
	
	update()
	{
		/* Abstract method */
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

class TransformComponent extends ComponentBase
{	
	position = new Vector2(0, 0);
	size = new Vector2(1, 1);
	axis = new Vector2(0.5, 0.5);
	angle = 0.0;
	
	setPosition(x, y)
	{
		this.position = new Vector2(x, y);
	}
	
	setSize(x, y)
	{
		this.size = new Vector2(x, y);
	}
	
	setAngle(a)
	{
		this.angle = a;
	}
	
	setAxis(x, y)
	{
		this.axis = new Vector2(x, y);
	}
	
	getPosition()
	{
		return this.position;
	}
	
	getSize()
	{
		return this.size;
	}
	
	getAngle()
	{
		return this.angle;
	}
	
	getAxis()
	{
		return this.axis;
	}
	
	move(x, y)
	{
		this.position.x += x;
		this.position.y += y;
	}
	
	move_to(point, speed)
	{
		point.x -= this.position.x;
		point.y -= this.position.y;
		
		var sum = Math.abs(point.x + point.y);
		var len = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
		
		if(len <= speed) this.setPosition(point);
		else this.move((point.x / sum) * speed, (point.y / sum) * speed);
	}
	
	move_around(x, y, angle)
	{	
		let point = new Vector2()
		angle = Math.PI / 180 * angle;
		
		point.x = (this.position.x - x) * Math.cos(angle) - (this.position.y - y) * Math.sin(angle) + x;
		point.y = (this.position.x - x) * Math.sin(angle) + (this.position.y - y) * Math.cos(angle) + y;
		
		this.move(point.x - this.position.x, point.y - this.position.y)
	}
	
	scale(w, h)
	{
		this.size.x *= w;
		this.size.y *= h;
	}
	
	rotate(a)
	{
		this.angle += a;
	}
	
	rotate_at(point)
	{
		let angle = this.position.getDirection(point)
		this.setAngle(angle)
	}
}

class DrawableComponent extends ComponentBase
{	
	shape = null
	visible = true
	opacity = 1.0;
	
	draw(context)
	{
		if(this.visible && this.opacity > 0.0 && this.shape) this.shape.draw(context)
	}
	
	setShape(value)
	{
		this.shape = value;
	}
	
	getOpacity()
	{
		return this.opacity
	}
}

class ShapeComponent extends DrawableComponent
{	
	fill_color = new Color(255, 255, 255)
	stroke_color = new Color(0, 0, 0)
	line_width = 1.0;
	
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
}

class RectShapeComponent extends ShapeComponent
{	
	init()
	{	
		this.join("TransformComponent")
		this.join("DrawableComponent").setShape(this)
	}
	
	draw(context)
	{		
		/* Get data */
		let transform_component = this.joined["TransformComponent"]
		let position = transform_component.getPosition()
		let size = transform_component.getSize()
		let angle = transform_component.getAngle()
		let axis = transform_component.getAxis()

		/* Style */
		context.globalAlpha = this.opacity;
		context.fillStyle = this.fill_color;
		context.strokeStyle = this.stroke_color;
		context.lineWidth = this.line_width;
		
		/* Transform */
		context.translate(position.x, position.y)
		context.translate(size.x * axis.x, size.y * axis.y)
		context.rotate(Math.PI / 180 * angle);
		context.translate(-size.x * axis.x, -size.y * axis.y)
		
		/* Draw */
		context.fillRect(0, 0, size.x, size.y);
		context.strokeRect(0, 0, size.x, size.y);
		context.resetTransform();
	}
}

class PathMovingComponent extends ComponentBase
{
	path = [];
	speed = 50;
	current_point = 0;
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		if(this.path.length)
		{
			let pos = transform_component.getPosition();
			let point = this.path[this.current_point];
			
			transform_component.move_to(point.x, point.y, this.speed * Time.delta_time)
			
			if(point.x == pos.x && point.y == pos.y) this.current_point++;
			if(this.current_point == this.path.length) this.current_point = 0;
		}
	}
}

class WatcherComponent extends ComponentBase
{
	target = null;
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		
		if(this.target)
		{
			let self_component = this.joined["TransformComponent"]
			let target_component = this.target.getComponent("TransformComponent")
			self_component.rotate_at(target_component.getPosition())
		}
	}
}

class RoundMovingComponent extends ComponentBase
{
	speed = 50;
	axis = new Vector2(0, 0);
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]	
		transform_component.move_around(this.axis.x, this.axis.y, this.speed * Time.delta_time)
		if(this.rotating) transform_component.rotate_at(this.axis)
	}
}

class PursuerComponent extends ComponentBase
{
	speed = 5;
	target = null;
	min_radius = 0;
	max_radius = 100;
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let target_transform = this.target.getComponent("TransformComponent")
		if(target_transform)
		{
			let transform_component = this.joined["TransformComponent"];
			let self_pos = transform_component.getPosition();
			let target_pos = target_transform.getPosition();
			let speed = Time.delta_time * this.speed;
			let distance = self_pos.getDistance(target_pos)
			
			console.log(target_pos)
			
			if(distance < this.min_radius) transform_component.move_to(target_pos, -speed)
			else if(distance < this.max_radius) transform_component.move_to(target_pos, speed)
		}
	}
}

class PlayerControlComponent extends ComponentBase
{
	controls = [];
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		let speed = Time.delta_time * 50;
		
		if(Input.isKeyPressed("KeyW")) transform_component.move(0, -speed);
		if(Input.isKeyPressed("KeyS")) transform_component.move(0, speed);
		if(Input.isKeyPressed("KeyA")) transform_component.move(-speed, 0);
		if(Input.isKeyPressed("KeyD")) transform_component.move(speed, 0);
	}
}



