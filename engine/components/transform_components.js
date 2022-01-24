/* Transform component*/
class TransformComponent extends ComponentBase
{
	init(props)
	{
		props.angle = 0;
		props.position = new Vector2(0, 0);
		props.velocity = new Vector2(0, 0);
		props.size = new Vector2(0, 0);

		super.init(props)
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
		let position = this.getCenter();
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

class GridLayoutComponent extends ComponentBase
{
	init(props)
	{
		props.padding = 0
		props.spacing = 0
		props.item_size = new Vector2(64, 64)
		props.map = {}

		super.init(props)
	}

	getItemSize()
	{
		return this.getProperty("item_size")
	}

	setOnMap(pos, obj)
	{
		if(!props.map[pos.x]) props.map[pos.x] = {}
		props.map[pos.x][pos.y] = obj
	}
}

class GridItemComponent extends ComponentBase
{
	init(props)
	{
		props.position = new Vector2(0, 0)
		super.init(props)
		let grid = this.owner.detComponent("GridLayoutComponent")
		grid.setOnMap(props.position, this)

	}

	getPosition()
	{
		return this.getProperty("position")
	}

	setPosition(vec)
	{
		this.setProperty("position", vec)
	}

	move(vec)
	{
		let pos = this.getPosition()
		this.setPosition(pos.add(vec))
	}

	update()
	{
		let transform = this.owner.getComponent("TransformComponent")
		let grid = this.owner.parent.getComponent("GridLayoutComponent")

		let pos = this.getPosition()
		let size = grid.getItemSize()

		transform.setPosition(pos.mulVec(size))
		transform.setSize(size)
	}
}

/* Path Moving Component */
class PathMovingComponent extends ComponentBase
{
	init(props)
	{
		props.path = []
		props.current_point = 0

		super.init(props)
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

			transform_component.move_to(point, this.getSpeed() * TimeSystem.getDeltaTime())

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
	init(props)
	{
		super.init(props)
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed())
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		let vec = Vector2.random();
		transform_component.move(vec.mul(TimeSystem.getDeltaTime() * this.getSpeed()))
	}
}

/* Watcher Component */
class WatcherComponent extends ComponentBase
{
	init(props)
	{
		super.init(props)
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
	init(props)
	{
		props.axis = new Vector2(0, 0);

		super.init(props)
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed(), new ITarget())

	}

	getAxis()
	{
		let target = this.getTarget();
		if(target)
		{
			if(target.hasComponent("TransformComponent"))
			{
				return target.getComponent("TransformComponent").getCenter()
			}
		}
		return this.getProperty("axis")
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		transform_component.move_around(this.getAxis(), this.getSpeed() * TimeSystem.getDeltaTime())
	}
}

class PursuerComponent extends ComponentBase
{
	init(props)
	{
		props.min_radius = 0
		props.middle_radius = 0
		props.max_radius = 100

		super.init(props)
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

			let self_pos = transform_component.getCenter();
			let target_pos = target_transform.getCenter();

			let speed = TimeSystem.getDeltaTime() * this.getSpeed();
			let distance = self_pos.getDistance(target_pos)

			if(distance < this.getMinRadius()) transform_component.move_to(target_pos, -speed)
			else if(distance < this.getMiddleRadius()) return;
			else if(distance < this.getMaxRadius()) transform_component.move_to(target_pos, speed)
		}
	}
}

/* Camera component */
class CameraOperatorComponent extends ComponentBase
{
	init(props)
	{
		super.init(props)
		this.join("TransformComponent")
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		CameraSystem.setCenter(transform_component.getCenter())
	}
}

/* Gravity component */
class GravityComponent extends ComponentBase
{
	init(props)
	{
		props.vector = new Vector2(0, 0)

		super.init(props)
		this.join("TransformComponent")
	}

	getVector()
	{
		return this.getProperty("vector")
	}

	update()
	{
		let vec = this.getVector();
		this.joined["TransformComponent"].move(vec.mul(TimeSystem.getDeltaTime()))
	}
}

class MapGeneratorComponent extends ComponentBase
{
	init(props)
	{
		props.map_size = new Vector2(64, 64)
		props.prefabs = {} // {"tree_01" : {"chance" : {"value" : 20}, "in_radius" : {"object" : "tree_01"}}

		super.init(props)
	}

	getMapSize()
	{
		return this.getProperty("map_size")
	}

	getPrefabs()
	{
		return this.getProperty("prefabs")
	}

	condition(name, args)
	{
		if(name == "chance")
		{
			return MathSystem.random_chance(args[0])
		}
	}

	createEntity(prefabs, vec)
	{
		for(let name in prefabs)
		{
			let result = true
			let arr = prefabs[name]

			for(let i in arr)
			{
				let cond = arr[i]
				let key = Object.keys(cond)[0]
				result = result && this.condition(key, cond[key])
			}

			if(result)
			{
				return ResourcesSystem.createEntity(name,
				{
					"GridItemComponent" : {"position" : vec},
					"TransformComponent" : {}

				})
			}
		}

		return null
	}

	update()
	{
		if(this.isEnabled())
		{
			let size = this.getMapSize()
			let prefabs = this.getPrefabs()
			for(let y=0; y<size.y; y++)
			{
				for(let x=0; x<size.x; x++)
				{
					let obj = this.createEntity(prefabs, new Vector2(x, y))
					if(obj)
					{
						this.owner.addChild(obj)
					}
				}
			}
			this.setEnabled(false)
		}
	}
}
