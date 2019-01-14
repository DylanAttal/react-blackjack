# React-Blackjack

<p align="center">
<img src="src/react-blackjack.gif">
</p>

### See it live

https://react-blackjack-dylanattal.surge.sh/

### Summary

This project was a rework of my [vanilla JavaScript blackjack app](http://blackjack-dylanattal.surge.sh). I used React this time to split the app into components and update elements on the DOM. I used the Axios library to generate a deck of cards from the API https://deckofcardsapi.com/ and deal cards to the player and the dealer.

One high point of the project was using a lookup table in the `totalHand` function to determine the player and dealer totals by adding up the value of all their cards. I accessed either the player's or dealer's hand dynamically by naming the argument for the `totalHand` function `whichHand` then utilizing bracket notation to reach the `playerHand` or `dealerHand` through the state like this: `this.state[whichHand]`. I then iterated through each card using `forEach()`, and I replaced the Ace, King, Queen, and Jack values with integers and totaled all the values.

Another point of pride was generating the card images dynamically. I passed down the `playerHand` or `dealerHand` from state to the `Hand` component. I then accessed the cards from the `Hand` component's props and `map`ped over each card, displaying its image from the API.

### Project Goals

- [x] Create an app where the user can play hands of blackjack
- [x] Generate a deck of cards and handle dealing cards by manipulating data from https://deckofcardsapi.com/
- [x] Create functions to handle dealing cards, hitting, and staying
- [x] Create logic to determine the winner of each hand
- [x] Manipulate DOM elements to display the player's hand, the dealer's hand, and the results of the game
- [x] Make a "Reset Game" button

### Technologies Used

HTML, CSS, Javascript, React, Axios
