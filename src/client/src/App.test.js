import renderer from 'react-test-renderer';
import React from 'react';
import App from './App';

test('renders learn react link', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
