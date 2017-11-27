import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { MapView } from 'expo';
import Container from '../components/Container';
import MapCallout, {
  styles as mapCalloutStyles,
} from '../components/MapCallout';
import FloatingButton from '../components/FloatingButton';

class NearMeMap extends Component {
  goToLocationDetails = location => {
    this.props.navigation.navigate('LocationDetails', { location });
  };

  replaceScreen = () => {
    const { locations, position } = this.props.navigation.state.params;
    this.props.navigation.dispatch({
      key: 'NearMe',
      type: 'ReplaceCurrentScreen',
      routeName: 'NearMe',
      params: { locations, position },
    });
  };

  subTitle = location => {
    let subtitle = '';
    if (location.street_address) {
      subtitle = location.street_address;
    }

    if (location.access_days_time && subtitle.length) {
      subtitle = `${subtitle} - ${location.access_days_time}`;
    } else if (location.access_days_time) {
      subtitle = location.access_days_time;
    }

    return subtitle;
  };

  render() {
    const { locations, position } = this.props.navigation.state.params;

    return (
      <Container>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
        >
          {locations.map(location => {
            const [longitude, latitude] = location.location.coordinates;
            return (
              <MapView.Marker
                key={location._id}
                coordinate={{ latitude, longitude }}
              >
                <MapView.Callout
                  style={mapCalloutStyles.calloutContainer}
                  tooltip
                  onPress={() => this.goToLocationDetails(location)}
                >
                  <MapCallout
                    title={location.station_name}
                    description={this.subTitle(location)}
                  />
                </MapView.Callout>
              </MapView.Marker>
            );
          })}
        </MapView>
        <FloatingButton icon="list" onPress={this.replaceScreen} />
      </Container>
    );
  }
}

NearMeMap.propTypes = {
  navigation: PropTypes.object,
};

export default NearMeMap;
