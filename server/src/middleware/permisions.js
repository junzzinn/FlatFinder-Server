function requireAdmin(req, res, next) {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({  message: "Admin only"  })
}

function requireAdminOrSelf(paramName = "id") {
 return (req, res, next) => {
  if (req.user?.isAdmin) return next();
  if (req.user?._id.toString() === req.params[paramName]) return next();
  return res.status(403).json( { message: "Forbinden" } )
  };
}

module.exports = { requireAdmin, requireAdminOrSelf };
