import { HomeScreen } from "./Screens";
import StackNavigator from "./StackNavigator";

export default function NavigationPage() {
  return (
    <div>
      <StackNavigator initialScreen={HomeScreen} />
    </div>
  );
}
