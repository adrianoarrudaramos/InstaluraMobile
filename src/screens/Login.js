import React, { Component } from "react";
import {
  Dimensions,
  View,
  TextInput,
  StyleSheet,
  Text,
  AsyncStorage,
  Button
} from "react-native";

const width = Dimensions.get("screen").width;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      usuario: "rafael",
      senha: "123456"
    };
  }

  efetuarLogin = () => {
    const uri = "https://instalura-api.herokuapp.com/api/public/login";
    //console.warn(this.state.usuario);
    //console.warn(this.state.senha);

    const requestInfo = {
      method: "POST",
      body: JSON.stringify({
        login: this.state.usuario,
        senha: this.state.senha
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    };

    fetch(uri, requestInfo)
      .then(response => {
        if (response.ok) return response.text();

        throw new Error("Não foi possíve efetuar login");
      })
      .then(token => {
        AsyncStorage.setItem("token", token);
        AsyncStorage.setItem("usuario", this.state.usuario);
        this.props.navigator.resetTo({
          screen: "Feed",
          title: "Instalura"
        });
        console.log(AsyncStorage.getItem("token"));
      })
      .catch(err => this.setState({ mensagem: err.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Instalura</Text>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            placeholder="Usuario..."
            onChangeText={texto => this.setState({ usuario: texto })}
            value={this.state.usuario}
          />
          <TextInput
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Senha..."
            onChangeText={texto => this.setState({ senha: texto })}
            value={this.state.senha}
          />
          <Button title="Login" onPress={this.efetuarLogin} />
        </View>
        <Text style={styles.mensagem}>{this.state.mensagem}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  form: {
    width: width * 0.8
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 26
  },
  mensagem: {
    marginTop: 15,
    color: "#e74c3c"
  }
});
