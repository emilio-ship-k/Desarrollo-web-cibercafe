#  Cibercafé Nova -- Desarrollo Web - Sección 4

Este proyecto consiste en el maquetado estructural de un sistema web para la administración y control operativo de "Cibercafé Nova". El objetivo es proporcionar una interfaz que simule la gestión de disponibilidad de equipos, reservas de clientes e incidencias técnicas.  

![cibercafe_nova, logo del cibercafe](pagina_web/images/logo.png)

### Equipo

-> Sebastián Quezada  
-> Emilio Bueno  
-> Jonathan Nuñez  

## Estado Hito 1:

Boceto de página web en formato visual, hecha en HTML y CSS estático.  
Todavia no se utilizara javascript.  

Links de las direcciones de las ip elástica:  
http://100.61.52.146/  
o  
http://50.19.1.95/  
  
Link de la presentación (PPT):  
https://docs.google.com/presentation/d/1D7EpK1aJ9JGm6b6xIpXODZSz1Ec0XQ5V7QwzEllwjDA/edit?slide=id.p#slide=id.p  

### Estructura de Páginas

El sistema está compuesto por cuatro vistas principales interconectadas:  
  
index.html (Inicio): Landing page del cibercafé. Incluye información de los servicios y un popup nativo de inicio de sesión administrativo utilizando el atributo HTML popover.  
  
panel.html (Dashboard): Módulo operativo que consolida la disponibilidad del local. Utiliza tablas para estructurar las sesiones activas, los horarios de las próximas reservas y una lista de incidencias técnicas.  
  
salas.html (Inventario Visual): Vista general de los equipos distribuidos por zonas (General, Gaming, Grupos). Emplea listas para categorizar visualmente el estado de cada PC (disponible, en uso, reservado, fuera de servicio).  
  
detalles.html (Ficha Técnica): Vista individual de un equipo. Organiza las especificaciones de hardware, datos de sesión y alertas utilizando listas de descripción.  
  
## Estado Hito 2: Prototipo Interactivo en React
Migración completa de la maqueta estática HTML/CSS a React.js (usando Vite). Se implementaron validaciones de formularios y renderizado dinámico mediante métodos de JavaScript.

### Estructura de Módulos (Componentes Principales)

* **Home.jsx (Inicio):** Landing page del cibercafé, con tarjetas de acceso a los módulos operativos y popup interactivo de inicio de sesión y registro.
* **Panel.jsx (Dashboard):** Módulo operativo que consolida la disponibilidad del local. Utiliza tablas para estructurar las sesiones activas, los horarios de las próximas reservas y una lista de incidencias técnicas.
* **Salas.jsx (Inventario Visual):** Mapa interactivo de los 30 computadores distribuidos por zonas. Emplea listas para categorizar visualmente el estado de cada PC (disponible, en uso, reservado, fuera de servicio), además cuenta con un buscador para filtrar los PC (por sala y estado).
* **Detalles.jsx (Flujo Principal):** Vista individual de un equipo. Organiza las especificaciones de hardware, datos de sesión y alertas utilizando listas de descripción. Además, ahora posee un menú para realizar el cambio de estado operativo de manera rápida si necesita alguna modificación.
* **Sesiones.jsx (Nuevo Módulo):** Control de turnos y caja. Permite iniciar equipos disponibles, sumar bloques de tiempo y generar recibos de cobro dinámicos calculados matemáticamente.
* **Reservas.jsx (Nuevo Módulo):** Sistema de agendamiento preventivo con validación para impedir solapamientos u horas de término erróneas.
* **Incidencias.jsx (Nuevo Módulo):** Registro de soporte técnico. Excluye del listado a los equipos que ya están averiados y cambia el estado del PC a "Fuera de servicio" al reportar un fallo, además de volver a marcarlo como disponible una vez reparado.
