import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import * as dataForge from "data-forge";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2FxdXR0cm8iLCJhIjoiY2thN3FicnkzMDZwcjJycWQzNTBuYW5tOSJ9.5cuZ0Th6f_KjECCIyvGANg";
const FILE_GeoJSON = "./Place_PenguinList.geojson";
const FILE_enkan_latlon = "./enkan_latlon_GSI.csv";
const FILE_data_enkans = "./JAZA_data_enkans.csv";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 138,
      lat: 37,
      zoom: 3.5,
      isFileLoaded: false,
      dropdownPlace: [],
      dropdownPlaceSelected: "すべて",
      checkboxPenguin: new Map(),
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
    // ファイル読み込み
    Promise.all([this.read_enkan_latlon(), this.read_data_enkans()]).then(
      () => {
        this.setState({ isFileLoaded: true });
      }
    );

    this.createMap();
  }

  render() {
    let checkboxPenguin; // チェックボックス（ペンギン）
    let dropdownPlace; // ドロップダウンリスト（動物園・水族館名）

    if (this.state.isFileLoaded) {
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
                <option value={item}>{item}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      );

      // チェックボックス（ペンギン）を用意する
      console.log(Array.from(this.state.checkboxPenguin.values()));
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
                label={key.replace("ペンギン", "")}
                onChange={this.checkboxPenguinChanged}
              />
            );
          })}
        </Form>
      );
    }

    return (
      <Container>
        <Row>
          <Col md={10}>
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
            <h5>絞り込み</h5>
            {dropdownPlace}
            ペンギン
            {checkboxPenguin}
          </Col>
        </Row>
      </Container>
    );
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
    this.state.dropdownPlace = ["すべて", ...this.places];
    this.state.dropdownPlaceSelected = "すべて";
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
    this.state.checkboxPenguin.set("すべて", true);
    for (let penguin of this.penguins) {
      this.state.checkboxPenguin.set(penguin, true);
    }
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
      this.map.addSource("place", {
        type: "geojson",
        data: FILE_GeoJSON,
      });
      this.map.addLayer({
        id: "place",
        type: "circle",
        source: "place",
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
    });

    // move時の処理を登録
    this.map.on("move", () => {
      this.setState({
        lng: this.map.getCenter().lng,
        lat: this.map.getCenter().lat,
        zoom: this.map.getZoom(),
      });
    });
  }

  /**
   * イベントハンドラ
   * @param {*} event
   */
  dropdownPlaceChanged(event) {
    const selected = event.target.value;
    this.setState({ dropdownPlaceSelected: selected });

    // マップにフィルタを適用
    if (this.map.loaded()) {
      if (selected === "すべて") {
        this.map.setFilter("place", null);
      } else {
        this.map.setFilter("place", ["==", ["get", "place"], selected]);
      }
    }
  }

  /**
   * イベントハンドラ
   * @param {*} event
   */
  checkboxPenguinChanged(event) {
    const state = this.state.checkboxPenguin;
    state.set(event.target.value, !state.get(event.target.value));
    if (event.target.value === "すべて") {
      state.forEach((val, key) => {
        state.set(key, event.target.checked);
      });
    }
    this.setState({ checkboxPenguin: state });

    // マップにフィルタを適用
    const checks = [];
    state.forEach((val, key) => {
      if (val) checks.push(key);
    });
    if (this.map.loaded()) {
      const places = this.df_data_enkans
        .where((row) => checks.includes(row.JP_Common_Name))
        .getSeries("commonname")
        .distinct()
        .toArray();
      this.map.setFilter("place", [
        "in",
        ["get", "place"],
        ["literal", places],
      ]);
    }
  }
}

export default App;
