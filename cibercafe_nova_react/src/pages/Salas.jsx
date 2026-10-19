import { Link } from 'react-router-dom';
function Salas() {

return (
        <main>
        <section id="salas">
            <h2>Salas y computadores</h2>
            <h3>Sala general</h3>
            <ul className="puestos">
                <li className="puesto disponible"title="Disponible">PC-01</li>
                <li className="puesto en_uso" title="En uso">PC-02</li>
                <li className="puesto fuera_de_servicio" title="Fuera de Servicio">PC-01</li>
                <li className="puesto reservado" title="Reservado">PC-02</li>
            </ul>
            <h3>Sala gaming</h3>
            <ul className="puestos">
                <li className="puesto disponible"title="Disponible">PC-01</li>
                <li className="puesto en_uso" title="En uso">PC-02</li>
                <li className="puesto fuera_de_servicio" title="Fuera de Servicio">PC-01</li>
                <li className="puesto reservado" title="Reservado">PC-02</li>
            </ul>
            <h3>Sala grupos </h3>
            <ul className="puestos">
                <li className="puesto disponible"title="Disponible">PC-01</li>
                <li className="puesto en_uso" title="En uso">PC-02</li>
                <li className="puesto fuera_de_servicio" title="Fuera de Servicio">PC-01</li>
                <li className="puesto reservado" title="Reservado">PC-02</li>
            </ul>
            
        </section>
       </main>
);
}
 export default Salas;
