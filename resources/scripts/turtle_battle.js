class TurtleBattle
{
  static cards_deck = []

  static init()
  {
    TurtleBattle.cards_deck = [AheadCard, TurnCard, UTurnCard, JumpCard, ResetCard, DoublingCard]
    TurtleBattle.addCards(5)
  }

  static addCards(count)
  {
    let cards_deck = GUISystem.getWidget("cards_deck")
    for(let i=0; i<count; i++)
    {
      let card = MathSystem.random_choice(TurtleBattle.cards_deck);

      // Widget
      let card_frame = cards_deck.addWidget(new Frame())
      card_frame.setClass("card")
      card_frame.widget.onclick = function()
      {
        card_frame.destroy()
        card.action()
      }

      let frame = card_frame.addWidget(new Frame())
      frame.setClass("card_frame")
      frame.setSize("80%", "85%")
      
      frame.addWidget(new Label(card.name))
      frame.addWidget(new Picture(card.icon)).setPosition("50%", "50%")
    }
  }
}
