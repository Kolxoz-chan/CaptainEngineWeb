/* Game class */
class Game
{
	/* Public fields */
	static current_level = null;
	static widgets = [];
	static names = {};
	static started = false;
	static resizable = false;
	static fps = 60;
	static default_cursor = "auto"
	
	/* Public methods */
	static init(id, w, h, style = "")
	{
		/* Init canvas*/
		Game.canvas = document.createElement("canvas");
		this.setSize(new Vector2(w, h))
		Game.canvas.style = style;
		Game.resetCursor()
		
		/* Create canvas */
		Game.context = Game.canvas.getContext("2d");
		Game.block = document.getElementById(id);
		Game.block.appendChild(Game.canvas);
	}
	
	static setEventHandlers(arr)
	{
		for(var i in arr)
		{
			document.body.addEventListener(arr[i], Input.handleEvent);
		}
	}
	
	static setFullScreen(value)
	{
		if(value) 
		{
			Game.canvas.requestFullscreen();
			if(this.resizable) this.setSize(this.getMaxSize())
		}
		else document.requestFullscreen();
	}
	
	static setSize(size)
	{
		Game.canvas.width = size.x;
		Game.canvas.height = size.y;
	}
	
	static setResizable(value)
	{
		this.resizable = value;
	}
	
	static isFullScreen()
	{
		return Game.canvas.fullscreenEnabled
	}
	
	static setLevel(lvl)
	{
		Game.current_level = lvl;
	}
	
	static resetCursor()
	{
		Game.setCursor(Game.default_cursor)
	}
	
	static setCursor(name)
	{
		Game.canvas.style.cursor = name
	}
	
	static setDefaultCursor(name)
	{
		Game.default_cursor = name
	}
	
	static getObject(name)
	{
		if(Game.names[name]) return Game.names[name];
		else console.log("WARNING. There is no object named '" + name + "'")
	}
	
	static getSize()
	{
		return new Vector2(Game.canvas.width, Game.canvas.height)
	}
	
	static getMaxSize()
	{
		return new Vector2(window.screen.width, window.screen.height)
	}
	
	static addWidget(widget)
	{
		this.widgets.push(widget)
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
		for(let i in this.widgets)
		{
			if(this.widgets[i].isEnabled()) this.widgets[i].update()
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
		let time = Time.date.getTime()
		Time.date = new Date();
		Time.delta_time = (Time.date.getTime() - time) / 1000;
	}
}

/* Camera class */
class Camera
{
	static position = new Vector2(0, 0);
	static angle = 0;
	static zoom = 1.0
	
	static getCenter()
	{
		let pos = Camera.getPosition();
		let size = Camera.getSize();
		
		return new Vector2(pos.x + size.x / 2, pos.y + size.y / 2)
	}
	
	static getPosition()
	{
		return Camera.position;
	}
	
	static setPosition(point)
	{
		Camera.position = point;
	}
	
	static setCenter(point)
	{
		let size = Camera.getSize();
		Camera.setPosition(new Vector2(point.x - size.x / 2, point.y - size.y / 2))
	}
	
	
	static apply_transform()
	{
		if(Game.context)
		{
			let center = Camera.getCenter()
			let size = Camera.getSize();
			Game.context.translate(-center.x + size.x / 2, -center.y + size.y / 2)
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
	static prefabs = {}
	
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
	
	static addPrefab(name, asset)
	{
		Resources.prefabs[name] = asset;
	}
	
	static getTexture(name)
	{
		return Resources.textures[name];
	}
	
	static getTexture(name)
	{
		return Resources.textures[name];
	}
	
	static getPrefab(name)
	{
		return Resources.prefabs[name];
	}
}

/* Input handler class */
class Input
{
	static mouse_pos = new Vector2(0, 0);
	static mouse_clicked = {};
	static keyboard_clicked = {};
	static mouse_clicked_cur = {};
	static keyboard_clicked_cur = {};
	
	static update()
	{
		for(let key in Input.mouse_clicked) Input.mouse_clicked_cur[key] = false;
		for(let key in Input.keyboard_clicked) Input.keyboard_clicked_cur[key] = false;
		Input.mouse_clicked_cur = Input.mouse_clicked;
		Input.keyboard_clicked_cur = Input.keyboard_clicked;
		Input.mouse_clicked = {};
		Input.keyboard_clicked = {};
		
	}
	
	static handleEvent(event)
	{		
		//console.log(event)
		switch(event.type)
		{
			case "keydown": 	Input.keyboard_clicked[event.code] = true; break;
			case "keyup": 		delete Input.keyboard_clicked[event.code]; break;
			case "mousedown": 	Input.mouse_clicked[event.button] = true; break;
			case "mouseup": 	delete Input.mouse_clicked[event.button]; break;
			case "mousemove":  	if(Game.canvas) Input.mouse_pos = new Vector2(event.clientX-Game.canvas.offsetLeft,event.clientY-Game.canvas.offsetTop); break;
		}
		//console.log(Input.mouse_clicked)
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
		return Input.mouse_clicked_cur[button] != undefined;
	}
	
	static isMouseClicked(button)
	{
		return Input.mouse_clicked_cur[button] == true;
	}
	
	static isKeyPressed(button)
	{
		return Input.keyboard_clicked_cur[button] != undefined;
	}
	
	static isKeyClicked(button)
	{
		return Input.keyboard_clicked_cur[button] == true;
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
