import React from 'react';

import Login from '../views/login';
import CadastroUsuario from '../views/cadastroUsuario'
import Home from '../views/home';
import ConsultaLancamentos from '../views/lancamentos/consulta-lancamentos';
import CadastroLancamentos from '../views/lancamentos/cadastro-lancamentos';
import { AuthConsumer } from './provedorAutenticacao';

import { Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';


function RotaAutenticada ( { component: Component, isUsuarioAutenticado ,...props } ) {
    return (
        <Route {...props} render={ (componentProps) => {
            if(isUsuarioAutenticado){
                return (
                    <Component {...componentProps} />
                )
            }else {
                return (
                    <Redirect to={ { pathname: '/login', state: { from: componentProps.location } } } />
                )
            }
        }} />
    )
}

function Rotas(props) {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/cadastro-usuarios" component={CadastroUsuario} />

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path={"/consulta-lancamentos"} component={ConsultaLancamentos} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path={"/cadastro-lancamentos/:id?"} component={CadastroLancamentos} />
            </Switch>
        </BrowserRouter>
    )
}


export default () => (
    <AuthConsumer>
        { 
            (context) => (<Rotas isUsuarioAutenticado={context.isAutenticado}/>) 
        }
    </AuthConsumer>
)