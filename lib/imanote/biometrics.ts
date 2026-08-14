import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export type BiometricResult = "success" | "unavailable" | "cancelled" | "failed";

export async function canUseBiometrics() {
  if (Platform.OS === "web") return false;
  const [hardware, enrolled] = await Promise.all([LocalAuthentication.hasHardwareAsync(), LocalAuthentication.isEnrolledAsync()]);
  return hardware && enrolled;
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<BiometricResult> {
  if (!(await canUseBiometrics())) return "unavailable";
  const result = await LocalAuthentication.authenticateAsync({ promptMessage, disableDeviceFallback: true });
  if (result.success) return "success";
  return result.error === "user_cancel" ? "cancelled" : "failed";
}
