import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native';
import styles from '../../Styles'


class Loader extends Component {
  constructor(props){
    super(props)
  }
  render()  {
    const { loading } = this.props;
    return (
        <Modal
          visible={loading}
          transparent={true}
          animationType='none'
          onRequestClose={()=>{
          }}
          >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={true}
                size="large"
                color="#0000ff"
                />
              <Text style={{fontWeight: 'bold', color: "#0000ff"}}>Watson's on it!</Text>
            </View>
          </View>
        </Modal>
      )}
}

export default Loader;
