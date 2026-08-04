import { Camera, CameraType, PermissionStatus } from 'expo-camera';

export interface CameraAdapter {
  isAvailable: boolean;
  requestPermission: () => Promise<boolean>;
}

export const cameraAdapter: CameraAdapter = {
  isAvailable: true,
  requestPermission: async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === PermissionStatus.GRANTED;
  },
};
