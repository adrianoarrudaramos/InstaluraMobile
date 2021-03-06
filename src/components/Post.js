import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import InputComentario from "./InputComentario";
import Likes from "./Likes";

const width = Dimensions.get("screen").width;

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foto: this.props.foto,
      valorComentario: ""
    };
  }

  // adicionaComentario = (idFoto, valorComentario, inputComentario) => {
  //   if (!valorComentario) return;

  //   const foto = this.buscaPorId(idFoto);

  //   const novaLista = [
  //     ...foto.comentarios,
  //     {
  //       id: valorComentario,
  //       login: "meuUsuario",
  //       texto: valorComentario
  //     }
  //   ];

  //   const fotoAtualizada = {
  //     ...this.state.foto,
  //     comentarios: novaLista
  //   };

  //   this.setState({ foto: fotoAtualizada });
  //   inputComentario.clear();
  // };

  exibeLikes(likers) {
    if (likers.length <= 0) return;

    return (
      <Text style={styles.likes}>
        {likers.length} {likers.length > 1 ? "curtidas" : "curtida"}
      </Text>
    );
  }

  exibeLegenda(foto) {
    if (foto.comentario === "") return;

    return (
      <View style={styles.comentario}>
        <Text style={styles.tituloComentario}>{foto.loginUsuario}</Text>
        <Text>{foto.comentario}</Text>
      </View>
    );
  }

  render() {
    const {
      foto,
      likeCallback,
      comentarioCallback,
      verPerfilCallback
    } = this.props;

    return (
      <View>
        <View>
          <TouchableOpacity
            style={styles.cabecalho}
            onPress={() => verPerfilCallback(foto.id)}
          >
            <Image
              source={{ uri: foto.urlPerfil }}
              style={styles.fotoDePerfil}
            />
            <Text>{foto.loginUsuario}</Text>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: foto.urlFoto }} style={styles.foto} />
        <View style={styles.rodape} />
        <Likes foto={foto} likeCallback={likeCallback} />
        {this.exibeLegenda(foto.likers)}
        {foto.comentarios.map(comentario => (
          <View key={comentario.id} style={styles.comentario}>
            <Text style={styles.tituloComentario}>{comentario.login}</Text>
            <Text>{comentario.texto}</Text>
          </View>
        ))}

        <InputComentario
          idFoto={foto.id}
          comentarioCallback={comentarioCallback}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  rodape: {
    margin: 10
  }
});

Post.propTypes = {
  foto: PropTypes.object,
  likeCallback: PropTypes.func
};
