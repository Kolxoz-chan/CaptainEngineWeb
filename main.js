/* --- Init game -------------------------------------------------------  */
Game.init("game-block");

/* --- Init systems -------------------------------------------------------  */
Game.addSystem("time_system.js",  		"TimeSystem")
Game.addSystem("tasks_system.js", 		"TasksSystem")
Game.addSystem("camera_system.js", 		"CameraSystem")
Game.addSystem("entities_system.js", 	"EntitiesSystem")
//Game.addSystem("window_system.js", 		"WindowSystem")
Game.addSystem("input_system.js", 		"InputSystem")
Game.addSystem("resources_system.js", 	"ResourcesSystem")
Game.addSystem("textcanvas_system.js", 	"TextCanvasSystem")
Game.addSystem("gui_system.js",  "GUISystem")

/* --- Init components -------------------------------------------------------  */
setTimeout(() =>
{
  Game.include("engine/components/transform_components.js")
  Game.include("engine/components/drawable_components.js")
  Game.include("engine/components/controller_components.js")
  Game.include("engine/components/action_components.js")
  Game.include("engine/components/trigger_components.js")
  Game.include("engine/components/colider_components.js")
}, 1000)

let anim_01 =
[
    {
        "sprite" :
        [
            "    _\\/_",
            "     /\\",
            "     /\\",
            "    /  \\",
            "    /~~\\o",
            "  o/    \\",
            "  /~~*~~~\\",
            "  /    o \\",
            " /~~~~~~~~\\",
            "/*_________\\",
            "     ||",
            "     ||",
            "    /  \\"
        ]
    },
    {
        "sprite" :
        [
            "   '_\\/_'",
            "    '/\\'",
            "     /\\",
            "    /  \\",
            "    /~~\\",
            "   / o  \\",
            "  /~~~~*~\\",
            "  /      \\o",
            " /~~~~~~~~\\",
            "/__*_______\\",
            "     ||",
            "     ||",
            "    /  \\"
        ]
    },
    {
        "sprite" :
        [
            "   \"_\\/_\"",
            "    //\\\\",
            "     /\\",
            "    /  \\",
            "   o/~~\\",
            "   /   o\\",
            "  /~~~~~*\\",
            "  /      \\",
            " /~~~~~~~~\\",
            "/_____*____\\",
            "     ||",
            "     ||",
            "    /  \\"
        ]
    },
    {
        "sprite" :
        [
            "   '_\\/_'",
            "    '/\\'",
            "     /\\",
            "    /  \\",
            "    /o~\\",
            "   /    \\o",
            "  /~~~~~~\\",
            " o/      \\",
            " /~~~~~~~~\\",
            "/_________*\\",
            "     ||",
            "     ||",
            "    /  \\"
        ]
    },
    {
        "sprite" :
        [
            "    _\\/_",
            "     /\\",
            "     /\\",
            "    /  \\",
            "    /~o\\",
            "   /    \\",
            "  /*~~~~~\\",
            "  / o    \\",
            " /~~~~~~~~\\",
            "/__________\\",
            "     ||",
            "     ||",
            "    /  \\"
        ]
    }
]

let anim_02 =
[
  {
    "sprite":
    [
      "\\   /",
      " \\o/"
    ]
  },
  {
    "sprite":
    [
      "/\\o/\\"
    ]
  },
  {
    "sprite":
    [
      " /o\\",
      "/   \\"
    ]
  }
]


/* --- Start game -------------------------------------------------------  */
setTimeout(() =>
{
    // TextCanvasSystem
    let text_canvas = Game.getSystem("TextCanvasSystem")
    text_canvas.setSize(new Vector2(140, 35))

    // InputSystem
    let input = Game.getSystem("InputSystem")
    input.setEvents(["keydown", "keyup"])

    // GUISystem ----------------------------------------------------------------------------------------------- //
    let gui = Game.getSystem("GUISystem")

    // Start menu
    let start_menu = gui.addWidget(new Frame())
    start_menu.setPosition(50, 50, "%")

    let button_style = "background-color: black; color: white; border: 2px solid white; width: 70%; margin: auto; margin-top: 10px;"
    start_menu.addWidget(new Label("&#10052; Дед Мороз &#10052;", "font-size: 48pt; color: white;"))
    start_menu.addWidget(new Separator("margin: 10px"))
    start_menu.addWidget(new Button("Начать", button_style, () =>
    {
        EntitiesSystem.resetAllEntities()
        start_menu.setVisible(false)
    }))
    start_menu.addWidget(new Button("Разработчик", button_style, () => 
    {
        window.open("https://github.com/Kolxoz-chan");
    }))
    start_menu.addWidget(new Button("Выйти", button_style, () => 
    {
        window.close();
    }))


    // ResourcesSystem ----------------------------------------------------------------------------------------- //
    let prefab = ResourcesSystem.addPrefab(new Prefab("tree_01"))
    prefab.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    prefab.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : ["ResetActionComponent"]})
    prefab.addComponent("ResetActionComponent")
    prefab.addComponent("ASCIISpriteComponent")
    prefab.addComponent("ASCIIColiderComponent")
    prefab.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})

    prefab = ResourcesSystem.addPrefab(new Prefab("bird_01"))
    prefab.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    prefab.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : ["ResetActionComponent"]})
    prefab.addComponent("ResetActionComponent")
    prefab.addComponent("ASCIISpriteComponent")
    prefab.addComponent("ASCIIColiderComponent")
    prefab.addComponent("AnimatedComponent", {"max_timer" : 0.2, "clip" : anim_02})

    prefab = ResourcesSystem.addPrefab(new Prefab("price_01"))
    prefab.addComponent("GravityComponent", {"vector" : new Vector2(-30, 26)})
    prefab.addComponent("ASCIISpriteComponent", {"sprite" :
    [
      " [><]",
      "[_||_]",
      "|____|"
    ]})


    // EntitiesSystem -------------------------------------------------------------------------------------------- // 
    let entities = Game.getSystem("EntitiesSystem")

    let objects = new Entity("objects")
    entities.addEntity(objects)

    let ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 34)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 6.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("ASCIISpriteComponent", {"sprite" : ["_".repeat(140)]})
    objects.addChild(ent)

    objects.addChild(ResourcesSystem.createEntity("tree_01",
    {
        "TransformComponent" : {"position" : new Vector2(120, 22)}
    }))

    objects.addChild(ResourcesSystem.createEntity("tree_01",
    {
        "TransformComponent" : {"position" : new Vector2(140, 22)},
        "TimerTriggerComponent" : {"timer" : 7.0, "actions" : ["ResetActionComponent"]}
    }))

    objects.addChild(ResourcesSystem.createEntity("bird_01",
    {
        "TransformComponent" : {"position" : new Vector2(160, 5)},
        "TimerTriggerComponent" : {"timer" : 4.0, "actions" : ["ResetActionComponent"]}
    }))

    objects.addChild(ResourcesSystem.createEntity("bird_01",
    {
        "TransformComponent" : {"position" : new Vector2(120, 10)},
        "TimerTriggerComponent" : {"timer" : 6.0, "actions" : ["ResetActionComponent"]}
    }))

    objects.addChild(ResourcesSystem.createEntity("bird_01",
    {
        "TransformComponent" : {"position" : new Vector2(200, 15)},
        "TimerTriggerComponent" : {"timer" : 8.0, "actions" : ["ResetActionComponent"]}
    }))

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(100, 33)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, -10)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 3.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
    " |",
    "/_\\",
    "|F|",
    "/_\\"
    ]})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(140, 29)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
    "    __",
    "  _|==|_",
    "   ('')",
    " <(`^^')>",
    " (`^'^'`)",
    "  ------"
    ]})
    objects.addChild(ent) 


    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 0)})
    ent.addComponent("MovingControllerComponent", {"speed" : 30})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(0, 10)})
    ent.addComponent("ASCIIColiderComponent", {"coliding" : true})
    ent.addComponent("DisableActionComponent")
    ent.addComponent("SpawnActionComponent", {"prefab" : "price_01"})
    ent.addComponent("ColideTriggerComponent", {"actions" : ["DisableActionComponent"]})
    ent.addComponent("KeyboardTriggerComponent", {"actions" : 
    [
        {"key" : "KeyE", "type" : "clicked", "components" : ["SpawnActionComponent"]}
    ]})
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
      "     __",
      "    *|_\\",
      "    _(_'o",
      "o_o/ /\\ V\\_",
      "|=||_|__)  )=)",
      "|_|___LL__/_/",
      "========='='"

    ]})
    objects.addChild(ent)



    Game.start();
}, 2000)
