class SettingsSystem
{
	static settings =
	{
		"resizable" : false,
		"default_cursor" : "auto",
		"size" : new Vector2(640, 480),
		"style" : ""
	}

	static resetSettings()
	{
		Game.setSize(Game.settings.size)
		Game.canvas.style = Game.settings.style
		Game.canvas.style.cursor = Game.settings.default_cursor
	}

	static resetCursor()
	{
		Game.setCursor(Game.default_cursor)
	}

	static setCursor(name)
	{
		Game.canvas.style.cursor = name
	}
}