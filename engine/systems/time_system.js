/* Time class */
class TimeSystem
{
	static date = new Date();
	static delta_time = 0;

	static getDate()
	{
		return TimeSystem.date
	}

	static getDeltaTime()
	{
		return TimeSystem.delta_time
	}

	static update()
	{
		let time = TimeSystem.date.getTime()
		TimeSystem.date = new Date();
		TimeSystem.delta_time = (TimeSystem.date.getTime() - time) / 1000;
	}
}
