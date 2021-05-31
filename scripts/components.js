/* --------------------------------- Components  -------------------------------------- */

/* Character stats stats */
class ScoreComponent extends AttributeComponent 
{
	value = 0;
}

class LifeComponent extends AttributeComponent 
{
	max_value = 100;
	min_value = 0
	
	init()
	{
		if(!this.value) this.value = this.max_value
	}
}

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

/* Image component */
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

/* Text component */
class TextComponent extends DrawableComponent
{
	text = "";
	font = null
	outline = true;
	
	init()
	{	
		this.join("TransformComponent")
	}
	
	update()
	{		
		if(this.text.length && this.opacity > 0.0 && this.font)
		{	
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			
			/* Settings */
			this.applyStyles();
			this.applyTransformation()
			
			/* Draw */
			Game.context.font = this.font;
			if(this.outline) Game.context.strokeText(this.text, position.x, position.y);
			Game.context.fillText(this.text, position.x, position.y);
			
			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

/* Path Moving Component */
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

/* Watcher Component */
class SoundComponent extends ComponentBase
{
	sound = null;
	autoplay = false;
	loop = false;
	
	play()
	{
		let audio = Resources.getAudio(this.sound)
		audio.play();
	}
}

/* Watcher Component */
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

/* Mouse Watcher Component */
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

/* Round Moving Component */
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

/* Hiding after death component */
class GravityComponent extends ComponentBase
{
	vector = new Vector2(0, 0)
	
	init()
	{
		this.join("TransformComponent")
	}
	
	update()
	{
		this.joined["TransformComponent"].move(this.vector.x, this.vector.y)
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
		if(!this.position) this.position = transform.getPosition();
	}
	
	update()
	{
		let life = this.joined["LifeComponent"];
		if(life.isZero())
		{
			if(!this.timer) this.timer = this.time
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
class DissolveComponent extends TimerComponent
{
	max_time = undefined;
	
	init()
	{
		this.max_time = this.time
		this.join("DrawableComponent")
	}
	
	tic()
	{
		this.joined["DrawableComponent"].setOpacity(this.time / this.max_time)
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

/* Score Indicator Spawner */
class ScoreIndicatorSpawnerComponent extends AttributeEventComponent
{	
	container = null
	prefab = null

	action(old_value, new_value)
	{
		let value = new_value - old_value
		let layer = Game.current_level.getLayer(this.container)
		let prefab = Resources.getPrefab(this.prefab)
		layer.addObject(prefab.getEntity({
			"TransformComponent" : {"position" : Input.getLocalMouse()},
			"TextComponent" : {"text" : String(value), "fill_color" : value > 0 ? new Color(0, 255, 0) : new Color(255, 0, 0)}}))
	}
}

/* Dead Disabler Component */
class DeadDisablerComponent extends DeadEventComponent
{	
	reversable = true
	enablers = []
	disablers = []
	
	revival_action()
	{
		if(this.reversable)
		{
			for(let i in this.enablers)
			{
				let component = this.owner.getComponent(this.enablers[i])
				if(component) component.setEnabled(false);
			}
			for(let i in this.disablers) 
			{
				let component = this.owner.getComponent(this.disablers[i])
				if(component) component.setEnabled(true);
			}
		}
	}
	
	dead_action()
	{
		for(let i in this.enablers)
		{
			let component = this.owner.getComponent(this.enablers[i])
			if(component) component.setEnabled(true);
		}
		for(let i in this.disablers) 
		{
			let component = this.owner.getComponent(this.disablers[i])
			if(component) component.setEnabled(false);
		}
	}
}

/* Image component */
class CursoreColider extends ComponentBase
{
	objects = []
	container = null;
	global_cursor = true;
	
	getCursore()
	{
		return this.global_cursor ? Input.getGlobalMouse() : Input.getLocalMouse();
	}
	
	update()
	{	
		this.objects = [];
		let container = this.container ? Game.current_level.getLayer(this.container) : this.owner.container;
		for(let i in container.entities)
		{
			if(container.entities[i].hasComponent("ColiderComponent"))
			{
				let colider = container.entities[i].getComponent("ColiderComponent")
				if(colider.isContained(this.getCursore())) this.objects.push(container.entities[i])
			}
		}
	}
}

/* Damage clickable component */
class DamageClickComponent extends ClickComponent
{	
	value = 1;
	
	action(obj)
	{
		let life = obj.getComponent("LifeComponent");
		if(life)
		{
			if(!life.isZero()) life.addValue(-this.value);
		}
	}
}

/* Damage clickable component */
class AwardClickComponent extends ClickComponent
{	
	penalty = 100

	init()
	{
		super.init()
		this.join("ScoreComponent")
	}
	
	action(obj)
	{	
		if(obj.hasComponent("TransformComponent") && obj.hasComponent("ColiderComponent") && obj.hasComponent("ScoreComponent"))
		{
			let center = obj.getComponent("TransformComponent").getCenter();
			let radius = obj.getComponent("ColiderComponent").radius;
			let score = obj.getComponent("ScoreComponent").getValue();
			let mouse = this.joined["CursoreColider"].getCursore();
			
			this.joined["ScoreComponent"].addValue(Math.ceil(score * (1 - mouse.getDistance(center) / radius)))
		}
	}
	
	miss()
	{
		let score = this.joined["ScoreComponent"];
		score.addValue(-this.penalty)
	}
}

/* Damage clickable component */
class SoundClickComponent extends ClickComponent
{	
	miss_sound = null

	action(obj)
	{	
		if(obj.hasComponent("SoundComponent"))
		{
			obj.getComponent("SoundComponent").play();
		}
	}
	
	miss()
	{
		if(this.miss_sound)
		{
			Resources.getAudio(this.miss_sound).play()
		}
	}
}