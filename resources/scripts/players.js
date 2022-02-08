class Player
{
  name = ""
  money = 0
  steps = 3
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

  reset()
  {
    // Reset timer
    this.resetTimer();

    // Add cards
    if(this.cards.length < 5)
    {
      this.cards = this.cards.concat(TurtleBattle.getCards(5 - this.cards.length))
    }

    // Reset counter
    this.steps = 3
    GUISystem.getWidgetById("steps_label").setText(this.steps)
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
