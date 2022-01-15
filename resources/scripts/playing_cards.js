class PlayingCard
{
	name = ""
	icon = ""
	description = ""

	constructor(name, icon, description)
	{
		this.name = name
		this.icon = icon
		this.description = description
	}
}

class AheadCard extends PlayingCard
{
	constructor()
	{
		super("", "", "")
	}

	action()
	{
		
	}
}