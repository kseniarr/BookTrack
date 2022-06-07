import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from './CustomText';
import RemoteImage from './RemoteImage';
import { useNavigation } from '@react-navigation/core';
import AddToLibrary from './AddToLibrary';
import consts from '../config/consts';

const BookTile = ({ id }) => {
    const [coverURL, setCoverURL] = useState();
    const [bookTitle, setBookTitle] = useState();
    const [bookAuthors, setBookAuthors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rating, setRating] = useState(4.5);

    const navigation = useNavigation();
    let type = "id";

    useEffect(() => {
        const getBookAuthors = (authors) => {
            if(authors.length > 1) {
                let authorsStr = "";
                for(let i = 0; i < authors.length; i++) {
                    if(i == authors.length - 1) {
                        authorsStr += authors[i];
                    } else {
                        authorsStr += authors[i] + ", ";
                    }
                }
                setBookAuthors(authorsStr);
            } else {
                setBookAuthors(authors[0]);
            }
        }

        const func = async () => {
            let response = await fetch(`${consts.baseUrl}books/v1/volumes/${id}`, {method: "GET"});
            let json = await response.json(); 

            if(json.volumeInfo == undefined) {
                response = await fetch(`${consts.baseUrl}books/v1/volumes?q=isbn:${id}`, {method: "GET"});
                json = await response.json();
                type = "isbn"
            }
            
            if(type == "isbn") {
                setCoverURL(json.items[0].volumeInfo.imageLinks.thumbnail);
                setBookTitle(json.items[0].volumeInfo.title);
                getBookAuthors(json.items[0].volumeInfo.authors);
                
                let avgRating = json.items[0].volumeInfo.averageRating;
                if(avgRating) {
                    setRating(json.items[0].volumeInfo.averageRating);
                }
                
                setIsLoaded(true);
            }
            else if(type == "id"){
                setCoverURL(json.volumeInfo.imageLinks.thumbnail);
                setBookTitle(json.volumeInfo.title);
                getBookAuthors(json.volumeInfo.authors);

                let avgRating = json.volumeInfo.averageRating;
                if(avgRating) {
                    setRating(json.volumeInfo.averageRating);
                }

                setIsLoaded(true);
            }
        }

        func();
    }, [])

    return ( isLoaded && 
            <View style={styles.bookTile}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    navigation.navigate("Book", {id: id});
                }}>
                    <View style={{minHeight: 200}}><RemoteImage style={{ }} uri={coverURL} desiredWidth={130}></RemoteImage></View>
                </TouchableOpacity>
                
                <View style={styles.innerView}>
                    <CustomText 
                        numberOfLines={2}
                        style={styles.header} 
                        text={bookTitle}
                        weight="medium"
                    ></CustomText>

                    {bookAuthors == undefined ? <CustomText text={"authors not stated"}/> : <CustomText style={styles.authors} 
                        text={bookAuthors} size={12} numberOfLines={2}/>}

                    <CustomText style={styles.margins} text={rating }/>
                </View>
                <AddToLibrary align={"flex-start"} bookId={id}/>
        </View>
    )
}

export default BookTile

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        justifyContent: 'flex-start',
    },
    bookTile: {
        flex: 1,
        maxWidth: "49%",
        textAlign: 'left',
        marginVertical: 15,
        height: 330,
    },
    innerView: {
        flex: 1,
        alignContent: 'flex-end',
        justifyContent: "space-around",
        position: 'relative',
        maxWidth: 140,
    },
    authors: {
        marginBottom: 5,
        fontSize: 12,
    }
})