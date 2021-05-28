/* --------------------------------- Components  -------------------------------------- */

/* Character stats stats */
class LifeComponent extends AttributeComponent {}
class ScoreComponent extends AttributeComponent {}

/* Transform component*/
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
		let len = this.position.getDistance(point);
		if(len > 0)
		{
			
			let vector = this.position.getVectorTo(point)
			if(len <= speed) this.setPosition(point.x, point.y);
			else this.move(vector.x * speed, vector.y * speed);
		}
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

/* Rect shape */
class RectShapeComponent extends DrawableComponent
{	
	init()
	{	
		this.join("TransformComponent")
	}
	
	update()
	{		
		if(this.opacity > 0.0)
		{
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			Game.context.fillRect(position.x, position.y, size.x, size.y);
			if(this.line_width > 0.0) Game.context.strokeRect(position.x, position.y, size.x, size.y);
			
			/* Reset*/
			Game.context.resetTransform();
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
		if(this.texture && this.opacity > 0.0)
		{	
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			Game.context.drawImage(Resources.getTexture(this.texture), position.x, position.y, size.x, size.y);
			if(this.line_width > 0.0) Game.context.strokeRect(position.x, position.y, size.x, size.y);
			
			/* Reset*/
			Game.context.resetTransform();
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
			
			transform_component.move_to(point, this.speed * Time.delta_time)
			
			if(point.equals(pos)) this.current_point++;
			if(this.current_point >= this.path.length) this.current_point = 0;
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
			let obj = Game.getObject(this.target)
			let self_component = this.joined["TransformComponent"]
			let target_component = obj.getComponent("TransformComponent")
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
		if(this.target)
		{
			let obj = Game.getObject(this.target)
			let target_transform = obj.getComponent("TransformComponent")
			
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
		if(Input.isKeysPressed(["KeyQ"])) Game.setFullScreen(true);
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

/* Rect colider component*/
class RectColiderComponent extends ColiderComponent
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
	
	isContained(point)
	{
		let rect = this.getRect
		return rect.isContained(point)
	}
}


/* Circle colider component*/
class CircleColiderComponent extends ColiderComponent
{	
	radius = undefined
	offset = new Vector2(0, 0)
	
	init()
	{
		let size = this.join("TransformComponent").getSize()
		if(!this.radius) this.radius = Math.max(size.x, size.y) / 2;
	}

	getRect()
	{	
		let transform_component = this.joined["TransformComponent"];
		let center = transform_component.getCenter();
		
		let diameter = this.radius * 2;
		return new Rect(center.x - this.radius, center.y - this.radius, diameter, diameter);
	}
	
	isContained(point)
	{
		let transform_component = this.joined["TransformComponent"];
		let center = transform_component.getCenter();
		return point.getDistance(center) <= this.radius;
	}
}

/* Damage clickable component */
class DamageClickableComponent extends ClickableComponent
{	
	value = 1;

	init()
	{
		super.init()
		this.join("LifeComponent")
	}
	
	action()
	{
		let life = this.joined["LifeComponent"];
		if(!life.isZero()) life.addValue(-this.value);
	}
}

/* Target bonus clickable component */
class TargetBonusClickableComponent extends ClickableComponent
{	
	score = 100;
	target = null

	init()
	{
		super.init()
		this.join("TransformComponent")
		this.join("ColiderComponent")
	}
	
	action()
	{
		if(this.target)
		{
			let obj = Game.getObject(this.target);
			if(obj)
			{
				let center = this.joined["TransformComponent"].getCenter();
				let radius = this.joined["ColiderComponent"].radius;
				let mouse = this.getCursore();
				
				let score = obj.getComponent("ScoreComponent");
				score.addValue(Math.round(this.score * (1 - mouse.getDistance(center) / radius)))
			}
		}
	}
}

/* Respawn component */
class RespawnComponent extends ComponentBase
{	
	time = 5.0;
	timer = undefined;
	position = undefined;

	init()
	{
		let transform = this.join("TransformComponent")
		this.join("LifeComponent")
		
		if(!this.timer) this.timer = this.time
		if(!this.position) this.position = transform.getPosition();
	}
	
	update()
	{
		let life = this.joined["LifeComponent"];
		if(life.isZero())
		{
			this.timer -= Time.delta_time;
			if(this.timer <= 0.0)
			{
				this.joined["TransformComponent"].setPosition(this.position.x, this.position.y);
				life.resetMax();
				this.timer = this.time;
			}
		}
	}
}

/* Hiding after death component */
class DeathDisolveComponent extends ComponentBase
{
	init()
	{
		this.join("DrawableComponent")
		this.join("LifeComponent")
	}
	
	update()
	{
		let life = this.joined["LifeComponent"];
		let draw = this.joined["DrawableComponent"];
		
		if(!life.isZero() && !draw.isEnabled()) draw.setEnabled(true);
		else if(life.isZero() && draw.isEnabled()) draw.setEnabled(false);

	}
}

/* Cursore camera component */
class CursoreWatcherComponent extends ComponentBase
{	
	init()
	{
		this.join("TransformComponent")
	}

	update()
	{
		let transform = this.joined["TransformComponent"];
		let offset = transform ? transform.getPosition() : new Vector2(0, 0);
		Camera.setCenter(Input.getLocalMouse().add(offset))
	}
}

/* Temporary component */
class TemporaryComponent extends TimerComponent
{
	time = 5.0
	
	action()
	{
		this.owner.container.delete(this.owner)
	}
}

/* Temporary component */
class PunishmentMissclickComponent extends MissclickComponent
{
	value = 100
	
	init()
	{
		this.join("ScoreComponent")
	}
	
	action()
	{
		this.joined["ScoreComponent"].addValue(-this.value);
	}
}