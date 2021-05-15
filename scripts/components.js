/* --------------------------------- Components  -------------------------------------- */
class ComponentBase
{	
	name = ""
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
	name = "DrawableComponent"
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

/* Base colider component*/
class ColiderComponent extends ComponentBase
{	
	name = "ColiderComponent"
	solid = true;

	getRect()
	{
		return new Rect(0, 0, 0, 0)
	}
	
	isIntersects(colider)
	{
		return false;
	}
}

/* Rect colider component*/
class RectColiderComponent extends ComponentBase
{	
	offset = new Rect(0, 0, 0, 0)

	init()
	{
		this.join("TransformComponent")
	}

	getRect()
	{
		let transform_component = this.joined["TransformComponent"]
		let position = transform_component.getPosition()
		let size = transform_component.getSize()
		
		return new Rect(position.x, position.y, size.x, size.y)
	}
	
	isIntersects(colider)
	{
		return false;
	}
	
	isContained(point)
	{
		let rect = this.getRect();
		
		
	}
}


/* Circle colider component*/
class CircleColiderComponent extends ComponentBase
{	
	radius = 10

	getRect()
	{	
		let value = this.radius * 2;
		return new Rect(value, value, value, value);
	}
}

