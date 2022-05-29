import { StyleSheet } from 'react-native';
import LoginScreen from './app/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainContainer from './app/components/MainContainer';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { LogBox } from 'react-native';
import { AppStateProvider } from './app/components/AppStateContext';
import SignupScreen from './app/screens/SignupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    let [fontsLoaded] = useFonts({
        "Montserrat-Bold": require("./app/assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-ExtraBold": require("./app/assets/fonts/Montserrat-ExtraBold.ttf"),
        "Montserrat-Italic": require("./app/assets/fonts/Montserrat-Italic.ttf"),
        "Montserrat-Light": require("./app/assets/fonts/Montserrat-Light.ttf"),
        "Montserrat-Medium": require("./app/assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-Regular": require("./app/assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("./app/assets/fonts/Montserrat-SemiBold.ttf"),
    });

    if (!fontsLoaded) {
        return <AppLoading></AppLoading>
    }


    LogBox.ignoreLogs(['expo-app-loading', "AsyncStorage"]); // Ignore log notification by message
    // LogBox.ignoreAllLogs();//Ignore all log notifications

    return (
        <AppStateProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
                    <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignupScreen} />
                    <Stack.Screen options={{ headerShown: false }} name="Main" component={MainContainer} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppStateProvider>

    );
}

const styles = StyleSheet.create({
});