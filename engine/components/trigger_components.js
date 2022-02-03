class TriggerComponent extends ComponentBase
{
	activate(arr = {})
	{
		for(let name in arr)
		{
			ActionsSystem.callAction(name, arr[name])
		}
	}
}

/* Timer component*/
class TimersTriggerComponent extends TriggerComponent
{
	init(props)
	{
		props.timers = []
		super.init(props)
	}

	resetTimer(i)
	{
		let timers = this.getProperty("timers")
		timers[i].value = 0;
	}

	updateTimer(i)
	{
		let timers = this.getProperty("timers")
		timers[i].value += TimeSystem.getDeltaTime()
	}

	getTimer(i)
	{
		let timers = this.getProperty("timers")
		return timers[i]
	}

	update()
	{
		let timers = this.getProperty("timers")
		for(let i in timers)
		{
			let timer = timers[i]
			if(!timer.disabled)
			{
				if(!timer.value)
				{
					this.resetTimer(i)
				}
				this.updateTimer(i)

				if(timer.tik)
				{
					this.activate(timer.tik)
				}
				if(timer.value >= timer.time && timer.actions)
				{
					this.activate(timer.actions)
					if(timer.loop)
					{
						this.resetTimer(i)
					}
					else
					{
						timer.disabled = true;
					}
				}
			}
		}
	}
}

class RandomTimersTriggerComponent extends TimersTriggerComponent
{
	resetTimer(i)
	{
		let timers = this.getProperty("timers")
		let timer = timers[i]

		timer.time = Math.random() * (timer.time_max - timer.time_min) + timer.time_min;
		timer.value = 0;
	}
}

/* Timer component*/
class KeyboardTriggerComponent extends TriggerComponent
{
	init(props)
	{
		props.actions = []	// {"key" : "KeyA", "type" : "clicked", "actions" : {"SomeActionComponent" : {}}}
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
				this.activate(action.actions)
			}
		}
	}
}

/* Timer component*/
class MouseTriggerComponent extends TriggerComponent
{
	init(props)
	{
		props.actions = []	// {"button" : 1, "type" : "clicked", "actions" : {"SomeActionComponent" : {}}}
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
				case "clicked":  value = InputSystem.isMouseClicked(action.button); break;
				case "pressed":  value = InputSystem.isMousePressed(action.button); break;
				case "released": value = InputSystem.isMouseReleased(action.button); break;
			}
			
			if(value)
			{
				if(this.owner.hasComponent("ColiderComponent"))
				{
					let colider = this.owner.getComponent("ColiderComponent")
					if(colider.isContained(InputSystem.getGlobalMouse()))
					{
						this.activate(action.actions)
					}
				}
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
