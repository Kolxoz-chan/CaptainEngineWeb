class ActionsSystem
{
	static actions = {}
	static update_actions = []

	static init()
	{

	}

	static update()
	{
		let arr = ActionsSystem.update_actions
		for(let i in arr)
		{
			ActionsSystem.callAction(arr[i])
		}
	}

	static addUpdateAction(name)
	{
		ActionsSystem.update_actions.push(name)
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
ActionsSystem.addAction("DestroyAction", (data) => { obj.parent.deleteChild(this.owner)})
ActionsSystem.addAction("DisableAction", (data) => { obj.setEnabled(false) });
ActionsSystem.addAction("ResetAction", (data) =>
{
	let obj = EntitiesSystem.getNamedEntity(data.obj)
	obj.reset(); 
})
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

		if(data.position != undefined) transform.setPosition(data.position);
		if(data.size != undefined) transform.setSize(data.size);
		if(data.angle != undefined) transform.setAngle(data.angle);
		if(data.move != undefined) transform.move(data.move);
		if(data.scale != undefined) transform.scale(data.scale);
		if(data.rotate != undefined) transform.rotate(data.rotate);
	}
})
