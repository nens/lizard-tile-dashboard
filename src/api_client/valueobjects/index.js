import { AssetTimeseries, AssetTimeseriesDefinition } from './AssetTimeseries';
import { Bootstrap, BootstrapDefinition } from './Bootstrap';
import { LegendData, LegendDataDefinition } from './LegendData';
import { MeasuringStation, MeasuringStationDefinition } from './MeasuringStation';
import { ObservationType, ObservationTypeDefinition, DefaultObservationType } from './ObservationType';
import { Organisation, OrganisationDefinition } from './Organisation';
import { Parcel, ParcelDefinition } from './Parcel';
import { RasterAlarm, RasterAlarmDefinition } from './RasterAlarm';
import { RasterStore, RasterStoreDefinition } from './RasterStore';
import { RasterStoreDetail, RasterStoreDetailDefinition } from './RasterStoreDetail';
import { Timeseries, TimeseriesDefinition } from './Timeseries';
import { TimeseriesAlarm, TimeseriesAlarmDefinition } from './TimeseriesAlarm';
import { WmsInfo, WmsInfoDefinition } from './WmsInfo';

export const valueObjects = {
  AssetTimeseries: AssetTimeseries,
  Bootstrap: Bootstrap,
  LegendData: LegendData,
  MeasuringStation: MeasuringStation,
  ObservationType: ObservationType,
  Organisation: Organisation,
  Parcel: Parcel,
  RasterAlarm: RasterAlarm,
  RasterStore: RasterStore,
  RasterStoreDetail: RasterStoreDetail,
  Timeseries: Timeseries,
  TimeseriesAlarm: TimeseriesAlarm,
  WmsInfo: WmsInfo
};

export const valueObjectDefinitions = {
  AssetTimeseries: AssetTimeseriesDefinition,
  Bootstrap: BootstrapDefinition,
  LegendData: LegendDataDefinition,
  MeasuringStation: MeasuringStationDefinition,
  ObservationType: ObservationTypeDefinition,
  Organisation: OrganisationDefinition,
  Parcel: ParcelDefinition,
  RasterAlarm: RasterAlarmDefinition,
  RasterStore: RasterStoreDefinition,
  RasterStoreDetail: RasterStoreDetailDefinition,
  Timeseries: TimeseriesDefinition,
  TimeseriesAlarm: TimeseriesAlarmDefinition,
  WmsInfo: WmsInfoDefinition
};

export const valueObjectDefaults = {
  ObservationType: DefaultObservationType
};
