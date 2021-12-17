/* --- Init game -------------------------------------------------------  */
Game.init("game-block");

/* --- Init systems -------------------------------------------------------  */
Game.addSystems(
{
    "time_system.js"        :   "TimeSystem",
    "tasks_system.js"       :   "TasksSystem",
    "camera_system.js"      :   "CameraSystem",
    "entities_system.js"    :   "EntitiesSystem",
    //"window_system.js"      :   "WindowSystem",
    "input_system.js"       :   "InputSystem",
    "resources_system.js"   :   "ResourcesSystem",
    "textcanvas_system.js"  :   "TextCanvasSystem",
    "gui_system.js"         :   "GUISystem",
    "audio_system.js"       :   "AudioSystem"
})

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

    // Styles
    let button_style = "background-color: black; color: white; border: 2px solid white; width: 70%; margin: auto; margin-top: 10px;"

    // Start menu
    let start_menu = gui.addWidget("main_menu", new Frame())
    start_menu.setPosition(50, 40, "%")
    start_menu.addWidget(new Label("&#10052; Дед Мороз &#10052;", "font-size: 48pt; color: white;"))
    start_menu.addWidget(new Separator("margin: 10px"))
    start_menu.addWidget(new Button("Начать", button_style, () =>
    {
        EntitiesSystem.getNamedEntity("actor").setEnabled(true)
        EntitiesSystem.resetAll()
        //AudioSystem.play("bg_01")
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

    // Fail main
    let fail_menu = gui.addWidget("fail_menu", new Frame())
    fail_menu.hide()
    fail_menu.setPosition(50, 40, "%")
    fail_menu.addWidget(new Label("&#10052; Игра окончена &#10052;", "font-size: 48pt; color: white;"))
    fail_menu.addWidget(new Separator("margin: 10px"))
    fail_menu.addWidget(new Button("Занова", button_style, () =>
    {
        EntitiesSystem.getNamedEntity("actor").setEnabled(true)
        EntitiesSystem.resetAll()
        //AudioSystem.play("bg_01")
        fail_menu.setVisible(false)

    }))
    fail_menu.addWidget(new Button("В меню", button_style, () =>
    {
        fail_menu.setVisible(false)
        start_menu.setVisible(true)
    }))

    // Win main
    let win_menu = gui.addWidget("win_menu", new Frame())
    win_menu.hide()
    win_menu.setPosition(50, 40, "%")
    win_menu.addWidget(new Label("&#10052; Победа &#10052;", "font-size: 48pt; color: white;"))
    win_menu.addWidget(new Separator("margin: 10px"))
    win_menu.addWidget(new Button("Продолжить", button_style, () =>
    {
        EntitiesSystem.getNamedEntity("actor").setEnabled(true)
        EntitiesSystem.resetAll()
        //AudioSystem.play("bg_01")
        win_menu.setVisible(false)

    }))
    win_menu.addWidget(new Button("В меню", button_style, () =>
    {
        win_menu.setVisible(false)
        start_menu.setVisible(true)
    }))

    // ResourcesSystem ----------------------------------------------------------------------------------------- //

    // Audio
    ResourcesSystem.loadAudio("bg_01", "resources/sounds/bg_01.mp3")

    // Prefabs
    let prefab = ResourcesSystem.addPrefab(new Prefab("tree_01"))
    prefab.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : 
    {
        "ResetActionComponent" : {}
    }})

    prefab.addComponent("ResetActionComponent")

    prefab.addComponent("GravityComponent", {"vector" : new Vector2(-40, 0)})
    prefab.addComponent("ASCIISpriteComponent")
    prefab.addComponent("ASCIIColiderComponent")
    prefab.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})

    // ------------------------------------------------------------------------------- //
    prefab = ResourcesSystem.addPrefab(new Prefab("bird_01"))
    prefab.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : 
    {
        "ResetActionComponent" : {}
    }})

    prefab.addComponent("ResetActionComponent")

    prefab.addComponent("GravityComponent", {"vector" : new Vector2(-60, 0)})
    prefab.addComponent("ASCIISpriteComponent")
    prefab.addComponent("ASCIIColiderComponent")
    prefab.addComponent("AnimatedComponent", {"max_timer" : 0.2, "clip" : anim_02})

    // ------------------------------------------------------------------------------- //
    prefab = ResourcesSystem.addPrefab(new Prefab("price_01"))
    prefab.addComponent("DestroyActionComponent")

    prefab.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : 
    {
        "DestroyActionComponent" : {}
    }})

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
    objects.addComponent("GUIActionComponent", {"forms" : ["win_menu"]})
    entities.addEntity(objects)

    let ent = new Entity()
    ent.addComponent("TimerTriggerComponent", {"timer" : 6.0, "actions" : 
    {
        "ResetActionComponent" : {}
    }})

    ent.addComponent("ResetActionComponent")

    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 34)})
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
        "TimerTriggerComponent" : {"timer" : 7.0, "actions" : 
        {
            "ResetActionComponent" : {}
        }}
    }))

    objects.addChild(ResourcesSystem.createEntity("bird_01",
    {
        "TransformComponent" : {"position" : new Vector2(160, 5)},
        "TimerTriggerComponent" : {"timer" : 4.0, "actions" : 
        {
            "ResetActionComponent" : {}
        }}
    }))

    objects.addChild(ResourcesSystem.createEntity("bird_01",
    {
        "TransformComponent" : {"position" : new Vector2(120, 10)},
        "TimerTriggerComponent" : {"timer" : 6.0, "actions" : 
        {
            "ResetActionComponent" : {}
        }}
    }))

    objects.addChild(ResourcesSystem.createEntity("bird_01",
    {
        "TransformComponent" : {"position" : new Vector2(200, 15)},
        "TimerTriggerComponent" : {"timer" : 8.0, "actions" : 
        {
            "ResetActionComponent" : {}
        }}
    }))

    ent = new Entity()
    ent.addComponent("TimerTriggerComponent", {"timer" : 3.0, "actions" : 
    {
        "ResetActionComponent" : {}
    }})
    
    ent.addComponent("ResetActionComponent")

    ent.addComponent("TransformComponent", {"position" : new Vector2(100, 33)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-40, -20)})
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
    ent.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : 
    {
        "ResetActionComponent" : {}
    }})

    ent.addComponent("ResetActionComponent")

    ent.addComponent("TransformComponent", {"position" : new Vector2(140, 29)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-40, 0)})
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


    ent = new Entity("actor")
    ent.setEnabled(false)
    ent.addComponent("DisableActionComponent")
    ent.addComponent("GUIActionComponent")
    ent.addComponent("SpawnActionComponent", {"prefab" : "price_01"})

    ent.addComponent("TimerTriggerComponent", {"timer" : 60.0, "actions" : 
    {
        "GUIActionComponent" : {"show" : ["win_menu"]}, 
        "DisableActionComponent" : {}
    }})
    ent.addComponent("ColideTriggerComponent", {"actions" : 
    {
        "GUIActionComponent" : {"show" : ["fail_menu"]},
        "DisableActionComponent" : {}
    }})
    ent.addComponent("KeyboardTriggerComponent", {"actions" :
    [
        {"key" : "KeyE", "type" : "clicked", "components" : 
        {
            "SpawnActionComponent" : {}
        }}
    ]})

    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 0)})
    ent.addComponent("MovingControllerComponent", {"speed" : 30})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(0, 10)})
    ent.addComponent("ASCIIColiderComponent", {"coliding" : true})
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
