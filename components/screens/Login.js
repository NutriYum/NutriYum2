import React from 'react';
import { StyleSheet, Text, TextInput, KeyboardAvoidingView, ScrollView, Button } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';

import { connect } from 'react-redux';

import { login } from '../redux/auth';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (!this.state.email || !this.state.password) {
      return this.setState({error: 'Email and Password are required'})
    }
    const email = this.state.email;
    const password = this.state.password;
    this.props.login({
      email,
      password
    }, this.props.navigation);
    // clear the state after login for security
    this.setState({
      email: '',
      password: '',
      error: ''
    });
  }

  warning(){
    if (this.props.error){
      return <Text style={{fontWeight: 'bold',color: 'red', textShadowColor: 'black', fontSize: 16}}> {this.props.error.response.data} </Text>
  }
}

  render() {
   return (
    <KeyboardAvoidingView behavior="padding" enabled>
      <ScrollView>
        <Form>
        <Item stackedLabel>
              <Label>Email</Label>
              <Input 
                name="email"
                autoCapitalize='none'
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={(text)=> this.setState({email: text})}
              />
        </Item>

        <Item stackedLabel last>
              <Label>Password</Label>
              <Input 
                name="password"
                autoCapitalize='none'
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={(text)=> this.setState({password: text})}
              />
            </Item>

        <Button
          buttonStyle={styles.button}
          title="Login"
          onPress={this.handleSubmit}
        />
        <Button
          buttonStyle={styles.button}
          title="Sign Up"
          onPress={() => {
            this.props.navigation.navigate('Signup');
            this.setState({
              email: '',
              password: '',
              error: ''
            });
          }}
        />
        <Text >{this.state.error}</Text>
        {/* {()=>{this.warning}} */}
        </Form>
      </ScrollView>
    </KeyboardAvoidingView>
  );
 }
}

const mapStateToProps = state => {
 return {
   error: state.currentUser.error
 }
}

const mapDispatchToProps = (dispatch) => ({
  login: (credentials, navigation) => dispatch(login(credentials, navigation))
});

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    flex: 1
  },
  textLabel: {
    fontSize: 20,
    marginTop: 10,
    padding: 10
  },
  textInput: {
    height: 40,
    width: 300,
    margin: 10,
    color: 'tomato',
    fontSize: 15,
    borderWidth: 2,
    borderRadius: 5
  },
  button: {
    backgroundColor: 'gray',
    width: 150,
    height: 40,
    borderRadius: 5,
    alignSelf: 'center'
  },
  error: {
    fontSize: 15,
    color: 'blue',
    marginVertical: 0,
    paddingLeft: 10,
    fontWeight: 'bold'
  }
});
