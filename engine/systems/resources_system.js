/* Resources class */
class ResourcesSystem
{
	static animations = {}
	static textures = {}
	static bitmaps = {}
	static prefabs = {}
	static sounds = {}
	static scripts = {}

	static init()
	{

	}

	static loadTexture(name, src, relative=true, func = null)
	{
		Game.load_queue.push(new Promise((resolve, reject) => 
		{
			ResourcesSystem.textures[name] = new Image()
			ResourcesSystem.textures[name].src = src
			ResourcesSystem.textures[name].onload = function()
			{
				if(func) func(this);
				resolve()
			}
			ResourcesSystem.textures[name].onerror = function()
			{
				let err = "Image " + src + " not loaded!"
				alert(err)
				reject(new Error(err))
			}
		}))
	}

	static loadPrefabs(src)
	{
		ResourcesSystem.loadByURL(src, "text", (result) =>
		{
			let arr = Game.parse(result)
			for(let name in arr)
			{
				let obj = arr[name]
				let prefab = ResourcesSystem.newPrefab(name)
				for(let comp in obj)
				{
					prefab.addComponent(comp, obj[comp])
				}
				
				ResourcesSystem.prefabs[name] = prefab
			}
		})
	}

	static loadStyle(src)
	{
		Game.load_queue.push(new Promise((resolve, reject) => 
		{
			let head = document.head;
			let link = document.createElement("link");

			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = src;
			link.onload = () =>
			{
				resolve()
			}
			link.onerror = () =>
			{
				let err = "Style " + src + " not loaded!"
				alert(err)
				reject(new Error(err))
			}
			head.appendChild(link);
		}))
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
		Game.load_queue.push(new Promise((resolve, reject) => 
		{
			var xhr = new XMLHttpRequest(url);
		    xhr.open('GET', url, true);
		    xhr.responseType = type
		    xhr.onload = function()
		    {
		        func(xhr.response)
		        resolve()
		    }
		    xhr.onerror = function()
		    {
		    	let err = "Resource " + url + " not loaded!"
		    	alert(err)
		    	reject(new Error(err))
		    }
		    xhr.send();
		}))
	}

	static newPrefab(name)
	{
		let prefab = new Prefab(name)
		ResourcesSystem.prefabs[name] = prefab;
		return prefab;
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

	static getScript(name)
	{
		return ResourcesSystem.scripts[name]
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

	static callScript(name)
	{
		ResourcesSystem.scripts[name]()
	}
}
