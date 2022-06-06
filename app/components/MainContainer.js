import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'
import colors from '../config/colors'

const homeName = "Home";
const profileName = "Profile";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

const MainContainer = () => {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? "home" : "home-outline"
                    } else if (rn === profileName) {
                        iconName = focused ? "person" : "person-outline"
                    } else if (rn === settingsName) {
                        iconName = focused ? "settings" : "settings-outline"
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: colors.primaryColor,
                tabBarInactiveTintColor: colors.grey,
                tabBarLabelStyle: {
                    paddingBottom: 10,
                    fontSize: 10,
                    fontFamily: "Montserrat-Regular",
                },
                tabBarStyle: {
                    padding: 10,
                    height: 70
                },
            })}>
            <Tab.Screen options={{ headerShown: false }} name={homeName} component={HomeScreen} />
            <Tab.Screen options={{ headerShown: false }} name={profileName} component={ProfileScreen} />
            <Tab.Screen options={{ headerShown: false }} name={settingsName} component={SettingsScreen} />
        </Tab.Navigator>);
}

export default MainContainer

const styles = StyleSheet.create({})