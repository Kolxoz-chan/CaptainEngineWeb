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
    text_canvas.setSize(new Vector2(100, 30))

    // InputSystem
    let input = Game.getSystem("InputSystem")
    input.setEvents(["keydown", "keyup"])

    // EntitiesSystem
    let entities = Game.getSystem("EntitiesSystem")

    // ResourcesSystem
  /*  let prefab = ResourcesSystem.addPrefab(new Prefab())
    prefab.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    prefab.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : ["ResetActionComponent"]})
    prefab.addComponent("ResetActionComponent")
    prefab.addComponent("ASCIISpriteComponent")
    prefab.addComponent("ASCIIColiderComponent")
    prefab.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})
    */

    // Init entities
    let objects = new Entity("objects")
    entities.addEntity(objects)

    let ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 26)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 6.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
      "___________________________________________________________________________________________________________________________"
    ]})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(120, 14)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(180, 14)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-30, 0)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 8.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("AnimatedComponent", {"timer" : 0.2, "max_timer" : 0.2, "clip" : anim_01})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(160, 5)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 5.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("AnimatedComponent", {"max_timer" : 0.2, "clip" : anim_02})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(120, 10)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 7.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("AnimatedComponent", {"max_timer" : 0.2, "clip" : anim_02})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(200, 15)})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(-50, 0)})
    ent.addComponent("TimerTriggerComponent", {"timer" : 6.0, "actions" : ["ResetActionComponent"]})
    ent.addComponent("ResetActionComponent")
    ent.addComponent("ASCIISpriteComponent")
    ent.addComponent("ASCIIColiderComponent")
    ent.addComponent("AnimatedComponent", {"max_timer" : 0.2, "clip" : anim_02})
    objects.addChild(ent)

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(100, 24)})
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
    ent.addComponent("TransformComponent", {"position" : new Vector2(140, 21)})
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


/*
    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(1, 1)})
    ent.addComponent("ASCIISpriteComponent", {"sprite" :
    [
      " [><]",
      "[_||_]",
      "|____|"
    ]})
    entities.addChild(ent)
*/

    ent = new Entity()
    ent.addComponent("TransformComponent", {"position" : new Vector2(0, 0)})
    ent.addComponent("MovingControllerComponent", {"speed" : 30})
    ent.addComponent("GravityComponent", {"vector" : new Vector2(0, 10)})
    ent.addComponent("ASCIIColiderComponent", {"coliding" : true})
    ent.addComponent("DestroyActionComponent")
    ent.addComponent("ColideTriggerComponent", {"actions" : ["DestroyActionComponent"]})
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
