import React from 'react';

import { createTheme, ThemeProvider } from '@material-ui/core/styles/index.js';
import { indigo, teal } from '@material-ui/core/colors/index.js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/index.js';

/* application components */
import Header from '../../components/Header/index.js';

import {
    LOGIN_CHECK_SUCCESS,
} from '../../constants/index.js';

import { Footer } from '../../components/Footer/index.js';

/* global styles for app */
import './styles/app.scss';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
          logged_in: false,
        };
        this.check_login_status()
    }

    check_login_status() {
        const { loginCheck } = this.props;

        loginCheck().then(
          response => {
            if (response.type == LOGIN_CHECK_SUCCESS) {
              this.login_success()
            } else {
              this.logout_success()
            }
          }
        ).catch(
            err => {
                console.log(err)
                this.logout_success()
            }
        )
    }

    do_login(email, password) {
        const { login } = this.props;

        return login(email, password)
    }

    login_success() { this.setState({ logged_in: true }) }
    logout_success() {
        this.setState({ logged_in: false })
    }

    do_logout() {
        const { logout } = this.props;

        return logout()
    }

    render() {
        const theme = {
          palette: {
            primary: {
              main: '#607D8B'
            },
            secondary: {
              main: '#E0F2F1'
            }
          },
          typography: {
            fontSize: 24,
          }
        };

        return (
          <div>
            <ThemeProvider theme={createTheme(theme)}>
                <section>
                    <Header
                      login={(username, password) => this.do_login(username, password)}
                      login_success={() => this.login_success()}
                      logout={() => this.do_logout()}
                      logout_success={() => this.logout_success()}
                      logged_in={this.state.logged_in}
                    />
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 20 }}
                    >
                        {this.props.children}
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            </ThemeProvider>
          </div>
        );
    }
}

export { App };
