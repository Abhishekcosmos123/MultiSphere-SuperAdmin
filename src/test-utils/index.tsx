// import React from 'react';
// import { render as rtlRender } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk'; // Explicitly import ThunkMiddleware
// import { AnyAction } from '@reduxjs/toolkit';

// // Properly type middlewares to match redux-mock-store expectations
// const middlewares = [thunk]; // No need for explicit type here, redux-mock-store handles it
// const mockStore = configureMockStore(middlewares);

// function render(
//   ui: React.ReactElement,
//   {
//     preloadedState = {}, // Type it to an empty object, but more specific if needed
//     store = mockStore(preloadedState as Record<string, any>), // Using Record<string, any> instead of {}
//     ...renderOptions
//   } = {}
// ) {
//   // Wrapper component to provide the store to the component under test
//   function Wrapper({ children }: { children: React.ReactNode }) {
//     return <Provider store={store}>{children}</Provider>;
//   }

//   // Render the UI with store and any additional render options
//   return {
//     store,
//     ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
//   };
// }

// // Re-export everything from @testing-library/react
// export * from '@testing-library/react';

// // Override render method to make it reusable with custom store setup
// export { render };
