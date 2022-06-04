import { StyleSheet, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import CustomText from '../components/CustomText'
import AppStateContext from '../components/AppStateContext';
import CustomButton from '../components/CustomButton';
import consts from '../config/consts';
import Avatar from '../components/Avatar';

const ProfileScreen = () => {
    const { context, setContext } = useContext(AppStateContext);
    const [read, setRead] = useState(0);
    const [toRead, setToRead] = useState(0);
    const [dnf, setDnf] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [favBooks, setFavBooks] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [yearlyGoal, setYearlyGoal] = useState(null);

    const changeYearlyGoal = () => {

    }

    return (
        <View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.userData}>
                <View style={styles.header}>
                    <Avatar />
                    <View style={{marginVertical: 8}}><CustomText text={`${context}`} weight={"bold"} size={24} align="center" /></View>
                </View>
                <View style={[styles.statictic, styles.alignLeft]}>
                    <CustomText text={"read: " + read} align="left" />
                    <CustomText text={"to read: " + toRead} />
                    <CustomText text={"dnf: " + dnf} />
                </View>
                <View style={[styles.statictic, styles.alignLeft]}>
                    <CustomText text={"average rating: " + avgRating} />
                    <CustomText text={"number of reviews: " + (reviews == null ? 0 : reviews.count)} />
                </View>
            </View>
            <View style={styles.userData}>
                <CustomText text={"Yearly goal"} size={24} />
                {yearlyGoal == null ? <View>
                        <View style={{marginVertical: 10}}><CustomText text={"No yearly goal set"} align="center"/></View>
                        <CustomButton text={"Set yearly goal"} onPress={changeYearlyGoal}/>
                    </View> : <View>
                        <CustomText text={"yearly goal"}/>
                    </View>}
            </View>
            <View style={styles.userData}>
                <CustomText text={"Favorite books"} size={24} />
                {favBooks == null ? <CustomText text="No favorite books" /> : <View>
                        <CustomText text={"Favorite books"} />
                    </View>}
            </View>
            <View style={styles.userData}>
                <CustomText text={"Reviews"} size={24} />
                {reviews == null ? <CustomText text="No reviews" /> : <View>
                        <CustomText text={"Favorite books"} />
                    </View>}
            </View>
            <View style={styles.userData}>
                <CustomText text={"Reviews"} size={24} />
                {reviews == null ? <CustomText text="No reviews" /> : <View>
                        <CustomText text={"Favorite books"} />
                    </View>}
            </View>
        </ScrollView>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: consts.bottomPadding,
    },
    button: {
        padding: 15,
        marginTop: 20,
    },
    header: {
        marginTop: 20,
    },
    statictic: {
        width: "60%",
        marginVertical: 5,
        alignItems: 'center',
    },
    userData: {
        width: "100%",
        alignItems: 'center',
        marginBottom: 50,
    },
    alignLeft: {
        alignItems: "flex-start",
    },
});

export default ProfileScreen;