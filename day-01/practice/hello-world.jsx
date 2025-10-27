// Day 1 Practice: Hello World Component
// Topic: JSX Basics and First Component

import React from 'react';

// Practice 1: Basic JSX Element
function HelloWorld() {
  return <h1>Hello, World!</h1>;
}

// Practice 2: JSX with Variables
function Greeting() {
  const name = 'React Learner';
  return <h1>Hello, {name}!</h1>;
}

// Practice 3: JSX with Multiple Elements (using Fragment)
function Card() {
  return (
    <>
      <h2>Welcome</h2>
      <p>This is a React component</p>
    </>
  );
}

// Practice 4: JSX with Attributes
function ImageCard() {
  const imageUrl = 'https://via.placeholder.com/150';
  const title = 'Sample Image';
  
  return (
    <div className="card">
      <img src={imageUrl} alt={title} />
      <p>{title}</p>
    </div>
  );
}

// Practice 5: JSX with Conditional Rendering
function ConditionalMessage({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}

// Practice 6: Component with Props
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>You are {age} years old</p>
    </div>
  );
}

// Usage example:
// <Welcome name="Alice" age={25} />

export {
  HelloWorld,
  Greeting,
  Card,
  ImageCard,
  ConditionalMessage,
  Welcome
};
