import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, Text, VirtualizedList, TouchableOpacity/* include other react native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

const Item = React.memo(({ symbol, id, company, addToWatchlist, navigation }) => {
  return (
    <View key={id}>
      <TouchableOpacity style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#565656' }} onPress={() => {
          addToWatchlist(symbol);
          console.log("Added");
          
          navigation.navigate({name: 'Stocks'});

          console.log("Navigated",navigation);
          
        }
       }>
        <Text style={styles.title}>{symbol}</Text>
        <Text style={styles.para}>{company}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]); { /* FixMe: initial state here */ }

  // can put more code here
  const [value, onChangeText] = useState('');
  const [filtered, setFiltered] = useState([]);
  let idCounter = 0;

  const searchSymbol = (txt) => {
    var output = state.filter(function(item) {
      return (item.symbol).includes(txt.nativeEvent.text);
    });
    setFiltered(output);
  }

  const getItem = (data, index) => {
    idCounter++;
    return {
      id: 'opt'+idCounter.toString(),
      symbol: `${data[index].symbol}`,
      company: `${data[index].name}`,
    }
  }

  const getItemCount = (data) => {
    return filtered.length;
  }

  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    fetch(ServerURL+'/all')
      .then(response => response.json())
      .then(resData => {
        setState(resData);
        setFiltered(resData);
      });
    return;
  }, []);

  // useEffect(()=>{
    
  // }, [state]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* FixMe: add children here! */}
        <Text style={{ color: 'white' }}>Type a company name or stock symbol:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', borderRadius: 25, paddingLeft: 10 }}
          onChangeText={text => onChangeText(text)}
          onChange={(txt) => { searchSymbol(txt) }}
          value={value}
          placeholder="Enter stock name"
        />
        <VirtualizedList
          data={filtered}
          renderItem={({ item }) => <Item symbol={item.symbol} id={item.id} company={item.company} key={item.id} addToWatchlist={addToWatchlist} navigation={navigation} />}
          keyExtractor={item => item.id}
          getItemCount={getItemCount}
          getItem={getItem}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 15,
    color: 'white',
  },
  para: {
    fontSize: 10,
    color: 'white',
  }
});