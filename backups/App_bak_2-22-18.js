import React from 'react';
import { ActivityIndicator, Button, ListView, StyleSheet, Text, View } from 'react-native';

/*function test() {
	fetch('https://reqres.in/api/users/2')
		.then(function(response) {
			return response.json()
		})
}*/


/*function getUserMatches() {
	return fetch('https://reqres.in/api/users/2')
	.then((response) => response.json())
	.then((responseJson) => {
		return responseJson.matches;
	})
	.catch((error) => {
		console.error(error);
	});
}*/

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

export default class App extends React.Component {
  render() {
    return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<Button
				  onPress={() => {
					Alert.alert('You tapped the button!');
				  }}
				  title="Add availability"
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
