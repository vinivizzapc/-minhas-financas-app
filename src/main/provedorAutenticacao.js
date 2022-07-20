import React from 'react';
import AuthService from '../app/service/authService';

export const AuthContext = React.createContext();
export const AuthConsumer = AuthContext.Consumer;
const AuthProvider = AuthContext.Provider;


class ProvedorAutenticacao extends React.Component {

    async componentDidMount() {
        const isAutenticado = AuthService.isUsuarioAutenticado();
        if(isAutenticado){
            const usuario = await AuthService.obterUsuarioAutenticado();
            this.setState({
                isAutenticado: true,
                usuarioAutenticado: usuario,
                isLoading: false
            }) 
        } else {
            this.setState ( previousState => {
                return {
                    ...previousState,
                    isLoading: false
                }
            })
        }
    }

    state = {
        usuarioAutenticado: null,
        isAutenticado: false,
        isLoading: true
    }

    iniciarSessao = (usuario) => {
        AuthService.logar(usuario);
        this.setState({ isAutenticado: true, usuarioAutenticado: usuario });
    }

    encerrarSessao = () => {
        AuthService.removerUsuarioAutenticado();
        this.setState({ isAutenticado: false, usuarioAutenticado: null });
    }

    render() {

        if(this.state.isLoading) {
            return null;
        }

        const contexto = {
            usuarioAutenticado: this.state.usuarioAutenticado,
            isAutenticado: this.state.isAutenticado,
            iniciarSessao: this.iniciarSessao,
            encerrarSessao: this.encerrarSessao
        }

        return (
            <AuthProvider value={contexto}>
                {this.props.children}
            </AuthProvider>
        )
    }
}

export default ProvedorAutenticacao