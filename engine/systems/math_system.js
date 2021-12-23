class MathSystem
{
	static random_range(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	static random_choice(arr)
	{
		if(arr.length)
		{
			let index = Math.round(Math.random() * arr.length)
			return arr[index]
		}
		return null
	}
}