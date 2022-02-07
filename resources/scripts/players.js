class Player
{
  name = ""
  money = 0
  steps = 0
  timer = 0
  power = 1
  max_timer = 0
  cards = []

  constructor(name, timer, cards=[])
  {
    this.name = name;
    this.timer = timer
    this.max_timer = timer
    this.cards = cards;
  }

  resetTimer()
  {
    this.timer = this.max_timer
  }

  getTimer()
  {
    return this.timer
  }

  updateTimer()
  {
    this.timer -= TimeSystem.getDeltaTime();
    return this.timer > 0
  }

  update()
  {

  }
}

class BotPlayer extends Player
{
  update()
  {

  }
}
