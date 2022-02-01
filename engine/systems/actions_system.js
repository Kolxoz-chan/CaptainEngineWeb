class ActionsSystem
{
	static actions = {}

	static init()
	{

	}

	static addAction(name, func)
	{
		if(ActionsSystem.actions[name])
		{
			alert("Warning. Redefining an action '" + name + "'")
		}
		ActionsSystem.actions[name] = func
	}

	static callAction(name, data = {})
	{
		if(ActionsSystem.actions[name])
		{
			ActionsSystem.actions[name](data)
		}
		else
		{
			alert("Error. There is no action '" + name + "'") 
		}
		
	}
}

// Actions loading
ActionsSystem.addAction("ResetAction", (data) => { obj.reset(); })
ActionsSystem.addAction("DestroyAction", (data) => { obj.parent.deleteChild(this.owner)})
ActionsSystem.addAction("DisableAction", (data) => { obj.setEnabled(false) });
ActionsSystem.addAction("GUIVisibleAction", (data) =>
{
	for(let name in data)
	{
		let widget = GUISystem.getWidget(name)
		if(widget)
		{
			widget.setVisible(data[name])
		}
	}
})
ActionsSystem.addAction("SpawnAction", (data) =>
{
	if(data.prefab)
	{
		let prefab = ResourcesSystem.getPrefab(data.prefab)
		let settings = data.settings ? data.settings : {}
		let layer = EntitiesSystem.getNamedEntity(data.layer)

		if(!layer) layer = data.self.owner.parent
		if(data.self)
		{
			if(!settings["TransformComponent"]) settings["TransformComponent"] = {};
			let transform = settings["TransformComponent"];
			transform.position = data.self.joined["TransformComponent"].getPosition()
			if(data.offset) transform.position = transform.position.addVec(data.offset)
		}

		layer.addChild(prefab.getEntity(settings))
	}
})
ActionsSystem.addAction("TransformAction", (data) =>
{
	let obj = EntitiesSystem.getNamedEntity(data.target)
	if(obj)
	{
		let transform = obj.getComponent("TransformComponent")

		if(data.position) transform.setPosition(data.position);
		if(data.size) transform.setSize(data.size);
		if(data.angle) transform.setAngle(data.angle);
		if(data.move) transform.move(data.move);
		if(data.scale) transform.scale(data.scale);
		if(data.rotate) transform.rotate(data.rotate);
	}
})
