class MathSystem
{
	static random_range(min, max)
	{
		return Math.round(Math.random() * (max - min) + min);
	}

	static random_choice(arr)
	{
		if(arr.length)
		{
			let index = Math.floor(Math.random() * arr.length)
			return arr[index]
		}
		return null
	}
/*
	static random_choice_priority(arr)
	{
		if(arr.length)
		{
			let index = Math.floor(Math.random() * arr.length)
			return arr[index]
		}
		return null
	}
*/
	static random_chance(value)
	{
		return Math.round(Math.random() * 100) <= value
	}
}
