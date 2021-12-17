class TriggerComponent extends ComponentBase
{
	activate(arr = {})
	{
		for(let name in arr)
		{
			let component = this.owner.getComponent(name)
			component.action(arr[name])
		}
	}
}

/* Timer component*/
class TimerTriggerComponent extends TriggerComponent
{
	init(props)
	{
		props.tic = []
		props.actions = []
		super.init(props)
		this.addIntefaces(new ITimer())
	}

	update()
	{
		if(this.updateTimer())
		{
			let tic = this.getProperty("tic")
			this.activate(tic)
		}
		else
		{
			let actions = this.getProperty("actions")
			this.activate(actions)
		}
	}
}

/* Timer component*/
class KeyboardTriggerComponent extends TriggerComponent
{
	init(props)
	{
		props.actions = []	// {"key" : "KeyA", "type" : "click", "components" : [SomeActionComponent]}
		super.init(props)
	}

	update()
	{
		let props = this.getProperty("actions")
		for(let i in props)
		{
			let value = false
			let action = props[i]
			switch(action.type)
			{
				case "clicked":  value = InputSystem.isKeyClicked(action.key); break;
				case "pressed":  value = InputSystem.isKeyPressed(action.key); break;
				case "released": value = InputSystem.isKeyReleased(action.key); break;
			}

			if(value)
			{
				this.activate(action.components)
			}
		}
	}
}

/* Timer component*/
class ColideTriggerComponent extends TriggerComponent
{
	init(props)
	{
		props.actions = []
		super.init(props)
		this.join("ColiderComponent")
	}

	update()
	{
		let colider = this.joined["ColiderComponent"]
		let objects = colider.getObjects()

		for(let obj in objects)
		{
			let actions = this.getProperty("actions")
			this.activate(actions, {"object" : obj})
		}

		
	}
}