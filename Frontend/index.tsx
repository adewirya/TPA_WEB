import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import React, {createContext} from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const client = new ApolloClient({
  cache: new InMemoryCache,
  uri: "http://localhost:8080/query"
})

window.addEventListener("load", () => {
  navigator.serviceWorker
    .register("./serviceWorker.js")
    .then(res => console.log("service worker registered"))
    .catch(err => console.log("service worker not registered", err));
});


ReactDOM.render(
  <ApolloProvider client={client}>
      < App/>
  </ApolloProvider> ,
  document.getElementById('root')
)