class Game
{
	static widget = null;
	static systems = {};
	static is_started = false;

	static init(id)
	{
		window.onerror = function(message, url, line, col)
		{
		  alert(`${message}\n${url}, ${line}:${col}`);  
		}

		Game.widget = document.getElementById(id)
		Game.include("engine/objects.js")
		Game.include("engine/interfaces.js")
	}

	static start()
	{
		if(!Game.is_started)
		{
			Game.is_started = true;
			requestAnimationFrame(Game.loop);
		}
	}

	static stop()
	{
		Game.is_started = false;
	}

	static loop()
	{
		try
		{
			if(Game.is_started)
			{
				Game.update()
				requestAnimationFrame(Game.loop);
			}
		}
		catch(error)
		{
			alert(error.stack)
		}
	}

	static addSystem(src, system)
	{
		Game.include("engine/systems/" + src, () => 
		{ 
			Game.systems[system] = eval("() => { return "+ system +"; }")() 
		})
	}

	static getWidget()
	{
		return Game.widget
	}

	static include(src, func = null)
	{
		let script = document.createElement("script")
		script.src = src;
		if(func) script.onload = func
		document.head.appendChild(script)
	}

	static update()
	{
		for(let key in Game.systems)
		{
			let sys = Game.systems[key]
			if(sys.update) 
			{
				sys.update()
			}
		}
	}
}
