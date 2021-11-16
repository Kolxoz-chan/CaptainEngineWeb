/* Base colider component*/
class ColiderComponent extends ComponentBase
{
	name = "ColiderComponent"

	default_properties =
	{
		"offset" : null,
		"objects" : [],
		"coliding" : false
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
			let container = this.owner.parent
			for(let i in container.childs)
			{
				if(container.childs[i].hasComponent("ColiderComponent") && this.owner !== container.childs[i])
				{
					let colider = container.childs[i].getComponent("ColiderComponent")
					if(colider.isEnabled())
					{
						if(this.isIntersects(colider))
						{
							objects.push(container.childs[i])
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
	offset = new Rect(0, 0, 0, 0)

	init()
	{
		this.join("TransformComponent")
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
	radius = undefined

	init()
	{
		let size = this.join("TransformComponent").getSize()
		if(!this.radius) this.radius = Math.max(size.x, size.y) / 2;
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
