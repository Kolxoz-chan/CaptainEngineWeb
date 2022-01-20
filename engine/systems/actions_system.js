class ActionsSystem
{
	static actions = {}

	static init()
	{

	}

	static addAction(name, func)
	{
		ActionsSystem.actions[name] = func
	}

	static callAction(name, data = {})
	{
		ActionsSystem.actions[name](data)
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
