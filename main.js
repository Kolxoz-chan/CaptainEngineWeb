/* --- Init game -------------------------------------------------------  */
Game.init("game-block");

// Loading systems
Game.addSystems(
{
    "time_system.js"        :   "TimeSystem",
    "tasks_system.js"       :   "TasksSystem",
    "camera_system.js"      :   "CameraSystem", 
    "entities_system.js"    :   "EntitiesSystem",
    //"window_system.js"      :   "WindowSystem",
    "input_system.js"       :   "InputSystem",
    "resources_system.js"   :   "ResourcesSystem",
    "ascii_canvas_system.js":   "ASCIICanvasSystem",
    "gui_system.js"         :   "GUISystem",
    "audio_system.js"       :   "AudioSystem"
})

// Loading componeents
Game.onCompleate(() =>
{
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
    ResourcesSystem.loadAnimations("resources/configs/animations.json")
    ResourcesSystem.loadPrefabs("resources/configs/prefabs.json")
    JSONLoader.loadEntities("resources/configs/entities.json")

    Game.onCompleate(() => 
    {
        // TextCanvasSystem
        let text_canvas = Game.getSystem("ASCIICanvasSystem")
        text_canvas.setSize(new Vector2(140, 35))

        // InputSystem
        let input = Game.getSystem("InputSystem")
        input.setEvents(["keydown", "keyup"])

        // GUISystem ----------------------------------------------------------------------------------------------- //
        let gui = Game.getSystem("GUISystem")

        // Styles
        let button_style = "background-color: black; color: white; border: 2px solid white; width: 70%; margin: auto; margin-top: 10px;"

        // Start menu
        let start_menu = gui.addWidget("main_menu", new Frame())
        start_menu.setPosition(50, 40, "%")
        start_menu.addWidget(new Label("&#10052; Дед Мороз &#10052;", "font-size: 48pt; color: white;"))
        start_menu.addWidget(new Separator("margin: 10px"))
        start_menu.addWidget(new Button("Начать", button_style))
        start_menu.addWidget(new Button("Разработчик", button_style))
        start_menu.addWidget(new Button("Выйти", button_style))

        // Fail main
        let fail_menu = gui.addWidget("fail_menu", new Frame())
        fail_menu.hide()
        fail_menu.setPosition(50, 40, "%")
        fail_menu.addWidget(new Label("&#10052; Игра окончена &#10052;", "font-size: 48pt; color: white;"))
        fail_menu.addWidget(new Separator("margin: 10px"))
        fail_menu.addWidget(new Button("Занова", button_style))
        fail_menu.addWidget(new Button("В меню", button_style))

        // Win main
        let win_menu = gui.addWidget("win_menu", new Frame())
        win_menu.hide()
        win_menu.setPosition(50, 40, "%")
        win_menu.addWidget(new Label("&#10052; Победа &#10052;", "font-size: 48pt; color: white;"))
        win_menu.addWidget(new Separator("margin: 10px"))
        win_menu.addWidget(new Button("Продолжить", button_style))
        win_menu.addWidget(new Button("В меню", button_style))

        // HUD screen
        let hud = gui.addWidget("hud_screen", new Frame())
        hud.setPosition(50, 10, "%")
        hud.hide()
        hud.addWidget(new Label("", "font-size: 36pt; color: white;"))



        Game.start();
    })
  })
})
