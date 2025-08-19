export const checkLogin = (req, res, next) => {
  if (req.session && req.session.auth && req.session.auth.login) {
    return next();
  }
  res.redirect("/login");
}