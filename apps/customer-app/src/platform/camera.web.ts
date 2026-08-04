export interface CameraAdapter {
  isAvailable: boolean;
  requestPermission: () => Promise<boolean>;
}

export const cameraAdapter: CameraAdapter = {
  isAvailable: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
  requestPermission: async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) return false;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (e) {
      return false;
    }
  },
};
