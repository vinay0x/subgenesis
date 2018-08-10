import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild(root);

//Google font
let googleFont = document.createElement('Link')
googleFont.href = "https://fonts.googleapis.com/css?family=Roboto+Slab:300"
googleFont.rel = "stylesheet"
document.head.appendChild(googleFont)
// Now we can render our application into it
render( <App />, document.getElementById('root') );
