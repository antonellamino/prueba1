import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const backendUrl = process.env.REACT_APP_BACK_URL;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const navigate = useNavigate();

    const validateEmail = () => {
        if (!email) {
            setEmailError('Por favor ingresa un email');
            return false;
        }
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailError('Por favor, ingresa un email valido');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Por favor ingresa una contraseña');
            return false;
        }
        if (password.length < 8) {
            setPasswordError('La contraseña debe tener 8 caracteres o mas');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const onButtonClick = async () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            try {
                //solicitud http al backend
                const response = await axios.post(`${backendUrl}/iniciarSesion`, { correo: email, contrasena: password });


                // si se pudo iniciar sesion, redirije a /
                if (response.status === 200) {
                    console.log(response.data);
                    navigate('/');//REDIRECCION A HOME DE PRUEBA
                } else {
                    // Manejo de errores en caso de que la autenticacion falle
                    console.error('Error al iniciar sesión:', response.data.error);
                    setMensajeError(response.data.error);
                }
            } catch (error) {
                // Manejo de errores en caso de error de red o error del servidor
                console.error('Error al iniciar sesión:', error.message);
            }
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Login</div>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="inputBox"
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="inputBox"
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>

            </div>
            <br />
            {mensajeError && <div className="errorLabel">{mensajeError}</div>}
            {/* VER PORQUE NO SE MUESTRA */}

            <div className="inputContainer">
                <input className="inputButton" type="button" onClick={onButtonClick} value="Log in" />
            </div>
        </div>
    );
};

export default Login;
