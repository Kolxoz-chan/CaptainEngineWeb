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

			if(angle == 0) vec = new Vector2(0, -1)
			else if(angle == 90) vec = new Vector2(1, 0)
			else if(angle == 180) vec = new Vector2(0, 1)
			else if(angle == 270) vec = new Vector2(-1, 0)

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
		ActionsSystem.callAction("TransformAction", {"target" : "player", "rotate" : 90})
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
		let map = EntitiesSystem.getNamedEntity("map")
		if(player)
		{
			let transform = player.getComponent("TransformComponent")
			let grid = player.getComponent("GridItemComponent")
			let angle = Math.abs(transform.getAngle()) % 360;
			let vec = new Vector2(0,0);
			map = map.getComponent("GridLayoutComponent")

			if(angle == 0) vec = new Vector2(0, -1)
			else if(angle == 90) vec = new Vector2(1, 0)
			else if(angle == 180) vec = new Vector2(0, 1)
			else if(angle == 270) vec = new Vector2(-1, 0)

			//map.getMapItem()

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
