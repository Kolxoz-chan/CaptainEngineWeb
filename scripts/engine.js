/* Game class */
class Game
{
	/* Public fields */
	entities = [];
	names = {};
	started = false;
	data = new Date();
	fps = 60;
	
	/* Public methods */
	constructor(id)
	{
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.block = document.getElementById(id);
		
		/* Init classes */
		Camera.init(this.canvas)
		Input.init(this.canvas)
		
		/* Init events */
		var arr = ['keydown', 'keyup', 'mousedown', 'mouseup', "mousemove"];
		for(var i in arr)
		{
			document.body.addEventListener(arr[i], Input.handleEvent);
		}
	}
	
	addObject(obj)
	{
		this.names[obj.name] = obj;
		this.entities.push(obj)
		obj.init();
	}
	
	setSize(w, h)
	{
		this.canvas.width = w;
		this.canvas.height = h;
	}
	
	setStyle(style)
	{
		this.canvas.style = style;
	}
	
	getObject(name)
	{
		if(this.names[name]) return this.names[name];
		else console.log("WARNING. There is no object named '" + name + "'")
	}
	
	setFPS(value)
	{
		this.fps = value
	}
	
	create()
	{
		this.block.appendChild(this.canvas);
	}
	
	start()
	{
		if(!this.started)
		{
			this.started = true;
			var self = this;
			setTimeout(() => {this.loop()}, 1000 / this.fps);
		}
	}
	
	loop()
	{
		if(this.started)
		{
			Time.update()
			Input.update()
			
			this.update()

			setTimeout(() => {this.loop()}, 1000 / this.fps);
		}
	}
	
	update()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(var i in this.entities) 
		{
			this.entities[i].update();
		}
	}
}

/* Time class */
class Time
{
	static date = new Date();
	static delta_time = 0;
	
	static update()
	{
		let time = this.date.getTime()
		Time.date = new Date();
		Time.delta_time = (this.date.getTime() - time) / 1000;
	}
}

/* Camera class */
class Camera
{
	static context = null;
	static canvas = null;
	static center = new Vector2(0, 0);
	static angle = 0;
	static zoom = 1.0
	
	static init(canvas)
	{
		Camera.canvas = canvas;
		Camera.context = canvas.getContext("2d");
	}
	
	static getPosition()
	{
		let size = Camera.getSize();
		return new Vector2(Camera.center.x - size.x / 2, Camera.center.y - size.y / 2)
	}
	
	static setCenter(point)
	{
		Camera.center = point
	}
	
	static apply_transform()
	{
		if(Camera.context)
		{
			let size = Camera.getSize();
			Camera.context.translate(-Camera.center.x + size.x / 2, -Camera.center.y + size.y / 2,)
		}
	}
	
	static getSize()
	{
		return new Vector2(Camera.canvas.width, Camera.canvas.height)
	}
}

/* Resources class */
class Resources
{
	static textures = {}
	static loading_counter = 0;
	static textures_dir = "";
	
	static isLoaded()
	{
		return Resources.loading_counter == 0;
	}
	
	static loadTexture(name, src)
	{
		src = Resources.textures_dir + src
		Resources.loading_counter += 1;
		
		Resources.textures[name] = new Image();
		Resources.textures[name].src = src;
		Resources.textures[name].onload = function()
		{
			Resources.loading_counter -= 1;
		}
	}
	
	static getTexture(name)
	{
		return Resources.textures[name];
	}
}

/* Input handler class */
class Input
{
	static canvas = null;
	static mouse_pos = new Vector2(0, 0);
	static mouse_clicked = {};
	static keyboard_clicked = {};
	
	static init(canvas)
	{
		Input.canvas = canvas;
	}
	
	static update()
	{
		for(let key in Input.mouse_clicked) Input.mouse_clicked[key] = false;
		for(let key in Input.keyboard_clicked) Input.mouse_clicked[key] = false;
	}
	
	static handleEvent(event)
	{		
		switch(event.type)
		{
			case "keydown": 	Input.keyboard_clicked[event.code] = true; break;
			case "keyup": 		delete Input.keyboard_clicked[event.code]; break;
			case "mousedown": 	Input.mouse_clicked[event.button] = true; break;
			case "mouseup": 	delete Input.mouse_clicked[event.button]; break;
			case "mousemove":  	if(Input.canvas) Input.mouse_pos = new Vector2(event.clientX-Input.canvas.offsetLeft,event.clientY-Input.canvas.offsetTop); break;
		}
	}
	
	static getGlobalMouse()
	{
		let point = Camera.getPosition()
		return new Vector2(Input.mouse_pos.x + point.x, Input.mouse_pos.y + point.y);
	}
	
	static getLocalMouse()
	{
		return Input.mouse_pos;
	}
	
	static isMousePressed(button)
	{
		return Input.mouse_clicked[button] != undefined;
	}
	
	static isMouseClicked(button)
	{
		return Input.mouse_clicked[button] == true;
	}
	
	static isKeyPressed(button)
	{
		return Input.keyboard_clicked[button] != undefined;
	}
	
	static isKeyClicked(button)
	{
		return Input.keyboard_clicked[button] == true;
	}
	
	static isKeysPressed(arr, and=false)
	{
		let result = false;
		if(arr.length > 0)
		{
			result = Input.isKeyPressed(arr[0]);
			
			for(let i = 1; i<arr.length; i++) 
			{
				if(and) result = Input.isKeyPressed(arr[i]) && result;
				else result = Input.isKeyPressed(arr[i]) || result;
			}
		}
		return result;
	}
}
