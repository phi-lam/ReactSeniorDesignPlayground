import React from 'react';
import { ActivityIndicator, Button, DatePickerIOS, ListView,
	 		StyleSheet, Text, View
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

function getMoviesFromApiAsync() {
  return fetch('https://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<Button
				  onPress={() => {

				  }}
				  title="Add availability"
				  onPress={() =>
				  	navigate('Profile', {name: 'Jane' })
				}
				/>
			</View>
			<View style={styles.container}>
				<Text>Click the button above to add availabilities!</Text>
				<Text>Changes you make will automatically reload.</Text>
				<Text>Shake your phone to open the developer menu.</Text>
			</View>
		</View>

    );
  }
}

class ProfileScreen extends React.Component {
  render() {
    return (
		<Button
		  title="Go to Jane's profile"
		  onPress={() =>
			navigate('Profile', { name: 'Jane' })
		  }
		/>
    );
  }
}

export default StackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
	flex: 1,
	flexDirection: 'column',
  	alignItems: 'center',
	justifyContent: 'center'
},
});
