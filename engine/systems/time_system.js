/* Time class */
class TimeSystem
{
	static date = new Date();
	static delta_time = 0;

	static init()
	{
		TimeSystem.update()
	}

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

	static timeFormat(time, temp)
	{
		const day = 86400
		const hour = 3600
		const minute = 60

		time = Math.max(time, 0)

		let hours = Math.floor((time % day) / hour)
	    let minutes = Math.floor((time % hour) / minute)
	    let seconds = Math.floor((time % minute))

	    if(seconds < 10) seconds = "0" + seconds 
	    if(minutes < 10) minutes = "0" + minutes
	    if(hours < 10) hours = "0" + hours

	    return temp.replace("h", hours).replace("m", minutes).replace("s", seconds)
	}
}
