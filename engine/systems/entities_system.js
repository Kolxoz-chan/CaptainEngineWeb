class EntitiesSystem
{
	static entities = [];
	static entities_named = {};

	static init()
	{

	}

	static getNamedEntity(name)
	{
		return EntitiesSystem.entities_named[name]
	}

  	static addEntity(obj)
	{
		if(obj.name)
		{
			this.entities_named[obj.name] = obj;
		}
		this.entities.push(obj);
		obj.init();

		return obj;
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
