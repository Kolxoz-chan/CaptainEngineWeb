class TriggerComponent extends ComponentBase
{
	activate(arr = [], data = {})
	{
		for(let i in arr)
		{
			let name = arr[i]
			let component = this.owner.getComponent(name)
			component.action(data)
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