class AudioSystem
{
	static init()
	{


	}

	static play(name)
	{
		ResourcesSystem.getAudio(name).play()
	}
}