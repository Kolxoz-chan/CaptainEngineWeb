/* --- Init game -------------------------------------------------------  */
Game.init("game-block");

// Loading systems
Game.addSystem("time_system.js", "TimeSystem")
Game.addSystem("tasks_system.js", "TasksSystem")
Game.addSystem("camera_system.js", "CameraSystem")
Game.addSystem("entities_system.js", "EntitiesSystem")
Game.addSystem("resources_system.js", "ResourcesSystem")
Game.addSystem("gui_system.js", "GUISystem")
Game.addSystem("audio_system.js", "AudioSystem")
Game.addSystem("ascii_canvas_system.js", "ASCIICanvasSystem", (system) =>
{
    system.setSize(new Vector2(140, 35))
})
Game.addSystem("input_system.js", "InputSystem", (system) =>
{
    system.setEvents(["keydown", "keyup"])
})

// Loading componeents
Game.include("engine/addons/json_loader.js")
Game.include("engine/components/transform_components.js")
Game.include("engine/components/drawable_components.js")
Game.include("engine/components/controller_components.js") 
Game.include("engine/components/action_components.js")
Game.include("engine/components/trigger_components.js")
Game.include("engine/components/colider_components.js")

// Loading resources
Game.onCompleate(() => 
{
    // Audio
    ResourcesSystem.loadAudio("bg_01", "resources/sounds/bg_01.mp3")

    // Configs
    Game.include("resources/scripts/gui_actions.js")
    ResourcesSystem.loadStyle("resources/configs/styles.css")
    ResourcesSystem.loadAnimations("resources/configs/animations.json")
    ResourcesSystem.loadPrefabs("resources/configs/prefabs.json")
    JSONLoader.loadEntities("resources/configs/entities.json")
    GUISystem.loadGUI("resources/configs/gui.json")

    Game.onCompleate(() => 
    {
        Game.start();
    })
})