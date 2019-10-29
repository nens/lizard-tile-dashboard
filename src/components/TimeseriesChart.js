import React, { Component } from "react";
// import ReactDOM from "react-dom"; re-anbale for Plot hack??
import { connect } from "react-redux";
import {
  getRasterEvents,
  getTimeseriesEvents
} from "../actions";
import { MAX_TIMESERIES_POINTS } from "../config";
import { getNow, getCurrentPeriod } from "../reducers";

import { makeGetter } from "../api_client/index";
import plotComponentFactory from "react-plotly.js/factory";

import {
  axisLabel,
  indexForType,
  combineEventSeries
} from "./TimeseriesChartUtils.js";

const MODE_BAR_BUTTONS_TO_REMOVE = [
  // Nice to have, always work as expected:
  ///////////////////////////////////////////////////////////////////////
  // 'toImage'               /* Download plot as png */,
  "sendDataToCloud" /* Edit in chart studio */,

  // Mutual exclusive; comment 0 or all 4:
  ///////////////////////////////////////////////////////////////////////
  "zoom2d",
  "pan2d",
  "select2d",
  "lasso2d",

  // Mutual exclusive; Comment 0 or both:
  ///////////////////////////////////////////////////////////////////////
  "zoomIn2d",
  "zoomOut2d",

  // Used to reset scaling (=achieved via zoomIn2d/zoomOut2d):
  ///////////////////////////////////////////////////////////////////////
  //'resetScale2d',

  // Mutual exclusive; comment 0 or both:
  ///////////////////////////////////////////////////////////////////////
  "hoverClosestCartesian" /* Show closest data on hover */,
  "hoverCompareCartesian" /* Compare data on hover */,

  "toggleSpikelines"
];

class TimeseriesChartComponent extends Component {
  /////////////////////////////////////////////////////////////////////////////
  // Component - lifecycle functions //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  constructor(props) {
    super(props);
    // Initially get the timeseries events
    this.updateTimeseries();
  }

  observationType = (timeseriesUuid) => {
    const timeseries = this.props.timeseriesEvents.find(event => event.uuid === timeseriesUuid);

    return timeseries && timeseries.observation_type;
  }

  componentDidUpdate() {
    // This is safe because the actions in actions.js check if the
    // data is still up to date
    // this.updateTimeseries();
  }

  shouldComponentUpdate(nextProps) {
    // Only update if actual data changed for speed, otherwise
    // React constantly thinks we need updating
    // Note that the component is only shown if all assets are present,
    // so we don't have to check that. Alarms we do.
    const {
      alarms,
      now,
      start,
      end,
      plotlyData,
      isFull,
      height,
      width
    } = this.props;
    const nextAlarms = nextProps.alarms;
    const nextNow = nextProps.now;
    const nextStart = nextProps.start;
    const nextEnd = nextProps.end;
    const nextPlotlyData = nextProps.plotlyData;
    const nextIsFull = nextProps.isFull;
    const nextHeight = nextProps.height;
    const nextWidth = nextProps.width;

    // The following if statements are split for debugging purposes

    if (isFull !== nextIsFull || height !== nextHeight || width !== nextWidth) {
      return true;
    }

    if (alarms !== nextAlarms) {
      return true;
    }

    if (now !== nextNow) {
      return true;
    }

    if (start !== nextStart) {
      return true;
    }

    if (end !== nextEnd) {
      return true;
    }

    // Check if plotlyData changed.
    if (plotlyData.length !== nextPlotlyData.length) {
      return true;
    }

    for (let i=0; i < plotlyData.length; i++) {
      // Assume that if data changes, that the length of the array changes
      // or x or y value of the first data item.
      const events = plotlyData[i];
      const nextEvents = nextPlotlyData[i];
      if (!events || !nextEvents) {
        // Update if their boolean value changed
        if (!!events !== !!nextEvents) {
          return true;
        }
      }

      if (events && nextEvents) {
        // x is an array of Data objects
        const x = events.x;
        const nextX = nextEvents.x;

        if (x.length !== nextX.length) {
          return true;
        }

        if (x.length > 0 && (x[0].getTime() !== nextX[0].getTime())) {
          return true;
        }

        // y is an array of numbers, as strings with a fixed number of decimals
        const y = events.y;
        const nextY = nextEvents.y;
        if (y.length !== nextY.length) {
          return true;
        }
        if (y.length > 0 && (y[0] !== nextY[0])) {
          return true;
        }
      }
    }

    return false;
  }

  /////////////////////////////////////////////////////////////////////////////
  // Component - custom functions /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  updateTimeseries() {
    const {
      tile,
      rastersForTile
    } = this.props;

    (tile.timeseries || []).map(uuid =>
      this.props.getTimeseriesEvents(uuid, this.props.start, this.props.end, {
        minpoints: MAX_TIMESERIES_POINTS
      })
    );

    (tile.rasterIntersections || []).map(intersection =>
      this.props.getRasterEvents(
        rastersForTile[intersection.uuid],
        intersection.geometry,
        this.props.start,
        this.props.end
      )
    );
  }

  isRelevantTimeseriesAlarm(alarm) {
    const { tile } = this.props;

    return (
      alarm.isTimeseriesAlarm() &&
      tile.timeseries.indexOf(alarm.timeseries.uuid) !== -1
    );
  }

  isRelevantRasterAlarm(alarm) {
    const {
      tile,
      rastersForTile
    } = this.props;

    if (!tile.rasterIntersections) return false;

    return (
      !alarm.isTimeseriesAlarm() &&
      tile.rasterIntersections.some(rasterIntersection => {
        const raster = rastersForTile[rasterIntersection.uuid];
        return (
          raster &&
          alarm.sameIntersection(raster.url, rasterIntersection.geometry)
        );
      })
    );
  }

  alarmReferenceLines() {
    const {
      alarms,
      isFull,
      observationTypes
    } = this.props;

    if (!alarms.data || !alarms.data.length) {
      return null;
    }

    // Select those alarms that are related to one of the timeseries on
    // this tile.
    const relevantAlarms = alarms.data.filter(
      alarm =>
        this.isRelevantTimeseriesAlarm(alarm) ||
             this.isRelevantRasterAlarm(alarm)
    );

    const shapes = [];
    const annotations = [];

    relevantAlarms.forEach(alarm => {
      // A timeseriesAlarm can have multiple thresholds, make a reference line
      // for each.
      return alarm.thresholds.forEach(threshold => {
        let color;

        if (
          alarm.warning_threshold &&
          alarm.warning_threshold.value === threshold.value
        ) {
          color = "red";
        } else {
          color = "#888";
        }

        // Figure out which Y axis the value is on so we know where to plot it
        // The TimeseriesAlarm also have an ObservationType itself, it should be exactly
        // the same as that of the timeseries, but I think using the timeseries' observation
        // type is more robust as we used those to construct the Y axes.
        const observationType = alarm.isTimeseriesAlarm()
                              ? this.observationType(alarm.timeseries.uuid)
                              : alarm.observation_type;

        const axisIndex = indexForType(observationTypes, observationType);

        if (axisIndex === 0 || axisIndex === 1) {
          shapes.push({
            type: "line",
            layer: "above",
            xref: "paper",
            x0: 0,
            x1: 1,
            yref: axisIndex === 0 ? "y" : "y2",
            y0: threshold.value,
            y1: threshold.value,
            line: {
              color: color,
              width: isFull ? 2 : 1,
              dash: "dot"
            }
          });
        }
      });
    });

    return { shapes, annotations };
  }

  getThresholdLine(threshold, yref) {
    return {
      type: "line",
      layer: "above",
      x0: 0,
      x1: 1,
      xref: "paper",
      yref: yref,
      y0: parseFloat(threshold.value),
      y1: parseFloat(threshold.value),
      line: {
        width: 2,
        color: threshold.color
      }
    };
  }

  getThresholdAnnotation(threshold, yref) {
    return {
      text: " " + threshold.label + " ",
      bordercolor: threshold.color,
      xref: "paper",
      x0: 0,
      x1: 1,
      yanchor: "bottom",
      yref: yref,
      y: parseFloat(threshold.value),
      showarrow: false
    };
  }

  getAnnotationsAndShapes(thresholds) {
    const {
      isFull,
      observationTypes
    } = this.props;

    let annotations = [];
    let shapes = [];
    let thresholdLines, thresholdAnnotations;

    // Return lines for alarms and for "now".
    const now = new Date(this.props.now).getTime();
    const alarmReferenceLines = this.alarmReferenceLines();

    if (thresholds) {
      thresholdLines = thresholds.map(th => {
        // Welke y as?
        let yref;
        if (observationTypes.length === 2 &&
            observationTypes[1].unit === th.unitReference) {
          yref = "y2";
        } else {
          yref = "y";
        }

        return this.getThresholdLine(th, yref);
      });

      thresholdAnnotations = thresholds.map(th => {
        // Welke y as?
        let yref;
        if (observationTypes.length === 2 &&
            observationTypes[1].unit === th.unitReference) {
          yref = "y2";
        } else {
          yref = "y";
        }
        return this.getThresholdAnnotation(th, yref);
      });
    }

    if (alarmReferenceLines) {
      annotations = alarmReferenceLines.annotations;
      shapes = alarmReferenceLines.shapes;
    }

    const nowLine = {
      type: "line",
      layer: "above",
      x0: now,
      x1: now,
      yref: "paper",
      y0: 0,
      y1: 1,
      line: {
        color: "black",
        width: isFull ? 2 : 1
      }
    };

    const nowAnnotation = {
      text: " NOW ",
      bordercolor: "black",
      x: now,
      xanchor: "right",
      yref: "paper",
      y: 1,
      yanchor: "top",
      showarrow: false
    };

    if (thresholds) {
      thresholdLines.forEach(thLine => {
        shapes.push(thLine);
      });
      thresholdAnnotations.forEach(thAnnot => {
        annotations.push(thAnnot);
      });
    }

    annotations.push(nowAnnotation);
    shapes.push(nowLine);

    return { annotations, shapes };
  }

  getYAxis(idx) {
    const {
      observationTypes
    } = this.props;

    if (idx >= observationTypes.length) return null;

    const observationType = observationTypes[idx];

    const isRatio = observationType.scale === "ratio";

    const yaxis = {
      title: axisLabel(observationType),
      type: "linear",
      rangemode: isRatio ? "tozero" : "normal",
      side: idx === 0 ? "left" : "right",
      overlaying: idx === 1 ? "y" : undefined,
      //      showspikes: true,
      //      spikemode: 'toaxis+across+marker',
      ticks: "outside",
      showgrid: idx === 0,
      zeroline: isRatio
    };

    if (isRatio) {
      yaxis.tick0 = 0;
    }

    return yaxis;
  }

  getLayout(thresholds = null) {
    const {
      width, height, isFull, showAxis, start, end
    } = this.props;

    // We have a bunch of lines with labels, the labels are annotations and
    // the lines are shapes, that's why we have one function to make them.
    // Only full mode shows the labels.
    const annotationsAndShapes = this.getAnnotationsAndShapes(thresholds);

    let margin = {};

    if (isFull || showAxis) {
      margin = {
        t: 20,
        l: 50,
        r: 50,
        b: 40
      };
    } else {
      margin = {
        t: 5,
        l: 5,
        r: 5,
        b: 5
      };
    }

    return {
      width: width,
      height: height,
      yaxis: {
        ...this.getYAxis(0),
        visible: showAxis
      },
      yaxis2: {
        ...this.getYAxis(1),
        visible: showAxis
      },
      showlegend: isFull,
      legend: {
        x: 0.02,
        borderwidth: 1
      },
      margin: margin,
      xaxis: {
        visible: showAxis,
        type: "date",
        showgrid: true,
        range: [start, end]
      },
      shapes: annotationsAndShapes.shapes,
      annotations: isFull ? annotationsAndShapes.annotations : []
    };
  }

  render() {
    const {
      isFull,
      tile
    } = this.props;

    return isFull ?
           this.renderFull(this.getLayout(tile.thresholds))
         : this.renderTile(this.getLayout());
  }

  renderFull(plotlyLayout) {
    const {
      plotlyData,
      marginTop,
      marginLeft,
      width,
      height
    } = this.props;

    const Plot = plotComponentFactory(window.Plotly);

    return (
      <div
        style={{
          marginTop,
          marginLeft,
          width,
          height
        }}
      >
        <Plot
          data={plotlyData}
          layout={plotlyLayout}
          config={{
            displayModeBar: true,
            modeBarButtonsToRemove: MODE_BAR_BUTTONS_TO_REMOVE
          }}
        />
      </div>
    );
  }

  renderTile(plotlyLayout) {
    const {
      plotlyData
    } = this.props;

    if (!this.props.height || !this.props.width || !window.Plotly) {
      return null;
    }

    const Plot = plotComponentFactory(window.Plotly);

    return (
      <div>
        <Plot
          data={plotlyData}
          layout={plotlyLayout}
          config={{ displayModeBar: false }}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    tile,
    isFull
  } = ownProps;

  const currentPeriod = getCurrentPeriod(state, tile);
  const start = currentPeriod.start;
  const end = currentPeriod.end;

  const rastersForTile = new Map();
  const observationTypes = [];
  const timeseriesEvents = [];
  const rasterEvents = [];

  (tile.timeseries || []).forEach(timeseriesUuid => {
    const timeseries = state.timeseries[timeseriesUuid];
    const events = state.timeseriesEvents[timeseriesUuid];
    const observationType = timeseries.observation_type;

    let axisId = indexForType(observationTypes, observationType);

    if (axisId === -1) {
      axisId = observationTypes.length;
      if (axisId >= 2) {
        // Already full
        console.error(
          "Can't have a third Y axis for timeseries",
          timeseries
        );
        return;
      }
      observationTypes.push(observationType);
    }

    if (events && events.events) {
      timeseriesEvents.push({
        uuid: timeseriesUuid,
        axisId: axisId,
        observation_type: observationType,
        events: events.events
      });
    }
  });

  const getRaster = makeGetter(state.rasters);
  (tile.rasterIntersections || []).forEach(intersection => {
    const raster = getRaster(intersection.uuid).object;
    rastersForTile[intersection.uuid] = raster;
    const observationType = raster.observation_type;

    let axisId = indexForType(observationTypes, observationType);
    if (axisId === -1) {
      axisId = observationTypes.length;
      if (axisId >= 2) {
        // Already full
        console.error(
          "Can't have a third Y axis for raster",
          raster
        );
        return;
      }
      observationTypes.push(observationType);
    }

    const allEvents = state.rasterEvents;
    const geometry = intersection.geometry;
    const geomKey = `${geometry.coordinates[0]}-${geometry.coordinates[1]}`;

    if (allEvents[raster.uuid] && allEvents[raster.uuid][geomKey]) {
      const events = allEvents[raster.uuid][geomKey];
      if (events.start === start && events.end === end && events.events) {
        rasterEvents.push({
          uuid: raster.uuid,
          axisId: axisId,
          observation_type: observationType,
          events: events.events
        });
      }
    }
  });

  const plotlyData = combineEventSeries(
    timeseriesEvents.concat(rasterEvents),
    tile.colors,
    isFull,
    tile.legendStrings
  );

  return {
    rastersForTile,
    observationTypes,
    timeseriesEvents,
    rasterEvents,
    alarms: state.alarms,
    now: getNow(state, tile),
    start,
    end,
    plotlyData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTimeseriesEvents: (uuid, start, end) =>
      dispatch(getTimeseriesEvents(uuid, start, end)),
    getRasterEvents: (raster, geometry, start, end) =>
      dispatch(getRasterEvents(raster, geometry, start, end))
  };
}

const TimeseriesChart = connect(mapStateToProps, mapDispatchToProps)(
  TimeseriesChartComponent
);

export default TimeseriesChart;
