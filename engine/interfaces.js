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
    return EntitiesSystem.getNamedEntity(target)
  }

  this.setTarget = function(value)
  {
    this.setProperty("target", value)
  }
}

/* ----------------- TargetElement ---------------------- */
function IPrefab()
{
  this.prefab = ""

  this.getPrefab = function()
  {
    let prefab = this.getProperty("prefab")
    return ResourcesSystem.getPrefab(prefab)
  }

  this.setPrefab = function(value)
  {
    this.setProperty("prefab", value)
  }
}

/* ----------------- TargetElement ---------------------- */
function ITimer()
{
  this.time = 0.0
  this.timer = 0.0

  this.getTimer = function()
  {
    return this.getProperty("timer")
  }

  this.setTimer = function(value)
  {
    this.setProperty("timer", value)
  }

  this.setTime = function(value)
  {
    this.setProperty("time", value)
  }

  this.getTime = function()
  {
    return this.getProperty("time")
  }

  this.resetTimer = function()
  {
    this.setTime(0)
  }

  this.updateTimer = function()
  {
    this.setTime(this.getTime() + TimeSystem.getDeltaTime())
    if(this.getTime() >= this.getTimer())
    {
      this.resetTimer()
      return false
    }

    return true
  }
}
