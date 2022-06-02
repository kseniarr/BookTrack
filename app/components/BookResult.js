import { StyleSheet, FlatList, View } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import BookTile from './BookTile'

const BookResult = ({text, data }) => {
  return (
    <>
    <View style={{marginBottom: 3}}><CustomText text={text} weight="bold" size={16}></CustomText></View>
            <FlatList 
                contentContainerStyle={{ paddingBottom: 30 }}
                numColumns={2} 
                width={"100%"} 
                style={styles.flatList} 
                data={data} 
                renderItem={( element ) => {
                    return (<BookTile 
                        style={styles.bookView}
                        key={ element.item.element } 
                        isbn13={ element.item.element }>
                    </BookTile>)}
                }
            ></FlatList>
    </>
  )
}

export default BookResult

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
    },
})