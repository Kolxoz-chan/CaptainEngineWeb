/* --------------------------------- Components  -------------------------------------- */
class ComponentBase
{
	name = ""
	enabled = true;
	joined = {};
	default_properties = {};
	properties = {};

	init(props = {})
	{
		this.default_properties = Object.assign(props, this.default_properties)
	}

	update()
	{
		/* Abstract method */
	}

	reset()
	{
		if(super.reset) super.reset()
		this.properties = Object.assign(this.properties, this.default_properties)
	}

	join(name)
	{
		this.joined[name] = this.owner.getComponent(name)
		return this.joined[name];
	}

	addIntefaces()
	{
		for(let i in arguments)
		{
			let obj = arguments[i]
			for(let key in obj)
			{
				let value = obj[key]
				if(typeof(value) == "function")
				{
					this[key] = value;
				}
				else
				{
					this.default_properties[key] = value;
				}
			}
		}
	}

	setProperty(name, value)
	{
		if(this.default_properties[name] != undefined)
		{
			this.properties[name] = value
		}
		else
		{
			alert("SET PROPERTY ERROR. " + this.constructor.name + ` hasn't property '${name}'`)
		}
	}

	getProperty(name)
	{
		if(this.properties[name] != undefined)
		{
			return this.properties[name]
		}
		else if(this.default_properties[name] != undefined)
		{
			return this.default_properties[name]
		}
		else
		{
			alert("GET PROPERTY ERROR. " + this.constructor.name + ` hasn't property '${name}'`)
			return null;
		}
	}

	setName(value)
	{
		this.name = value
	}

	isEnabled()
	{
		return this.enabled;
	}

	setEnabled(value)
	{
		this.enabled = value
	}

	setOwner(owner)
	{
		this.owner = owner
	}

	isEnabled()
	{
		return this.enabled
	}

	setData(data)
	{
		for(var name in data)
		{
			this.default_properties[name] = data[name]
		}
	}
}
