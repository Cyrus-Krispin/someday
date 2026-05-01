import React from 'react';
import ActionPanel from '../components/ActionPanel';

describe('ActionPanel', () => {
  it('should render without crashing', () => {
    const onGather = jest.fn();
    const onWork = jest.fn();
    const onEndTurn = jest.fn();

    const result = React.createElement(ActionPanel, {
      canGather: true,
      canWork: false,
      onGather,
      onWork,
      onEndTurn,
    });
    expect(result).toBeDefined();
  });

  it('should pass callbacks through props', () => {
    const onGather = jest.fn();
    const onWork = jest.fn();
    const onEndTurn = jest.fn();

    const result = React.createElement(ActionPanel, {
      canGather: true,
      canWork: true,
      onGather,
      onWork,
      onEndTurn,
    });

    (result.props as { onGather: () => void }).onGather();
    (result.props as { onWork: () => void }).onWork();
    (result.props as { onEndTurn: () => void }).onEndTurn();

    expect(onGather).toHaveBeenCalledTimes(1);
    expect(onWork).toHaveBeenCalledTimes(1);
    expect(onEndTurn).toHaveBeenCalledTimes(1);
  });
});
