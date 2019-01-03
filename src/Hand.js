import React, { Component } from 'react'

class Hand extends Component {
  render() {
    return (
      <>
        {this.props.cards.map((card, index) => {
          return <img src={`${card.image}`} key={index} alt="card" />
        })}
      </>
    )
  }
}

export default Hand
