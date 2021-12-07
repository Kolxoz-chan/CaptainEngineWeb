/* ----------------- SpeedElement ---------------------- */
function ISpeed()
{
  this.speed = 60

  this.getSpeed = function()
  {
    return this.getProperty("speed")
  }

  this.setSpeed = function(value)
  {
    this.setProperty("speed", value)
  }
}

/* ----------------- TargetElement ---------------------- */
function ITarget()
{
  this.target = ""

  this.getTarget = function()
  {
    let target = this.getProperty("target")
    return Game.getObject(target)
  }

  this.setTarget = function(value)
  {
    this.setProperty("target", value)
  }
}

/* ----------------- TargetElement ---------------------- */
function ITimer()
{
  this.max_timer = 0.0
  this.timer = 0.0

  this.getTimer = function()
  {
    return this.getProperty("timer")
  }

  this.setTimer = function(value)
  {
    this.setProperty("timer", value)
  }

  this.setMaxTimer = function(value)
  {
    this.setProperty("max_timer", value)
  }

  this.getMaxTimer = function()
  {
    return this.getProperty("max_timer")
  }

  this.resetTimer = function()
  {
    let waiting = this.getMaxTimer()
    this.setTimer(waiting)
  }

  this.updateTimer = function()
  {
    this.setTimer(this.getTimer() - TimeSystem.getDeltaTime())
    if(this.getTimer() <= 0)
    {
      this.resetTimer()
      return false
    }

    return true
  }
}

/* ----------------- TargetElement ---------------------- */
function IPrefab()
{
  this.prefab = ""

  this.getPrefab = function()
  {
    let prefab = this.getProperty("prefab")
    return Resources.getPrefab(prefab)
  }

  this.setPrefab = function(value)
  {
    this.setProperty("prefab", value)
  }
}
