import React, { useState, useContext, useEffect } from "react";
import { 
  AsyncStorage,
  ToastAndroid,
  Platform,
  AlertIOS,
 } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here

  async function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    var symbolsArray = await AsyncStorage.getItem('watchlist');
    
    (symbolsArray === undefined || symbolsArray === null)?symbolsArray = []:symbolsArray = (JSON.parse(symbolsArray));
    if(!(symbolsArray).includes(newSymbol)){
      symbolsArray.push(newSymbol);
      await AsyncStorage.setItem('watchlist',JSON.stringify(symbolsArray));
    }
    setState(symbolsArray);
    
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    AsyncStorage.getItem('watchlist')
      .then(response => JSON.parse(response))
      .then(symbolList => {
        setState(symbolList);
      });
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
