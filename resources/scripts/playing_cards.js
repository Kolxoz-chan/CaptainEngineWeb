class AheadCard
{
	static name = "ВПЕРЁД"
	static icon = "cards_0x0"
	static description = "Вы можете сделать ход по направлению в которое смотрит ваша фишка"

	static action()
	{
		let player = EntitiesSystem.getNamedEntity("player")
		if(player)
		{
			let transform = player.getComponent("TransformComponent")
			let grid = player.getComponent("GridItemComponent")
			let angle = Math.abs(transform.getAngle()) % 360;
			let vec = new Vector2(0, 0)
			let map = player.parent.getComponent("GridLayoutComponent")
			let pos = grid.getPosition()

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
	}
}

class TurnCard
{
	static name = "ПОВОРОТ"
	static icon = "cards_1x0"
	static description = "Вы можете повернуться на 90 градусов в любую сторону"

	static action()
	{
		let player = EntitiesSystem.getNamedEntity("player")
		let grid = player.getComponent("GridItemComponent")
		let transform = player.getComponent("TransformComponent")
		let position = grid.getPosition()
		let angle = transform.getAngle()

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
				"TransformAction" : {"target" : "player","rotate" : -rotation},
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
				"TransformAction" : {"target" : "player","rotate" : rotation},
				"GUIVisibleAction" : {"cards_deck" : true}
			}

		}]}
		}})
	}
}

class UTurnCard
{
	static name = "РАЗВОРОТ"
	static icon = "cards_2x0"
	static description = "Вы можете развернуться в обратную сторону"

	static action()
	{
		let player = EntitiesSystem.getNamedEntity("player")
		let transform = player.getComponent("TransformComponent")
		transform.rotate(180)
	}
}

class JumpCard
{
	static name = "ПРЫЖОК"
	static icon = "cards_1x1"
	static description = "Вы можете перепрыгнуть через рядомстаящуюю стену или игрока"

	static action()
	{
		let player = EntitiesSystem.getNamedEntity("player")
		if(player)
		{
			let transform = player.getComponent("TransformComponent")
			let grid = player.getComponent("GridItemComponent")
			let angle = Math.abs(transform.getAngle()) % 360;
			let vec = new Vector2(0,0);
			let map = player.parent.getComponent("GridLayoutComponent")
			let pos = grid.getPosition()

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
	}
}

class ResetCard
{
	static name = "СБРОС"
	static icon = "cards_0x1"
	static description = "Вы можете заменить весь свой набор карт на новый"

	static action()
	{
		TurtleBattle.reset()
	}
}

class DoublingCard
{
	static name = "УДВОЕНИЕ"
	static icon = "cards_2x1"
	static description = "Эффект любой карты увеличивается в два раза"

	static action()
	{

	}
}
