/* this handler class */
class InputSystem
{
	//static mouse_pos = new Vector2(0, 0);
	static events = []
	static mouse_pressed = {};
	static keyboard_pressed = {};
	static mouse_clicked_cur = {};
	static keyboard_clicked_cur = {};

	static init()
	{

	}

	static update()
	{
		for(let key in this.mouse_pressed)
		{
			if(this.mouse_pressed[key] == false) delete this.mouse_clicked_cur[key]
			else if(this.mouse_clicked_cur[key] == undefined) this.mouse_clicked_cur[key] = true
			else this.mouse_clicked_cur[key] = false;
		}
		for(let key in this.keyboard_pressed)
		{
			if(this.keyboard_pressed[key] == false) delete this.keyboard_clicked_cur[key]
			else if(this.keyboard_clicked_cur[key] == undefined) this.keyboard_clicked_cur[key] = true
			else this.keyboard_clicked_cur[key] = false;
		}
	}

	static handleEvent(event)
	{
		if(event.type == "mousemove")
		{
			if(Canvas2DSystem)
			{
				let mouse = new Vector2(event.clientX, event.clientY)
				let offset = Canvas2DSystem.getPosition()
				InputSystem.mouse_pos = mouse.sub(offset);
			}
		}
		else if(event.type == "keydown")
		{
			InputSystem.keyboard_pressed[event.code] = true;
		}
		else if(event.type == "keyup")
		{
			InputSystem.keyboard_pressed[event.code] = false;
		}
		else if(event.type == "mousedown")
		{
			InputSystem.mouse_pressed[event.button] = true;
		}
		else if(event.type == "mouseup")
		{
			InputSystem.mouse_pressed[event.button] = false;
		}
	}

	static setEvents()
	{
		this.events = Array.from(arguments)
		for(var i in this.events)
		{
			document.body.addEventListener(this.events[i], this.handleEvent);
		}
	}

	static getGlobalMouse()
	{
		let point = CameraSystem.getPosition()
		return new Vector2(this.mouse_pos.x + point.x, this.mouse_pos.y + point.y);
	}

	static getLocalMouse()
	{
		return new Vector2(this.mouse_pos.x, this.mouse_pos.y);
	}

	static isMousePressed(button)
	{
		return this.mouse_clicked_cur[button] != undefined;
	}

	static isMouseClicked(button)
	{
		return this.mouse_clicked_cur[button] == true;
	}

	static isKeyPressed(button)
	{
		return this.keyboard_clicked_cur[button] != undefined;
	}

	static isKeyClicked(button)
	{
		return this.keyboard_clicked_cur[button] == true;
	}

	static isKeysPressed(arr, and=false)
	{
		let result = false;
		if(arr.length > 0)
		{
			result = this.isKeyPressed(arr[0]);

			for(let i = 1; i<arr.length; i++)
			{
				if(and) result = this.isKeyPressed(arr[i]) && result;
				else result = this.isKeyPressed(arr[i]) || result;
			}
		}
		return result;
	}
}
