import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import RemoteImage from './RemoteImage';

const BookTile = ({ isbn13 }) => {
    const [coverURL, setCoverURL] = useState();
    const [bookTitle, setBookTitle] = useState();
    const [bookAuthors, setBookAuthors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rating, setRating] = useState(4.5);

    useEffect(() => {
        const func = async () => {
            const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn13, {method: "GET"})
            const json = await response.json(); 
            
            setCoverURL(json.items[0].volumeInfo.imageLinks.thumbnail);
            setBookTitle(json.items[0].volumeInfo.title);
            setBookAuthors(json.items[0].volumeInfo.authors);
            
            let avgRating = json.items[0].volumeInfo.averageRating;
            if(avgRating) {
                setRating(json.items[0].volumeInfo.averageRating);
            }
            
            setIsLoaded(true);
        }

        func();
    }, [])

    return ( isLoaded && 
            <View style={styles.bookTile}>
                <RemoteImage uri={coverURL} desiredWidth={130}></RemoteImage>
                
                <View style={styles.innerView}>
                    <CustomText 
                        style={styles.header} 
                        text={bookTitle}
                        weight="medium"
                    ></CustomText>

                    {bookAuthors.map((element, id) => {
                        return <CustomText key={id} style={styles.authors} text={element} size={12}/>
                    })}
                    
                    <CustomText style={styles.margins} text={rating }/>
                    <CustomButton text={"Add to library"} style={styles.btn} weight={"medium"} width={"90%"} size={12}/>
                </View>
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
        width: "49%",
        textAlign: 'left',
        marginVertical: 15,
        height: 330,
    },
    innerView: {
        flex: 1,
        alignContent: 'flex-end',
        justifyContent: "space-between",
        position: 'relative',
        maxWidth: 140,
    },
    btn: {
        width: "100%",
        marginTop: 10,
    },
    authors: {
        marginBottom: 5,
        fontSize: 12,
    }
})