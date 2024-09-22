const uploadFile = async (req, res, next) => {
  try {
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile };
