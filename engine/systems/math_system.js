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

	static random_chance(value)
	{
		return Math.round(Math.random() * 100) <= value
	}

	
	static random_choice_priority(arr) // {["value", 10], ["value2", 20], ["value2", 30]}
	{
		arr = Object.copy(arr)
		let len = 0

		for(let i in arr)
		{
			let num = arr[i][1]
			arr[i][1] = len
			len += num
		}

		let index = Math.floor(Math.random() * len)
		let result = arr[0][0]

		for(let i in arr)
		{
			if(arr[i][1] > index) break;
			result = arr[i][0];
		}

		return result
	}
}
