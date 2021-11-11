/* --- Init game -------------------------------------------------------  */
Game.init("game-block");
Game.settings.style = "margin: auto; display: block;"
Game.resetSettings()
Game.setEventHandlers(['keydown', 'keyup'])
Game.setSize(new Vector2(1280, 720))

let player = new Entity("player")
player.addComponent("TransformComponent", {"position" : new Vector2(100, 100), "size" : new Vector2(64, 64)})
player.addComponent("CircleShapeComponent", {})
player.addComponent("BrownianMovingComponent", {})
Game.addEntity(player)

Game.start();
