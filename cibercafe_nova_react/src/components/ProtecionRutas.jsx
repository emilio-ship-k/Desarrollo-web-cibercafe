import { Navigate } from 'react-router-dom';

function ProtecionRutas({ usuario, rolesPermitidos, children }) {
   
    if (!usuario) {
    return <Navigate to="/" replace />;
  }

  
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  
  return children;
}

export default ProtecionRutas;