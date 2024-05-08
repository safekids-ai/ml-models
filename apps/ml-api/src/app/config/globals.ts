import {float} from "@techstark/opencv-js";

export interface GlobalConfig {
  twoFactorEnabled: boolean,
  twoFactorExpirationDurationMinutes: number,
  defaultCaptureResolution: {
    _id: string,
    widthPx: number,
    heightPx: number,
  },
  defaultCaptureFPS: float,
  defaultVideoCaptureFPS: float,
  maxLoginAttempts: number,
  resetPrevFailedAttemptsMinutes: number,
  resendDetectionNotificationMinutes: number,
  targetDesktopBuild: number,
  defaultCaptureInterval: number,
}

export default () => ({
  globalConfig: {
    twoFactorEnabled: false,
    twoFactorExpirationDurationMinutes: 10,
    defaultCaptureResolution: {
      _id: '720p',
      widthPx: 1280,
      heightPx: 720,
    },
    defaultCaptureFPS: 0.033,
    defaultVideoCaptureFPS: 0.1,
    maxLoginAttempts: 3,
    resetPrevFailedAttemptsMinutes: 1440,
    resendDetectionNotificationMinutes: 60,
    targetDesktopBuild: 1,
    defaultCaptureInterval: 30,
  } as GlobalConfig
});
