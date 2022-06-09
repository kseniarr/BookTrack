import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CheckBox from 'expo-checkbox'
import Star from './Star'

const StarRating = ({ total, rating }) => {
    const [isHalfSelected, setIsHalfSelected] = useState(false);
    const [selectedStar, setSelectedStar] = useState(-1);
    const [totalStars, setTotal] = useState(0);

    const selectStar = (id) => {
        if (id == selectedStar) {
            setSelectedStar(-1);
            setTotal(0);
            total(0);
            setIsHalfSelected(false);
        } else {
            setSelectedStar(id);
            if (isHalfSelected) {
                setTotal(id + 1 - 0.5);
                total(id + 1 - 0.5);
            } else {
                setTotal(id + 1);
                total(id + 1);
            }
        }
    }


    return (
        <>
            {rating == -1 && <View style={styles.container}>
                {Array.apply(null, Array(5)).map((element, id) => {
                    if (id == selectedStar) {
                        if (isHalfSelected) {
                            return <Star key={id} name="star-half-sharp" onPress={() => selectStar(id)} />
                        } else {
                            return <Star key={id} name="star" onPress={() => selectStar(id)} />
                        }
                    } else if (id < selectedStar) {
                        return <Star key={id} name="star" onPress={() => selectStar(id)} />
                    } else {
                        return <Star key={id} name="star-outline" onPress={() => selectStar(id)} />
                    }
                })}
                <CheckBox
                    value={isHalfSelected}
                    onValueChange={() => {
                        if (isHalfSelected) {
                            setIsHalfSelected(false);
                            setTotal(+totalStars + 0.5);
                            total(+totalStars + 0.5);
                        } else {
                            setIsHalfSelected(true);
                            setTotal(totalStars - 0.5);
                            total(totalStars - 0.5);
                        }
                    }}
                    style={styles.checkbox}
                />
            </View>}
            {rating && <View style={{ flexDirection: 'row' }}>
                {Array.apply(null, Array(5)).map((element, id) => {
                    if (id + 1 <= Math.trunc(rating)) {
                        return <Star key={id} name="star" />
                    } else if (+id + 0.5 == rating) {
                        return <Star key={id} name="star-half-sharp" />
                    } else {
                        return <Star key={id} name="star-outline" />
                    }
                })}
            </View>}
        </>

    )
}

export default StarRating

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    star: {
        fontSize: 20,
    }
})