export const renderIndex = async (req, res) => {
    try {
        // Una sola respuesta exitosa
        return res.render("pages/panel", {
            layout: "layouts/panel",
            user: req.session.auth,
        });
    } catch (error) {
        console.error("Error en panel controller:", error);
        // Una sola respuesta de error
        return res.status(500).render('error', { 
            message: 'Error interno del servidor',
            layout: 'layouts/main'
        });
    }
};