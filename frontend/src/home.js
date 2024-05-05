import React from 'react'
import { useNavigate } from 'react-router-dom'
//HOME DE PRUEBA
const Home = (props) => {

    const onButtonClick = () => {
        
    }

    return (
        <div className="mainContainer">
            <div className={'titleContainer'}>
                <div>Bienvenido!</div>
            </div>
            <div>a TRUEQUETOOLS</div>
            <div className={'buttonContainer'}>
                <input
                    className={'inputButton'}
                    type="button"
                    onClick={onButtonClick}
                    value="Publicar producto"
                />
            </div>
        </div>
    )
}

export default Home