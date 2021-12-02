/* CameraSystem class */
class CameraSystem
{
	static size = new Vector2(0, 0);
	static position = new Vector2(0, 0);
	static angle = 0;
	static zoom = 1.0;
	static updated = false;
	static data = {}

	static update()
	{
		if(CameraSystem.updated)
		{
			for(let i in CameraSystem.data)
			{
				CameraSystem[i] = CameraSystem.data[i]
			}
			CameraSystem.data = {}
			CameraSystem.updated = false;
		}
	}

	static getCenter()
	{
		let pos = CameraSystem.getPosition();
		let size = CameraSystem.getSize();

		return new Vector2(pos.x + size.x / 2, pos.y + size.y / 2)
	}

	static getPosition()
	{
		return CameraSystem.position;
	}

	static setPosition(point)
	{
		CameraSystem.data.position = new Vector2(point.x, point.y)
		CameraSystem.updated = true;
	}

	static setCenter(point)
	{
		let size = CameraSystem.getSize();
		CameraSystem.setPosition(new Vector2(point.x - size.x / 2, point.y - size.y / 2))
	}

	static setSize(vec)
	{
		CameraSystem.data.size = vec;
	}


	static apply_transform()
	{
		if(Game.context)
		{
			let center = CameraSystem.getCenter()
			let size = CameraSystem.getSize();
			Game.context.translate(-center.x + size.x / 2, -center.y + size.y / 2)
		}
	}

	static getSize()
	{
		return CameraSystem.size;
	}

	static getRect()
	{
		let pos = CameraSystem.getPosition();
		let size = CameraSystem.getSize();
		return new Rect(pos.x, pos.y, size.width, size.height)
	}
}
