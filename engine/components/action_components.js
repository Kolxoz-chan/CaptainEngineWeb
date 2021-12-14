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
	init(props)
	{
		props.forms = []
		super.init(props)
	}

	getForms()
	{
		return this.getProperty("forms")
	}

	action()
	{
		let forms = this.getForms()
		for(let i in forms)
		{
			let name = forms[i];
			GUISystem.getWidget(name).show()
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
		props.settings = {}

		this.addIntefaces(new IPrefab(), new ITarget())
		this.join("TransformComponent")
		super.init(props)
	}

	getSettings()
	{
		return this.getProperty("settings")
	}

	action()
	{
		let settings = this.getSettings()
		let layer = this.getTarget()
		let prefab = this.getPrefab()

		if(!layer) layer = this.owner.parent;

		layer.addChild(prefab.getEntity(
		{
			...settings,
			"TransformComponent" : {"position" : this.joined["TransformComponent"].getPosition()},
		}))
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
