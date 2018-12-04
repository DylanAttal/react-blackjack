import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import Hand from './Hand'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deck_id: '',
      playerHand: [],
      dealerHand: []
    }
  }

  componentDidMount = () => {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
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
                }/draw/?count=2`
              )
              .then(response => {
                this.setState({
                  playerHand: update(this.state.playerHand, {
                    $push: response.data.cards
                  })
                })
                console.log(this.state.playerHand)
              })
          }
        )
      })
    axios
      .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
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
                }/draw/?count=2`
              )
              .then(response => {
                this.setState({
                  dealerHand: update(this.state.dealerHand, {
                    $push: response.data.cards
                  })
                })
                console.log(this.state.dealerHand)
              })
          }
        )
      })
  }

  hit = event => {
    console.log('hit!')
  }

  render() {
    return (
      <>
        <h1>Blackjack</h1>
        <div className="center">
          <p className="game-results">Test Your Skills!</p>
        </div>
        <div className="center">
          <button className="reset hidden">Play Again!</button>
        </div>

        <div className="play-area">
          <div className="left">
            <button className="hit" onClick={this.hit}>
              Hit
            </button>
            <p>Your Cards:</p>
            <p className="player-total">Total 0</p>
            <div className="player-hand">
              <Hand cards={this.state.playerHand} />
            </div>
          </div>

          <div className="right">
            <button className="stay">Stay</button>
            <p>Dealer Cards:</p>
            <p className="dealer-total">Facedown</p>
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
