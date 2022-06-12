import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'
import colors from '../config/colors'
import TabBar from './TabBar'

const homeName = "Home";
const profileName = "Profile";
const settingsName = "Settings";

const MainContainer = () => {
    const [currTab, setCurrTab] = useState(homeName);

    return (
        <>
            {currTab == homeName && <HomeScreen />}
            {currTab == profileName && <ProfileScreen />}
            {currTab == settingsName && <SettingsScreen />}
            <View style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "white",
                height: 80,
                justifyContent: 'space-evenly',
                alignItems: 'center',
            }}>
                <TabBar
                    onPress={() => setCurrTab(homeName)}
                    name={homeName}
                    icon={currTab == homeName ? "home" : "home-outline"}
                    color={currTab == homeName ? colors.primaryColor : colors.grey} />
                <TabBar
                    onPress={() => setCurrTab(profileName)}
                    name={profileName}
                    icon={currTab == profileName ? "person" : "person-outline"}
                    color={currTab == profileName ? colors.primaryColor : colors.grey} />
                <TabBar
                    onPress={() => setCurrTab(settingsName)}
                    name={settingsName}
                    icon={currTab == settingsName ? "settings" : "settings-outline"}
                    color={currTab == settingsName ? colors.primaryColor : colors.grey} />
            </View>
        </>
    );
}

export default MainContainer

const styles = StyleSheet.create({})