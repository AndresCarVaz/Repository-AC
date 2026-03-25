const isAdminRole = (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { role, nombre } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no puede hacer esto`
        });
    }

    next();
};

module.exports = {
    isAdminRole
};
