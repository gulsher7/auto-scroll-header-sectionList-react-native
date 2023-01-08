//import liraries
import { useEffect, useState, useCallback, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SectionList from 'react-native-tabs-section-list';
import sectionListGetitemLayout from 'react-native-section-list-get-item-layout';
import Modal from 'react-native-modal'

const App = () => {

  const listRef = useRef()
  const [products, setProducts] = useState([])
  const [showMenuItem, setShowMenuItem] = useState(false)


  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=40')
      .then(res => res.json())
      .then(res => {
        let filterArry = res.products.map((val, i) => {
          return {
            title: val?.title,
            data: val?.images,
            id: val?.id
          }
        })
        console.log("filterArry+++++", filterArry)
        setProducts(filterArry)
      });
  }, [])


  const onPressTitle = useCallback((index) => {
    console.log("listReflistRef", listRef)
    if (!!listRef?.current) {
      listRef.current.sectionList.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true
      })
    }
  }, [products])


  const renderSectionTab = useCallback((props) => {

    console.log("render section tab", props)
    return (
      <TouchableOpacity
        style={{ marginLeft: 12, marginBottom: 16 }}
        onPress={() => onPressTitle(props.index)}
      >
        <Text style={{
          fontWeight: 'bold',
          color: props.isActive ? 'red' : 'black'
        }}>{props.title}</Text>
      </TouchableOpacity>
    )
  }, [products])

  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={styles.itemStyle}>
        <Text style={{ fontWeight: 'bold', color: 'black' }}>{index + 1}</Text>
      </View>
    )
  }, [products])


  const itemSeparatorComponent = useCallback(() => {
    return (
      <View style={{ height: 8 }} />
    )
  }, [products])

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return (
      <View style={{ height: 30 }}>
        <Text>{title}</Text>
      </View>
    )
  }, [products])

  const getItemLayout = sectionListGetitemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => 100,
    getSectionHeaderHeight: () => 30,
    getSeparatorHeight: () => 8,
    getSectionFooterHeight: () => 40
  })

  const onPressMenuItem = useCallback((index) => {
    onPressTitle(index)
    setShowMenuItem(false)
  }, [products])

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <SectionList
          stickySectionHeadersEnabled={false}
          ref={listRef}
          sections={products}
          extraData={products}
          renderTab={renderSectionTab}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={itemSeparatorComponent}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={() => <View style={{ height: 40 }} />}
          getItemLayout={getItemLayout}
        />
      </SafeAreaView>

      <Modal
      onBackdropPress={()=>setShowMenuItem(false)}
        isVisible={showMenuItem}
        style={{
          margin: 0,
          justifyContent: 'flex-end'
        }}
      >
        <View style={styles.modalStyle}>
          <ScrollView>
            {products.map((val, i) => {
              return (
                <TouchableOpacity
                  onPress={() => onPressMenuItem(i)}
                  activeOpacity={0.7}
                  style={{
                    marginBottom: 8
                  }}
                >
                  <Text style={styles.descStyle}>{val?.title}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </Modal>

      <TouchableOpacity
      activeOpacity={0.7}
      onPress={()=>setShowMenuItem(true)}
      style={styles.btnStyle}
      >
          <Text style={styles.menuStyle}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  itemStyle: {
    height: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: "center"
  },
  modalStyle: {
    height: 300,
    width: 240,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    bottom: 20
  },
  descStyle: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right'
  },
  menuStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  btnStyle: {
    position:'absolute',
    bottom: 20, 
    right: 20,
    backgroundColor:'black',
    paddingHorizontal: 20,
    paddingVertical: 10, 
    borderRadius: 8
  }
});

//make this component available to the app
export default App;
