/* Game class */
class Game
{
	/* Public fields */
	entities = [];
	started = false;
	fps = 60;
	
	/* Public methods */
	constructor(id)
	{
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.block = document.getElementById(id);
	}
	
	setSize(w, h)
	{
		this.canvas.width = w;
		this.canvas.height = h;
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
			var self = this;
			setTimeout(function(){self.loop()}, 1000 / this.fps);
		}
	}
	
	loop()
	{
		if(this.started)
		{
			update()
			draw()
			
			var self = this;
			setTimeout(function(){self.loop()}, 1000 / this.fps);
		}
	}
	
	update()
	{
		for(var obj in this.entities) obj.update();
	}
	
	draw()
	{
		for(var obj in this.entities) obj.draw();
	}
}

/* Entity class */
class Entity
{
	/* Public fields */
	components = {};
	
	/* Public methods */
	constructor(name)
	{
		this.name = name;
	}
	
	draw()
	{
		visual_component = getComponent("visual");
		if(visual_component)
		{
			
		}
	}
	
	update()
	{
		for(var comp in this.components) comp.update();
	}
	
	addComponent(name, value)
	{
		components[name] = value;
	}
	
	getComponent(name)
	{
		if(!components[name]) console.log("WARNING. Object '" + this.name + "' has not '" + name + "' component!")
		return components[name];
	}
}

/* Component class */
class ComponentBase
{
	
}