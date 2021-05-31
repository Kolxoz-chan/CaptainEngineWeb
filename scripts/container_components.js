/* Attribute Change Event */
class BackgroundComponent extends ComponentBase
{
	init()
	{
		this.is_alife = this.join("LifeComponent").isGreaterZero();
	}

	update()
	{
		let life = this.joined["LifeComponent"]
		if(!life.isGreaterZero() && this.is_alife)
		{
			this.is_alife = false
			if(this.dead_action) this.dead_action()
		}
		else if(life.isGreaterZero() && !this.is_alife)
		{
			this.is_alife = true
			if(this.revival_action) this.revival_action()
		}
	}
}