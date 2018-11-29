import { ToastAndroid } from "react-native";

export default class Notificacao {
  static exibe(titulo, msg) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
}
