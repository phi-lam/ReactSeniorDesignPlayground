import React from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Button, DatePickerIOS,
			FlatList, ListView,
	 		Platform, SectionList, StyleSheet, Text, View
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

import { List, ListItem } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import store from 'react-native-simple-store';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

/* TODO Apr 26:
 *	- When asking for freeblocks for home screen, need server to give me:
 *			- "committed" flag: is the free block committed? 0 or 1
 *			- "matched_friends": array of friend names for which match exists
 */

/* Frontend TODO:
 * - scale the block height-wise to intuitively convey how much time it takes up
 * 		-
 * - Should top-align the box with the date on the left, not bottom-align
 *		- Do we intuitively convey gaps between free blocks?
 *		- OR: remove implication of height with timespan altogether
 * - separate screen to show details of all matched friends?
 * - hover to show all matched friends?
 * -
 * - omit end time: anonymity and unnecessary
 * - how much tolerance for varying start times? 5 minutes? 15 minutes?
 */


/* TODO:
 *		- ensure userid is initialized (logged in) before allowing access to Home
 *		- put dates as headers like in iStudiez assignments
 */

 /* TODO: Security
  *		- For now, give Benji token AND friends list, user info, etc
  *		- Eventually, only exchange token, and server will contact facebook for info
  *		- Contact Graph API with PHP
  *		- Continue to clean up app
  */


function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

/*	Function: logIn()

	Description: Called when the Login button is pressed.
*/

async function logIn() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('346085519238336', {
      permissions: ['public_profile', 'user_friends'],
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

	//Send access token and userid to benji
	const response_test = await fetch(`http://students.engr.scu.edu/~bbutton/SDW/clickauthenticate.php?userid=${responseJson.id}&fbtoken=${token}`);
	console.log("###TEST: ", response_test);
	AsyncStorage.setItem('USERID', responseJson.id);
	AsyncStorage.setItem('FBTOKEN', JSON.stringify(token));

	//Save id and token
	store.save('USERID', responseJson.id);
	store.save('FBTOKEN', JSON.stringify(token));

	//const userid = await AsyncStorage.getItem('USERID');
	const userid = store.get('USERID')
	.then((res) =>
		console.log('logIn() - simple-store USERID: ', res)
	)
	return store.get('USERID');
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
				<View style={styles.buttonContainerVert}>
					<Button
						onPress={() => {

						}}
						title="Login"
						onPress={() => {
							logIn()
							.then((loginID) => {
								console.log('loginID - ', loginID)
								this.setState({
									userid: loginID,
									isLoggedIn: true,
								})
							})

						} }
					/>
					<Button
					  onPress={() => {

					  }}
					  title="Go To Home"
					  onPress={() =>
						store.get('USERID')
						.then((loginID) =>
							navigate('Home', {
								userid: loginID
							})
						)
					  }
					/>
				</View>
			</View>
		)
	}
}

class HomeScreen extends React.Component {
	static navigationOptions = {
	   title: 'Your Availabilities',
	};
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
  }

	async componentDidMount() {
		let userid = await store.get('USERID');
		console.log("USERID: ", userid);
		return fetch(`http://students.engr.scu.edu/~bbutton/SDW/retrieveclickdata.php?table=freeblock&userid=${userid}`)
			.then((responseJson) => {
				let parsed_response = JSON.parse(responseJson._bodyText);
				// console.log(responseJson);
				// console.log("-----------")
				console.log(parsed_response)

				/* TODO Apr 26:
				 *	- When asking for freeblocks for home screen, need server to give me:
				 *			- "committed" flag: is the free block committed? 0 or 1
				 *			- "matched_friends": array of friend names for which match exists
				*/

				let availabilities = {};
				var key, count = 0;
				var res, res2, end_time, start_time, start_date;

				for(key in parsed_response) {
					if(parsed_response.hasOwnProperty(key)) {
						count++;
					}

					res = parsed_response[key]["startTime"].split(" ");
					start_date = res[0];
					start_time = res[1];

					res2 = parsed_response[key]["endTime"].split(" ");
					end_time = res2[1];

					console.log(start_date)
					console.log(start_time)

					avail_id = parsed_response[key]["avail_ID"];
					//console.log(avail_id)
					availabilities[start_time] = avail_id;

					this.state.items[start_date] = [];

					this.state.items[start_date].push({
						name: "Your availability: " + start_time + " - " + end_time,
				        height: 50
					});

				}
				console.log(this.state.items)
				// this.setState({
				// 	items: availabilities
				// })

				console.log("Number of availabilities: ", count);

				// this.setState({
				// 	// isLoading: false,
				// 	// dataSource: availabilities,
				// });
				// Alert.alert(availabilities);
				// console.log(availabilities.data);
			})
			.catch((error) => {
				console.error(error);
			});
		  // store.get('USERID')
		  // .then((loginID) => {
		  // 		this.setState({
			//   		userid: loginID
		  // 		})
			// })
	}

  render() {
	const { navigate } = this.props.navigation;
    return (
	<View style = {styles.MainContainer}>
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        // selected={'2018-04-16'}
		selected={Date()}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
         // monthFormat={'yyyy'}
        //theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
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
	</View>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      // for (let i = -15; i < 85; i++) {
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
		// const strTime = this.timeToString(time);
      //   if (!this.state.items[strTime]) {
      //     this.state.items[strTime] = [];
      //     const numItems = Math.floor(Math.random() * 5);
	  //
      //     for (let j = 0; j < numItems; j++) {
      //       this.state.items[strTime].push({
      //         name: 'Availability ' + strTime,
      //         height: Math.max(50, Math.floor(Math.random() * 150))
      //       });
      //     }
	  //
		// }
      // }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text></Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0]; //date of time
	//return date.toISOString().split('T')[1]; //timestamp
  }
}


{ /**** Class: Matches Screen *********************
		This class pings the server for matches and displays them to the user
		* TODO:
		* 	- After pinging server, make separate function for parsing the
		*		data to better display it.
		*	- Sort matches by date
  */
}

class MatchesScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			userid: '',
			sections: {},
			match_list: {},
		}
	}

	state = {
		isLoading: true
	};

	ListViewItemSeparator = () => {
		return (
			<View
				style={{
					height: .5,
					width: "100%",
					backgroundColor: "#000",
				}}
			/>
		);
	}

	GetItem(match) {
		Alert.alert(match);
	}


	async componentDidMount() {
		/* Create form data, then add to body of POST request */

		let userid = await store.get('USERID')
		console.log('See Matches - userid', userid)
		let formData = new FormData();
		let dummy_pw = 'password';
		let dummy_user = 'Phi';
		formData.append('userid', userid)

		console.log('formData - ', formData);
		console.log('Retrieve matches -', userid);

		return fetch(`http://students.engr.scu.edu/~bbutton/SDW/MatchNClick.php`, {
			method: 'POST',
			headers: new Headers({
					   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
			  }),
			body: formData
		})
			.then((responseJson) => {
				console.log(responseJson);
				let parsed_response = JSON.parse(responseJson._bodyText);

				//TeMP TEST
				//let parsed_response = responseJson._bodyText;
				// console.log("-----------")
				console.log(parsed_response)

				/* TODO Apr 26:
				 *	- When asking for freeblocks for home screen, need server to give me:
				 *			- "committed" flag: is the free block committed? 0 or 1
				 *			- "matched_friends": array of friend names for which match exists
				*/

				var matches = {};
				var key, key2, i, count = 0;
				var res, res2, end_time, start_time, start_date;

				for(key in parsed_response) {
					if(parsed_response.hasOwnProperty(key)) {
						count++;
					}

					res = parsed_response[key]["startTime"].split(" ");
					start_date = res[0];
					start_time = res[1];

					res2 = parsed_response[key]["endTime"].split(" ");
					end_time = res2[1];

					// console.log(start_date)
					// console.log(start_time)

					matches = [];

					/* Add each friend grouping for this date and start time */
					let friend_list = parsed_response[key]["friends"];
					console.log(friend_list)
					console.log("----------")
					for(i = 0; i < friend_list.length; i++) {
							matches[i] = friend_list[i]["name"];
					}

					/* match_list {
					* 		"2018-4-21": {
					*			"13:00": [ Darren Atkinson, BME ]
					*		}
					* }
					*/

					if (isEmpty(this.state.match_list))
						this.state.match_list[start_date] = [];
					else if (isEmpty(this.state.match_list[start_date]))
						this.state.match_list[start_date] = [];

					this.state.match_list[start_date].push({
						id: key,
						time: start_time,
				        friends: matches
					});

					console.log("\n Push attempt: ", matches)
				}

				console.log("\n***** FINAL MATCH LIST *****")
				console.log(this.state.match_list)

				this.setState({
					isLoading: false,
					dataSource: matches,
				});

				// Alert.alert(availabilities);
				// console.log(availabilities.data);
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

	/*###################################################################*/


	render() {
		if (this.state.isLoading) {
			return (
				<View style={{flex:1, paddingTop: 20}}>
					<ActivityIndicator />
				</View>
			);
		}

		console.log("source data for FlatList - ", this.state.dataSource);
		return (
			<View>
				<FlatList
					data = {this.state.dataSource}
					renderItem={({item}) =>
					<View>
						<Text style={styles.titleText}> Friend: {item.friendName} </Text>
						<Text style={styles.titleText}> Time: {item.friendStart} </Text>
						<View
							style={{
								height: .5,
								width: "100%",
								backgroundColor: "#000",
							}}
						/>
					</View>	}
					keyExtractor= { (item, index) => index}
				/>
			</View>
		);
		/* DUMMY RENDER */
		// return (
		// 	<View>
		// 		<FlatList
		// 			data = {this.state.dataSource}
		// 			renderItem={({item}) => <Text> {item.first_name} </Text>}
		// 			keyExtractor= { (item, index) => index}
		// 		/>
		// 	</View>
		// );
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
		/* Create form data, then add to body of POST request */
			const userid = await store.get('USERID');	//DON'T CHANGE THIS
			console.log('postAvailability() - userid: ', userid);
			let formData = new FormData();
			let dummy_pw = 'password';
			let dummy_user = 'Phi';
			let matchreqdata = JSON.stringify({
				user: [
						{
							fb_ID: userid,
							pw: dummy_pw,
							userName: dummy_user
						}
					],
				freeblock: [
						{
							user_ID: userid,
							startTime: this.state.time1,
							endTime: this.state.time2
						}
					]
				});
			formData.append('entrytype', matchreqdata)
			console.log('formData - ', formData);

			/* POST request to save free block */
			fetch('http://students.engr.scu.edu/~bbutton/SDW/saveclickdata.php', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
				  }),
				body: formData
					/* TODO: blacklist and friend list
					blacklist: [
					]
					friend: [
					]
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
				  format="YYYY-MM-DD HH:mm:ss"
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
				  format="YYYY-MM-DD HH:mm:ss"
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
	baseText: {
	  fontFamily: 'Cochin',
	},
	titleText: {
	  fontSize: 20,
	  fontWeight: 'bold',
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		},
	buttonContainerVert: {
		flex: 1,
		flexDirection: 'column',
			alignItems: 'center',
		justifyContent: 'center'
	},
	buttonContainer: {
		flex: 0.05,
		flexDirection: 'row',
			alignItems: 'center',
		justifyContent: 'center',
		paddingTop:	(Platform.OS === 'ios') ? 20 : 0,
	},

	item: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
		},
		emptyDate: {
		height: 15,
		flex:1,
		paddingTop: 30
	},

  	MainContainer: {
  		// Setting up View inside content in Vertically center.
	  //justifyContent: 'center',
		flex:2,
		paddingBottom: (Platform.OS === 'ios') ? 110 : 0,
		backgroundColor: '#fff',
		padding: 5,
  	},

 	rowViewContainer: {
        fontSize: 20,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,

	},
	title: {
	    backgroundColor: '#0f1b29',
	    color: '#fff',
	    fontSize: 18,
	    fontWeight: 'bold',
	    padding: 10,
	    paddingTop: 40,
	    textAlign: 'center',
	 },
  	row: {
	    borderColor: '#f1f1f1',
	    borderBottomWidth: 1,
	    flexDirection: 'row',
	    marginLeft: 10,
	    marginRight: 10,
	    paddingTop: 20,
	    paddingBottom: 20,
  	},
  	iconContainer: {
	    alignItems: 'center',
	    backgroundColor: '#feb401',
	    borderColor: '#feaf12',
	    borderRadius: 25,
	    borderWidth: 1,
	    justifyContent: 'center',
	    height: 50,
	    width: 50,
  	},
  	icon: {
	    tintColor: '#fff',
	    height: 22,
	    width: 22,
  	},
  	info: {
	    flex: 1,
	    paddingLeft: 25,
	    paddingRight: 25,
  	},
  	items: {
	    fontWeight: 'bold',
	    fontSize: 16,
	    marginBottom: 5,
  	},
  	address: {
	    color: '#ccc',
	    fontSize: 14,
  	},
  total: {
    width: 80,
  },
  date: {
    fontSize: 12,
    marginBottom: 5,
  },
  price: {
    color: '#1cad61',
    fontSize: 25,
    fontWeight: 'bold',
  },
});


/* TODO (done):
 *		- after calling logIn(), save the userID value.
 * 		- send userID in POST requests
 *			- pass userID as parameter between components?
 *			- async storage of User data instead of passing around components as param */


 /* (done)
  *	- retrieve my availabilities, and then display in calendar view
  */
