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
		
		/* Init classes */
		Camera.init(this.canvas)
		Input.init(this.canvas)
		
		/* Init events */
		var arr = ['keydown', 'keyup', 'mousedown', 'mouseup', "mousemove"];
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
			setTimeout(() => {this.loop()}, 1000 / this.fps);
		}
	}
	
	loop()
	{
		if(this.started)
		{
			Time.update()
			Input.update()
			
			this.update()

			setTimeout(() => {this.loop()}, 1000 / this.fps);
		}
	}
	
	update()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(var i in this.entities) 
		{
			this.entities[i].update();
		}
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

/* Camera class */
class Camera
{
	static context = null;
	static canvas = null;
	static center = new Vector2(0, 0);
	static angle = 0;
	static zoom = 1.0
	
	static init(canvas)
	{
		Camera.canvas = canvas;
		Camera.context = canvas.getContext("2d");
	}
	
	static getPosition()
	{
		let size = Camera.getSize();
		return new Vector2(Camera.center.x - size.x / 2, Camera.center.y - size.y / 2)
	}
	
	static setCenter(point)
	{
		Camera.center = point
	}
	
	static apply_transform()
	{
		if(Camera.context)
		{
			let size = Camera.getSize();
			Camera.context.translate(-Camera.center.x + size.x / 2, -Camera.center.y + size.y / 2,)
		}
	}
	
	static getSize()
	{
		return new Vector2(Camera.canvas.width, Camera.canvas.height)
	}
}

/* Resources class */
class Resources
{
	static textures = {}
	static loading_counter = 0;
	
	static isLoaded()
	{
		return Resources.loading_counter == 0;
	}
	
	static loadTexture(name, src)
	{
		Resources.loading_counter += 1;
		
		Resources.textures[name] = new Image();
		Resources.textures[name].src = src;
		Resources.textures[name].onload = function()
		{
			Resources.loading_counter -= 1;
		}
	}
	
	static getTexture(name)
	{
		return Resources.textures[name];
	}
}

/* Input handler class */
class Input
{
	static canvas = null;
	static mouse_pos = new Vector2(0, 0);
	static mouse_clicked = {};
	static keyboard_clicked = {};
	
	static init(canvas)
	{
		Input.canvas = canvas;
	}
	
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
			case "mousemove":  	if(Input.canvas) Input.mouse_pos = new Vector2(event.clientX-Input.canvas.offsetLeft,event.clientY-Input.canvas.offsetTop); break;
		}
	}
	
	static getGlobalMouse()
	{
		let point = Camera.getPosition()
		return new Vector2(Input.mouse_pos.x + point.x, Input.mouse_pos.y + point.y);
	}
	
	static getLocalMouse()
	{
		return Input.mouse_pos;
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
	
	static isKeysPressed(arr, and=false)
	{
		let result = false;
		if(arr.length > 0)
		{
			result = Input.isKeyPressed(arr[0]);
			
			for(let i = 1; i<arr.length; i++) 
			{
				if(and) result = Input.isKeyPressed(arr[i]) && result;
				else result = Input.isKeyPressed(arr[i]) || result;
			}
		}
		return result;
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
	
	getCenter()
	{
		return new Vector2(this.position.x+this.size.x/2, this.position.y+this.size.y/2)
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
		let len = this.position.getDistance(point)
		let vector = this.position.getVectorTo(point)
		
		if(len <= speed) this.setPosition(point.x, point.y);
		else this.move(vector.x * speed, vector.y * speed);
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
		let center = this.getCenter()
		let angle = center.getDirection(point)
		this.setAngle(angle)
	}
}

class DrawableComponent extends ComponentBase
{	
	fill_color = new Color(255, 255, 255)
	stroke_color = new Color(0, 0, 0)
	line_width = 0.0;
	opacity = 1.0;
	context = null;
	
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
	
	applyStyles()
	{
		this.context.globalAlpha = this.opacity;
		this.context.fillStyle = this.fill_color;
		this.context.strokeStyle = this.stroke_color;
		this.context.lineWidth = this.line_width;
	}
	
	applyTransformation()
	{
		let transform_component = this.joined["TransformComponent"]
		let position = transform_component.getPosition()
		let size = transform_component.getSize()
		let angle = transform_component.getAngle()
		let axis = transform_component.getAxis()
		
		Camera.apply_transform()
		
		this.context.translate(position.x + size.x * axis.x, position.y + size.y * axis.y)
		this.context.rotate(Math.PI / 180 * angle);
		this.context.translate(-size.x * axis.x - position.x, -size.y * axis.y - position.y)
	}
}

/* Rect shape */
class RectShapeComponent extends DrawableComponent
{	
	init()
	{	
		this.join("TransformComponent")
	}
	
	update()
	{		
		if(this.context && this.opacity > 0.0)
		{
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			this.context.fillRect(position.x, position.y, size.x, size.y);
			if(this.line_width > 0.0) this.context.strokeRect(position.x, position.y, size.x, size.y);
			
			/* Reset*/
			this.context.resetTransform();
		}
	}
}

class ImageComponent extends DrawableComponent
{
	texture = null;
	
	init()
	{	
		this.join("TransformComponent")
	}
	
	update()
	{		
		if(this.context && this.texture && this.opacity > 0.0)
		{	
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			this.context.drawImage(this.texture, position.x, position.y, size.x, size.y);
			if(this.line_width > 0.0) this.context.strokeRect(position.x, position.y, size.x, size.y);
			
			/* Reset*/
			this.context.resetTransform();
		}
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
			self_component.rotate_at(target_component.getCenter())
		}
	}
}

class MouseWatcherComponent extends ComponentBase
{	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let self_component = this.joined["TransformComponent"]
		self_component.rotate_at(Input.getGlobalMouse())
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
	}
}

class PursuerComponent extends ComponentBase
{
	speed = 50;
	target = null;
	min_radius = 0;
	middle_radius = 0;
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
			
			if(distance < this.min_radius) transform_component.move_to(target_pos, -speed)
			else if(distance < this.middle_radius) return;
			else if(distance < this.max_radius) transform_component.move_to(target_pos, speed)
		}
	}
}

class PlayerControlComponent extends ComponentBase
{
	controls = {};
	acceleration = 2.0
	running = false
		
	init()
	{
		this.join("TransformComponent")
		
		this.addControl("Run", ["ShiftLeft", "ShiftRight"]);
		this.addControl("GoAhead", ["KeyW", "ArrowUp"]);
		this.addControl("GoBack", ["KeyS", "ArrowDown"]);
		this.addControl("GoLeft", ["KeyA", "ArrowLeft"]);
		this.addControl("GoRight", ["KeyD", "ArrowRight"]);
	}
	
	addControl(action, buttons)
	{
		this.controls[action] = buttons;
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		let speed = Time.delta_time * 50;
		
		/* Acceleration */
		if(Input.isKeysPressed(this.controls["Run"])) 
		{
			this.running = true;
			speed *= this.acceleration;
		}
		else this.running = false;
		
		/* Moving */
		if(Input.isKeysPressed(this.controls["GoAhead"])) transform_component.move(0, -speed);
		if(Input.isKeysPressed(this.controls["GoBack"])) transform_component.move(0, speed);
		if(Input.isKeysPressed(this.controls["GoLeft"])) transform_component.move(-speed, 0);
		if(Input.isKeysPressed(this.controls["GoRight"])) transform_component.move(speed, 0);
	}
}

class LifeComponent extends ComponentBase
{	
	health_max = 100
	health_value = this.health_max
	
	resurrect()
	{
		this.health_value = this.health_max
	}
	
	kill()
	{
		this.health_value = 0
	}
	
	isFine()
	{
		this.health_value == this.health_max; 
	}
	
	isAlife()
	{
		this.health_value > 0;
	}
	
	addHealth(value)
	{
		this.health_value += value
		if(this.health_value > this.health_max) 
		{
			this.health_value = this.health_max
		}
	}
}

class CameraComponent extends ComponentBase
{	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		let transform_component = this.joined["TransformComponent"]
		Camera.setCenter(transform_component.getCenter())
	}
}

