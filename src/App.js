import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import * as dataForge from "data-forge";
import Plot from "react-plotly.js";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2FxdXR0cm8iLCJhIjoiY2thN3FicnkzMDZwcjJycWQzNTBuYW5tOSJ9.5cuZ0Th6f_KjECCIyvGANg";
const FILE_GeoJSON = "./Place_PenguinList.geojson";
const FILE_enkan_latlon = "./enkan_latlon_GSI.csv";
const FILE_data_enkans = "./JAZA_data_enkans.csv";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.SELECT_ALL = "＜全て＞";

    this.state = {
      lng: 138,
      lat: 37,
      zoom: 3.5,
      dropdownPlace: [],
      dropdownPlaceSelected: this.SELECT_ALL,
      checkboxPenguin: new Map().set(this.SELECT_ALL, true),
      geojson: null,
    };

    this.map = null;
    this.df_enkan_latlon = null;
    this.df_data_enkans = null;
    this.penguins = null;
    this.places = null;

    this.checkboxPenguinChanged = this.checkboxPenguinChanged.bind(this);
    this.dropdownPlaceChanged = this.dropdownPlaceChanged.bind(this);
  }

  componentDidMount() {
    this.createMap();
    // ファイル読み込み
    this.readGeoJSON();
    this.read_enkan_latlon();
    this.read_data_enkans();
  }

  render() {
    let checkboxPenguin = null; // チェックボックス（ペンギン）
    let dropdownPlace = null; // ドロップダウンリスト（動物園・水族館名）
    let graph1 = null; //グラフ（飼育種類数）
    let graph2 = null; // グラフ（飼育館数）

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

    // グラフ（飼育種類数）を用意する
    const geojson = this.state.geojson;
    if (geojson != null) {
      const features = [...geojson.features];
      features.sort(
        (a, b) => a.properties.penguin_num - b.properties.penguin_num
      );
      graph1 = (
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
              margin: { t: 40 },
              height: 2000,
            }}
            config={{ responsive: true }}
          />
        </div>
      );
    }

    // グラフ（飼育館数）を用意する
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
      graph2 = (
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
              margin: { t: 40 },
              height: 400,
            }}
            config={{ responsive: true }}
          />
        </div>
      );
    }

    return (
      <Container fluid>
        <Row>
          <Col md={8}>
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
                <div className="map-legend-bar-text">1 8</div>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="responsive-plot">
              <h5>絞り込み</h5>
              {dropdownPlace}
              ペンギン
              {checkboxPenguin}
            </div>
          </Col>
          <Col md={2}>
            {graph1}
            {graph2}
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

    this.setState({ geojson: geojson });
  }

  /**
   * CSVファイルをデータフレームに読み込む
   */
  async read_enkan_latlon() {
    const response = await fetch(FILE_enkan_latlon);
    const text = await response.text();
    this.df_enkan_latlon = dataForge.fromCSV(text);
    console.log("read file: " + FILE_enkan_latlon);

    // 場所のリストを作成
    this.places = this.df_enkan_latlon
      .getSeries("commonname")
      .distinct()
      .toArray();

    // ドロップダウンリストの状態を初期化
    this.setState({ dropdownPlace: [this.SELECT_ALL, ...this.places] });
    this.setState({ dropdownPlaceSelected: this.SELECT_ALL });
  }

  /**
   * CSVファイルをデータフレームに読み込む
   */
  async read_data_enkans() {
    const response = await fetch(FILE_data_enkans);
    const text = await response.text();
    this.df_data_enkans = dataForge.fromCSV(text);
    console.log("read file: " + FILE_data_enkans);

    // ペンギンのリストを作成
    this.penguins = this.df_data_enkans
      .getSeries("JP_Common_Name")
      .distinct()
      .toArray();

    // チェックボックスの状態を初期化
    const box = new Map();
    box.set(this.SELECT_ALL, true);
    for (let penguin of this.penguins) box.set(penguin, true);
    this.setState({ checkboxPenguin: box });
  }

  /**
   * マップを作成する
   */
  createMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
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
    const checks = [];
    boxState.forEach((val, key) => (val ? checks.push(key) : null));
    if (this.map.loaded()) {
      const places = this.df_data_enkans
        .where((row) => checks.includes(row.JP_Common_Name))
        .getSeries("commonname")
        .distinct()
        .toArray();
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

export default App;
