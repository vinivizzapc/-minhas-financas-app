import React from 'react';

import Card from '../components/card';
import FormGroup from '../components/form-group';
import { withRouter } from 'react-router-dom';
import UsuarioService from '../app/service/usuarioService';
import { mensagemErro, mensagemSucesso } from '../components/toastr';

class CadastroUsuario extends React.Component {

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: '',
    }

    constructor() {
        super();
        this.usuarioService = new UsuarioService();
    }

    cadastrar = () => {

        const { nome, email, senha, senhaRepeticao } = this.state;
        
        const usuario = { nome, email, senha, senhaRepeticao};

        try {
            this.usuarioService.validar(usuario);
        }catch(erro) {
            const msgs = erro.mensagens;
            msgs.forEach(msg => mensagemErro(msg));
            return false;
        }

        this.usuarioService.cadastrarUsuario(usuario)
            .then(response => {
                mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.')
                this.props.history.push('/login');
            })
            .catch(error => {
                mensagemErro(error.response.data);
            });

    }

    cancelar = () => {
        this.props.history.push("/login");
    }

    render() {
        return (
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Nome: *" htmlFor="inputNome">
                                    <input
                                        type="text"
                                        id="inputNome"
                                        className='form-control'
                                        name="nome"
                                        value={this.state.nome}
                                        placeholder="Digite o Nome"
                                        onChange={e => this.setState({ nome: e.target.value })} />
                                </FormGroup>

                                <FormGroup label="Email: *" htmlFor="inputEmail">
                                    <input
                                        type="email"
                                        id="inputEmail"
                                        className='form-control'
                                        name="email"
                                        value={this.state.email}
                                        placeholder="Digite o Email"
                                        onChange={e => this.setState({ email: e.target.value })} />
                                </FormGroup>

                                <FormGroup label="Senha: *" htmlFor="inputSenha">
                                    <input
                                        type="password"
                                        id="inputSenha"
                                        className='form-control'
                                        name="senha"
                                        value={this.state.senha}
                                        placeholder="Digite a Senha"
                                        onChange={e => this.setState({ senha: e.target.value })} />
                                </FormGroup>

                                <FormGroup label="Repita a Senha: *" htmlFor="inputRepitaSenha">
                                    <input
                                        type="password"
                                        id="inputRepitaSenha"
                                        className='form-control'
                                        name="senhaRepeticao"
                                        value={this.state.senhaRepeticao}
                                        placeholder="Digite o Senha novamente"
                                        onChange={e => this.setState({ senhaRepeticao: e.target.value })} />
                                </FormGroup>

                                <button type="button" className="btn btn-success" onClick={this.cadastrar} >
                                    <i className='pi pi-save'></i> Cadastrar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={this.cancelar}>
                                    <i className='pi pi-times'></i> Voltar
                                </button>

                            </fieldset>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

}

export default withRouter(CadastroUsuario)