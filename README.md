#  Cibercafé Nova -- Desarrollo Web - Sección 4

Este proyecto consiste en el maquetado estructural de un sistema web para la administración y control operativo de "Cibercafé Nova". El objetivo es proporcionar una interfaz que simule la gestión de disponibilidad de equipos, reservas de clientes e incidencias técnicas.  

![cibercafe_nova, logo del cibercafe](pagina_web/images/logo.png)

### Equipo

-> Sebastián Quesada  
-> Emilio Bueno  
-> Jonathan Nuñez  

## Estado Hito 1:

Boceto de página web en formato visual, hecha en HTML y CSS estático.  
Todavia no se utilizara javascript.  

Links de las direcciones de las ip elástica:  
http://100.61.52.146/  
o  
http://50.19.1.95/  

## Estructura de Páginas

El sistema está compuesto por cuatro vistas principales interconectadas:  
  
index.html (Inicio): Landing page del cibercafé. Incluye información de los servicios y un popup nativo de inicio de sesión administrativo utilizando el atributo HTML popover.  
  
panel.html (Dashboard): Módulo operativo que consolida la disponibilidad del local. Utiliza tablas para estructurar las sesiones activas, los horarios de las próximas reservas y una lista de incidencias técnicas.  
  
salas.html (Inventario Visual): Vista general de los equipos distribuidos por zonas (General, Gaming, Grupos). Emplea listas para categorizar visualmente el estado de cada PC (disponible, en uso, reservado, fuera de servicio).  
  
detalles.html (Ficha Técnica): Vista individual de un equipo. Organiza las especificaciones de hardware, datos de sesión y alertas utilizando listas de descripción.  
  

## Pendiente Entrega 2:
