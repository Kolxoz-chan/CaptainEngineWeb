let scripts = ResourcesSystem.scripts

scripts.new_game_button = function()
{
	EntitiesSystem.getNamedEntity("actor").setEnabled(true)
    EntitiesSystem.resetAll()
    AudioSystem.play("bg_01")

    GUISystem.getWidget("main_menu").setVisible(false)
    GUISystem.getWidget("fail_menu").setVisible(false)
    GUISystem.getWidget("win_menu").setVisible(false)

    GUISystem.getWidget("hud_screen").setVisible(true)
}

scripts.main_menu_button = function()
{
    GUISystem.getWidget("main_menu").setVisible(true)
    GUISystem.getWidget("fail_menu").setVisible(false)
    GUISystem.getWidget("win_menu").setVisible(false)
}

scripts.update_timer = function()
{
    let actor = EntitiesSystem.getNamedEntity("actor")
    let timers = actor.getComponent("TimersTriggerComponent")
    let timer = timers.getTimer(0)
    let time = TimeSystem.timeFormat(timer.time - timer.value, "&#9885; m:s")

    GUISystem.getWidgetById("hud_timer_label").setText(time)
}

scripts.exit_button = function()
{
    window.close()
}

scripts.author_button = function()
{
    window.open("https://www.patreon.com/kolxoz")
}