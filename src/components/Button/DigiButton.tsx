import { Button, GestureResponderEvent } from "react-native";

interface DigiButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function DigiButton({ title, onPress }: DigiButtonProps) {
  return <Button title={title} onPress={onPress} />;
}
