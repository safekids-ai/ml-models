export interface DeviceProfileConfig {
  lowProfile: DeviceProfileConfigItem
  mediumProfile: DeviceProfileConfigItem
  highProfile: DeviceProfileConfigItem
}
export interface DeviceProfileConfigItem {
  'ml-enabled': boolean,
  'nlp-enabled': boolean,
  'ml-threshold-min': number,
  'ml-threshold-max': number,
  'ml-model': string,
  'ml-limit-min': number,
  'ml-limit-max': string,

  'nlp-threshold-min': number,
  'nlp-threshold-max': number,
  'nlp-model': string,
  'nlp-limit-min': number,
  'nlp-limit-max': string,

  'pr-enabled': boolean,
}

export default () => ({
  deviceProfileConfig: {
    lowProfile: {
      'ml-enabled': true,
      'ml-threshold-min': 5,
      'ml-threshold-max': 5,
      'ml-model': 'yolov5',
      'ml-limit-min': 5,
      'ml-limit-max': '10%',

      'nlp-enabled': false,
      'nlp-threshold-min': 5,
      'nlp-threshold-max': 5,
      'nlp-model': 'test',
      'nlp-limit-min': 5,
      'nlp-limit-max': '10%',

      'pr-enabled': true,
    } as DeviceProfileConfigItem,
    mediumProfile: {
      'ml-enabled': true,
      'ml-threshold-min': 3,
      'ml-threshold-max': 10,
      'ml-model': 'yolov5',
      'ml-limit-min': 3,
      'ml-limit-max': '20%',

      'nlp-enabled': false,
      'nlp-threshold-min': 3,
      'nlp-threshold-max': 10,
      'nlp-model': 'test',
      'nlp-limit-min': 3,
      'nlp-limit-max': '20%',

      'pr-enabled': true,
    } as DeviceProfileConfigItem,
    highProfile: {
      'ml-enabled': true,
      'ml-threshold-min': 2,
      'ml-threshold-max': 20,
      'ml-model': 'yolov5',
      'ml-limit-min': 1,
      'ml-limit-max': '50%',

      'nlp-enabled': true,
      'nlp-threshold-min': 2,
      'nlp-threshold-max': 30,
      'nlp-model': 'test',
      'nlp-limit-min': 3,
      'nlp-limit-max': '50%',

      'pr-enabled': true,
    } as DeviceProfileConfigItem,
  } as DeviceProfileConfig
});
