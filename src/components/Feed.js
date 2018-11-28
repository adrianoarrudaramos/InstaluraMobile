import React, { Component } from "react";
import { FlatList, StyleSheet, Button, AsyncStorage, View } from "react-native";
import { Dimensions } from "react-native";

import Post from "./Post";

const width = Dimensions.get("screen").width;

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: []
    };
  }

  componentDidMount() {
    const uri = "https://instalura-api.herokuapp.com/api/fotos";

    //fetch("http://instalura-api.herokuapp.com/api/public/fotos/rafael")
    //  .then(resposta => resposta.json())
    //  .then(json => this.setState({ fotos: json }));
    //this.props.navigator.showModal({
    //  screen: "AluraLingua",
    //  title: "ALuraLingua"
    //});

    AsyncStorage.getItem("token")
      .then(token => {
        return {
          headers: new Headers({
            "X-AUTH-TOKEN": token
          })
        };
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(json => this.setState({ fotos: json }))
      .catch(err => {
        throw err;
      });
  }

  // like = (idFoto) => {
  like = async idFoto => {
    const foto = this.buscaPorId(idFoto);

    let usuarioLogado = await AsyncStorage.getItem("usuario");

    let novaLista = [];
    if (!foto.likeada) {
      novaLista = [...foto.likers, { login: usuarioLogado }];
    } else {
      novaLista = foto.likers.filter(liker => {
        return liker.login !== usuarioLogado;
      });
    }

    const fotoAtualizada = {
      ...foto,
      likeada: !foto.likeada,
      likers: novaLista
    };
    this.setState({ foto: fotoAtualizada });

    const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/like`;

    let token = await AsyncStorage.getItem("token");

    fetch(uri, {
      method: "POST",
      headers: new Headers({
        "X-AUTH-TOKEN": token
      })
    });
  };

  buscaPorId = idFoto => {
    return this.state.fotos.find(foto => foto.id === idFoto);
  };

  atualizaFotos = fotoAtualizada => {
    return this.state.fotos.map(foto =>
      foto.id === fotoAtualizada.id ? fotoAtualizada : foto
    );
  };

  logout = () => {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("usuario");
    this.props.navigator.resetTo({
      screen: "Login",
      title: "Login"
    });
  };

  render() {
    return (
      <View>
        <Button title="Sair" onPress={this.logout} />
        <FlatList
          style={styles.container}
          keyExtractor={item => item.id + ""}
          data={this.state.fotos}
          renderItem={({ item }) => (
            <Post foto={item} likeCallback={this.like} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  cabecalho: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  fotoDePerfil: {
    marginRight: 10,
    borderRadius: 20,
    width: 40,
    height: 40
  },
  foto: {
    width: width,
    height: width
  }
});
