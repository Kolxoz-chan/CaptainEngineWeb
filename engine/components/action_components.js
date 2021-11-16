/* Timer component*/
class TimerComponent extends ComponentBase
{
	// action = null,
	// tic = null

	init()
	{
		this.addIntefaces(new ITimer())
	}

	update()
	{
		if(this.updateTimer())
		{
			if(this.tic) this.tic(this.getTimer());
		}
		else
		{
			this.enabled = false;
			if(this.action) this.action()
		}
	}
}

/* Attribute Change Event 
class AttributeEventComponent extends ComponentBase
{
	default_properties = 
	{
		"attribute" : null,
		"action" : null,
		"value" : null
	}

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
}*/

/* Radius Scanner
class RadiusScannerComponent extends ComponentBase
{
	 
	init()
	{
		this.join("TransformComponent")
	}

	update()
	{
		var container = this.owner.parent;
		for(var i in container.childs)
		{
			var obj = container.childs[i];
			var A = this.joined["TransformComponent"].getCenter()
			var B = obj.getComponent("TransformComponent").getCenter()
			var distance = A.getDistance(B)

			if(obj != this.owner && distance <= this.radius && this.onRegister)
			{
				this.onRegister(obj);
			}
		}
	}
} */
