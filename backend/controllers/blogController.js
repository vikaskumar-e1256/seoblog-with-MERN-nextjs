exports.test = (req, res) => {
    res.json({ time: Date().toString() });
};