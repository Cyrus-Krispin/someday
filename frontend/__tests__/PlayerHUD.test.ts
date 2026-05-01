import React from 'react';
import PlayerHUD from '../components/PlayerHUD';

describe('PlayerHUD', () => {
  it('should render without crashing', () => {
    const result = React.createElement(PlayerHUD, {
      tokens: 20,
      movementRemaining: 6,
      actionsRemaining: 2,
      currentDay: 1,
    });
    expect(result).toBeDefined();
    expect(result.type).toBe(PlayerHUD);
  });

  it('should accept minimal props', () => {
    const result = React.createElement(PlayerHUD, {
      tokens: 0,
      movementRemaining: 0,
      actionsRemaining: 0,
      currentDay: 30,
    });
    expect(result.props.tokens).toBe(0);
    expect(result.props.currentDay).toBe(30);
  });
});
