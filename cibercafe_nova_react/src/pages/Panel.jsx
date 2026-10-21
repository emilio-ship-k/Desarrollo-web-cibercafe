   import { Link } from 'react-router-dom';
   import '../css/Panel.css';
   
function Panel() {
   return(
   
   <main>
        <header><h1>Panel Operativo</h1></header>
        <h3>Disponibilidad general</h3>
        <section id="flexbox_resumen">
            <article class="resum">
                <h4>Disponible</h4>
                <p class="verde">11</p>
            </article>
            <article class="resum">
                <h4>Sesiones de uso</h4>
                <p class="rojo">10</p>
            </article>
            <article class="resum">
                <h4>Reserva Próxima</h4>
                <p class="tomate">7</p>
            </article>
            <article class="resum">
                <h4>Fuera de servicio</h4>
                <p>3</p>
            </article>
        </section>

        
        <div class="centro">
            <div>
                <section class="panel">
                   
                    <h3>Disponibilidad general (En curso)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Puesto</th>
                                <th>Cliente</th>
                                <th>Inicio</th>
                                <th>Tiempo Usado</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                               
                                <td><strong>Pc 02</strong> (general)</td>
                                <td>Sebastián Quezada</td>
                                <td>16:15</td>
                                <td>45 min</td>
                                <td><span class="badge activa">En uso</span></td>
                            </tr>
                            <tr>
                                <td><strong>Pc 16</strong> (Gamer)</td>
                                <td>Diego Ibarra</td>
                                <td>15:30</td>
                                <td>1 h 30 min</td>
                                <td><span class="badge activa">En uso</span></td>
                            </tr>
                            <tr>
                                <td><strong>Pc 23</strong> (Grupal)</td>
                                <td>Jonathan Nuñez</td>
                                <td>15:30</td>
                                <td>1 h 30 min</td>
                                <td><span class="badge activa">En uso</span></td>
                        </tr>
                        </tbody>
                    </table>
                </section>
                    
                <section class="panel">
                    <h3>Próximas Reserva de la Jornada</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Horario</th>
                                <th>Puesto Asignado</th>
                                <th>Cliente</th>
                                <th>Modalidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>18:00-20:00</td>
                                <td><strong>Pc 08</strong> (General)</td>
                                <td>Sebastián Quezada</td>
                                <td><span class="badge modal">Individual</span></td>
                            </tr>
                            <tr>
                                <td>19:00-21:00</td>
                                <td><strong>Pc 19</strong> (Gamer)</td>
                                <td>Jonathan Nuñez</td>
                                <td><span class="badge modal">Grupo</span></td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>

            <section class="panel">
                <h3>Indicendias</h3>
                <ul class="list_incid">
                    <li class="item_incid">
                        <strong>Pc 05 - Zona general</strong>
                        <p>Falla en tarjeta gráfica. Equipo bloquedo temporalmente</p>
                    </li>
                    <li class="item_incid">
                        <strong>Pc 22 - Zona Gamer</strong>
                        <p>Teclado mecánico con tecla espaciadora bloqueda. Requiere cambio de repuesto.</p>
                    </li>
                </ul>
            </section>
        </div>
        
    </main>
   );
}
export default Panel;