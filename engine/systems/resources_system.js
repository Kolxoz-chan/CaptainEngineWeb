/* Resources class */
class ResourcesSystem
{
	static animations = {}
	static textures = {}
	static bitmaps = {}
	static prefabs = {}
	static sounds = {}
	static scripts = {}
	static actions = {}

	static buffer = null
	static buffer_canvas = null

	static init()
	{
		ResourcesSystem.buffer_canvas = document.createElement("canvas")
		ResourcesSystem.buffer = ResourcesSystem.buffer_canvas.getContext("2d")
	}

	static cropImage(img, x, y, w, h)
	{
		ResourcesSystem.buffer_canvas.width = w
		ResourcesSystem.buffer_canvas.height = h
		ResourcesSystem.buffer.drawImage(img, x, y, w, h, 0, 0, w, h)


		var img = new Image();
		img.src = ResourcesSystem.buffer_canvas.toDataURL();

		return img
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

	static loadTileset(name, src, width, height, padding = 0, spacing = 0)
	{
		Game.load_queue.push(new Promise((resolve, reject) =>
		{
			let img = new Image()
			img.src = src
			img.onload = function()
			{
				let w = Math.floor(img.width / width)
				let h = Math.floor(img.height / height)

				for(let y=0; y<h; y++)
				{
					for(let x=0; x<w; x++)
					{
						let tile = ResourcesSystem.cropImage(img, x * width, y * height, width, height)
						ResourcesSystem.textures[name + "_" + x + "x" + y] = tile
					}
				}
				resolve()
			}
			img.onerror = function()
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

// Actions loading
let actions = ResourcesSystem.actions
actions.ResetAction = (obj, data) =>
{
	obj.reset();
}

actions.DestroyAction = (obj, data) =>
{
	obj.parent.deleteChild(this.owner)
}

actions.DisableAction = (obj, data) =>
{
	obj.setEnabled(false)
}

actions.GUIShowAction = (obj, data) =>
{
	for(let name in data)
	{
		let widget = GUISystem.getWidget(name)
		if(widget)
		{
			widget.setVisible(data[name])
		}
	}
}

actions.DissolveAction = (obj, data) =>
{
	//this.joined["DrawableComponent"].setOpacity(data.time / data.max_time)
}

actions.SpawnAction = (obj, data) =>
{
	if(data.prefab)
	{
		let prefab = ResourcesSystem.getPrefab(data.prefab)
		let settings = data.settings ? data.settings : {}
		let layer = data.layer ? data.layer : this.owner.parent
		let position = this.joined["TransformComponent"].getPosition()

		if(data.offset)
		{
			position = position.addVec(data.offset)
		}

		layer.addChild(prefab.getEntity(
		{
			...settings,
			"TransformComponent" : {"position" : position},
		}))
	}
}

actions.ScriptAction = (obj, data) =>
{
	for(let name in data)
	{
		ResourcesSystem.callScript(name)
	}
}
