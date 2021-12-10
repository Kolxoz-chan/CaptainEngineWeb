/* Base colider component*/
class ColiderComponent extends ComponentBase
{
	name = "ColiderComponent"

	init(props)
	{
		props.offset = null
		props.objects = []
		props.coliding = false

		this.join("TransformComponent")

		super.init(props)
	}

	isColiding()
	{
		return this.getProperty("coliding")
	}
	
	setObjects(arr)
	{
		this.setProperty("objects", arr)
	}

	getOffset()
	{
		return this.getProperty("offset")
	}

	getObjects()
	{
		return this.getProperty("objects")
	}

	isIntersects(colider)
	{
		let A = this.getRect()
		let B = colider.getRect()
		let C = A.getCommon(B)

		if(!C.isNullSize())
		{
			for(let y = C.y; y < C.y + C.h; y++)
			{
				for(let x = C.x; x < C.x + C.w; x++)
				{
					let point = new Vector2(x, y)
					if(this.isContained(point) && colider.isContained(point)) return true;
				}
			}
		}
		return false;
	}

	update()
	{
		if(this.isColiding())
		{
			let objects = [];
			let container = this.owner.parent ? this.owner.parent : EntitiesSystem.entities
			for(let i in container)
			{
				let obj = container[i]
				if(obj.hasComponent("ColiderComponent") && this.owner !== obj)
				{
					
					let colider = obj.getComponent("ColiderComponent")
					if(colider.isEnabled())
					{
						console.log(this.getRect(), colider.getRect())
						if(this.isIntersects(colider))
						{
							objects.push(obj)
						}
					}
				}
			}
			this.setObjects(objects)
		}
	}
}

/* Rect colider component*/
class RectColiderComponent extends ColiderComponent
{
	init(props)
	{
		props.offset = new Rect(0, 0, 0, 0)
		super.init(props)
	}

	getRect()
	{
		return this.joined["TransformComponent"].getRect().addRect(this.getOffset())
	}

	isContained(point)
	{
		let rect = this.getRect()
		return rect.isConteined(point)
	}
}


/* Circle colider component*/
class CircleColiderComponent extends ColiderComponent
{
	init(props)
	{
		super.init(props)
	}

	getRect()
	{
		let transform_component = this.joined["TransformComponent"];
		return transform_component.getRect()
	}

	isContained(point)
	{
		let rect = this.getRect()
		let center = transform_component.getCenter();
		return point.getDistance(center) <= rect.w / 2;
	}
}

class ASCIIColiderComponent extends ColiderComponent
{
	init(props)
	{
		super.init(props)
		this.join("TransformComponent")
		this.join("DrawableComponent")
	}

	getRect()
	{
		let pos = this.joined["TransformComponent"].getPosition();
		let sprite = this.joined["DrawableComponent"].getSprite();
		let width = 0;

		for(let i in sprite)
		{
			let row = sprite[i]
			if(width < row.length) width = row.length
		}
		return new Rect(pos.x, pos.y, width, sprite.length)
	}

	isContained(point)
	{
		let pos = this.joined["TransformComponent"].getPosition();
		let sprite = this.joined["DrawableComponent"].getSprite();
		let row = sprite[point.y - pos.y]

		if(row)
		{
			
			let value = row[point.x - pos.x]
			if(value)
			{
				return value != " ";
			}
		}
		return false
	}
}
