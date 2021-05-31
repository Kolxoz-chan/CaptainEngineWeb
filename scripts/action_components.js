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
		if(colider)
		{
			if(Input.isMouseClicked(this.key) && this.action && colider.isEnabled())
			{	
				let position = this.getCursore()
				if(colider.isContained(position)) this.action();
			}
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
	//tic = null;
	
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
		else 
		{
			this.time -= Time.delta_time;
			if(this.tic) this.tic();
		}
	}
}

/* Attribute Change Event */
class AttributeEventComponent extends ComponentBase
{
	attribute = null
	value = null
	// action = null
	
	init()
	{
		if(this.attribute) this.value = this.join(this.attribute).getValue()
	}

	update()
	{
		let attribute = this.joined[this.attribute]
		let new_value = attribute.getValue();
		if(this.value != new_value && this.action) this.action(this.value, new_value)
		this.value = new_value;
	}
}

/* Attribute Change Event */
class DeadEventComponent extends ComponentBase
{
	is_alife = false;
	// revival_action = null
	// dead_action = null
	
	init()
	{
		this.is_alife = this.join("LifeComponent").isGreaterZero();
	}

	update()
	{
		let life = this.joined["LifeComponent"]
		if(!life.isGreaterZero() && this.is_alife)
		{
			this.is_alife = false
			if(this.dead_action) this.dead_action()
		}
		else if(life.isGreaterZero() && !this.is_alife)
		{
			this.is_alife = true
			if(this.revival_action) this.revival_action()
		}
	}
}

/* Attribute Change Event */
class ClickComponent extends ComponentBase
{
	// Constants
	static FIRST = 1;
	static ALL = 2
	static LAST = 3;
	
	key = 0
	order = ClickComponent.ALL
	// action = null
	// miss = null
	
	init()
	{
		this.join("CursoreColider");
	}

	update()
	{
		if(Input.isMouseClicked(this.key))
		{
			let colider = this.joined["CursoreColider"]
			if(colider)
			{
				if(colider.isEnabled())
				{
					let count = colider.objects.length
					if(count > 0)
					{
						if(this.action)
						{
							switch(this.order)
							{
								case ClickComponent.ALL: for(let i in colider.objects) this.action(colider.objects[i]); break;
								case ClickComponent.FIRST: this.action(colider.objects[0]); break;
								case ClickComponent.LAST: this.action(colider.objects[count - 1]); break;
							}
						}
					}
					else if(this.miss) this.miss()
				}
			}
		}
	}
}