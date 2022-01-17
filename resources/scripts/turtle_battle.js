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
      let src = ResourcesSystem.textures[card.icon]
      if(src) src = src.src

      // Widget
      let card_frame = new Frame()
      card_frame.setClass("card")
      card_frame.widget.onclick = function()
      {
        card_frame.destroy()
        card.action()
      }
      arr.push(card_frame)

      let frame = card_frame.addWidget(new Frame())
      frame.setClass("card_frame")
      frame.setSize("80%", "85%")
      
      frame.addWidget(new Label(card.name))
      frame.addWidget(new Picture(src)).setPosition("50%", "50%")
    }

    return arr
  }
}
