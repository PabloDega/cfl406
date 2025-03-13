export const index = async (req, res) => {
    res.render("pages/index", {
        data: "Pablo",
    });
}