import React from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Button, DatePickerIOS, ListView,
	 		SectionList, StyleSheet, Text, View
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import DatePicker from 'react-native-datepicker'

/* TODO:
 *		- after calling logIn(), save the userID value.
 * 		- send userID in POST requests
 *			- pass userID as parameter between components?
 *			- async storage of User data instead of passing around components as param
 *			- ensure userid is initialized (logged in) before allowing access to Home
 */

 /* TODO: Security
  *		- For now, give Benji token AND friends list, user info, etc
  *		- Eventually, only exchange token, and server will contact facebook for info
  *		- Contact Graph API with PHP
  *		- Continue to clean up app
  */

async function logIn() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('346085519238336', {
      permissions: ['public_profile'],
    });
  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const response = await fetch(
    	`https://graph.facebook.com/me?access_token=${token}`);
	let responseJson = await response.json();
	Alert.alert(
      'Logged in!',
      `Hi ${(responseJson.name)}!`,
    );
	await console.log('logIn() - UserID: ', responseJson.id);

	AsyncStorage.setItem('USERID', responseJson.id);
	AsyncStorage.setItem('FBTOKEN', JSON.stringify(token));

	const userid = await AsyncStorage.getItem('USERID');
	console.log('logIn() - AsyncStorage USERID: ', userid);
	return userid;
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
						onPress={() => {
							let loginID = logIn();
							this.setState({userid: loginID})
						} }
					/>
					<Button
					  onPress={() => {

					  }}
					  title="Go To Home"
					  onPress={() =>
						navigate('Home', {
							userid: this.state.userid
						})
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

  constructor(props){
	  super(props)
	  this.state = {
		  isLoggedIn: 1,
		  userid: this.props.navigation.params
	  };
  }

  render() {
    const { navigate } = this.props.navigation;
	console.log('Home userid:', this.state.userid);
    return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<Button
				  onPress={() => {

				  }}
				  title="Add Availability"
				  onPress={() =>
				  	navigate('Profile', {
						userid: this.state.userid
					})
				}
				/>
				<Button
				  onPress={() => {

				  }}
				  title="See Matches"
				  onPress={() =>
					navigate('Matches', {
						userid: this.state.userid
					})
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

{ /**** Class: Matches Screen *********************
		This class pings the server for matches and displays them to the user
		*/
}

class MatchesScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			userid: this.props.navigation.state.params
		}
	}

	GetItem (fruit_name) {
  		Alert.alert(fruit_name);
  	}


	componentDidMount() {

		/* Dummy fetch request
		return fetch('https://reactnativecode.000webhostapp.com/FruitsList.php')
			.then((response) => response.json())
			.then((responseJson) => {
				let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
				this.setState({
					isLoading: false,
					dataSource: ds.cloneWithRows(responseJson),
				}, function() {
					//do something with new state
				});
			})
			.catch((error) => {
				console.error(error);
			}); */

		/* ACTUAL GET REQUEST */
		const encodedUserID = encodeURIComponent(this.state.userid);
		return fetch(`http://students.engr.scu.edu/~bbutton/SDW/retrievematches=${encodeduUserID}.php`)
			.then((response) => response)
			.then((responseJson) => {
				console.log(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	/* Set Sectionheaders based on dates
	populateList = () => {
		return([
			{data:}
		])
	}*/

	render() {
		if (this.state.isLoading) {
			return (
				<View style={{flex:1, paddingTop: 20}}>
					<ActivityIndicator />
				</View>
			);
		}
		return (
			<View style={styles.MainContainer}>

			  <ListView

				dataSource={this.state.dataSource}

				renderSeparator= {this.ListViewItemSeparator}

				renderRow={(rowData) => <Text style={styles.rowViewContainer}
				onPress={this.GetItem.bind(this, rowData.fruit_name)} >{rowData.fruit_name}</Text>}

			  />

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
			time2: "",
			userid: this.props.navigation.state.params
		};
	}

	/* Function: postAvailability
	 *	Submits a POST request to the API, transmitting
	 *	the user's name and availability.

	 *	Availability format: YYYY-MM-DD hh:mm */

	postAvailability = async() => {
	/*	if (this.state.date == "")
			Alert.alert('Enter a date!'); */
		if (this.state.time1 == "")
			Alert.alert('Enter a start time!');
		else if (this.state.time2 == "")
			Alert.alert('Enter an end time!');

		else {
		/*	Dummy POST request
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
			  }) // <-- Post parameters */

		/* Actual POST request */
			const userid = await AsyncStorage.getItem('USERID');
			console.log('postAvailability() - userid: ', userid);
			fetch('http://students.engr.scu.edu/~bbutton/SDW/saveclickdata.php', {
				method: 'POST',
				headers: new Headers({
						   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
				  }),
				body: JSON.stringify({
					user: [
						{ fb_ID: userid }
					],
					freeblock: [
						{
							user_ID: userid,
							startTime: this.state.time1,
							endTime: this.state.time2
						}
					]
					/* TODO: blacklist and friend list
					blacklist: [
					]
					friend: [
					]
				}) // <-- Post parameters */
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
			  alert(responseText);
			})
			.catch((error) => {
			    console.error(error);
			});
			Alert.alert('Availability added!');
			console.log(userid);
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
	StackNavigator is a function that contains each different screen that can be
	navigated to. */}

const RootStack = StackNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
  Matches: { screen: MatchesScreen },
});


export default class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			isLoggedIn: false,
			userid:0
		};
	}
	render() {
		return <RootStack />;
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

  MainContainer: {
		  // Setting up View inside content in Vertically center.
		justifyContent: 'center',
		flex:1,
		margin: 10

		},

 rowViewContainer: {
        fontSize: 20,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
      }
});
