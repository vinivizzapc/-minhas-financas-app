import React from "react";
import { withRouter } from "react-router-dom";

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from '../../views/lancamentos/lancamentos-table';
import LocalStorageService from '../../app/service/local-storageService'
import LancamentoService from '../../app/service/lancamentoService';

import * as messages from '../../components/toastr';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button'


class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.lancamentoService = new LancamentoService();
    }

    buscar = () => {

        if (!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo ano é obrigatório.');
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const { ano, mes, tipo, descricao } = this.state;

        const lancamentoFiltro = { ano, mes, tipo, descricao, usuario: usuarioLogado.id }

        this.lancamentoService
            .consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;
                if(lista.length < 1) {
                    messages.mensagemAlerta("Nenhum resultado encontrado.")
                }
                this.setState({ lancamentos: lista });
            }).catch(error => {
                messages.mensagemErro("Erro ao buscar lançamentos.")
            });
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`);
    }

    abrirConfirmacaoExclusao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento });
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} });
    }

    deletar = () => {
        this.lancamentoService.excluirLancamento(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({ lancamentos: lancamentos, showConfirmDialog: false });
                messages.mensagemSucesso('Lançamento deletado com sucesso!');
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o lançamento');
            });
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos');
    }

    alterarStatus = (lancamento, status) => {
        this.lancamentoService
            .alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if (index !== -1) {
                    lancamento['status'] = status
                    lancamentos[index] = lancamento
                    this.setState({ lancamento });
                }
                messages.mensagemSucesso("Status atualizado com sucesso!");
            })
    }

    render() {
        const meses = this.lancamentoService.obterListaMeses();
        const tipos = this.lancamentoService.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button className='p-button-secondary' label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        return (
            <Card title="Busca Lançamento">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Ano: *" htmlFor="inputAno">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputAno"
                                        value={this.state.ano}
                                        onChange={e => this.setState({ ano: e.target.value })}
                                        placeholder="Digite o Ano" />
                                </FormGroup>

                                <FormGroup label="Mês: " htmlFor="inputMes">
                                    <SelectMenu
                                        id="inputMes"
                                        lista={meses}
                                        value={this.state.mes}
                                        onChange={e => this.setState({ mes: e.target.value })}>
                                    </SelectMenu>
                                </FormGroup>

                                <FormGroup label="Descrição: " htmlFor="inputDesc">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputDesc"
                                        value={this.state.descricao}
                                        onChange={e => this.setState({ descricao: e.target.value })}
                                        placeholder="Digite a descrição" />
                                </FormGroup>

                                <FormGroup label="Tipo Lançamento: " htmlFor="inputTipo">
                                    <SelectMenu
                                        id="inputTipo"
                                        lista={tipos}
                                        value={this.state.tipo}
                                        onChange={e => this.setState({ tipo: e.target.value })}>
                                    </SelectMenu>
                                </FormGroup>

                                <button
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={this.buscar} >
                                    <i className='pi pi-search'></i> Buscar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={this.preparaFormularioCadastro} >
                                    <i className='pi pi-plus'></i> Cadastrar
                                </button>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable
                                lancamentos={this.state.lancamentos}
                                deleteAction={this.abrirConfirmacaoExclusao}
                                editarAction={this.editar}
                                alterarStatus={this.alterarStatus}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog
                        header="Confirmação"
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        footer={confirmDialogFooter}
                        modal={true}
                        onHide={() => this.setState({ showConfirmDialog: false })}>
                        Confirma a exclusão deste Lançamento?
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);