/* Resources class */
class ResourcesSystem
{
	static animations = {}
	static textures = {}
	static bitmaps = {}
	static prefabs = {}
	static sounds = {}

	static init()
	{

	}


	static loadTexture(name, src, relative=true, func = null)
	{
		ResourcesSystem.textures[name] = new Image()
		ResourcesSystem.textures[name].crossOrigin="anonymous"
		ResourcesSystem.textures[name].src = src
		if(func) ResourcesSystem.textures[name].onload = func;
		ResourcesSystem.textures[name].onerror = function()
		{
			alert("Image " + src + " not loaded!")
		}
	}

	static loadAnimations(src)
	{
		ResourcesSystem.loadByURL(src, "text", (result) =>
		{
			let arr = Game.parse(result)
			for(let name in arr)
			{
				ResourcesSystem.animations[name] = arr[name]
			}
		})
	}

	static loadAudio(name, src)
	{
		ResourcesSystem.sounds[name] = new Audio(src);
	}

	static loadFont(name, src)
	{
		let font = document.createElement("style")
		font.innerHTML = "@font-face { font-family: " + name + "; src: url(" + src + ");}"
		document.head.appendChild(font)
	}

	static loadByURL(url, type = "text", func = function() {})
	{
		var xhr = new XMLHttpRequest(url);
	    xhr.open('GET', url, true);
	    xhr.responseType = type
	    xhr.onload = function()
	    {
	        func(xhr.response)
	    }
	    xhr.onerror = function()
	    {
	    	alert("Resource " + url + " not loaded!")
	    }
	    xhr.send();
	}

	static addPrefab(asset)
	{
		ResourcesSystem.prefabs[asset.name] = asset;
		return asset;
	}

	static addTexture(name, obj)
	{
		ResourcesSystem.textures[name] = obj;
	}

	static getTexture(name)
	{
		return ResourcesSystem.textures[name];
	}

	static getAudio(name)
	{
		return ResourcesSystem.sounds[name];
	}

	static getPrefab(name)
	{
		return ResourcesSystem.prefabs[name];
	}

	static getAnimation(name)
	{
		return ResourcesSystem.animations[name]
	}

	static createEntity(name, props = {})
	{
		let prefab = ResourcesSystem.getPrefab(name)
		return prefab.getEntity(props)
	}
}
