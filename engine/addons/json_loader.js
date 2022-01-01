class JSONLoader
{
	static loadEntities(src)
	{	
		ResourcesSystem.loadByURL(src, "text", (result) =>
		{
			let arr = Game.parse(result)
			for(let i in arr)
			{
				let entity = JSONLoader.createEntity(arr[i])
				EntitiesSystem.addEntity(entity)
			}			
		})
	}

	static createEntity(obj)
	{
		let entity = new Entity()
		for(let name in obj)
		{
			let value = obj[name]

			// Components loading
			if(name == "components")
			{
				for(let name in value)
				{
					entity.addComponent(name, obj.components[name])
				}
			}

			// Child loadng
			else if (name == "entities")
			{
				for(let i in value)
				{
					let child = JSONLoader.createEntity(obj.entities[i])
					entity.addChild(child)
				}
			}

			// Set property
			else entity[name] = value
		}

		return entity
	}
}