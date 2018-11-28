import React, { Component } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

export default class AluraLingua extends Component {
  render() {
    return (
      <View>
        <Image source={require("../../resources/img/perfil-alura.jpg")} />
        <TouchableOpacity title="Aprenda Inglês">
          <Text>Aprenda Inglês</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
