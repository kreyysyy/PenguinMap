import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import Plot from "react-plotly.js";

const FILE_GeoJSON = "./Place_PenguinList.geojson";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.SELECT_ALL = "＜全て＞";

    this.state = {
      lng: 136,
      lat: 37,
      zoom: 3.5,
      dropdownPlace: [],
      dropdownPlaceSelected: this.SELECT_ALL,
      checkboxPenguin: new Map().set(this.SELECT_ALL, true),
      geojson: null,
    };

    this.map = null;

    this.checkboxPenguinChanged = this.checkboxPenguinChanged.bind(this);
    this.dropdownPlaceChanged = this.dropdownPlaceChanged.bind(this);
  }

  componentDidMount() {
    this.createMap();
    this.readGeoJSON();
  }

  render() {
    let checkboxPenguin = null; // チェックボックス（ペンギン）
    let dropdownPlace = null; // ドロップダウンリスト（動物園・水族館名）

    // ドロップダウンリスト（動物園・水族館）を用意する
    dropdownPlace = (
      <Form>
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label>動物園・水族館</Form.Label>
          <Form.Control
            as="select"
            custom
            value={this.state.dropdownPlaceSelected}
            onChange={this.dropdownPlaceChanged}
          >
            {this.state.dropdownPlace.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    );

    // チェックボックス（ペンギン）を用意する
    checkboxPenguin = (
      <Form>
        <Form.Label>ペンギン</Form.Label>
        {Array.from(this.state.checkboxPenguin.keys()).map((key) => {
          const checked = this.state.checkboxPenguin.get(key);
          return (
            <Form.Check
              key={key}
              value={key}
              type="checkbox"
              checked={checked}
              label={key.replace(/ペンギン$/, "")}
              onChange={this.checkboxPenguinChanged}
            />
          );
        })}
      </Form>
    );

    return (
      <Container fluid>
        <Row>
          <Col xs={12} sm={8} md={9} lg={5} xl={6}>
            <div className="container-frame">
              {/** マップの<div>で装飾を行うと地図上でポップアップ位置がズレるため、外側の<div>で装飾する */}
              <div
                ref={(el) => (this.mapContainer = el)}
                className="map-container"
              />
              <div className="map-overlay">
                <div className="map-title">
                  <h5>ペンギンマップ</h5>
                  ペンギンがいる動物園・水族館
                </div>
                <div id="legend" className="map-legend">
                  飼育されているペンギンの種類数
                  <div className="map-legend-bar"></div>
                  <table className="map-legend-bar-text">
                    <tbody>
                      <tr>
                        <td align="left">1</td>
                        <td align="right">8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={4} sm={4} md={3} lg={3} xl={2}>
            <div className="container-frame">
              <div className="selector-container">
                {dropdownPlace}
                {checkboxPenguin}
              </div>
            </div>
          </Col>
          <Col xs={8} sm={12} md={12} lg={4} xl={4}>
            <GraphPenguinNumPerPlace
              geojson={this.state.geojson}
            ></GraphPenguinNumPerPlace>
            <GraphPlaceNumPerPenguin
              geojson={this.state.geojson}
            ></GraphPlaceNumPerPenguin>
          </Col>
        </Row>
      </Container>
    );
  }

  /**
   * GeoJSONファイルを読み込む
   */
  async readGeoJSON() {
    const response = await fetch(FILE_GeoJSON);
    const geojson = await response.json();
    console.log("read file: " + FILE_GeoJSON);

    // 動物園・水族館の配列
    const places = Array.from(
      new Set(geojson.features.map((x) => x.properties.place))
    ).sort();

    // ペンギンの配列
    const set = new Set();
    for (let f of geojson.features)
      for (let p of f.properties.penguin.split("_")) set.add(p);
    const penguins = Array.from(set).sort();

    // チェックボックスの状態を初期化
    const box = new Map();
    box.set(this.SELECT_ALL, true);
    for (let penguin of penguins) box.set(penguin, true);

    this.setState({
      geojson: geojson,
      // ドロップダウンリストの状態を初期化
      dropdownPlace: [this.SELECT_ALL, ...places],
      dropdownPlaceSelected: this.SELECT_ALL,
      // チェックボックスの状態を初期化
      checkboxPenguin: box,
    });
  }

  /**
   * マップを作成する
   */
  createMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: {
        version: 8,
        sources: {
          OSM: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "OSM",
            type: "raster",
            source: "OSM",
            //minzoom: 0,
            //maxzoom: 18,
          },
        ],
        glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
      },
      attributionControl: true,
      customAttribution: [
        'Map: © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        'Data: refer to <a href="https://www.jaza.jp/" target="_blank">JAZA (2020/12/7)</a>',
      ],
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });

    // load時の処理を登録
    this.map.on("load", () => {
      this.map.addSource("source-place", {
        type: "geojson",
        data: FILE_GeoJSON,
      });
      this.map.addLayer({
        id: "layer-place",
        type: "circle",
        source: "source-place",
        layout: {},
        paint: {
          "circle-stroke-width": 1,
          "circle-stroke-color": "black",
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "penguin_num"],
            1,
            "blue",
            4.5,
            "yellow",
            8,
            "red",
          ],
        },
      });
      this.map.addLayer({
        id: "layer-place-label",
        type: "symbol",
        source: "source-place",
        layout: {
          "text-field": ["format", ["get", "place"]],
          "text-anchor": "bottom",
          "text-radial-offset": 0.7,
          "text-font": ["Open Sans Regular"],
        },
        paint: {
          "text-halo-width": 2,
          "text-halo-color": "rgba(255, 255, 255, 255)",
        },
      });
    });

    // move時の処理を登録
    this.map.on("move", () => {
      this.setState({
        lng: this.map.getCenter().lng,
        lat: this.map.getCenter().lat,
        zoom: this.map.getZoom(),
      });
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    this.map.on("mouseenter", "layer-place", (e) => {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();

      const penguins = e.features[0].properties.penguin.split("_");
      const penguinsHTML =
        "<ul>" + penguins.map((x) => "<li>" + x + "</li>").join("") + "</ul>";
      const placeHTML = "<h6>" + e.features[0].properties.place + "</h6>";
      const description = placeHTML + penguinsHTML;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(this.map);
    });

    this.map.on("mouseleave", "layer-place", () => {
      this.map.getCanvas().style.cursor = "";
      popup.remove();
    });
  }

  /**
   * イベントハンドラ
   * @param {*} event
   */
  dropdownPlaceChanged(event) {
    const item = event.target.value;

    // マップにフィルタを適用
    if (this.map.loaded()) {
      if (item === this.SELECT_ALL) {
        this.map.setFilter("layer-place", null);
        this.map.setFilter("layer-place-label", null);
      } else {
        this.map.setFilter("layer-place", ["==", ["get", "place"], item]);
        this.map.setFilter("layer-place-label", ["==", ["get", "place"], item]);
      }
    }

    this.setState({ dropdownPlaceSelected: item });
  }

  /**
   * イベントハンドラ
   * @param {*} event
   */
  checkboxPenguinChanged(event) {
    // 状態を更新
    const boxState = this.state.checkboxPenguin;
    const item = event.target.value;
    const check = event.target.checked;
    boxState.set(item, !boxState.get(item));
    if (item === this.SELECT_ALL)
      for (let key of boxState.keys()) boxState.set(key, check);
    else if (check) {
      let isAllChecked = true;
      for (let [key, val] of boxState)
        if (key !== this.SELECT_ALL && val === false) {
          isAllChecked = false;
          break;
        }
      if (isAllChecked) boxState.set(this.SELECT_ALL, true);
    } else boxState.set(this.SELECT_ALL, false);

    // マップにフィルタを適用
    const placeSet = new Set();
    for (let [key, val] of boxState)
      if (val)
        for (let f of this.state.geojson.features)
          if (f.properties.penguin.includes(key))
            placeSet.add(f.properties.place);
    const places = Array.from(placeSet);
    if (this.map.loaded()) {
      this.map.setFilter("layer-place", [
        "in",
        ["get", "place"],
        ["literal", places],
      ]);
      this.map.setFilter("layer-place-label", [
        "in",
        ["get", "place"],
        ["literal", places],
      ]);
    }

    this.setState({ checkboxPenguin: boxState });
  }
}

/**
 * グラフ（飼育種類数）
 */
class GraphPenguinNumPerPlace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geojson: props.geojson,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ geojson: props.geojson });
  }

  render() {
    const geojson = this.state.geojson;
    if (geojson != null) {
      const features = [...geojson.features];
      features.sort(
        (a, b) => a.properties.penguin_num - b.properties.penguin_num
      );
      return (
        <div className="container-frame">
          <div className="graph-container">
            <Plot
              className="graph"
              ref={(el) => (this.graph = el)}
              data={[
                {
                  type: "bar",
                  x: features.map((x) => x.properties.penguin_num),
                  y: features.map((y) => y.properties.place),
                  orientation: "h",
                },
              ]}
              layout={{
                title: "飼育種類数",
                showlegend: false,
                margin: { t: 50 },
                height: 2000,
                xaxis: { side: "top" },
                yaxis: { automargin: true },
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>
      );
    } else return null;
  }
}

/**
 * グラフ（飼育館数）
 */
class GraphPlaceNumPerPenguin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geojson: props.geojson,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ geojson: props.geojson });
  }

  render() {
    const geojson = this.state.geojson;
    if (geojson != null) {
      const features = [...geojson.features];
      const penNum = new Map();
      for (let f of features) {
        let pens = f.properties.penguin.split("_");
        for (let pen of pens) {
          pen = pen.replace(/ペンギン$/, "");
          if (penNum.has(pen)) penNum.set(pen, penNum.get(pen) + 1);
          else penNum.set(pen, 0);
        }
      }
      const penNumArray = [];
      for (let [key, val] of penNum) penNumArray.push({ pen: key, num: val });
      penNumArray.sort((a, b) => a.num - b.num);
      return (
        <div className="container-frame">
          <div className="graph-container">
            <Plot
              className="graph"
              ref={(el) => (this.graph = el)}
              data={[
                {
                  type: "bar",
                  x: penNumArray.map((x) => x.num),
                  y: penNumArray.map((y) => y.pen),
                  orientation: "h",
                },
              ]}
              layout={{
                title: "飼育館数",
                showlegend: false,
                margin: { t: 50 },
                height: 400,
                xaxis: { side: "top" },
                yaxis: { automargin: true },
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>
      );
    } else return null;
  }
}

export default App;
