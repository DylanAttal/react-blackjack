import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import Hand from './Hand'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      gameResults: 'Test Your Skills!',
      deck_id: '',
      playerHand: [],
      dealerHand: [],
      playing: true
    }
  }

  componentDidMount = () => {
    this.dealCards(2, 'playerHand')
    this.dealCards(2, 'dealerHand')
  }

  componentDidUpdate = () => {
    if (this.totalHand('playerHand') > 21 && this.state.playing) {
      this.setState({
        gameResults: 'Player Busted!',
        playing: false
      })
    }
  }

  dealCards = (numberOfCards, whichHand) => {
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numberOfCards}`
      )
      .then(response => {
        this.setState(
          {
            deck_id: response.data.deck_id
          },
          () => {
            axios
              .get(
                `https://deckofcardsapi.com/api/deck/${
                  this.state.deck_id
                }/draw/?count=${numberOfCards}`
              )
              .then(response => {
                this.setState({
                  [whichHand]: update(this.state[whichHand], {
                    $push: response.data.cards
                  })
                })
              })
          }
        )
      })
  }

  hit = event => {
    this.dealCards(1, 'playerHand')
  }

  totalHand = whichHand => {
    let total = 0
    this.state[whichHand].forEach(card => {
      const VALUES = {
        ACE: 11,
        KING: 10,
        QUEEN: 10,
        JACK: 10
      }

      total = total + (VALUES[card.value] || parseInt(card.value))
    })
    return total
  }

  get hideButtons() {
    return this.state.playing ? '' : 'hidden'
  }

  render() {
    return (
      <>
        <h1>Blackjack</h1>
        <div className="center">
          <p className="game-results">{this.state.gameResults}</p>
        </div>
        <div className="center">
          <button className="reset hidden">Play Again!</button>
        </div>

        <div className="play-area">
          <div className="left">
            <button className={`hit ${this.hideButtons}`} onClick={this.hit}>
              Hit
            </button>
            <p>Your Cards:</p>
            <p className="player-total">{this.totalHand('playerHand')}</p>
            <div className="player-hand">
              <Hand cards={this.state.playerHand} />
            </div>
          </div>

          <div className="right">
            <button className={`stay ${this.hideButtons}`}>Stay</button>
            <p>Dealer Cards:</p>
            <p className="dealer-total">{this.totalHand('dealerHand')}</p>
            <div className="dealer-hand">
              <Hand cards={this.state.dealerHand} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App
