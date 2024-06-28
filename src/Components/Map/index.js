import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import PropTypes from 'prop-types'

const containerStyle = {
  width: '400px',
  height: '400px'
}

const center = {
  lat: -3.745,
  lng: -38.523
}

export const Map = ({ points }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.MAP_KEY
  })

  const [, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={7}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <>
        {points.map((point) => (
          <Marker
            key={point._id}
            position={{
              lat: point.lat,
              lng: point.lng
            }}
          />
        ))}
      </>
    </GoogleMap>
  ) : (
    <></>
  )
}

Map.propTypes = {
  points: PropTypes.array.isRequired
}
