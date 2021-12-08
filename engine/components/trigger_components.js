/* Timer component*/
class TimerComponent extends ComponentBase
{
	init(props)
	{
		super.init(props)
		this.addIntefaces(new ITimer())
	}

	update()
	{
		if(this.updateTimer())
		{

			if(this.tic) this.tic(this.getTimer());
		}
		else
		{
			if(this.action) this.action()
		}
	}
}

