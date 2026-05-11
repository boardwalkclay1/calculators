export function createSecretEngine(config) {
  const {
    onOpenContactsVault,
    onOpenContactsEntry,
    onOpenPicturesVault,
    onOpenCameraMode,
    onOpenVoiceVault,
    onToggleRecording
  } = config;

  return function handleSequence(seq) {
    // Contacts calculator
    if (onOpenContactsEntry && seq.endsWith("00")) {
      onOpenContactsEntry();
    }
    if (onOpenContactsVault && seq.endsWith("**")) {
      onOpenContactsVault();
    }

    // Pictures calculator
    if (onOpenCameraMode && seq.endsWith("00")) {
      onOpenCameraMode();
    }
    if (onOpenPicturesVault && seq.endsWith("**")) {
      onOpenPicturesVault();
    }

    // Voice calculator
    if (onToggleRecording && seq.endsWith("456")) {
      onToggleRecording();
    }
    if (onOpenVoiceVault && seq.endsWith("**")) {
      onOpenVoiceVault();
    }
  };
}
