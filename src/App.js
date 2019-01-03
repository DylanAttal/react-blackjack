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
    axios
      .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => {
        const newState = {
          deck_id: response.data.deck_id
        }

        this.setState(newState, this.whenNewDeckIsShuffled)
      })
  }

  componentDidUpdate = () => {
    if (!this.state.playing) {
      return
    }
    if (this.totalHand('playerHand') > 21 && this.state.playing) {
      this.setState({
        gameResults: 'Player Busted!',
        playing: false
      })
    }
  }

  whenNewDeckIsShuffled = () => {
    // this will happen after state is updated

    // call the API for "Draw a Card"
    // -- draw two cards
    // -- make sure to supply the deck_id
    // -- console log the result to be sure it
    // -- works the way we want
    this.dealCards(2, 'playerHand')

    this.dealCards(2, 'dealerHand')
  }

  dealCards = async (numberOfCards, whichHand) => {
    // Don't allow cards to be dealt in a game that is over
    if (!this.state.playing) {
      return
    }

    // put the axios request to get this number of cards
    // and add to the players hand
    await axios
      .get(
        `https://deckofcardsapi.com/api/deck/${
          this.state.deck_id
        }/draw/?count=${numberOfCards}`
      )
      .then(response => {
        const newState = {
          [whichHand]: update(this.state[whichHand], {
            $push: response.data.cards
          })
        }

        this.setState(newState)
      })
  }

  hit = event => {
    this.dealCards(1, 'playerHand')
  }

  stay = async event => {
    while (this.totalHand('dealerHand') < 17) {
      await this.dealCards(1, 'dealerHand')
    }

    if (this.totalHand('dealerHand') > 21) {
      this.setState({
        playing: false,
        gameResults: 'Player Wins!'
      })

      return
    }

    if (this.totalHand('playerHand') > this.totalHand('dealerHand')) {
      this.setState({
        playing: false,
        gameResults: 'Player Wins!'
      })

      return
    }

    if (this.totalHand('playerHand') < this.totalHand('dealerHand')) {
      this.setState({
        playing: false,
        gameResults: 'Dealer Wins!'
      })

      return
    }

    if (this.totalHand('playerHand') === this.totalHand('dealerHand')) {
      this.setState({
        playing: false,
        gameResults: 'Dealer Wins!'
      })

      return
    }
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
            <button className={`stay ${this.hideButtons}`} onClick={this.stay}>
              Stay
            </button>
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
