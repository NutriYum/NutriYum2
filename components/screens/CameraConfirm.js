import React from 'react'
import { Image } from 'react-native'
import {
  Icon,
  Button,
  Container,
  Content,
  Header,
  Text,
  Card,
  CardItem,
  Body,
  Left,
  Title
} from 'native-base'
import { connect } from 'react-redux'
import { addToFoodLogThunker } from '../redux/foodLog'
import { setCurrentPhoto, removeCurrentPhoto } from '../redux/photo'
import { setCurrentMatch, removeCurrentMatch } from '../redux/foodmatch'
import { setCurrentUrl } from '../redux/amazon'
import { setNutrition, removeNutrition } from '../redux/nutrition'
import { StackActions, NavigationActions } from 'react-navigation'
import { RNS3 } from 'react-native-aws3'
import {
  AMAZON_ACCESSKEY,
  AMAZON_SECRETKEY,
  WATSON_KEY
} from 'react-native-dotenv'
import axios from 'axios'
import styles from '../../Styles'

accesskey = AMAZON_ACCESSKEY
secretkey = AMAZON_SECRETKEY
watsonKey = WATSON_KEY

const options = {
  bucket: 'nutriyum2',
  region: 'us-east-1',
  accessKey: accesskey,
  secretKey: secretkey,
  successActionStatus: 201
}

class CameraConfirm extends React.Component {
  constructor(props) {
    super(props)

    this.looksGood = this.looksGood.bind(this)
    this.looksBad = this.looksBad.bind(this)
    this.send = this.send.bind(this)
  }

  componentWillMount() {
    console.log(this.props.photo.photo)
  }

  async send() {
    const file = {
      uri: this.props.photo.photo.uri,
      name: this.props.photo.photoName,
      type: 'image/png'
    }
    let amaUri
    await RNS3.put(file, options).then(response => {
      if (response.status !== 201)
        throw new Error('Failed to upload image to S3')
      amaUri = response.body.postResponse.location
      console.log('from amazon', amaUri)
    })
    const response = await axios.get(
      `https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=${watsonKey}&url=${amaUri}&version=2018-03-19&classifier_ids=food`
    )
    let result = response.data.images[0].classifiers[0].classes
    await this.props.setCurrentMatch(result)
    console.log('from watson', this.props)
    await this.props.setCurrentUrl({ amazonUrl: amaUri })
  }

  async looksGood() {
    this.send()
    await this.props.navigation.navigate('Food')
  }

  async looksBad() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'MyCameraScreen' })]
    })
    this.props.navigation.dispatch(resetAction)
    this.props.removeCurrentPhoto()
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Title> NutriYum </Title>
        </Header>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>My Pic</Text>
              </Body>
            </CardItem>
            <CardItem cardBody>
              <Image
                style={{ flex: 1, height: 200, width: null }}
                source={{ uri: this.props.photo.photo.uri }}
              />
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={this.looksGood}>
                  <Icon active name="thumbs-up" />
                  <Text>Looks good!</Text>
                </Button>
              </Left>
              <Body>
                <Button
                  transparent
                  onPress={() => {
                    this.looksBad()
                  }}
                >
                  <Icon active name="reverse-camera" />
                  <Text>Take a new picture</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    photo: state.currentPhoto
  }
}

const mapDispatch = {
  setCurrentPhoto,
  removeCurrentPhoto,
  setCurrentMatch,
  setCurrentUrl
}

export default connect(mapState, mapDispatch)(CameraConfirm)
