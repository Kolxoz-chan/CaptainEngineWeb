/* Game class */
class Game
{
	/* Public fields */
	static current_level = null;
	static names = {};
	static started = false;
	static fps = 60;
	
	/* Public methods */
	static init(id, w, h, style = "")
	{
		/* Init canvas*/
		Game.canvas = document.createElement("canvas");
		Game.canvas.width = w;
		Game.canvas.height = h;
		Game.canvas.style = style;
		
		/* Create canvas */
		Game.context = Game.canvas.getContext("2d");
		Game.block = document.getElementById(id);
		Game.block.appendChild(Game.canvas);
		
		/* Init events */
		var arr = ['keydown', 'keyup', 'mousedown', 'mouseup', "mousemove"];
		for(var i in arr)
		{
			document.body.addEventListener(arr[i], Input.handleEvent);
		}
	}
	
	static setLevel(lvl)
	{
		Game.current_level = lvl;
	}
	
	static getObject(name)
	{
		if(Game.names[name]) return Game.names[name];
		else console.log("WARNING. There is no object named '" + name + "'")
	}
	
	static setFPS(value)
	{
		Game.fps = value
	}
	
	static start()
	{
		if(!Game.started)
		{
			Game.started = true;
			var self = Game;
			setTimeout(() => {Game.loop()}, 1000 / Game.fps);
		}
	}
	
	static stop()
	{
		Game.started = false;
	}
	
	static loop()
	{
		if(Game.started)
		{
			Time.update()
			Input.update()
			Game.update()

			setTimeout(() => {Game.loop()}, 1000 / Game.fps);
		}
	}
	
	static update()
	{
		Game.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		Game.current_level.update();
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
	static center = new Vector2(0, 0);
	static angle = 0;
	static zoom = 1.0
	
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
		if(Game.context)
		{
			let size = Camera.getSize();
			Game.context.translate(-Camera.center.x + size.x / 2, -Camera.center.y + size.y / 2,)
		}
	}
	
	static getSize()
	{
		return new Vector2(Game.canvas.width, Game.canvas.height)
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
		Resources.loading_counter++;
		
		Resources.textures[name] = new Image();
		Resources.textures[name].src = src;
		Resources.textures[name].onload = function()
		{
			Resources.loading_counter--;
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
	static mouse_pos = new Vector2(0, 0);
	static mouse_clicked = {};
	static keyboard_clicked = {};
	
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
			case "mousemove":  	if(Game.canvas) Input.mouse_pos = new Vector2(event.clientX-Game.canvas.offsetLeft,event.clientY-Game.canvas.offsetTop); break;
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
