/* CameraSystem class */
class CameraSystem
{
	static position = new Vector2(0, 0);
	static angle = 0;
	static zoom = 1.0;
	static updated = false;
	static data = {}

	static init()
	{

	}

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

	static apply_transform()
	{
		if(Canvas2DSystem)
		{
			let center = CameraSystem.getCenter()
			let size = CameraSystem.getSize();
			Canvas2DSystem.buffer.translate(-center.x + size.x / 2, -center.y + size.y / 2)
		}
	}

	static getSize()
	{
		return Canvas2DSystem.getSize().mul(CameraSystem.zoom)
	}

	static getRect()
	{
		let pos = CameraSystem.getPosition();
		let size = CameraSystem.getSize();
		return new Rect(pos.x, pos.y, size.width, size.height)
	}
}
