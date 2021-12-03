/* --- Init game -------------------------------------------------------  */
Game.init("game-block");

/* --- Init systems -------------------------------------------------------  */
Game.addSystem("time_system.js",  		"TimeSystem")
Game.addSystem("tasks_system.js", 		"TasksSystem")
Game.addSystem("camera_system.js", 		"CameraSystem")
Game.addSystem("entities_system.js", 	"EntitiesSystem")
Game.addSystem("window_system.js", 		"WindowSystem")
Game.addSystem("input_system.js", 		"InputSystem")
Game.addSystem("resources_system.js", 	"ResourcesSystem")
Game.addSystem("textcanvas_system.js", 	"TextCanvasSystem")


/* --- Start game -------------------------------------------------------  */
Game.start();
