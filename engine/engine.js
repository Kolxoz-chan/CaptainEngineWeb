class Game
{
	static widget = null;
	static systems = {};
	static is_started = false;
	static load_queue = []
	static sections = []

	static init(id)
	{
		window.onerror = function(message, url, line, col)
		{
		  alert(`${message}\n${url}, ${line}:${col}`);
		}
 
		Game.widget = document.getElementById(id)
		Game.widget.style.cursor = "default"
		Game.widget.style.userSelect = "none"
		
		Game.widget.oncontextmenu = function() {return false}
		Game.widget.onselectstart = function() {return false}

		Game.include("engine/objects.js")
		Game.include("engine/interfaces.js")
		Game.include("engine/systems/math_system.js")
		Game.include("engine/components/base_components.js")
	}

	static section(func)
	{
		Game.sections.push(func)
		if(Game.sections.length == 1)
		{
			Game.nextSection()
		}
	}

	static nextSection()
	{
		Promise.all(Game.load_queue).then(() =>
		{
			Game.load_queue = []
			Game.sections.shift()()
			if(Game.sections.length > 0) Game.nextSection()
		})
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

	static addSystem(src, system, func = null)
	{
		Game.include("engine/systems/" + src, () =>
		{
			Game.systems[system] = Game.parse(system)
			Game.systems[system].init()
			if(func) func(Game.systems[system])
		})
	}

	static parse(code)
	{
		return eval("() => { return "+ code +"; }")()
	}

	static getWidget()
	{
		return Game.widget
	}

	static getSystem(name)
	{
		return Game.systems[name]
	}

	static include(src, func = null)
	{
		Game.load_queue.push(new Promise((resolve, reject) => 
		{
			let script = document.createElement("script")
			document.head.appendChild(script)
			script.src = src;
			script.onload = () => 
			{
				if(func) func()
				resolve()
			}
			script.onerror = () =>
			{
				let err = "Module " + src + " not loaded!"
				alert(err)
				reject(new Error(err))
			}
		}))
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
