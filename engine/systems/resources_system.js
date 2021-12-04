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
		return Resources.loading_counter <= 0;
	}

	static loadAll()
	{
		Resources.loadResource(Resources.textures, (src) =>
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
				Resources.loading_counter--;
				if(Resources.isLoaded() && Resources.onLoad) Resources.onLoad()
			}

			arr[i].onerror = () =>
			{
				Resources.loading_counter--;
				console.log("ERROR. " + obj.constructor.name + " '" + i + "' is not loaded!")
				if(Resources.loading_counter <= 0 && Resources.onLoad) Resources.onLoad()
			}
		}
	}

	static loadTexture(name, src, relative=true, func = null)
	{
		Resources.loading_counter++;
		Resources.textures[name] = new Image()
		Resources.textures[name].crossOrigin="anonymous"
		if(relative) src = Resources.textures_dir + src;
		Resources.textures[name].src = src
		if(func) Resources.textures[name].onload = func;
		Resources.textures[name].onerror = function()
		{
			alert("Image " + src + " not loaded!")
		}
	}

	static loadAudio(name, src)
	{
		Resources.sounds[name] = new Audio(Resources.sounds_dir + src);
	}

	static loadFont(name, src)
	{
		let font = document.createElement("style")
		font.innerHTML = "@font-face { font-family: " + name + "; src: url(" + Resources.fonts_dir + src + ");}"
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
		Resources.prefabs[asset.name] = asset;
		return asset;
	}

	static addTexture(name, obj)
	{
		Resources.textures[name] = obj;
	}

	static getTexture(name)
	{
		return Resources.textures[name];
	}

	static getAudio(name)
	{
		return Resources.sounds[name];
	}

	static getPrefab(name)
	{
		return Resources.prefabs[name];
	}
}
