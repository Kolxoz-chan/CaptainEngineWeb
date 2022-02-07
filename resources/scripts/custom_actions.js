ActionsSystem.addAction("CloseGame", (data) =>
{
	window.close()
})
ActionsSystem.addAction("AheadCardAction", (data) =>
{
	let player = EntitiesSystem.getNamedEntity("player")
	if(player)
	{
		let transform = player.getComponent("TransformComponent")
		let grid = player.getComponent("GridItemComponent")
		let vec = new Vector2(0, 0)
		let map = player.parent.getComponent("GridLayoutComponent")
		let pos = grid.getPosition()
		let angle = transform.getAngle()
		if(angle < 0) angle = Math.abs(angle) + 180
		angle %= 360

		if(angle == 0) vec = new Vector2(0, -1)
		else if(angle == 90) vec = new Vector2(1, 0)
		else if(angle == 180) vec = new Vector2(0, 1)
		else if(angle == 270) vec = new Vector2(-1, 0)

		let obj = map.getMapItem(pos.add(vec))
		if(obj)
		{
			if(obj.type == "wall_01") return
			if(obj.type == "money_01")
			{
				TurtleBattle.money++
        		GUISystem.getWidgetById("money_label").setText(TurtleBattle.money)
			}
			obj.delete()
		}
		grid.move(vec)
	}
})
ActionsSystem.addAction("TurnCardAction", (data) =>
{
	let player = EntitiesSystem.getNamedEntity("player")
	let grid = player.getComponent("GridItemComponent")
	let transform = player.getComponent("TransformComponent")
	let position = grid.getPosition()

	let angle = transform.getAngle()
	if(angle < 0) angle = Math.abs(angle) + 180
	angle %= 360

	ActionsSystem.callAction("GUIVisibleAction", {"cards_deck" : false})

	let pos_A = new Vector2(0, 1)
	let pos_B = new Vector2(0, -1)
	let rotation = 90

	if(angle % 180 == 0)
	{
		pos_A = new Vector2(1, 0)
		pos_B = new Vector2(-1, 0)
	}
	if (angle >= 0 && angle < 180)
	{
		pos_A = pos_A.invert()
		pos_B = pos_B.invert()
	}

	ActionsSystem.callAction("SpawnAction", {"prefab" : "rotate_button", "layer" : "controls", "settings" :
	{
		"TransformComponent" : {"angle" : angle - rotation},
		"GridItemComponent" : {"position" : position.add(pos_A), "padding" : new Vector2(10, 10)},
		"RectColiderComponent" : {},
		"MouseTriggerComponent" : {"actions" : [{"button" : 0, "type" : "clicked", "actions" :
		{
			"ResetAction" : {"obj" : "controls"},
			"TransformAction" : {"target" : "player", "rotate" : -rotation},
			"GUIVisibleAction" : {"cards_deck" : true}
		}
	}]}
	}})
	ActionsSystem.callAction("SpawnAction", {"prefab" : "rotate_button", "layer" : "controls", "settings" :
	{
		"TransformComponent" : {"angle" : angle + rotation},
		"GridItemComponent" : {"position" : position.add(pos_B), "padding" : new Vector2(10, 10)},
		"RectColiderComponent" : {},
		"MouseTriggerComponent" : {"actions" : [{"button" : 0, "type" : "clicked", "actions" :
		{
			"ResetAction" : {"obj" : "controls"},
			"TransformAction" : {"target" : "player", "rotate" : rotation},
			"GUIVisibleAction" : {"cards_deck" : true}
		}

	}]}
	}})
})
ActionsSystem.addAction("UTurnCardAction", (data) =>
{
	let player = EntitiesSystem.getNamedEntity("player")
	let transform = player.getComponent("TransformComponent")
	transform.rotate(180)
})
ActionsSystem.addAction("JumpCardAction", (data) =>
{
	let player = EntitiesSystem.getNamedEntity("player")
	if(player)
	{
		let transform = player.getComponent("TransformComponent")
		let grid = player.getComponent("GridItemComponent")
		let vec = new Vector2(0,0);
		let map = player.parent.getComponent("GridLayoutComponent")
		let pos = grid.getPosition()
		let angle = transform.getAngle();
		if(angle < 0) angle = Math.abs(angle) + 180
		angle %= 360

		if(angle == 0) vec = new Vector2(0, -1)
		else if(angle == 90) vec = new Vector2(1, 0)
		else if(angle == 180) vec = new Vector2(0, 1)
		else if(angle == 270) vec = new Vector2(-1, 0)

		let obj1 = map.getMapItem(pos.add(vec))
		if(obj1) vec = vec.mul(2)

		let obj2 = map.getMapItem(pos.add(vec))
		if(obj2)
		{
			if(obj2.type == "wall_01") return
			obj2.delete()
		}

		grid.move(vec)
	}
})
ActionsSystem.addAction("ResetCardAction", (data) =>
{
	let player = TurtleBattle.getCurrentPlayer()

	player.cards = TurtleBattle.getCards(5)
	TurtleBattle.updateDeck()
})
ActionsSystem.addAction("DoublingCardAction", (data) =>
{
	let player = TurtleBattle.getCurrentPlayer()
	player.power = 2
})
ActionsSystem.addAction("UpdateGameAction", (data) =>
{
	TurtleBattle.update()
})
ActionsSystem.addAction("SelectCardAction", (data) =>
{
	let index = data.index
	let player = TurtleBattle.getCurrentPlayer()
	let cards = ResourcesSystem.configs.cards
	let name = player.cards[index]

	// Delete card
	player.cards.splice(index, 1)
	TurtleBattle.updateDeck()

	// Call card action
	let count = player.power
	player.power = 1
	for(let i=0; i<count; i++)
	{
		ActionsSystem.callAction(cards[name].action)
	}
	
	// Update counter
	player.steps++
    GUISystem.getWidgetById("steps_label").setText(player.steps)
})