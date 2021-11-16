/* Transform component*/
class TransformComponent extends ComponentBase
{
	default_properties =
	{
		"angle" : 0,
		"position" : new Vector2(0, 0),
		"velocity" :new Vector2(0, 0),
		"size" : new Vector2(0, 0),
		"axis" : new Vector2(0.5, 0.5),
	}

	update()
	{
		this.setVelocity(new Vector2(0, 0));
	}

	setPosition(vec)
	{
		this.setProperty("position", vec);
	}

	setSize(vec)
	{
		this.setProperty("size", vec);
	}

	getRect()
	{
		let position = this.getProperty("position")
		let size = this.getProperty("size")
		return new Rect(position.x, position.y, size.x, size.y)
	}

	setAngle(a)
	{
		this.setProperty("angle", a);
	}

	setAxis(x, y)
	{
		this.setProperty("axis", new Vector2(x, y))
	}

	setVelocity(vec)
	{
		this.setProperty("velocity", vec);
	}

	getVelocity()
	{
		return this.getProperty("velocity")
	}

	getRealPosition()
	{
		return this.getProperty("position")
	}

	getPosition()
	{
		let pos = this.getRealPosition();
		let vec = new Vector2(0, 0)

		if(this.owner.parent)
		{
			if(this.owner.parent.hasComponent("TransformComponent"))
			{
				vec = this.owner.parent.getComponent("TransformComponent").getPosition()
			}
		}
		/*
		if(this.position_type == VALUE_RELATIVE)
		{
			let size = this.getSize().invert()
			vec = Camera.getPosition()
			vec = vec.add(pos.mulVec(Camera.getSize().add(new Vector2(size.x, size.y * 2))))
		}*/
		return pos.add(vec);
	}

	getCenter()
	{
		let pos = this.getPosition();
		let size = this.getSize();
		return new Vector2(pos.x + size.x / 2, pos.y + size.y / 2)
	}

	getSize()
	{
		return this.getProperty("size");
	}

	getAngle()
	{
		return this.getProperty("angle");
	}

	getAxis()
	{
		return this.getProperty("axis");
	}

	move(vector)
	{
		this.setVelocity(this.getVelocity().add(vector))
		this.setPosition(this.getPosition().add(vector))
	}

	move_to(point, speed)
	{
		let position = this.getPosition();
		let len = position.getDistance(point);
		if(len > 0)
		{
			let vector = position.getVectorTo(point)
			if(len <= speed) this.move(point.sub(position));
			else this.move(vector.mul(speed));
		}
	}

	move_around(axis, angle)
	{
		let position = this.getPosition();
		angle = Math.PI / 180 * angle;

		let point = new Vector2()
		point.x = (position.x - axis.x) * Math.cos(angle) - (position.y - axis.y) * Math.sin(angle) + axis.x;
		point.y = (position.x - axis.x) * Math.sin(angle) + (position.y - axis.y) * Math.cos(angle) + axis.y;

		this.move(point.sub(position))
	}

	scale(vec)
	{
		let size = this.getSize()
		this.setSize(size.mulVec(vec))
	}

	grow(vec)
	{
		let size = this.getSize()
		this.setSize(size.addVec(vec))
	}

	rotate(a)
	{
		let angle = this.getAngle();
		this.setAngle(angle + a);
	}

	rotate_at(point)
	{
		let center = this.getCenter()
		let angle = center.getDirection(point)
		this.setAngle(angle)
	}
}

/* Path Moving Component */
class PathMovingComponent extends ComponentBase
{
	default_properties =
	{
		"path" : [],
		"current_point" : 0,
	}

	init()
	{
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed(), new ITimer())
	}

	getCounter()
	{
		return this.getProperty("current_point")
	}

	getPath()
	{
		return this.getProperty("path")
	}

	getPathSize()
	{
		return this.getPath().length
	}

	getCurentPoint()
	{
		let path = this.getPath()
		let index = this.getCounter();
		return path[index]
	}

	setCounter(value)
	{
		this.setProperty("current_point", value)
	}

	switchPoint()
	{
		let counter = this.getCounter() + 1
		let size = this.getPathSize()

		this.setCounter(counter)
		if(counter >= size) this.setCounter(0);
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		if(this.getPathSize())
		{
			let pos = transform_component.getPosition();
			let point = this.getCurentPoint();

			transform_component.move_to(point, this.getSpeed() * Time.delta_time)

			if(point.equals(pos))
			{
				if(!this.updateTimer())
				{
					this.switchPoint()
				}
			}
		}
	}
}

/* Path Moving Component */
class BrownianMovingComponent extends ComponentBase
{
	init()
	{
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed())
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		let vec = Vector2.random();
		transform_component.move(vec.mul(Time.delta_time * this.getSpeed()))
	}
}

/* Watcher Component */
class WatcherComponent extends ComponentBase
{
	init()
	{
		this.join("TransformComponent")
		this.addIntefaces(new ITarget())
	}

	update()
	{
		let target = this.getTarget()
		if(target)
		{
			let self_component = this.joined["TransformComponent"]
			let target_component = obj.getComponent("TransformComponent")
			self_component.rotate_at(target_component.getCenter())
		}
	}
}

/* Round Moving Component */
class RoundMovingComponent extends ComponentBase
{
	default_properties =
	{
		"axis" : new Vector2(0, 0)
	}

	init()
	{
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed())

	}

	getAxis()
	{
		return this.getProperty("axis")
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		transform_component.move_around(this.getAxis(), this.getSpeed() * Time.delta_time)
	}
}

class PursuerComponent extends ComponentBase
{
	default_properties =
	{
		"min_radius" : 0,
		"middle_radius" : 0,
		"max_radius" : 100
	}

	init()
	{
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed(), new ITarget())
	}

	getMinRadius()
	{
		return this.getProperty("min_radius")
	}

	getMiddleRadius()
	{
		return this.getProperty("middle_radius")
	}

	getMaxRadius()
	{
		return this.getProperty("max_radius")
	}

	update()
	{

		let obj = this.getTarget()

		if(obj)
		{
			let target_transform = obj.getComponent("TransformComponent")
			let transform_component = this.joined["TransformComponent"];

			let self_pos = transform_component.getPosition();
			let target_pos = target_transform.getPosition();

			let speed = Time.delta_time * this.getSpeed();
			let distance = self_pos.getDistance(target_pos)

			if(distance < this.getMinRadius()) transform_component.move_to(target_pos, -speed)
			else if(distance < this.getMiddleRadius()) return;
			else if(distance < this.getMaxRadius()) transform_component.move_to(target_pos, speed)
		}
	}
}

/* Camera component */
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

/* Gravity component */
class GravityComponent extends ComponentBase
{
	default_properties =
	{
		"vector" : new Vector2(0, 0)
	}
	
	getVector()
	{
		return this.getProperty("vector")
	}

	init()
	{
		this.join("TransformComponent")
	}

	update()
	{
		let vec = this.getVector();
		this.joined["TransformComponent"].move(vec.mul(Time.delta_time))
	}
}
