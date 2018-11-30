import { Navigation } from "react-native-navigation";
import Feed from "./src/components/Feed";
import Login from "./src/screens/Login";
import { AsyncStorage } from "react-native";
import AluraLingua from "./src/screens/AluraLingua";

Navigation.registerComponent("Login", () => Login);
Navigation.registerComponent("Feed", () => Feed);
Navigation.registerComponent("AluraLingua", () => AluraLingua);
Navigation.registerComponent('PerfilUsuario', () => Feed);

AsyncStorage.getItem("token")
  .then(token => {
    if (token) {
      return {
        screen: "Feed",
        title: "Instalura"
      };
    }

    return {
      screen: "Login",
      title: "Login"
    };
  })
  .then(screen => Navigation.startSingleScreenApp({ screen }));

Navigation.startSingleScreenApp({
  screen: {
    screen: "Login",
    title: "Login"
  }
});
