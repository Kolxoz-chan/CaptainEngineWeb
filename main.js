/* --- Init game -------------------------------------------------------  */
Game.init("game-block");

// Loading engine
Game.section(() =>
{
    // Loading systems
    Game.addSystem("time_system.js", "TimeSystem")
    Game.addSystem("camera_system.js", "CameraSystem")
    Game.addSystem("entities_system.js", "EntitiesSystem")
    Game.addSystem("resources_system.js", "ResourcesSystem")
    Game.addSystem("gui_system.js", "GUISystem")
    Game.addSystem("audio_system.js", "AudioSystem")
    Game.addSystem("input_system.js", "InputSystem", (system) =>
    {
        system.setEvents("mousemove", "mousedown", "mouseup")
    })
    Game.addSystem("canvas2d_system.js", "Canvas2DSystem", (system) =>
    {
        system.setSize(new Vector2(1280, 720))
    })

    // Loading componeents
    Game.include("engine/components/transform_components.js")
    Game.include("engine/components/drawable_components.js")
    Game.include("engine/components/controller_components.js")
    Game.include("engine/components/trigger_components.js")
    Game.include("engine/components/colider_components.js")

    // Loading modules
    Game.include("engine/addons/json_loader.js")
})

// Loading resources
Game.section(() =>
{
    JSONLoader.loadEntities("resources/configs/entities.json")
    ResourcesSystem.loadPrefabs("resources/configs/prefabs.json")
    GUISystem.loadGUI("resources/configs/gui.json")
    ResourcesSystem.loadStyle("resources/styles.css")
    Game.include("resources/scripts/playing_cards.js")
    Game.include("resources/scripts/turtle_battle.js")
    ResourcesSystem.loadTexture("test", "resources/textures/test.png")
    ResourcesSystem.loadTileset("cards", "resources/textures/cards.png", 100, 100)
})

// Start engine
Game.section(() =>
{

    TurtleBattle.init()
    let cards_deck = GUISystem.getWidget("cards_deck")
    let cards = TurtleBattle.getCards(5)
    for(let i in cards)
    {
      cards_deck.addWidget(cards[i])
    }

    Game.start();
})
