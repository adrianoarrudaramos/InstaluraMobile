import { AlertIOS } from "react-native";

export default class Notificacao {
  static exibe(titulo, msg) {
    AlertIOS.alert(titulo, msg);
  }
}
