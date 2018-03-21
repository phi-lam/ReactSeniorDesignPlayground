import React from 'react';
import { ActivityIndicator, Alert, Button, DatePickerIOS, ListView,
	 		StyleSheet, Text, View
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import DatePicker from 'react-native-datepicker'

async function logIn() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('346085519238336', {
      permissions: ['public_profile'],
    });
  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);
    Alert.alert(
      'Logged in!',
      `Hi ${(await response.json()).name}!`,
    );
	return (await response.json()).id;
  }
}

class LoginScreen extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			isLoggedIn: false,
			userid:0
		};
	}
	render() {
		const { navigate } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.buttonContainer}>
					<Button
						onPress={() => {

						}}
						title="Login"
						onPress={() =>
							userid = logIn()
						}
					/>
					<Button
					  onPress={() => {

					  }}
					  title="Go To Home"
					  onPress={() =>
						navigate('Home')
					}
					/>
				</View>
			</View>
		)
	}

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

{ /* Class: ProfileScreen
	This class posts availabilities as chosen from the dialogue
	box that it displays.*/}

class ProfileScreen extends React.Component {
	constructor(props){
  		super(props)
  		this.state = {
			date: "",
			time1: "",
			time2: ""
		};
	}

	/* Function: postAvailability
	 *	Submits a POST request to the API, transmitting
	 *	the user's name and availability.

	 *	Availability format: YYYY-MM-DD hh:mm */

	postAvailability = () => {
	/*	if (this.state.date == "")
			Alert.alert('Enter a date!'); */
		if (this.state.time1 == "")
			Alert.alert('Enter a start time!');
		else if (this.state.time2 == "")
			Alert.alert('Enter an end time!');

		else {
		/*	Dummy POST request */
			fetch("https://reqres.in/api/users", {
			  method: 'POST',
			  headers: new Headers({
			             'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
			    }),
			  body: JSON.stringify({
				  name:'Phi',
				  //date:this.state.date,
				  time1:this.state.time1,
				  time2:this.state.time2
			  }) // <-- Post parameters

		/* Actual POST request
			fetch("http://students.engr.scu.edu/~bbutton/SDW/clickdata.php", {
				method: 'POST',
				headers: new Headers({
						   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
				  }),
				body: JSON.stringify({
					name:'Phi',
				//	date:this.state.date,
					time1:this.state.time1,
					time2:this.state.time2
				}) // <-- Post parameters */
			})
			.then((response) => response.text())
			.then((responseText) => {
			  alert(responseText);
			})
			.catch((error) => {
			    console.error(error);
			});
			Alert.alert('Availability added!');
		}
	}

	/* Function:	render()
	 *
	 *	Description: provides the date selection buttons as well as indicators
	 *				for the start and end times of the availability to enter.
	 *				The "confirm availability" button calls postAvailability()
	 */

	render(){
	    return (
			<View style={styles.container}>
		    {/*   <DatePicker
		          style={{width: 300}}
		          date={this.state.date1}
		          mode="date"
		          format="YYYY-MM-DD"
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
		          onDateChange={(date) => {this.setState({date: date});}}
		        /> */}

				{/* can do if/then selection to display time selected */}
				<DatePicker
				  style={{width: 300}}
				  date={this.state.time1}
				  mode="datetime"
				  format="YYYY-MM-DD HH:mm"
				  confirmBtnText="Confirm"
				  cancelBtnText="Cancel"
				  customStyles={{
					dateIcon: {
					  position: 'absolute',
					  left: 0,
					  top: 16,
					  marginLeft: 0
					},
					dateInput: {
					  marginLeft: 36
					}
				  }}
				  minuteInterval={10}
				  onDateChange={(date) => {this.setState({time1: date});}}
				/>
				<DatePicker
				  style={{width: 300}}
				  date={this.state.time2}
				  mode="datetime"
				  format="YYYY-MM-DD HH:mm"
				  confirmBtnText="Confirm"
				  cancelBtnText="Cancel"
				  customStyles={{
					dateIcon: {
					  position: 'absolute',
					  left: 0,
					  top: 16,
					  marginLeft: 0
					},
					dateInput: {
					  marginLeft: 36
					}
				  }}
				  minuteInterval={10}
				  onDateChange={(date) => {this.setState({time2: date});}}
				/>
				<Text style={styles.instructions}></Text>
			{/*<Text style={styles.instructions}>Selected Date: {this.state.date}</Text>*/}
				<Text style={styles.instructions}>Start time: {this.state.time1}</Text>
				<Text style={styles.instructions}>End time: {this.state.time2}</Text>

				<View style={styles.buttonContainer}>
					<Button
					  title="Confirm availability"
					  /* TODO: Prevent postAvailability() if end date is earlier than start date*/
					  onPress={() => {
						  this.postAvailability();
					}}
					/>

				</View>
			</View>
		)
	  }
}

{ /*
	StackNavigator contains each different screen that can be
	navigated to. */}

export default StackNavigator({

  Login: { screen: LoginScreen },
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
