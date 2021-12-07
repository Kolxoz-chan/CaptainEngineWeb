class ControllerComponent extends ComponentBase
{
	init(props)
	{
		props.is_combined = true;

		super.init(props)
	}

	getDefaultProperties()
	{
		return this.default_properties
	}

	isCombined()
	{
		return this.getProperty("is_combined")
	}
}

class MovingControllerComponent extends ControllerComponent
{
	init(props)
	{
		props.left = ["KeyA", "ArrowLeft"]
		props.right = ["KeyD", "ArrowRight"]
		props.up = ["KeyW", "ArrowUp"]
		props.down = ["KeyS", "ArrowDown"]

		super.init(props)
		this.join("TransformComponent")
		this.addIntefaces(new ISpeed())
	}

	update()
	{
		let transform_component = this.joined["TransformComponent"]
		let speed = this.getSpeed() * TimeSystem.getDeltaTime() ;

		/* Moving */
		if(InputSystem.isKeysPressed(this.getProperty("up")))
		{
			transform_component.move(new Vector2(0, -speed));
			if(!this.isCombined()) return
		}

		if(InputSystem.isKeysPressed(this.getProperty("down")))
		{
			transform_component.move(new Vector2(0, speed));
			if(!this.isCombined()) return
		}

		if(InputSystem.isKeysPressed(this.getProperty("left")))
		{
			transform_component.move(new Vector2(-speed, 0));
			if(!this.isCombined()) return
		}

		if(InputSystem.isKeysPressed(this.getProperty("right")))
		{
			transform_component.move(new Vector2(speed, 0));
			if(!this.isCombined()) return
		}
	}
}
