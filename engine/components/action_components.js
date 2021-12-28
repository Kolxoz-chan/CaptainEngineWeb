class ResetActionComponent extends ComponentBase
{
	action()
	{
		this.owner.reset();
	}
}

/* Temporary component */
class DestroyActionComponent extends ComponentBase
{
	action()
	{
		this.owner.parent.deleteChild(this.owner)
	}
}

/* Temporary component */
class DisableActionComponent extends ComponentBase
{
	action()
	{
		this.owner.setEnabled(false)
	}
}

/* Temporary component */
class GUIActionComponent extends ComponentBase
{
	action(data)
	{
		for(let name in data)
		{
			let widget = GUISystem.getWidget(name)
			if(widget)
			{
				let func = widget.events[data[name].action]
				if(func) func()
			}
		}
	}
}

/* Hiding after death component */
class DissolveActionComponent extends ComponentBase
{
	init(props)
	{
		this.join("DrawableComponent")
		super.init(props)
	}

	tic(data)
	{
		this.joined["DrawableComponent"].setOpacity(data.time / data.max_time)
	}
}

/* Hiding after death component */
class SpawnActionComponent extends ComponentBase
{
	init(props)
	{
		this.join("TransformComponent")
		super.init(props)
	}

	action(data)
	{
		if(data.prefab)
		{
			let prefab = ResourcesSystem.getPrefab(data.prefab)
			let settings = data.settings ? data.settings : {}
			let layer = data.layer ? data.layer : this.owner.parent
			let position = this.joined["TransformComponent"].getPosition()
			
			if(data.offset)
			{
				position = position.addVec(data.offset)
			}

			layer.addChild(prefab.getEntity(
			{
				...settings,
				"TransformComponent" : {"position" : position},
			}))
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

	update()ResetActionComponent
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
