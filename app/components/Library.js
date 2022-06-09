import { StyleSheet, View } from 'react-native'
import CustomButton from './CustomButton'
import colors from '../config/colors'
import React, { useState } from 'react'
import CustomText from './CustomText'
import BookTile from './BookTile'

const Library = ({ books }) => {
    const [currShelf, setCurrShelf] = useState(0); // 0 - read (default), 1 - to read, 2 - dnf

    const chooseShelf = (id) => {
        if (currShelf != id) {
            setCurrShelf(id);
        } else {
            setCurrShelf(null);
        }
    }

    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ marginHorizontal: 5 }}>
                    <CustomButton text={`read (${books.read.length})`}
                        backgroundColor={currShelf == 0 ? colors.primaryColor : colors.white}
                        border={true} size={16}
                        onPress={() => { chooseShelf(0) }} />
                </View>
                <View style={{ marginHorizontal: 5 }}>
                    <CustomButton text={`to read (${books.toRead.length})`}
                        backgroundColor={currShelf == 1 ? colors.primaryColor : colors.white}
                        border={true} size={16}
                        onPress={() => { chooseShelf(1) }} />
                </View>
                <View style={{ marginHorizontal: 5 }}>
                    <CustomButton text={`dnf (${books.dnf.length})`}
                        backgroundColor={currShelf == 2 ? colors.primaryColor : colors.white}
                        border={true} size={16}
                        onPress={() => { chooseShelf(2) }} />
                </View>
            </View>
            <View>
                {(currShelf == 0 && books.read.length == 0 || currShelf == 1 && books.toRead.length == 0 ||
                    currShelf == 2 && books.dnf.length == 0) && <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}><CustomText text="no books to show" align={"center"} /></View>}
                <View style={{width: "100%"}}>
                {currShelf == 0 && books.read.length > 0 && books.read.map((element) => {
                    return <BookTile style={{width: "100%"}} key={element.id} id={element.id} userRating={element.rating} profile={true} />
                })}
                {currShelf == 1 && books.toRead.length > 0 && books.toRead.map((element) => {
                    return <BookTile style={{width: "100%"}} key={element.id} id={element.id} userRating={element.rating} profile={true} />
                })}
                {currShelf == 2 && books.dnf.length > 0 && books.dnf.map((element) => {
                    return <BookTile style={{width: "100%"}} key={element.id} id={element.id} userRating={element.rating} profile={true} />
                })}
                </View>
            </View>
        </>
    )
}

export default Library

const styles = StyleSheet.create({})