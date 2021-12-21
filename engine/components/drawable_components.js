/* Drawable сomponent */
class DrawableComponent extends ComponentBase
{
	name = "DrawableComponent"

	init(props)
	{
		props.fill_color =  new Color(255, 255, 255)
		props.stroke_color = new Color(0, 0, 0)
		props.line_width = 1.0
		props.opacity = 1.0
		props.autodraw = true
		props.is_drawn = false

		this.join("TransformComponent")

		super.init(props)
	}

	getOpacity()
	{
		return this.getProperty("opacity")
	}

	getFillColor()
	{
		return this.getProperty("fill_color")
	}

	getStrokeColor()
	{
		return this.getProperty("stroke_color")
	}

	getLineWidth()
	{
		return this.getProperty("line_width")
	}

	setFillColor(color)
	{
		this.setProperty("fill_color", color)
	}

	setStrokeColor(color)
	{
		this.setProperty("stroke_color", color)
	}

	setLineWidth(value)
	{
		this.setProperty("line_width", value)
	}

	setOpacity(value)
	{
		this.setProperty("opacity", value)
	}

	isVisible()
	{
		return this.getOpacity() > 0.0;
	}

	setDrawn(value)
	{
		this.setProperty("is_drawn", value)
	}

	update()
	{
		if(this.isVisible() && (this.getProperty("autodraw") || this.getProperty("is_drawn")))
		{
			/* Get data */
			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()

			/* Settings */
			//this.applyStyles();
			//this.applyTransformation()

			this.draw(position, size);

			/* Reset*/
			//Game.context.resetTransform();
			this.setDrawn(false);
		}
	}

	applyStyles()
	{
		Game.context.globalAlpha = this.getOpacity();
		Game.context.fillStyle = this.getFillColor();
		Game.context.strokeStyle = this.getStrokeColor();
		Game.context.lineWidth = this.getLineWidth();
	}

	applyTransformation()
	{
		let transform_component = this.joined["TransformComponent"]
		let position = transform_component.getPosition()
		let size = transform_component.getSize()
		let angle = transform_component.getAngle()
		let axis = transform_component.getAxis()

		Camera.apply_transform()

		Game.context.translate(position.x + size.x * axis.x, position.y + size.y * axis.y)
		Game.context.rotate(Math.PI / 180 * angle);
		Game.context.translate(-size.x * axis.x - position.x, -size.y * axis.y - position.y)
	}
}

/* Rect shape */
class RectShapeComponent extends DrawableComponent
{
	init(props)
	{
		super.props(props)
	}

	draw(position, size)
	{
		Game.context.fillRect(position.x, position.y, size.x, size.y);
		if(this.getLineWidth() > 0.0) Game.context.strokeRect(position.x, position.y, size.x, size.y);
	}
}

/* Circle shape */
class CircleShapeComponent extends DrawableComponent
{
	init(props)
	{
		super.init(props)
	}

	draw(position, size)
	{
		let radiuses = new Vector2(size.x/2, size.y/2)
		let center = position.add(radiuses)

		Game.context.beginPath();
		Game.context.ellipse(center.x, center.y, radiuses.x, radiuses.y, Math.PI, 0, Math.PI * 2, true);
		Game.context.fill();
		Game.context.stroke();
	}
}

/* Circle shape */
class ASCIISpriteComponent extends DrawableComponent
{
	init(props)
	{
		props.sprite = []
		super.init(props)

		this.text_canvas = Game.getSystem("TextCanvasSystem")
	}

	getSprite()
	{
		return this.getProperty("sprite")
	}

	draw(position, size)
	{
		this.text_canvas.draw(position, this.getSprite())
	}
}

/* Image component */
class ImageComponent extends DrawableComponent
{
	init(props)
	{
		props.texture = ""
		props.line_width = 0.0

		super.init(props)
	}

	getTexture()
	{
		let texture = this.getProperty("texture")
		return Resources.bitmaps[texture] ? Resources.bitmaps[texture]  : Resources.getTexture(texture)
	}


	isVisible()
	{
		return this.getTexture() && this.getOpacity() > 0.0
	}

	draw(position, size)
	{
		let image = this.getTexture()
		if(image)
		{
			Game.context.drawImage(image, position.x, position.y);
			//if(this.line_width > 0.0) Game.context.strokeRect(rect.x, rect.y, rect.w, rect.h);
		}
	}
}

/* Text component */
class TextComponent extends DrawableComponent
{
	init(props)
	{
		props.text = ""
		props.font = "14px Arial"
		props.outline = true

		super.init(props)
	}

	getText()
	{
		return this.getProperty("text")
	}

	getFont()
	{
		return this.getProperty("font")
	}

	isOutline()
	{
		return this.getProperty("outline")
	}

	isVisible()
	{
		return this.getText() && this.getOpacity() > 0.0 && this.getFont();
	}

	draw(position, size)
	{	let text = getText()
		Game.context.font = this.getFont();
		if(this.isOutline()) Game.context.strokeText(text, position.x, position.y + size.y);
		Game.context.fillText(text, position.x, position.y + size.y);
	}
}

/* Polygon component */
class PolygonComponent extends DrawableComponent
{
	init(props)
	{
		props.points = []
		props.closed = false
		props.line_width = 1.0

		super.init(props)
	}

	addPoint(point)
	{
		this.points.push(point)
	}

	deletePoint(index)
	{
		if(index < 0) index = this.points.length + index
		this.points.splice(index, 1);
	}

	setPoint(index, point)
	{
		if(index < 0) index = this.points.length + index
		this.points[index] = point;
	}

	isVisible()
	{
		return this.opacity > 0 && this.points.length > 0
	}

	draw(position, size)
	{
		Game.context.beginPath();
		Game.context.moveTo(this.points[0].x, this.points[0].y);
		for(let i=1; i<this.points.length; i++)
		{
			Game.context.lineTo(this.points[i].x, this.points[i].y);
		}
		if(this.closed) Game.context.closePath();
		Game.context.fill();
		Game.context.stroke();
	}
}

/* Spline component */
class SplineComponent extends PolygonComponent
{
	init(props)
	{
		super.init(props)
	}

	generateSpline()
	{
		let arr = [];

		if(this.points.length > 2)
		{
			for(let i=1; i<this.points.length - 1; i++)
			{
				let new_arr = this.getSpline(this.points[i - 1], this.points[i], this.points[i + 1])
				arr = arr.concat(new_arr);
			}
		}

		if(this.closed)
		{

		}
		else
		{
			arr.unshift(this.points[0], this.points[0]);
			arr.push(this.points[this.points.length - 1], this.points[this.points.length - 1]);
		}

		return arr;
	}

	getSpline(a, b, c)
	{
		let arr = []

		let dirA = Vector2.getBisector(a, b, c).toDirectionVector()
		let dirB = Vector2.fromAngle(dirA.getDirectionalAngle() - 90)

		if(this.test)
		{
			this.test = false
			//console.log(Vector2.getAngle(a, b, c))
			console.log(dirA)
			setTimeout(() => {this.test = true}, 500)
		}

		let parallel = new Line(b, b.add(dirB))
		let lineA = new Line(a, a.add(dirA))
		let lineB = new Line(c, c.add(dirA))

		a = lineA.getIntersectsPoint(parallel);
		c = lineB.getIntersectsPoint(parallel);

		lineA = new Line(b, a);
		lineB = new Line(b, c);

		arr.push(lineA.getPart(0.4).p2)
		arr.push(b)
		arr.push(lineB.getPart(0.4).p2)

		/*arr.push(lineA.getPart(1.0).p2)
		arr.push(b)
		arr.push(lineB.getPart(1.0).p2)*/

		return arr;
	}

	update()
	{
		if(this.isVisible())
		{
			/* Get data */
/*			let transform_component = this.joined["TransformComponent"]
			let position = transform_component.getPosition()
			let size = transform_component.getSize()
			*/

			/* Settings */
			this.applyStyles();
			//this.applyTransformation()

			/* Draw */
			Game.context.beginPath();

			let arr = this.generateSpline();
			Game.context.moveTo(arr[0].x, arr[0].y);
			for(let i=1; i<arr.length; i += 3)
			{
				Game.context.bezierCurveTo(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, arr[i + 2].x, arr[i + 2].y);
			}

			/*for(let i=1; i<arr.length; i++)
			{
				Game.context.lineTo(arr[i].x, arr[i].y);
			}*/

			if(this.closed) Game.context.closePath();
			Game.context.fill();
			Game.context.stroke();

			for(let i=0; i<this.points.length; i++)
			{
				Game.context.beginPath();
				Game.context.fillStyle = 'red';
				Game.context.arc(this.points[i].x, this.points[i].y, 3, 0, 2 * Math.PI, false);
				Game.context.closePath();
				Game.context.fill();
				Game.context.stroke();
			}

			/* Reset*/
			Game.context.resetTransform();
		}
	}
}

class AnimatedComponent extends ComponentBase
{
	init(props)
	{
		props.clip = []
		props.current_frame = 0
		this.addIntefaces(new ITimer())

		super.init(props)
		this.join("DrawableComponent")
	}

	getCilp()
	{
		return this.getProperty("clip")
	}

	getCurrentFrame()
	{
		return this.getProperty("current_frame")
	}

	setCurrentFrame(value)
	{
		this.setProperty("current_frame", value)
	}

	nextFrame()
	{
		let clip = this.getCilp()
		let frame_id = this.getCurrentFrame()

		frame_id++
		if(clip.length <= frame_id) frame_id = 0;
		this.setCurrentFrame(frame_id)

		return clip[frame_id]
	}

	update()
	{
		if(!this.updateTimer())
		{

			this.resetTimer()
			let data = this.nextFrame();
			this.joined["DrawableComponent"].setData(data);
		}
	}
}

class ParticlesComponent extends ComponentBase
{
	init(props)
	{
		props.particles = []
		props.max_count = 10
		props.templates = [] 
		/* 
		{
			"shape" : {"type" : "character", "color" : new Color(255, 0, 0)}, 
			"position" : new Rect(0.0, 0.0, 1.0, 1.0), 
			"func" : (data) => {}
		}
		*/
		super.init(props)
	}

	getParticles()
	{
		return this.getProperty("particles")
	}

	update()
	{
		let particles = this.getParticles()

		for(let i in particles)
		{
			let particle = particles[i]
		}
	}
}
