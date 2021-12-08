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

/* --- Init components -------------------------------------------------------  */
setTimeout(() =>
{
  Game.include("engine/components/transform_components.js")
  Game.include("engine/components/drawable_components.js")
  Game.include("engine/components/controller_components.js")
  Game.include("engine/components/action_components.js")
  Game.include("engine/components/trigger_components.js")
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
            "   \\====/",
            "    \\__/"
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
            "   \\====/",
            "    \\__/"
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
            "   \\====/",
            "    \\__/"
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
            "   \\====/",
            "    \\__/"
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
            "   \\====/",
            "    \\__/"
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

let anim_03 =
[
  {

  }
]


/* --- Start game -------------------------------------------------------  */
setTimeout(() =>
{
    // TextCanvasSystem
    let text_canvas = Game.getSystem("TextCanvasSystem")
    text_canvas.setSize(new Vector2(100, 30))

    // InputSystem
    let input = Game.getSystem("InputSystem")
    input.setEvents(["keydown", "keyup"])

    // EntitiesSystem
    let entities = Game.getSystem("EntitiesSystem")

    // Init entities
    let ent

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 26)})
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
      "___________________________________________________________________________________________________________________________"

    ]})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(120, 14)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 5.0, "timer" : 5.0})
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(180, 14)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 8.0, "timer" : 8.0})
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(160, 5)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 12.0, "timer" : 12.0})
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_02})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(120, 10)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 18.0, "timer" : 18.0})
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_02})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(200, 8)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 15.0, "timer" : 15.0})
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_02})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(100, 24)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, -10)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 3.0, "timer" : 3.0})
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
    " |",
    "/_\\",
    "|_|",
    "/_\\"
    ]})
    entities.addEntity(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(140, 21)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    ent.addComponent("ResetActionComponent", {"max_timer" : 5.0, "timer" : 5.0})
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
    "    __",
    "  _|==|_",
    "   ('')",
    " <(`^^')>",
    " (`^'^'`)",
    "  ------"
    ]})
    entities.addEntity(ent)


/*
    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(1, 1)})
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
      " [><]",
      "[_||_]",
      "|____|"
    ]})
    entities.addEntity(ent)
*/

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 0)})
    ent.addComponent("MovingControllerComponent", {"speed" : 30})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(0, 10)})
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
    entities.addEntity(ent)



    Game.start();
}, 2000)
