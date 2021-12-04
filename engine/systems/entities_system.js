class EntitiesSystem
{
	static entities = [];
	static entities_named = {};

	static init()
	{
		
	}

  static addEntity(obj)
	{
		if(obj.name)
		{
			EntitiesSystem.entities_named[obj.name] = obj;
		}
		EntitiesSystem.entities.push(obj);
		obj.reset();
		obj.init();

		return obj;
	}

	static getEntity(name)
	{
		if(EntitiesSystem.entities_named[name])
		{
			return EntitiesSystem.entities_named[name];
		}
		else
		{
			console.log("WARNING. There is not object named '" + name + "'")
		}
	}

	static update()
	{
		let arr = EntitiesSystem.entities;
		for(let i in arr)
		{
			let obj = arr[i]
			if(obj.update)
			{
				obj.update()
			}
		}
	}
}
