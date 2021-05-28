/* Clickable component */
class ClickableComponent extends ComponentBase
{	
	key = 0
	global_cursor = true;
	//action = null

	init()
	{
		this.join("ColiderComponent")
	}
	
	getCursore()
	{
		return this.global_cursor ? Input.getGlobalMouse() : Input.getLocalMouse();
	}
	
	update()
	{
		let colider = this.joined["ColiderComponent"];
		if(Input.isMouseClicked(this.key) && this.action)
		{	
			let position = this.getCursore()
			if(colider.isContained(position)) this.action();
		}
	}
}

/* Trigger component */
class TriggerComonent extends ComponentBase
{	
	//action = null;

	init()
	{
		this.join("ColiderComponent")
	}

	update()
	{	
		let colider = this.joined["ColiderComponent"];
		for(let i in colider.objects)
		{
			if(this.action) this.action(colider.objects[i])
		}
	}
}

/* Timer component */
class TimerComponent extends ComponentBase
{	
	time = 60.0
	//action = null;
	
	getTime()
	{
		return this.time;
	}
	
	update()
	{
		if(this.time <= 0.0)
		{
			this.enabled = false;
			if(this.action) this.action()
		}
		else this.time -= Time.delta_time;
	}
}

// Missclick component
class MissclickComponent extends ComponentBase
{ 
	key = 0;
	container = null
	// action = null
	
	update()
	{
		if(Input.isMouseClicked(this.key) && this.container && this.action)
		{
			let result = true;
			let layer = Game.current_level.getLayer(this.container);
			for(let i in layer.entities)
			{

				if(layer.entities[i].hasComponent("ColiderComponent"))
				{
					
					let colider = layer.entities[i].getComponent("ColiderComponent")
					if(colider.isContained(Input.getLocalMouse())) result = false;
				}
			}
			if(result) this.action()
		}
	}
}