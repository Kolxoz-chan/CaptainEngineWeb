class TurtleBattle
{
  static cards_deck = []

  static init()
  {
    TurtleBattle.cards_deck = [AheadCard, TurnCard, UTurnCard, JumpCard, ResetCard, DoublingCard]
  }

  static getCards(count)
  {
    let arr = []
    for(let i=0; i<count; i++)
    {
      let card = MathSystem.random_choice(TurtleBattle.cards_deck);

      // Widget
      let frame = new Frame()
      frame.setClass("card")
      frame.addWidget(new Label(card.name))
      frame.addWidget(new Picture(card.icon))

      arr.push(frame)
    }

    return arr
  }
}
