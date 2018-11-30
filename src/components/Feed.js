import React, { Component } from "react";
import { FlatList, StyleSheet, Button, AsyncStorage, View } from "react-native";
import { Dimensions } from "react-native";

import Post from "./Post";
import InstaluraFetchService from "../service/InstaluraFetchService";
import PropTypes from "prop-types";

import Notificacao from "../api/Notificacao";

import HeaderUsuario from "./HeaderUsuario";

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

    InstaluraFetchService.get("/fotos").then(json =>
      this.setState({ fotos: json })
    );

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

  like = async idFoto => {
    // const listaOriginal = this.state.fotos;
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
    console.warn(fotoAtualizada);
    this.atualizaFotos(fotoAtualizada);

    InstaluraFetchService.post(`/fotos/${idFoto}/like`).catch(() => {
      Notificacao.exibe("Ops..", "Algo deu errado ao curtir");
    });
    /*
    const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/like`;

    let token = await AsyncStorage.getItem("token");

    fetch(uri, {
      method: "POST",
      headers: new Headers({
        "X-AUTH-TOKEN": token
      })
    });
    */
  };

  buscaPorId = idFoto => {
    return this.state.fotos.find(foto => foto.id === idFoto);
  };

  atualizaFotos = fotoAtualizada => {
    const fotos = this.state.fotos.map(foto =>
      foto.id === fotoAtualizada.id ? fotoAtualizada : foto
    );
    this.setState({ fotos });
  };

  logout = () => {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("usuario");
    this.props.navigator.resetTo({
      screen: "Login",
      title: "Login"
    });
  };

  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    // const listaOriginal = this.state.fotos;

    if (!valorComentario) return;
    const foto = this.buscaPorId(idFoto);

    const comentario = {
      texto: valorComentario
    };

    // const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/comment`;

    // AsyncStorage.getItem("token")
    //   .then(token => {
    //     return {
    //       method: "POST",
    //       body: JSON.stringify({
    //         texto: valorComentario
    //       }),
    //       headers: new Headers({
    //         "Content-type": "application/json",
    //         "X-AUTH-TOKEN": token
    //       })
    //     };
    //   })
    //   .then(requestInfo => fetch(uri, requestInfo))
    //   .then(resposta => resposta.json())
    //   .then(comentario => [...foto.comentarios, comentario])
    //   .then(novaLista => {
    //     const fotoAtualizada = {
    //       ...foto,
    //       comentarios: novaLista
    //     };

    //     const fotos = this.atualizaFotos(fotoAtualizada);
    //     console.warn(fotos);
    //     this.setState({ fotos });
    //     inputComentario.clear();
    //   })
    //   .catch(err => alert(err));

    InstaluraFetchService.post(`/fotos/${idFoto}/comment`, comentario)
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista
        };
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(() => {
        Notificacao.exibe("Ops..", "Algo deu errado ao comentar");
      });
  };

  verPerfilUsuario = idFoto => {
    const foto = this.buscaPorId(idFoto);
    this.props.navigator.push({
      screen: "PerfilUsuario",
      title: foto.loginUsuario,
      backButtonTitle: "",
      passProps: {
        usuario: foto.loginUsuario,
        fotoDePerfil: foto.urlPerfil
      }
    });
  };

  exibeHeader() {
    if (this.props.usuario) {
      return (
        <HeaderUsuario {...this.props} fotoDePerfil={this.state.fotos.length} />
      );
    }
  }

  render() {
    return (
      <View>
        <Button title="Sair bla" onPress={this.logout} />
        {this.exibeHeader()}
        <FlatList
          style={styles.container}
          keyExtractor={item => item.id + ""}
          data={this.state.fotos}
          renderItem={({ item }) => (
            <Post
              foto={item}
              likeCallback={this.like}
              comentarioCallback={this.adicionaComentario}
              verPerfilCallback={this.verPerfilUsuario}
            />
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

Feed.propTypes = {
  navigator: PropTypes.object
};
