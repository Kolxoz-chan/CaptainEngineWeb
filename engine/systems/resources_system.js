/* Resources class */
class ResourcesSystem
{
	static onLoad = null

	static textures = {}
	static bitmaps = {}
	static prefabs = {}
	static sounds = {}

	static loading_counter = 0;
	static resources_dir = ""
	static textures_dir = "";
	static sounds_dir = ""
	static fonts_dir = ""
	static game_dir = ""

	static init()
	{

	}

	static isLoaded()
	{
		return ResourcesSystem.loading_counter <= 0;
	}

	static loadAll()
	{
		ResourcesSystem.loadResource(ResourcesSystem.textures, (src) =>
		{
			let img = new Image()
			img.src = src;
			return img;
		})
	}

	static loadResource(arr, func)
	{
		for(let i in arr)
		{
			let obj = func(arr[i]);
			obj.src = arr[i]
			arr[i] = obj

			arr[i].onload = () =>
			{
				ResourcesSystem.loading_counter--;
				if(ResourcesSystem.isLoaded() && ResourcesSystem.onLoad) ResourcesSystem.onLoad()
			}

			arr[i].onerror = () =>
			{
				ResourcesSystem.loading_counter--;
				console.log("ERROR. " + obj.constructor.name + " '" + i + "' is not loaded!")
				if(ResourcesSystem.loading_counter <= 0 && ResourcesSystem.onLoad) ResourcesSystem.onLoad()
			}
		}
	}

	static loadTexture(name, src, relative=true, func = null)
	{
		ResourcesSystem.loading_counter++;
		ResourcesSystem.textures[name] = new Image()
		ResourcesSystem.textures[name].crossOrigin="anonymous"
		if(relative) src = ResourcesSystem.textures_dir + src;
		ResourcesSystem.textures[name].src = src
		if(func) ResourcesSystem.textures[name].onload = func;
		ResourcesSystem.textures[name].onerror = function()
		{
			alert("Image " + src + " not loaded!")
		}
	}

	static loadAudio(name, src)
	{
		ResourcesSystem.sounds[name] = new Audio(ResourcesSystem.sounds_dir + src);
	}

	static loadFont(name, src)
	{
		let font = document.createElement("style")
		font.innerHTML = "@font-face { font-family: " + name + "; src: url(" + ResourcesSystem.fonts_dir + src + ");}"
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

	static createEntity(name, props = {})
	{
		let prefab = ResourcesSystem.getPrefab(name)
		return prefab.getEntity(props)
	}
}
