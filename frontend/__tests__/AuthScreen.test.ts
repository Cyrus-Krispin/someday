import React from 'react';
import AuthScreen from '../screens/AuthScreen';

describe('AuthScreen', () => {
  it('should export a component', () => {
    expect(AuthScreen).toBeDefined();
    expect(typeof AuthScreen).toBe('function');
  });

  it('should create element with onAuthSuccess prop', () => {
    const element = React.createElement(AuthScreen, {
      onAuthSuccess: jest.fn(),
    });
    expect(element).toBeDefined();
    expect(element.type).toBe(AuthScreen);
  });
});
