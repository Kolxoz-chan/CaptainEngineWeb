class TurtleBattle
{
  static deck = []
  static cards = []
  static players = []
  static current_player = 0;

  static init()
  {
    try
    {
      TurtleBattle.initCards()

      // Players
      TurtleBattle.addPlayer(new Player("Игрок", 10, TurtleBattle.getCards(5)))
      TurtleBattle.addPlayer(new BotPlayer("Вредина", 10, TurtleBattle.getCards(5)))
      TurtleBattle.addPlayer(new BotPlayer("Мелисса", 10, TurtleBattle.getCards(5)))
      TurtleBattle.addPlayer(new BotPlayer("Шуллер", 10, TurtleBattle.getCards(5)))

      let player = TurtleBattle.getCurrentPlayer()
      TurtleBattle.showMessage("Ходит " + player.name)

      TurtleBattle.createCards()
      TurtleBattle.updateDeck()
    }
    catch(err)
    {
      alert(err)
    }
  }

  static initCards()
  {
    let cards = ResourcesSystem.configs["cards"]
    for(let name in cards)
    {
      let card = cards[name]
      let priority = card.priority ? card.priority : 1
      TurtleBattle.cards.push([name, priority])
    }
  }

  static getCards(count)
  {
    let arr = []
    for(let i=0; i<count; i++)
    {
      let cards = TurtleBattle.cards;
      let card = MathSystem.random_choice_priority(cards)
      arr.push(card)
    }

    return arr;
  }

  static update()
  {
    let player = TurtleBattle.getCurrentPlayer()
    if(player)
    {
      if(player.updateTimer())
      {
        player.update()
        let timer = Math.round(player.getTimer())
        GUISystem.getWidgetById("timer_label").setText(timer)
      }
      else
      {
        player = TurtleBattle.nextPlayer()
      }
    }
  }

  static updateDeck()
  {
    let player = TurtleBattle.players[0]
    let cards = ResourcesSystem.configs["cards"]

    for(let i in TurtleBattle.deck)
    {
      let name = player.cards[i]
      if(name)
      {
        let card = cards[name]
        TurtleBattle.deck[i].widget.setVisible(true)
        TurtleBattle.deck[i].label.setText(card.name)
        TurtleBattle.deck[i].picture.setImage(card.icon)
      }
      else
      {
        TurtleBattle.deck[i].widget.setVisible(false)
      }
    }
    
  }

  static showMessage(msg)
  {
    GUISystem.getWidget("hud_message").setText(msg)
  }

  static getCurrentPlayer()
  {
    return TurtleBattle.players[TurtleBattle.current_player]
  }

  static nextPlayer()
  {
    let player = TurtleBattle.getCurrentPlayer()
    player.reset()

    TurtleBattle.current_player++
    if(TurtleBattle.current_player >= TurtleBattle.players.length)
    {
      TurtleBattle.current_player = 0
    }

    player = TurtleBattle.getCurrentPlayer()
    TurtleBattle.showMessage("Ходит " + player.name)
    TurtleBattle.updateDeck()

    let cards_deck = GUISystem.getWidget("cards_deck")
    if(player.constructor.name != "Player")
    {
      cards_deck.setStyle("pointerEvents", "none")
    }
    else
    {
      cards_deck.setStyle("pointerEvents", "auto")
    }

    return player
  }

  static addPlayer(player)
  {
    TurtleBattle.players.push(player)
  }

  static createCards()
  {
    let cards = ResourcesSystem.configs["cards"]
    let cards_deck = GUISystem.getWidget("cards_deck")

    for(let i=0; i<5; i++)
    {/*
      let name = MathSystem.random_choice_priority(TurtleBattle.cards);
      let card = cards[name]
      */

      TurtleBattle.deck[i] = {}

      // Widget
      let card_frame = cards_deck.addWidget(new Frame())
      TurtleBattle.deck[i].widget = card_frame;
      card_frame.setVisible(false)
      card_frame.setClass("card")
      card_frame.addEvent("onclick", 
      [
        {"SelectCardAction" : {"index" : i}}
      ])

      let frame = card_frame.addWidget(new Frame())
      frame.setClass("card_frame")
      frame.setSize("80%", "85%")
      TurtleBattle.deck[i].label = frame.addWidget(new Label())
      TurtleBattle.deck[i].picture = frame.addWidget(new Picture())
      TurtleBattle.deck[i].picture.setPosition("50%", "50%")
    }
  }
}
