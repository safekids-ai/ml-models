export interface EventConfig {
  imageThumbnailSize: {width: number, height: number}
  imageBlurredSize: {width: number, height: number}
  imageBlurredSignma: number
  numberOfEventsToRetrieve: number
  positiveEventsForGroup: number
}

export default () => ({
  eventConfig: {
    imageThumbnailSize: {width: 120, height: 67},
    imageBlurredSize: {width: 480, height: 270},
    imageBlurredSignma: 4,
    numberOfEventsToRetrieve: 5,
    positiveEventsForGroup: 3,
  } as EventConfig
});
