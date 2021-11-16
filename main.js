/* --- Init game -------------------------------------------------------  */
Game.init("game-block");
Game.settings.style = "margin: auto; display: block;"
Game.resetSettings()
Game.setEventHandlers(['keydown', 'keyup'])
Game.setSize(new Vector2(1280, 720))

let obj = new Entity()
obj.addComponent("TransformComponent", {"position" : new Vector2(200, 300), "size" : new Vector2(32, 32)})
obj.addComponent("CircleShapeComponent", {"fill_color" : Color.random()})
obj.addComponent("PursuerComponent", {"max_radius" : 500, "middle_radius" : 150, "min_radius" : 100, "target" : "player"})
obj.addComponent("RoundMovingComponent", {"target" : "player"})
Game.addEntity(obj)

let player = new Entity("player")
player.addComponent("TransformComponent", {"position" : new Vector2(100, 100), "size" : new Vector2(64, 64)})
player.addComponent("CircleShapeComponent", {"fill_color" : Color.random()})
player.addComponent("MovingControllerComponent", {"speed" : 100 })
Game.addEntity(player)

Game.start();
