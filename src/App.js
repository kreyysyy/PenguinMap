import logo from './logo.svg';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = 'pk.eyJ1Ijoid2FxdXR0cm8iLCJhIjoiY2thN3FicnkzMDZwcjJycWQzNTBuYW5tOSJ9.5cuZ0Th6f_KjECCIyvGANg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={2}>
            <div className='sidebarStyle'>
              <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
            </div>
          </Col>
          <Col md={8}>
            <div ref={el => this.mapContainer = el} className='mapContainer' />
          </Col>
          <Col md={2}>
            <Form.Check
              type={'checkbox'}
              id={`default-${'checkbox'}`}
              label={`default ${'checkbox'}`}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App;
