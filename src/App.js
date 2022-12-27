import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

async function onGoogleButtonPress() {

  try{
    console.log("Check if your device supports Google Play");
  
    const r1 = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
    console.log("Get the users ID token", r1);
    const { idToken } = await GoogleSignin.signIn();

    console.log(" Create a Google credential with the token", idToken)
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential

    const res = await auth().signInWithCredential(googleCredential);
    return res;
  }catch(e){
    console.log("Signin Error:",e)
    return null;
  }

}



export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const emailSignIn = () => {
    // First Try to Sign Up
    auth()
    .createUserWithEmailAndPassword(email,password)
    .then((result) => {
      result.user.updateProfile({displayName:displayName}).then(()=>{
        // As we changed the profile details with in 1 hour so it will not 
        // reflect automatically. To reflect it, we have to update user state
        setUser(auth().currentUser);
      })
      Alert.alert("Sign Up!",'User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        // If already signup then sign in
        auth().signInWithEmailAndPassword(email, password).then(()=>{
          Alert.alert('Signed In!',"Signed In Successful!.");
        })
      }else if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      } else {
        Alert.alert("Error Occured! Please try later")
      }
      console.error(error);
    });
  }

  return (
    <View style={styles.container}>
      <Text>Hello {user ? user.displayName : "Guest"}!</Text>
      <StatusBar style="auto" />
      {
        user 
        ? 
          <Button title='Sign Out' onPress={()=>{
            auth().signOut();
          }}/>
        :
          <View>
            <TextInput style={styles.input} placeholder="Display Name"
              value={displayName}
              onChangeText={(t) => setDisplayName(t)}
            />
            <TextInput style={styles.input} placeholder="Email"
              value={email}
              onChangeText={(t) => setEmail(t)}
            />
            <TextInput style={styles.input} placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(t) => setPassword(t)}
            />
            <TouchableOpacity style={styles.btn} onPress={emailSignIn}>
              <Text style={styles.btnText}>Email Sign-In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}
              onPress={() => onGoogleButtonPress()
                .then((res) => {
                  console.log('Signed in with Google!', res)
                  // res.additionalUserInfo.isNewUser will return true is signing
                  // for first time and false is not
                })}
            >
              <Text style={styles.btnText}>Google Sign-In</Text>
            </TouchableOpacity>
          </View>

      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin:20
  },
  input:{
    borderRadius:5,
    borderWidth:1,
    borderColor:'rgb(20,20,20)',
    padding:5,
    marginVertical:5
  },
  btn: {
    marginVertical:5,
    backgroundColor: '#4287f5',
    padding:7,
    borderWidth:0,
    borderRadius:5
  },
  btnText : {
    textAlign: 'center',
    color:'#FFF',
    fontWeight:'bold'
  }
});
