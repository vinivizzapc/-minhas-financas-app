import React from "react";

import Card from "../../components/card";

import FormGroup from "../../components/form-group";
import SelectMenu from '../../components/selectMenu';

import { withRouter } from "react-router-dom";
import * as messages from "../../components/toastr";

import LancamentoService from '../../app/service/lancamentoService';
import LocalStorageService from '../../app/service/local-storageService';


class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        valor: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor() {
        super();
        this.lancamentoService = new LancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params;

        if (params.id) {
            this.lancamentoService.obterPorId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true })
                }).catch(error => {
                    messages.mensagemErro(error.response.data);
                });
        }
    }

    cadastrar = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const { descricao, valor, mes, ano, tipo } = this.state;
        const lancamento = { descricao, ano, mes, valor, tipo, usuario: usuarioLogado.id }

        try {
            this.lancamentoService.validar(lancamento);
        } catch (erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg))
            return false;
        }

        this.lancamentoService
            .cadastrarLancamento(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos');
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!');
            }).catch(error => {
                messages.mensagemErro(error.response.data);
            });
    }

    atualizar = () => {
        const { descricao, valor, mes, ano, tipo, status, id, usuario } = this.state;
        const lancamento = { descricao, ano, mes, valor, tipo, status, id, usuario }

        this.lancamentoService
            .atualizarLancamento(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos');
                messages.mensagemSucesso('Lançamento atualizado com sucesso!');
            }).catch(error => {
                messages.mensagemErro(error.response.data);
            });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    render() {
        const meses = this.lancamentoService.obterListaMeses();
        const tipos = this.lancamentoService.obterListaTipos();

        return (
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className='col-md-12'>
                        <FormGroup label="Descrição: *" htmlFor="inputDescricao">
                            <input
                                type="text"
                                id='inputDescricao'
                                className="form-control"
                                value={this.state.descricao}
                                name="descricao"
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup label="Ano: *" htmlFor="inputAno">
                            <input
                                type="text"
                                className="form-control"
                                id="inputAno"
                                value={this.state.ano}
                                name="ano"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup label="Mês: *" htmlFor="inputMes">
                            <SelectMenu
                                id="inputMes"
                                lista={meses}
                                value={this.state.mes}
                                name="mes"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4'>
                        <FormGroup label="Valor: *" htmlFor="inputValor">
                            <input
                                type="text"
                                className="form-control"
                                id='inputValor'
                                value={this.state.valor}
                                name="valor"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>

                    <div className='col-md-4'>
                        <FormGroup label="Tipo: *" htmlFor="inputTipo">
                            <SelectMenu
                                id="inputTipo"
                                lista={tipos}
                                value={this.state.tipo}
                                name="tipo"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>

                    <div className='col-md-4'>
                        <FormGroup label="Status: *" htmlFor="inputStatus">
                            <input
                                type="text"
                                className='form-control'
                                name="status"
                                value={this.state.status}
                                disabled />
                        </FormGroup>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-6'>
                        {this.state.atualizando ?
                            (
                                <button 
                                    className='btn btn-success' 
                                    onClick={this.atualizar}>
                                    <i className='pi pi-refresh'></i> Atualizar
                                </button>
                            ) : (
                                <button 
                                    className='btn btn-success' 
                                    onClick={this.cadastrar}>
                                    <i className='pi pi-save'></i> Cadastrar
                                </button>
                            )

                        }
                        <button 
                            className='btn btn-danger'
                            onClick={e => this.props.history.push('/consulta-lancamentos')} > 
                            <i className='pi pi-times'></i> Cancelar
                        </button>
                    </div>
                </div>


            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos)