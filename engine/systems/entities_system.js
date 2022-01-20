class EntitiesSystem
{
	static entities = [];
	static entities_named = {};
	static entities_taged = {};
	static entities_componented = {};

	static init()
	{

	}

	static getNamedEntity(name)
	{
		return EntitiesSystem.entities_named[name]
	}

	static getEntity(name)
	{
		if(this.entities_named[name])
		{
			return this.entities_named[name];
		}
		else
		{
			console.log("WARNING. There is not object named '" + name + "'")
		}
	}

	static addEntity(obj)
	{
		if(obj.name)
		{
			this.entities_named[obj.name] = obj;
		}
		this.entities.push(obj);
		obj.init();
		obj.reset(false)

		return obj;
	}

	static addEntityByTag(name, obj)
	{
		if(!this.entities_taged[name]) this.entities_taged[name] = []
		this.entities_taged[name].push(obj)
	}

	static addEntityByComponent(name, obj)
	{
		/*
		if(!this.entities_componented[name]) this.entities_componented[name] = []
		this.entities_componented[name].push(obj)*/
	}

	static loadEntities(src)
	{
		ResourcesSystem.loadByURL(src, "text", (result) =>
		{
			let arr = Game.parse(result)
			for(let i in arr)
			{
				let entity = EntitiesSystem.createEntity(arr[i])
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
					let child = EntitiesSystem.createEntity(obj.entities[i])
					entity.addChild(child)
				}
			}

			// Set property
			else entity[name] = value
		}

		return entity
	}

	static resetAll()
	{
		for(let i in EntitiesSystem.entities)
		{
			EntitiesSystem.entities[i].reset()
		}
	}

	static update()
	{
		let arr = this.entities;
		for(let i in arr)
		{
			let obj = arr[i]
			if(obj.update && obj.isEnabled())
			{
				obj.update()
			}
		}
	}
}
