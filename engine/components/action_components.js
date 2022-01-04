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
				widget.setVisible(data[name])
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

class ScriptActionComponent extends ComponentBase
{
	action(data)
	{
		for(let name in data)
		{
			ResourcesSystem.callScript(name)
		}
	} 
}
