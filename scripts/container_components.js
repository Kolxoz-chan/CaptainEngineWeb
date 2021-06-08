/* BackgroundColorComponent */
class BackgroundColorComponent extends ComponentBase
{
	background = null

	update()
	{
		if(this.background)
		{
			let size = Camera.getSize();
			
			if(this.background.constructor.name == "Gradient") Game.context.fillStyle = this.background.get(Camera.getSize());
			else Game.context.fillStyle = this.background;
			Game.context.fillRect(0, 0, size.x, size.y);
		}
	}
}

/* BackgroundColorComponent */
class ParalaxComponent extends ComponentBase
{
	static AXIS_X = 1 << 0;
	static AXIS_Y = 1 << 1;
	
	position = new Vector2(0.0, 0.0)
	coef = new Vector2(1.0, 1.0)
	repeating = 0
	image = null

	update()
	{
		if(this.image)
		{
			let pos = Camera.getPosition();
			let size = Camera.getSize();
			let img = Resources.getTexture(this.image)
			pos = new Vector2((size.x - img.width) * this.position.x - pos.x * this.coef.x, (size.y - img.height) * this.position.y - pos.y * this.coef.y)
			
			Game.context.drawImage(img, pos.x, pos.y, img.width, img.height);
		}
	}
}