import React, { useState, useEffect } from 'react';
import { StyleSheet, View, VirtualizedList, TouchableOpacity, Text, /* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

const Item = React.memo(({ obj, selectedOrg }) => {
  return (
    <View key={obj.id}>
      <TouchableOpacity style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#565656', display: 'flex', flexDirection: 'row' }} onPress={() => {
        selectedOrg(obj)
      }}>
        <Text style={{ color: 'white', flex: 2 }}>{obj.symbol}</Text>
        <Text style={{ color: 'white', flex: 2, textAlign: 'right' }}>{obj.close}</Text>
        <Text style={{ flex: 1 }}></Text>
        <TouchableOpacity style={(obj.diff >= 0) ? styles.buttonUp : styles.buttonDown} >
          <Text style={{ color: 'white', textAlign: 'right' }}>{obj.diff}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
});

const Seperator = (() => {
  return (
    <View
      style={{
        borderBottomColor: '#969696',
        borderBottomWidth: 1,
      }}
    />
  );
});

const DetailRow = (({ key1, val1, key2, val2 }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{key1}</Text>
      <Text style={styles.rowDetail}>{val1}</Text>
      <Text style={styles.rowTitle}>{key2}</Text>
      <Text style={styles.rowDetail}>{val2}</Text>
    </View>
  );
});

const Description = (({ org }) => {
  console.log("GETTINNG ORG", org);

  return (
    <View>
      {org.name !== undefined ?
        <View>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, padding: 20, backgroundColor: '#2d2d2d' }}>{org.name}</Text>
          <Seperator />
          <DetailRow key1={"OPEN"} val1={org.open} key2={"LOW"} val2={org.low} />
          <Seperator />
          <DetailRow key1={"CLOSE"} val1={org.close} key2={"HIGH"} val2={org.high} />
          <Seperator />
          <DetailRow key1={"VOLUME"} val1={org.volume} key2={""} val2={""} />
          <Seperator />
        </View>
        : null}
    </View>
  );
});

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]); { /* FixMe: initial state here */ }
  const [map, setMap] = useState(new Map());
  const [selectedOrg, setSelectedOrg] = useState({});
  let idCounter = 0;

  // can put more code here

  const getItem = (data, index) => {
    idCounter++;
    var dataObj = map.get(data[index]);
    return {
      id: 'opt' + idCounter.toString(),
      name: `${dataObj.name}`,
      symbol: `${dataObj.symbol}`,
      close: `${dataObj.close}`,
      open: `${dataObj.open}`,
      low: `${dataObj.low}`,
      high: `${dataObj.high}`,
      volume: `${dataObj.volumes}`,
      diff: `${(dataObj.close - dataObj.open).toFixed(2)}`,
    }
  }

  const getItemCount = (data) => {
    return (state === null) ? 0 : state.length;
  }

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
    var tempMap = map;
    if (watchList !== null) {
      watchList.forEach(listItem => {
        if (!tempMap.has(listItem)) {
          console.log("LOST ITEM : ", listItem);
          tempMap.set(listItem, { timestamp: 'none', symbol: listItem, name: 'none', industry: 'none', open: 0.0, high: 0.0, low: 0.0, close: 0.0, volumes: 0 });
          fetch(ServerURL+'/history?symbol=' + listItem)
            .then(response => response.json())
            .then(resData => {
              console.log("DATA", listItem, resData[0]);
              if (resData[0] !== undefined) {
                tempMap.set(listItem, resData[0]);
              }
              setMap(tempMap);
              setState(watchList);
            });
        }
      });
    }
  }, [watchList]);

  return (
    <View style={styles.container}>
      {/* FixMe: add children here! */}
      <View style={styles.top}>
      <VirtualizedList
        data={state}
        renderItem={({ item }) => <Item obj={item} selectedOrg={setSelectedOrg} />}
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
      />
      </View>
      <View style={styles.bottom}>
        <Description org={selectedOrg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  buttonUp: {
    flex: 2,
    backgroundColor: 'green',
    height: '100%',
    padding: 6,
    width: '50%',
    borderRadius: 5
  },
  buttonDown: {
    flex: 2,
    backgroundColor: 'red',
    height: '100%',
    padding: 6,
    width: '50%',
    borderRadius: 5
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  top: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    paddingBottom: 5,
    paddingTop: 5,
  },
  rowTitle: {
    flex: 1,
    color: '#969696',
  },
  rowDetail: {
    flex: 1,
    color: 'white',
    textAlign: 'right',
    paddingRight: 5,
  },
});