import { PrimaryButton, GhostButton } from "../ui/Button";
export function CreateQuoteBtn({ onPress }: { onPress: () => void }) {
  return <PrimaryButton title="Create New Quotation" onPress={onPress} />;
}
export function CreateOrderBtn({ onPress }: { onPress: () => void }) {
  return <GhostButton title="Create New Order" onPress={onPress} />;
}
export function ScheduleTestDriveBtn({ onPress }: { onPress: () => void }) {
  return <GhostButton title="Schedule Test Drive" onPress={onPress} />;
}
