import React from 'react';
import { ActivityIndicator, Alert, Button, DatePickerIOS, ListView,
	 		StyleSheet, Text, View
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import DatePicker from 'react-native-datepicker'


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
				  	navigate('Profile')
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
	constructor(props){
  		super(props)
  		this.state = {datetime:"02/23/2018 12:00"}

	}
	TestFunction = () => {
		Alert.alert('Availability added: ', this.state.datetime);
	}
	render(){
	    return (
			<View style={styles.container}>
				<Text style={styles.instructions}>Today: {this.state.datetime}</Text>
		        <DatePicker
		          style={{width: 300}}
		          date={this.state.datetime1}
		          mode="datetime"
				  format="MM/DD/YYYY HH:mm"
		          /*format="YYYY-MM-DD HH:mm"*/
		          confirmBtnText="Confirm"
		          cancelBtnText="Cancel"
		          customStyles={{
		            dateIcon: {
		              position: 'absolute',
		              left: 0,
		              top: 8,
		              marginLeft: 0
		            },
		            dateInput: {
		              marginLeft: 36
		            }
		          }}
		          minuteInterval={10}
		          onDateChange={(datetime) => {this.setState({datetime1: datetime});}}
		        />
		        <Text style={styles.instructions}>Selected date & time: {this.state.datetime1}</Text>
				<View style={styles.buttonContainer}>
					<Button
					  title="Confirm availability"
					  onPress={() => {
						  this.TestFunction();
					}}
					/>
				</View>
			</View>
		)
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
