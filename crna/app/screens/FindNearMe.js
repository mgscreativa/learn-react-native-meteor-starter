import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-native-elements';
import Meteor from 'react-native-meteor';
import { Location } from 'expo';

import Container from '../components/Container';
import { Header } from '../components/Text';
import LocateMeButton from '../components/LocateMeButton';
import { connectAlert } from '../components/Alert';
import colors from '../config/colors';

const fakeLocations = [
  {
    _id: '1',
    name: 'MGS Creativa',
    latitude: '-34.542',
    longitude: '-58.541',
  },
  {
    _id: '2',
    name: 'Playtime',
    latitude: '-34.670',
    longitude: '-58.402',
  },
  {
    _id: '3',
    name: 'Google',
    latitude: '37.422',
    longitude: '-122.084',
  },
];

class FindNearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    };
  }

  handleGeolocationSuccess = position => {
    const params = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    this.setState({ loading: true });
    Meteor.call('Locations.getNearestLocations', params, (err, locations) => {
      if (err) {
        this.props.alertWithType('error', 'Error', err.reason);
      } else {
        this.props.navigation.navigate('NearMe', { locations, position });
      }
      this.setState({ loading: false });
    });
  };

  handleGeolocationError = error => {
    this.props.alertWithType('error', 'Error', error.message);
  };

  goToNearMe = async () => {
    const location = await Location.getCurrentPositionAsync(
      this.geolocationOptions,
    );

    location
      ? this.handleGeolocationSuccess(location)
      : this.handleGeolocationError(location);
  };

  goToFakeNearMe = (latitude, longitude) => {
    const position = {
      coords: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    this.handleGeolocationSuccess(position);
  };

  render() {
    return (
      <Container>
        <LocateMeButton
          onPress={this.goToNearMe}
          loading={this.state.loading}
        />
        <Header>Find Nearest Charging Stations</Header>
        <Card title="Use Fake Locations">
          {fakeLocations.map(location => (
            <Button
              key={location._id}
              raised
              icon={{ name: 'my-location' }}
              title={location.name}
              backgroundColor={colors.primary}
              buttonStyle={{ marginVertical: 5 }}
              onPress={() =>
                this.goToFakeNearMe(location.latitude, location.longitude)}
            />
          ))}
        </Card>
      </Container>
    );
  }
}

FindNearMe.propTypes = {
  navigation: PropTypes.object,
  alertWithType: PropTypes.func,
};

export default connectAlert(FindNearMe);
