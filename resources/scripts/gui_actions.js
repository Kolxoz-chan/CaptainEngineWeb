let scripts = ResourcesSystem.scripts

scripts.new_game_button = function()
{
	EntitiesSystem.getNamedEntity("actor").setEnabled(true)
    EntitiesSystem.resetAll()
    AudioSystem.play("bg_01")
    start_menu.setVisible(false)
    hud.show()
}

scripts.update_timer = function()
{
    let actor = EntitiesSystem.getNamedEntity("actor")
    let timers = actor.getComponent("TimersTriggerComponent")
    let timer = timers.getTimer(0)

    let time = timer.time - timer.value
    let minutes = Math.floor(time / 60)
    let seconds = Math.floor(time - minutes * 60)

    if(minutes < 10) minutes = "0" + minutes
    if(seconds < 10) seconds = "0" + seconds 

    hud_time.setText("&#9885;  " + minutes + ":" + seconds)
}

scripts.exit_button = function()
{
    window.close()
}